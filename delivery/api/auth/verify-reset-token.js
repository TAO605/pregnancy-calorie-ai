const {
  ensureAuthSchema,
  readJsonBody,
  sendJson,
  verifyPasswordResetToken
} = require("./_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    await ensureAuthSchema();
    const body = await readJsonBody(request);
    const token = String(body.token || "").trim();
    if (!token) return sendJson(response, 400, { ok: false, error: "Reset link is missing." });
    const user = await verifyPasswordResetToken(token);
    return sendJson(response, user ? 200 : 400, user
      ? { ok: true, email: user.email }
      : { ok: false, error: "This reset link is invalid or expired. Please request a new reset link." });
  } catch (error) {
    console.error("Reset token verification failed:", error);
    return sendJson(response, 500, { ok: false, error: "Reset link verification is temporarily unavailable." });
  }
};
