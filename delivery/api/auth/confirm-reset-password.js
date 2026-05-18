const {
  clearSessionCookie,
  ensureAuthSchema,
  isValidPassword,
  readJsonBody,
  resetPasswordWithToken,
  sendJson
} = require("./_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    await ensureAuthSchema();
    const body = await readJsonBody(request);
    const token = String(body.token || "").trim();
    const newPassword = String(body.newPassword || "");
    if (!token) return sendJson(response, 400, { ok: false, error: "Reset link is missing." });
    if (!isValidPassword(newPassword)) {
      return sendJson(response, 400, { ok: false, error: "Password must be at least 6 characters." });
    }
    const changed = await resetPasswordWithToken(token, newPassword);
    return sendJson(response, changed ? 200 : 400, changed
      ? { ok: true, message: "Your password has been reset. Please log in with your new password." }
      : { ok: false, error: "This reset link is invalid or expired. Please request a new reset link." }, changed ? [clearSessionCookie()] : []);
  } catch (error) {
    console.error("Password reset confirmation failed:", error);
    return sendJson(response, 500, { ok: false, error: "Password reset is temporarily unavailable." });
  }
};
