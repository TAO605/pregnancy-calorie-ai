const {
  getSessionUser,
  readJsonBody,
  sendJson
} = require("../auth/_auth");
const {
  getPriceId,
  getSiteUrl,
  getStripe
} = require("./_stripe");
const {
  getSubscriptionUserById,
  isPremiumSubscription
} = require("./_store");
const {
  isAllFeaturesFree
} = require("./_free-mode");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    if (isAllFeaturesFree()) {
      return sendJson(response, 403, {
        ok: false,
        allFeaturesFree: true,
        error: "All features are currently free. Checkout is disabled."
      });
    }
    const user = await getSessionUser(request);
    if (!user) {
      return sendJson(response, 401, { ok: false, error: "Please log in before starting Premium." });
    }
    const subscriptionUser = await getSubscriptionUserById(user.id);
    if (isPremiumSubscription(subscriptionUser)) {
      return sendJson(response, 200, { ok: true, alreadyPremium: true, url: `${getSiteUrl(request)}/index.html?premium=active` });
    }

    const body = await readJsonBody(request).catch(() => ({}));
    const { plan, priceId } = getPriceId(body.plan);
    const displayCurrency = String(body.displayCurrency || "USD").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) || "USD";
    const stripe = getStripe();
    const siteUrl = getSiteUrl(request);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/index.html?premium=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing.html?checkout=cancelled&plan=${encodeURIComponent(plan)}`,
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
          displayCurrency,
          chargeCurrency: "USD"
        }
      },
      metadata: {
        userId: user.id,
        plan,
        displayCurrency,
        chargeCurrency: "USD"
      },
      allow_promotion_codes: true
    });

    return sendJson(response, 200, { ok: true, url: session.url });
  } catch (error) {
    console.error("Create Stripe checkout session failed:", error);
    return sendJson(response, 500, { ok: false, error: "Premium checkout is temporarily unavailable." });
  }
};
