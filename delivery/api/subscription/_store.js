const { sql } = require("@vercel/postgres");
const { ensureAuthSchema } = require("../auth/_auth");

let subscriptionSchemaReady = false;

function normalizeSubscriptionStatus(value) {
  return String(value || "free").toLowerCase();
}

function isEarlyFreeUser(row) {
  if (row && row.is_early_user === true) return true;
  const cutoff = process.env.EARLY_FREE_CUTOFF_DATE;
  if (!row || !row.created_at || !cutoff) return false;
  const createdAt = new Date(row.created_at);
  const cutoffAt = new Date(cutoff);
  return Number.isFinite(createdAt.getTime()) && Number.isFinite(cutoffAt.getTime()) && createdAt.getTime() <= cutoffAt.getTime();
}

function checkSubscription(row) {
  // Global free switch: when enabled, every user gets full access.
  if (process.env.NEXT_PUBLIC_ALL_FEATURES_FREE === "true") {
    return {
      isSubscribed: true,
      isLoading: false,
      subscription: {
        plan: "premium",
        status: "active",
        isEarlyUser: true
      },
      status: "active",
      plan: "premium",
      expiresAt: null,
      isPremium: true,
      earlyFreeUser: true,
      allFeaturesFree: true
    };
  }

  const earlyFreeUser = isEarlyFreeUser(row);
  if (earlyFreeUser) {
    return {
      isSubscribed: true,
      isLoading: false,
      subscription: {
        plan: "premium",
        status: "active",
        isEarlyUser: true
      },
      status: "active",
      plan: "premium",
      expiresAt: null,
      isPremium: true,
      earlyFreeUser: true,
      allFeaturesFree: false
    };
  }

  const status = normalizeSubscriptionStatus(row && row.subscription_status);
  const expiresAt = row && row.subscription_expires_at ? new Date(row.subscription_expires_at) : null;
  const isPremium = status === "active" || status === "trialing" || (status === "past_due" && expiresAt && expiresAt.getTime() > Date.now());
  const plan = row && row.subscription_plan ? row.subscription_plan : null;
  return {
    isSubscribed: isPremium,
    isLoading: false,
    subscription: {
      plan: plan || (isPremium ? "premium" : null),
      status,
      isEarlyUser: false
    },
    status,
    plan,
    expiresAt: row && row.subscription_expires_at ? row.subscription_expires_at : null,
    isPremium,
    earlyFreeUser: false,
    allFeaturesFree: false
  };
}

function isPremiumSubscription(row) {
  return checkSubscription(row).isSubscribed;
}

function publicSubscription(row) {
  const access = checkSubscription(row);
  return {
    status: access.status,
    plan: access.plan,
    expiresAt: access.expiresAt,
    isPremium: access.isPremium,
    earlyFreeUser: access.earlyFreeUser,
    allFeaturesFree: access.allFeaturesFree
  };
}

async function ensureSubscriptionSchema() {
  if (subscriptionSchemaReady) return;
  await ensureAuthSchema();
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'free'`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_plan TEXT`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS is_early_user BOOLEAN NOT NULL DEFAULT FALSE`;
  const cutoff = process.env.EARLY_FREE_CUTOFF_DATE;
  const cutoffAt = cutoff ? new Date(cutoff) : null;
  if (cutoffAt && Number.isFinite(cutoffAt.getTime())) {
    await sql`
      UPDATE pcc_users
      SET is_early_user = TRUE,
          updated_at = NOW()
      WHERE is_early_user = FALSE
        AND created_at <= ${cutoffAt.toISOString()}
    `;
  }
  subscriptionSchemaReady = true;
}

async function getSubscriptionUserById(userId) {
  await ensureSubscriptionSchema();
  const result = await sql`
    SELECT id, email, created_at, is_early_user, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
    FROM pcc_users
    WHERE id = ${userId}
    LIMIT 1
  `;
  return result.rows[0] || null;
}

async function updateUserSubscription(userId, subscription) {
  await ensureSubscriptionSchema();
  const status = normalizeSubscriptionStatus(subscription.status);
  const result = await sql`
    UPDATE pcc_users
    SET subscription_status = ${status},
        subscription_plan = ${subscription.plan || null},
        subscription_expires_at = ${subscription.expiresAt || null},
        stripe_customer_id = COALESCE(${subscription.stripeCustomerId || null}, stripe_customer_id),
        updated_at = NOW()
    WHERE id = ${userId}
    RETURNING id, email, created_at, is_early_user, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
  `;
  return result.rows[0] || null;
}

async function updateUserSubscriptionByStripeCustomer(stripeCustomerId, subscription) {
  await ensureSubscriptionSchema();
  const status = normalizeSubscriptionStatus(subscription.status);
  const result = await sql`
    UPDATE pcc_users
    SET subscription_status = ${status},
        subscription_plan = ${subscription.plan || null},
        subscription_expires_at = ${subscription.expiresAt || null},
        stripe_customer_id = ${stripeCustomerId},
        updated_at = NOW()
    WHERE stripe_customer_id = ${stripeCustomerId}
    RETURNING id, email, created_at, is_early_user, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
  `;
  return result.rows[0] || null;
}

module.exports = {
  checkSubscription,
  ensureSubscriptionSchema,
  getSubscriptionUserById,
  isEarlyFreeUser,
  isPremiumSubscription,
  publicSubscription,
  updateUserSubscription,
  updateUserSubscriptionByStripeCustomer
};
