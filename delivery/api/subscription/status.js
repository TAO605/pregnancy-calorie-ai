const {
  getSessionUser,
  sendJson
} = require("../auth/_auth");
const {
  getSubscriptionUserById,
  publicSubscription
} = require("./_store");
const {
  freeModeSubscription,
  isAllFeaturesFree
} = require("./_free-mode");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    if (isAllFeaturesFree()) {
      return sendJson(response, 200, {
        ok: true,
        authenticated: false,
        subscription: freeModeSubscription()
      });
    }
    const sessionUser = await getSessionUser(request);
    const subscriptionUser = sessionUser ? await getSubscriptionUserById(sessionUser.id) : null;
    return sendJson(response, 200, {
      ok: true,
      authenticated: Boolean(sessionUser),
      subscription: publicSubscription(subscriptionUser)
    });
  } catch (error) {
    console.error("Subscription status failed:", error);
    return sendJson(response, 200, {
      ok: true,
      authenticated: false,
      subscription: { status: "free", plan: null, expiresAt: null, isPremium: false }
    });
  }
};
