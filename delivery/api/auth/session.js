const {
  getSessionUser,
  sendJson
} = require("./_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    const user = await getSessionUser(request);
    return sendJson(response, 200, { ok: true, authenticated: Boolean(user), user });
  } catch (error) {
    console.error("Auth session check failed:", error);
    return sendJson(response, 200, { ok: true, authenticated: false, user: null });
  }
};
