const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sql } = require("@vercel/postgres");

const COOKIE_NAME = "pcc_session";
const SESSION_DAYS = 30;
const RESET_TOKEN_HOURS = 24;
const RESET_RATE_LIMIT_HOURS = 1;
const RESET_RATE_LIMIT_MAX = 3;
let schemaReady = false;

function sendJson(response, statusCode, body, cookies = []) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  if (cookies.length) response.setHeader("Set-Cookie", cookies);
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6 && password.length <= 128;
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

function parseCookies(request) {
  const header = request.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => {
    const index = part.indexOf("=");
    if (index < 0) return ["", ""];
    return [part.slice(0, index).trim(), decodeURIComponent(part.slice(index + 1).trim())];
  }).filter(([key]) => key));
}

function sessionCookie(token) {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  return [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`
  ].filter(Boolean).join("; ");
}

function clearSessionCookie() {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  return [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
    "Max-Age=0"
  ].filter(Boolean).join("; ");
}

async function ensureAuthSchema() {
  if (schemaReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS pcc_users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reset_token_hash TEXT,
      reset_expires_at TIMESTAMPTZ,
      reset_requested_at TIMESTAMPTZ,
      reset_request_count INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS reset_requested_at TIMESTAMPTZ`;
  await sql`ALTER TABLE pcc_users ADD COLUMN IF NOT EXISTS reset_request_count INTEGER NOT NULL DEFAULT 0`;
  await sql`
    CREATE TABLE IF NOT EXISTS pcc_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES pcc_users(id) ON DELETE CASCADE,
      token_hash TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `;
  schemaReady = true;
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at
  };
}

async function createSession(userId) {
  const token = randomToken();
  const tokenHash = hashToken(token);
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await sql`
    INSERT INTO pcc_sessions (id, user_id, token_hash, expires_at)
    VALUES (${sessionId}, ${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;
  return token;
}

async function getSessionUser(request) {
  await ensureAuthSchema();
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return null;
  const tokenHash = hashToken(token);
  const result = await sql`
    SELECT u.id, u.email, u.created_at
    FROM pcc_sessions s
    JOIN pcc_users u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash}
      AND s.expires_at > NOW()
    LIMIT 1
  `;
  return publicUser(result.rows[0]);
}

async function deleteSession(request) {
  await ensureAuthSchema();
  const token = parseCookies(request)[COOKIE_NAME];
  if (!token) return;
  await sql`DELETE FROM pcc_sessions WHERE token_hash = ${hashToken(token)}`;
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 12);
  const userId = crypto.randomUUID();
  const result = await sql`
    INSERT INTO pcc_users (id, email, password_hash)
    VALUES (${userId}, ${email}, ${passwordHash})
    RETURNING id, email, created_at
  `;
  return publicUser(result.rows[0]);
}

async function findUserByEmail(email) {
  const result = await sql`
    SELECT id, email, password_hash, created_at, reset_requested_at, reset_request_count
    FROM pcc_users
    WHERE email = ${email}
    LIMIT 1
  `;
  return result.rows[0] || null;
}

function canSendPasswordReset(user) {
  if (!user) return { ok: false, reason: "missing" };
  const requestedAt = user.reset_requested_at ? new Date(user.reset_requested_at) : null;
  const recentWindow = requestedAt && Date.now() - requestedAt.getTime() < RESET_RATE_LIMIT_HOURS * 60 * 60 * 1000;
  const count = recentWindow ? Number(user.reset_request_count || 0) : 0;
  if (count >= RESET_RATE_LIMIT_MAX) return { ok: false, reason: "rate_limited" };
  return { ok: true, nextCount: count + 1 };
}

async function setPasswordReset(email) {
  const user = await findUserByEmail(email);
  const rate = canSendPasswordReset(user);
  if (!rate.ok) return { ok: false, reason: rate.reason };
  const token = randomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 60 * 60 * 1000);
  await sql`
    UPDATE pcc_users
    SET reset_token_hash = ${tokenHash},
        reset_expires_at = ${expiresAt.toISOString()},
        reset_requested_at = NOW(),
        reset_request_count = ${rate.nextCount},
        updated_at = NOW()
    WHERE email = ${email}
  `;
  return { ok: true, token, expiresAt };
}

async function verifyPasswordResetToken(token) {
  const tokenHash = hashToken(token);
  const result = await sql`
    SELECT id, email, created_at
    FROM pcc_users
    WHERE reset_token_hash = ${tokenHash}
      AND reset_expires_at > NOW()
    LIMIT 1
  `;
  return publicUser(result.rows[0]);
}

async function resetPasswordWithToken(token, newPassword) {
  const tokenHash = hashToken(token);
  const passwordHash = await bcrypt.hash(newPassword, 12);
  const result = await sql`
    UPDATE pcc_users
    SET password_hash = ${passwordHash},
        reset_token_hash = NULL,
        reset_expires_at = NULL,
        reset_request_count = 0,
        reset_requested_at = NULL,
        updated_at = NOW()
    WHERE reset_token_hash = ${tokenHash}
      AND reset_expires_at > NOW()
    RETURNING id
  `;
  if (!result.rowCount) return false;
  await sql`DELETE FROM pcc_sessions WHERE user_id = ${result.rows[0].id}`;
  return true;
}

module.exports = {
  bcrypt,
  clearSessionCookie,
  createSession,
  createUser,
  deleteSession,
  ensureAuthSchema,
  findUserByEmail,
  getSessionUser,
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  readJsonBody,
  resetPasswordWithToken,
  sendJson,
  sessionCookie,
  setPasswordReset,
  verifyPasswordResetToken
};
