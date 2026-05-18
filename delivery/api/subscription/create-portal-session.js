const {
  getSessionUser,
  sendJson
} = require("../auth/_auth");
const {
  getSiteUrl,
  getStripe
} = require("./_stripe");
const {
  getSubscriptionUserById
} = require("./_store");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return sendJson(response, 401, { ok: false, error: "Please log in to manage your subscription." });
    }
    const user = await getSubscriptionUserById(sessionUser.id);
    if (!user || !user.stripe_customer_id) {
      return sendJson(response, 400, { ok: false, error: "No active Stripe subscription was found for this account." });
    }

    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${getSiteUrl(request)}/index.html?premium=portal`
    });
    return sendJson(response, 200, { ok: true, url: portal.url });
  } catch (error) {
    console.error("Create Stripe portal session failed:", error);
    return sendJson(response, 500, { ok: false, error: "Subscription management is temporarily unavailable." });
  }
};
