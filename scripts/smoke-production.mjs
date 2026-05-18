import { spawn } from "node:child_process";
import { once } from "node:events";
import { readFile, writeFile } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.SMOKE_PORT ?? 3100);
const baseUrl = `http://localhost:${port}`;
const nextBin = path.join(rootDir, "node_modules", "next", "dist", "bin", "next");
const contentPagesPath = path.join(rootDir, "data", "content-pages.json");
const timeoutMs = 45_000;
const demoCookie =
  "nd_session=authenticated; nd_provider=demo; nd_user_email=qa%40example.com";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function assertPortFree() {
  const server = net.createServer();

  try {
    server.listen(port, "127.0.0.1");
    await once(server, "listening");
  } catch {
    throw new Error(
      `Port ${port} is already in use. Stop the old smoke-test server before rerunning.`,
    );
  } finally {
    server.close();
  }
}

async function waitForHealth() {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/health`);
      if (response.ok) {
        return;
      }
      lastError = new Error(`Health returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw lastError ?? new Error("Health check timed out.");
}

async function request(pathname, options = {}) {
  return fetch(`${baseUrl}${pathname}`, {
    redirect: "manual",
    ...options,
  });
}

async function assertStatus(pathname, expectedStatus, options) {
  const response = await request(pathname, options);
  assert(
    response.status === expectedStatus,
    `${pathname} returned ${response.status}, expected ${expectedStatus}`,
  );
  return response;
}

async function postAnalyticsEvent(event) {
  const response = await request("/api/v1/events", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(event),
  });

  assert(
    response.status === 200,
    `Analytics event ${event.name} returned ${response.status}.`,
  );
  assertNoStore(response, `Analytics event ${event.name}`);
  return response;
}

function assertNoStore(response, label) {
  assert(
    response.headers.get("cache-control") === "no-store",
    `${label} must return Cache-Control: no-store.`,
  );
}

function getCookiePairFromSetCookie(response, cookieName) {
  const setCookie = response.headers.get("set-cookie") ?? "";
  const match = setCookie.match(new RegExp(`(?:^|,\\s*)(${cookieName}=[^;]+)`));
  return match?.[1] ?? null;
}

async function smokeContentSaveWithRestore(adminCookie) {
  const originalContentPages = await readFile(contentPagesPath, "utf8");

  try {
    const contentSave = await request("/api/v1/admin/content/pages", {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
        cookie: adminCookie,
      },
      body: JSON.stringify({
        id: "smoke_audit_content",
        slug: "smoke-audit-content",
        locale: "en",
        title: "Smoke Audit Content",
        description: "Smoke audit content description.",
        body: "This smoke-only draft verifies content audit logging without changing the tracked seed file.",
        status: "draft",
      }),
    });

    assert(
      contentSave.status === 200,
      `Admin content save returned ${contentSave.status}.`,
    );
    assertNoStore(contentSave, "Admin content save API");
  } finally {
    await writeFile(contentPagesPath, originalContentPages, "utf8");
  }
}

async function runChecks() {
  const root = await assertStatus("/", 200);
  const rootHtml = await root.text();
  assert(
    rootHtml.includes("30 秒算出孕期每日热量") &&
      rootHtml.includes("AI 解读"),
    "Root should render the rebuilt Chinese pregnancy calorie calculator.",
  );

  await Promise.all([
    assertStatus("/en", 200),
    assertStatus("/en/tools/pregnancy-calorie-calculator", 200),
    assertStatus(
      "/en/tools/pregnancy-calorie-calculator/result?calories=2200&min=2100&max=2300&trimester=2&source=ACOG&extra=340&bmi=normal",
      200,
    ),
    assertStatus("/en/ai", 200),
    assertStatus("/en/auth/sign-in", 200),
    assertStatus("/en/blog", 200),
    assertStatus("/en/blog/pregnancy-fiber-and-hydration", 200),
    assertStatus("/zh-CN/blog/third-trimester-meal-timing", 200),
    assertStatus("/es/blog/first-trimester-appetite-and-calories", 200),
    assertStatus("/admin/sign-in", 200),
  ]);

  const health = await assertStatus("/api/v1/health", 200);
  assertNoStore(health, "Health check");

  const dashboardGuest = await assertStatus("/en/dashboard", 307);
  assert(
    dashboardGuest.headers.get("location") ===
      "/en/auth/sign-in?next=%2Fen%2Fdashboard&source=dashboard_gate",
    "Guest dashboard redirect target changed.",
  );

  await assertStatus("/en/dashboard", 200, {
    headers: {
      cookie: demoCookie,
    },
  });

  const adminUnauthorized = await assertStatus("/api/v1/admin/guidelines", 401);
  assertNoStore(adminUnauthorized, "Admin unauthorized API");
  const demoUnauthorized = await assertStatus("/api/v1/demo/user-data", 401);
  assertNoStore(demoUnauthorized, "Demo unauthorized API");
  await assertStatus("/api/v1/guidelines/US", 200);

  const demoData = await assertStatus("/api/v1/demo/user-data", 200, {
    headers: {
      cookie: demoCookie,
    },
  });
  assertNoStore(demoData, "Demo user data API");
  const demoPayload = await demoData.json();
  assert("bundle" in demoPayload, "Demo user data response should include bundle.");

  const validAnalyticsEvent = await postAnalyticsEvent({
    name: "content_page_viewed",
    locale: "en",
    metadata: {
      slug: "pregnancy-fiber-and-hydration",
      guideTopic: "fiber_hydration",
    },
  });
  assert(
    validAnalyticsEvent.headers.has("x-ratelimit-limit"),
    "Analytics events API should return rate-limit headers.",
  );

  const weeklyReviewSessionId = `smoke-weekly-${Date.now()}`;
  await postAnalyticsEvent({
    name: "ai_entry_clicked",
    locale: "en",
    metadata: {
      source: "dashboard_weekly_checkin",
    },
  });
  await postAnalyticsEvent({
    name: "ai_chat_started",
    locale: "en",
    metadata: {
      source: "dashboard_weekly_checkin",
      hasContext: true,
      isFollowUp: false,
      promptOrigin: "context_prompt",
      sessionId: weeklyReviewSessionId,
    },
  });
  await postAnalyticsEvent({
    name: "ai_chat_started",
    locale: "en",
    metadata: {
      source: "dashboard_weekly_checkin",
      hasContext: true,
      isFollowUp: true,
      promptOrigin: "history_reuse",
      sessionId: weeklyReviewSessionId,
    },
  });

  const invalidAnalyticsEventName = await request("/api/v1/events", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: "unknown_event",
      locale: "en",
    }),
  });
  assert(
    invalidAnalyticsEventName.status === 400,
    `Invalid analytics event name returned ${invalidAnalyticsEventName.status}.`,
  );
  assertNoStore(invalidAnalyticsEventName, "Invalid analytics event name");

  const invalidAnalyticsMetadata = await request("/api/v1/events", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      name: "content_page_viewed",
      locale: "en",
      metadata: {
        nested: { notAllowed: true },
      },
    }),
  });
  assert(
    invalidAnalyticsMetadata.status === 400,
    `Invalid analytics metadata returned ${invalidAnalyticsMetadata.status}.`,
  );
  assertNoStore(invalidAnalyticsMetadata, "Invalid analytics metadata");

  const malformedAnalyticsJson = await request("/api/v1/events", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: "{",
  });
  assert(
    malformedAnalyticsJson.status === 400,
    `Malformed analytics JSON returned ${malformedAnalyticsJson.status}.`,
  );
  assertNoStore(malformedAnalyticsJson, "Malformed analytics JSON");

  const adminSignIn = await request("/api/v1/admin/session", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      password: process.env.ADMIN_DEMO_PASSWORD || "admin123",
    }),
  });
  assert(adminSignIn.status === 200, `Admin sign-in returned ${adminSignIn.status}.`);
  assertNoStore(adminSignIn, "Admin sign-in API");
  assert(
    adminSignIn.headers.get("set-cookie")?.includes("nd_admin_session"),
    "Admin sign-in should set the admin session cookie.",
  );
  assert(
    adminSignIn.headers.has("x-ratelimit-limit"),
    "Admin sign-in should return rate-limit headers.",
  );
  const adminCookie = getCookiePairFromSetCookie(adminSignIn, "nd_admin_session");
  assert(adminCookie, "Admin sign-in cookie should be readable by smoke test.");

  await smokeContentSaveWithRestore(adminCookie);

  const smokeUserEmail = "smoke-retention@example.com";
  for (const snapshot of [
    {
      email: smokeUserEmail,
      displayName: "Smoke Retention",
      signUpSource: "calculator_result_save",
      locale: "en",
      countryCode: "US",
      gestationalWeek: 22,
      status: "saved_profile",
      event: "signup_completed",
      lastRecommendedCalories: 2200,
    },
    {
      email: smokeUserEmail,
      displayName: "Smoke Retention",
      locale: "en",
      countryCode: "US",
      gestationalWeek: 22,
      status: "saved_profile",
      event: "dashboard_viewed",
      lastRecommendedCalories: 2200,
    },
    {
      email: smokeUserEmail,
      displayName: "Smoke Retention",
      locale: "en",
      countryCode: "US",
      gestationalWeek: 22,
      status: "saved_profile",
      event: "ai_chat_started",
      lastRecommendedCalories: 2200,
    },
    {
      email: smokeUserEmail,
      displayName: "Smoke Retention",
      locale: "en",
      countryCode: "US",
      gestationalWeek: 22,
      status: "active_tracking",
      event: "weight_log_created",
      lastRecommendedCalories: 2200,
    },
    {
      email: smokeUserEmail,
      displayName: "Smoke Retention",
      locale: "en",
      countryCode: "US",
      gestationalWeek: 22,
      status: "active_tracking",
      event: "meal_log_created",
      lastRecommendedCalories: 2200,
    },
  ]) {
    const snapshotResponse = await request("/api/v1/users/snapshot", {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(snapshot),
    });
    assert(
      snapshotResponse.status === 200,
      `User snapshot returned ${snapshotResponse.status}.`,
    );
    assertNoStore(snapshotResponse, "User snapshot API");
  }

  const guidelineUpdate = await request("/api/v1/admin/guidelines/us_acog", {
    method: "PUT",
    headers: {
      "content-type": "application/json; charset=utf-8",
      cookie: adminCookie,
    },
    body: JSON.stringify({
      displayName: "United States (ACOG)",
      countryCode: "US",
      trimesterCalories: {
        t1: 0,
        t2: 340,
        t3: 450,
      },
      disclaimerKey: "medical_disclaimer_us",
    }),
  });
  assert(
    guidelineUpdate.status === 200,
    `Admin guideline update returned ${guidelineUpdate.status}.`,
  );
  assertNoStore(guidelineUpdate, "Admin guideline update API");

  const adminAnalytics = await assertStatus("/admin/analytics", 200, {
    headers: {
      cookie: adminCookie,
    },
  });
  const adminAnalyticsHtml = await adminAnalytics.text();
  assert(
    adminAnalyticsHtml.includes("Weekly review AI conversion"),
    "Admin analytics should render the weekly review conversion module.",
  );
  assert(
    adminAnalyticsHtml.includes("Dashboard weekly check-in CTA") &&
      adminAnalyticsHtml.includes("Follow-up messages"),
    "Admin analytics should render seeded weekly review conversion quality.",
  );
  assert(
    adminAnalyticsHtml.includes("Downstream quality"),
    "Admin analytics should render the sign-in source downstream quality module.",
  );
  assert(
    adminAnalyticsHtml.includes("Weight logs") &&
      adminAnalyticsHtml.includes("Meal logs"),
    "Admin analytics should split downstream tracking quality by weight and meal logs.",
  );
  assert(
    adminAnalyticsHtml.includes("Recent admin changes") &&
      adminAnalyticsHtml.includes("Content page saved") &&
      adminAnalyticsHtml.includes("Saved content page: Smoke Audit Content") &&
      adminAnalyticsHtml.includes("Guideline pack updated") &&
      adminAnalyticsHtml.includes("Updated guideline pack: United States (ACOG)"),
    "Admin analytics should render recent admin audit changes.",
  );

  const calculator = await request("/api/v1/calculator/pregnancy-calories", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      age: 30,
      height: 165,
      heightUnit: "cm",
      prePregnancyWeight: 60,
      currentWeight: 63,
      weightUnit: "kg",
      gestationalWeek: 22,
      activityLevel: "light",
      pregnancyType: "singleton",
      countryCode: "US",
      locale: "en",
    }),
  });
  assert(calculator.status === 200, `Calculator returned ${calculator.status}.`);
  assertNoStore(calculator, "Calculator API");
  assert(
    calculator.headers.has("x-ratelimit-limit"),
    "Calculator should return rate-limit headers.",
  );

  const malformedCalculatorJson = await request(
    "/api/v1/calculator/pregnancy-calories",
    {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: "{",
    },
  );
  assert(
    malformedCalculatorJson.status === 400,
    `Malformed calculator JSON returned ${malformedCalculatorJson.status}.`,
  );
  assertNoStore(malformedCalculatorJson, "Malformed calculator JSON");

  const ai = await request("/api/v1/ai/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      locale: "zh-CN",
      question:
        "\u6211\u5b55\u671f\u7a81\u7136\u4e25\u91cd\u51fa\u8840\u5e76\u4e14\u8179\u75db\uff0c\u5e94\u8be5\u5403\u4ec0\u4e48\uff1f",
    }),
  });
  assert(ai.status === 200, `AI chat returned ${ai.status}.`);
  assertNoStore(ai, "AI chat API");
  const aiPayload = await ai.json();
  assert(aiPayload.medicalEscalation === true, "AI high-risk escalation failed.");
  assert(
    typeof aiPayload.answer === "string" &&
      aiPayload.answer.includes("\u9ad8\u98ce\u9669"),
    "AI high-risk answer should be readable Chinese.",
  );
  assert(
    typeof aiPayload.disclaimer === "string" &&
      aiPayload.disclaimer.includes("\u6025\u75c7"),
    "AI high-risk disclaimer should be readable Chinese.",
  );

  const malformedAiJson = await request("/api/v1/ai/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: "{",
  });
  assert(
    malformedAiJson.status === 400,
    `Malformed AI chat JSON returned ${malformedAiJson.status}.`,
  );
  assertNoStore(malformedAiJson, "Malformed AI chat JSON");

  const robots = await (await assertStatus("/robots.txt", 200)).text();
  for (const line of [
    "Disallow: /admin",
    "Disallow: /api/",
    "Disallow: /en/auth/sign-in",
    "Disallow: /zh-CN/dashboard",
    "Disallow: /es/dashboard/weight",
  ]) {
    assert(robots.includes(line), `robots.txt missing ${line}`);
  }

  const sitemap = await (await assertStatus("/sitemap.xml", 200)).text();
  assert(!sitemap.includes("/admin"), "sitemap should not include admin routes.");
  assert(!sitemap.includes("/dashboard"), "sitemap should not include dashboard routes.");
  assert(
    !sitemap.includes("/auth/sign-in"),
    "sitemap should not include auth sign-in routes.",
  );
}

await assertPortFree();

const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
  cwd: rootDir,
  env: {
    ...process.env,
    ADMIN_DEMO_PASSWORD: process.env.ADMIN_DEMO_PASSWORD || "admin123",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => {
  serverOutput += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk.toString();
});

try {
  await waitForHealth();
  await runChecks();
  console.log("Production smoke test passed.");
} catch (error) {
  console.error(serverOutput.trim());
  throw error;
} finally {
  if (!server.killed) {
    server.kill("SIGTERM");
  }
}
