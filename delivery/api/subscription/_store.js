const { sql } = require("@vercel/postgres");
const { ensureAuthSchema } = require("../auth/_auth");

let subscriptionSchemaReady = false;

function normalizeSubscriptionStatus(value) {
  return String(value || "free").toLowerCase();
}

function isPremiumSubscription(row) {
  const status = normalizeSubscriptionStatus(row && row.subscription_status);
  const expiresAt = row && row.subscription_expires_at ? new Date(row.subscription_expires_at) : null;
  if (status === "active" || status === "trialing") return true;
  if (status === "past_due" && expiresAt && expiresAt.getTime() > Date.now()) return true;
  return false;
}

function publicSubscription(row) {
  return {
    status: row ? normalizeSubscriptionStatus(row.subscription_status) : "free",
    plan: row && row.subscription_plan ? row.subscription_plan : null,
    expiresAt: row && row.subscription_expires_at ? row.subscription_expires_at : null,
    isPremium: isPremiumSubscription(row)
  };
}

async function ensureSubscriptionSchema() {
  if (subscriptionSchemaReady) return;
  await ensureAuthSchema();
  // 中文注释：订阅字段只在订阅模块初始化，避免污染原有登录/注册/找回密码逻辑。
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'free'`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_plan TEXT`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT`;
  subscriptionSchemaReady = true;
}

async function getSubscriptionUserById(userId) {
  await ensureSubscriptionSchema();
  const result = await sql`
    SELECT id, email, created_at, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
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
    RETURNING id, email, created_at, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
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
    RETURNING id, email, created_at, subscription_status, subscription_plan, subscription_expires_at, stripe_customer_id
  `;
  return result.rows[0] || null;
}

module.exports = {
  ensureSubscriptionSchema,
  getSubscriptionUserById,
  isPremiumSubscription,
  publicSubscription,
  updateUserSubscription,
  updateUserSubscriptionByStripeCustomer
};
