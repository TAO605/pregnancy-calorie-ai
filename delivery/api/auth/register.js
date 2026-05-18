const {
  createSession,
  createUser,
  ensureAuthSchema,
  findUserByEmail,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  readJsonBody,
  sendJson,
  sessionCookie
} = require("./_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { ok: false, error: "Method not allowed" });
  }

  try {
    await ensureAuthSchema();
    const body = await readJsonBody(request);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!isValidEmail(email)) return sendJson(response, 400, { ok: false, error: "Please enter a valid email address." });
    if (!isValidPassword(password)) return sendJson(response, 400, { ok: false, error: "Password must be at least 6 characters." });

    const existing = await findUserByEmail(email);
    if (existing) return sendJson(response, 409, { ok: false, error: "An account with this email already exists." });

    const user = await createUser(email, password);
    const token = await createSession(user.id);
    return sendJson(response, 200, { ok: true, user }, [sessionCookie(token)]);
  } catch (error) {
    console.error("Auth register failed:", error);
    return sendJson(response, 500, { ok: false, error: "Registration is temporarily unavailable." });
  }
};
