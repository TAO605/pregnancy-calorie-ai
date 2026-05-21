const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");

function mockPostgres(sql = jest.fn()) {
  jest.doMock("@vercel/postgres", () => ({ sql }), { virtual: true });
  return sql;
}

function mockBcrypt() {
  jest.doMock("bcryptjs", () => ({
    hash: jest.fn(async (password) => `hashed:${password}`)
  }), { virtual: true });
}

describe("early free user access", () => {
  const originalFreeMode = process.env.NEXT_PUBLIC_ALL_FEATURES_FREE;
  const originalCutoff = process.env.EARLY_FREE_CUTOFF_DATE;

  afterEach(() => {
    if (originalFreeMode === undefined) delete process.env.NEXT_PUBLIC_ALL_FEATURES_FREE;
    else process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = originalFreeMode;
    if (originalCutoff === undefined) delete process.env.EARLY_FREE_CUTOFF_DATE;
    else process.env.EARLY_FREE_CUTOFF_DATE = originalCutoff;
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("checkSubscription keeps persisted early users premium after free mode is off", () => {
    process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = "false";
    delete process.env.EARLY_FREE_CUTOFF_DATE;
    mockPostgres();
    mockBcrypt();

    const { checkSubscription } = require(path.join(repoRoot, "delivery", "api", "subscription", "_store.js"));
    const access = checkSubscription({
      created_at: "2026-05-20T00:00:00.000Z",
      is_early_user: true,
      subscription_status: "free"
    });

    expect(access.isSubscribed).toBe(true);
    expect(access.isPremium).toBe(true);
    expect(access.earlyFreeUser).toBe(true);
    expect(access.subscription).toEqual({
      plan: "premium",
      status: "active",
      isEarlyUser: true
    });
  });

  test("checkSubscription keeps cutoff-era users premium as a legacy fallback", () => {
    process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = "false";
    process.env.EARLY_FREE_CUTOFF_DATE = "2026-05-21T00:00:00.000Z";
    mockPostgres();
    mockBcrypt();

    const { checkSubscription } = require(path.join(repoRoot, "delivery", "api", "subscription", "_store.js"));
    const access = checkSubscription({
      created_at: "2026-05-20T00:00:00.000Z",
      is_early_user: false,
      subscription_status: "free"
    });

    expect(access.isSubscribed).toBe(true);
    expect(access.isPremium).toBe(true);
    expect(access.earlyFreeUser).toBe(true);
  });

  test("checkSubscription leaves ordinary free users on the original subscription path", () => {
    process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = "false";
    delete process.env.EARLY_FREE_CUTOFF_DATE;
    mockPostgres();
    mockBcrypt();

    const { checkSubscription } = require(path.join(repoRoot, "delivery", "api", "subscription", "_store.js"));
    const access = checkSubscription({
      created_at: "2026-05-22T00:00:00.000Z",
      is_early_user: false,
      subscription_status: "free"
    });

    expect(access.isSubscribed).toBe(false);
    expect(access.isPremium).toBe(false);
    expect(access.earlyFreeUser).toBe(false);
  });
});

describe("early user registration marker", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_ALL_FEATURES_FREE;
  });

  test("createUser persists is_early_user when global free mode is enabled", async () => {
    process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = "true";
    const mockSql = jest.fn(async (strings, ...values) => ({
        rows: [{
          id: values[0],
          email: values[1],
          created_at: "2026-05-20T00:00:00.000Z",
          is_early_user: values[3]
        }]
      }));
    mockPostgres(mockSql);
    mockBcrypt();

    const { createUser } = require(path.join(repoRoot, "delivery", "api", "auth", "_auth.js"));
    const user = await createUser("early@example.com", "secret123");
    const insertSql = mockSql.mock.calls[0][0].join(" ");

    expect(insertSql).toContain("is_early_user");
    expect(mockSql.mock.calls[0][4]).toBe(true);
    expect(user.isEarlyUser).toBe(true);
  });

  test("createUser defaults is_early_user to false when free mode is disabled", async () => {
    process.env.NEXT_PUBLIC_ALL_FEATURES_FREE = "false";
    const mockSql = jest.fn(async (strings, ...values) => ({
        rows: [{
          id: values[0],
          email: values[1],
          created_at: "2026-05-20T00:00:00.000Z",
          is_early_user: values[3]
        }]
      }));
    mockPostgres(mockSql);
    mockBcrypt();

    const { createUser } = require(path.join(repoRoot, "delivery", "api", "auth", "_auth.js"));
    const user = await createUser("paid-era@example.com", "secret123");

    expect(mockSql.mock.calls[0][4]).toBe(false);
    expect(user.isEarlyUser).toBe(false);
  });
});
