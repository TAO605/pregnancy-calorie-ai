const Stripe = require("stripe");

function getSiteUrl(request) {
  const configured = String(process.env.SITE_URL || "").replace(/\/+$/, "");
  if (configured) return configured;
  const host = request.headers["x-forwarded-host"] || request.headers.host || "localhost:3000";
  const proto = request.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}`;
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function getPriceId(plan) {
  const normalized = plan === "monthly" ? "monthly" : "annual";
  const annual = process.env.STRIPE_PRICE_ANNUAL;
  const monthly = process.env.STRIPE_PRICE_MONTHLY;
  const priceId = normalized === "monthly" ? monthly : annual;
  if (!priceId) throw new Error(`Stripe price id is not configured for ${normalized}.`);
  return { plan: normalized, priceId };
}

function subscriptionFromStripe(subscription, fallbackPlan) {
  const item = subscription.items && subscription.items.data && subscription.items.data[0];
  const priceId = item && item.price && item.price.id;
  const annual = process.env.STRIPE_PRICE_ANNUAL;
  const monthly = process.env.STRIPE_PRICE_MONTHLY;
  const plan = priceId === monthly ? "monthly" : priceId === annual ? "annual" : fallbackPlan || null;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null;
  return {
    status: subscription.status || "free",
    plan,
    expiresAt: currentPeriodEnd,
    stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer && subscription.customer.id
  };
}

async function readRawBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = {
  getPriceId,
  getSiteUrl,
  getStripe,
  readRawBody,
  subscriptionFromStripe
};
