const {
  sendJson
} = require("../auth/_auth");
const {
  getStripe,
  readRawBody,
  subscriptionFromStripe
} = require("./_stripe");
const {
  updateUserSubscription,
  updateUserSubscriptionByStripeCustomer
} = require("./_store");
const {
  isAllFeaturesFree
} = require("./_free-mode");

async function applySubscription(subscription, fallbackUserId, fallbackPlan) {
  const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer && subscription.customer.id;
  const data = subscriptionFromStripe(subscription, fallbackPlan);
  if (fallbackUserId) {
    await updateUserSubscription(fallbackUserId, data);
    return;
  }
  if (stripeCustomerId) await updateUserSubscriptionByStripeCustomer(stripeCustomerId, data);
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  if (isAllFeaturesFree()) {
    return sendJson(response, 403, {
      ok: false,
      allFeaturesFree: true,
      error: "Payment system is temporarily disabled"
    });
  }

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return sendJson(response, 500, { ok: false, error: "Stripe webhook secret is not configured." });
  }

  let event;
  try {
    const rawBody = await readRawBody(request);
    const signature = request.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return sendJson(response, 400, { ok: false, error: "Invalid Stripe webhook signature." });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkout = event.data.object;
      const subscriptionId = checkout.subscription;
      const userId = checkout.metadata && checkout.metadata.userId ? checkout.metadata.userId : checkout.client_reference_id;
      const plan = checkout.metadata && checkout.metadata.plan ? checkout.metadata.plan : null;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await applySubscription(subscription, userId, plan);
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const userId = subscription.metadata && subscription.metadata.userId;
      const plan = subscription.metadata && subscription.metadata.plan;
      await applySubscription(subscription, userId, plan);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const stripeCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer && subscription.customer.id;
      const userId = subscription.metadata && subscription.metadata.userId;
      const downgraded = {
        status: "free",
        plan: null,
        expiresAt: null,
        stripeCustomerId
      };
      if (userId) await updateUserSubscription(userId, downgraded);
      else if (stripeCustomerId) await updateUserSubscriptionByStripeCustomer(stripeCustomerId, downgraded);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription && invoice.subscription.id;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata && subscription.metadata.userId;
        const plan = subscription.metadata && subscription.metadata.plan;
        await applySubscription({ ...subscription, status: "past_due" }, userId, plan);
      }
    }

    return sendJson(response, 200, { ok: true, received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return sendJson(response, 500, { ok: false, error: "Stripe webhook handling failed." });
  }
};
