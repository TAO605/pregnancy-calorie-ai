const {
  bcrypt,
  createSession,
  ensureAuthSchema,
  findUserByEmail,
  isValidEmail,
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

    if (!isValidEmail(email) || password.length < 1) {
      return sendJson(response, 400, { ok: false, error: "Please enter your email and password." });
    }

    const user = await findUserByEmail(email);
    const passwordOk = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!user || !passwordOk) {
      return sendJson(response, 401, { ok: false, error: "Email or password is incorrect." });
    }

    const token = await createSession(user.id);
    return sendJson(response, 200, {
      ok: true,
      user: { id: user.id, email: user.email, createdAt: user.created_at }
    }, [sessionCookie(token)]);
  } catch (error) {
    console.error("Auth login failed:", error);
    return sendJson(response, 500, { ok: false, error: "Login is temporarily unavailable." });
  }
};
