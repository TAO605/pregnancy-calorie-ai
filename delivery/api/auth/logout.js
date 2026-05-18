const {
  clearSessionCookie,
  deleteSession,
  sendJson
} = require("./_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    await deleteSession(request);
    return sendJson(response, 200, { ok: true }, [clearSessionCookie()]);
  } catch (error) {
    console.error("Auth logout failed:", error);
    return sendJson(response, 200, { ok: true }, [clearSessionCookie()]);
  }
};
