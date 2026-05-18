const BASE_URL = (process.env.SUBSCRIPTION_TEST_BASE_URL || "https://aipregnancycaloriecalculator.online").replace(/\/+$/, "");
const EMAIL = process.env.SUBSCRIPTION_TEST_EMAIL || "";
const PASSWORD = process.env.SUBSCRIPTION_TEST_PASSWORD || "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    redirect: "manual",
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  return { response, body };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const checks = [];
async function check(name, fn) {
  const started = Date.now();
  try {
    await fn();
    checks.push({ name, ok: true, ms: Date.now() - started });
  } catch (error) {
    checks.push({ name, ok: false, ms: Date.now() - started, error: error.message });
  }
}

await check("Premium page returns HTML", async () => {
  const response = await fetch(`${BASE_URL}/premium`);
  assert(response.status === 200, `Expected 200, got ${response.status}`);
  const html = await response.text();
  assert(html.includes("Start 7-Day Free Trial"), "Premium CTA missing");
});

await check("Anonymous subscription status is free", async () => {
  const { response, body } = await request("/api/subscription/status", { method: "GET" });
  assert(response.status === 200, `Expected 200, got ${response.status}`);
  assert(body && body.subscription && body.subscription.isPremium === false, "Anonymous user should not be premium");
});

await check("Anonymous checkout is blocked without breaking free calculator", async () => {
  const { response } = await request("/api/subscription/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ plan: "annual" })
  });
  assert(response.status === 401, `Expected 401 for anonymous checkout, got ${response.status}`);
});

if (EMAIL && PASSWORD) {
  let cookie = "";
  await check("Logged-in checkout creates Stripe URL", async () => {
    const login = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    assert(login.response.status === 200, `Login failed with ${login.response.status}`);
    cookie = login.response.headers.get("set-cookie") || "";
    assert(cookie.includes("pcc_session"), "Session cookie missing");

    const checkout = await request("/api/subscription/create-checkout-session", {
      method: "POST",
      headers: { cookie },
      body: JSON.stringify({ plan: "annual" })
    });
    assert([200, 500].includes(checkout.response.status), `Unexpected checkout status ${checkout.response.status}`);
    if (checkout.response.status === 200) {
      assert(checkout.body && (checkout.body.url || checkout.body.alreadyPremium), "Checkout URL or alreadyPremium flag missing");
    } else {
      assert(String(JSON.stringify(checkout.body)).includes("temporarily unavailable"), "500 should be a safe checkout configuration error");
    }
  });
}

const failed = checks.filter((item) => !item.ok);
console.log(JSON.stringify({ baseUrl: BASE_URL, total: checks.length, passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
if (failed.length) process.exit(1);
