// 中文注释：Resend邮件模板，可在这里调整品牌名、按钮文案、客服邮箱和邮件正文。
function buildPasswordResetEmail({ resetUrl, supportEmail }) {
  const safeSupportEmail = supportEmail || "support@aipregnancycaloriecalculator.online";
  const subject = "Reset Your Password - AI Pregnancy Calorie Calculator";
  const text = [
    "Reset your password",
    "",
    "We received a request to reset the password for your AI Pregnancy Calorie Calculator account.",
    "Use this link within 24 hours:",
    resetUrl,
    "",
    "If you did not request this, you can safely ignore this email. Your password will not change.",
    "For privacy, this link is only for password reset and does not collect extra information.",
    "",
    "Need help? Contact us at " + safeSupportEmail
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;background:#fff8fb;font-family:Arial,Helvetica,sans-serif;color:#241b21;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fff8fb;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #efdde5;border-radius:24px;overflow:hidden;">
          <tr>
            <td style="padding:28px 24px;text-align:center;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;color:#241b21;">Reset your password</h1>
              <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#6f5e67;">We received a request to reset the password for your AI Pregnancy Calorie Calculator account.</p>
              <a href="${resetUrl}" style="display:inline-block;background:#9c2760;color:#ffffff;text-decoration:none;font-weight:800;font-size:16px;border-radius:18px;padding:15px 24px;">Reset Password</a>
              <p style="margin:22px 0 0;font-size:14px;line-height:1.6;color:#6f5e67;">This link will expire in 24 hours. If the button does not work, copy and paste this link into your browser:</p>
              <p style="word-break:break-all;margin:12px 0 0;font-size:13px;line-height:1.5;color:#9c2760;">${resetUrl}</p>
              <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8b7b84;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
              <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#8b7b84;">Need help? Contact us at ${safeSupportEmail}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

module.exports = { buildPasswordResetEmail };
