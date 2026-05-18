const {
  ensureAuthSchema,
  findUserByEmail,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  readJsonBody,
  resetPasswordWithToken,
  sendJson,
  setPasswordReset
} = require("./_auth");
const { buildPasswordResetEmail } = require("./_reset-email-template");

// 中文注释：可修改参数位置。SITE_URL是网站域名，RESEND_API_KEY是Vercel Resend集成提供的密钥，AUTH_EMAIL_FROM是发件人。
const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://aipregnancycaloriecalculator.online";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const AUTH_EMAIL_FROM = process.env.AUTH_EMAIL_FROM || "AI Pregnancy Calorie Calculator <onboarding@resend.dev>";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@aipregnancycaloriecalculator.online";

async function sendResetEmail(email, token) {
  if (!RESEND_API_KEY) {
    if (process.env.AUTH_DEBUG_RESET_TOKEN === "true") return { skipped: true };
    throw new Error("Resend is not configured.");
  }
  const resetUrl = SITE_URL.replace(/\/$/, "") + "/reset-password.html?token=" + encodeURIComponent(token);
  const emailContent = buildPasswordResetEmail({ resetUrl, supportEmail: SUPPORT_EMAIL });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + RESEND_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: AUTH_EMAIL_FROM,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    })
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error("Resend email failed: " + body);
  }
  return response.json().catch(() => ({}));
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    await ensureAuthSchema();
    const body = await readJsonBody(request);

    if (body.token && body.newPassword) {
      const newPassword = String(body.newPassword || "");
      if (!isValidPassword(newPassword)) {
        return sendJson(response, 400, { ok: false, error: "Password must be at least 6 characters." });
      }
      const changed = await resetPasswordWithToken(String(body.token), newPassword);
      return sendJson(response, changed ? 200 : 400, changed
        ? { ok: true, message: "Password has been reset." }
        : { ok: false, error: "Reset link is invalid or expired." });
    }

    const email = normalizeEmail(body.email);
    if (!isValidEmail(email)) {
      return sendJson(response, 400, { ok: false, error: "Please enter a valid email address." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return sendJson(response, 404, {
        ok: false,
        error: "No account found with this email address. Please check the email you entered or sign up for a new account."
      });
    }

    const reset = await setPasswordReset(email);
    if (!reset.ok && reset.reason === "rate_limited") {
      return sendJson(response, 429, { ok: false, error: "Too many reset emails were requested. Please wait and try again later." });
    }
    if (!reset.ok) {
      return sendJson(response, 400, { ok: false, error: "Password reset is temporarily unavailable." });
    }

    await sendResetEmail(email, reset.token);
    return sendJson(response, 200, {
      ok: true,
      message: "Reset link sent! Please check your email (including spam folder) for a link to reset your password. The link will expire in 24 hours.",
      resetToken: process.env.AUTH_DEBUG_RESET_TOKEN === "true" ? reset.token : undefined
    });
  } catch (error) {
    console.error("Password reset failed:", error);
    return sendJson(response, 500, { ok: false, error: "Password reset is temporarily unavailable." });
  }
};
