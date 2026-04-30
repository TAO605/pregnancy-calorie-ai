type RateLimitOptions = {
  namespace: string;
  request: Request;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  retryAfterSeconds: number;
  remaining: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __pregnancyCalorieRateLimitStore?: Map<string, RateLimitEntry>;
};

function getStore() {
  if (!globalRateLimitStore.__pregnancyCalorieRateLimitStore) {
    globalRateLimitStore.__pregnancyCalorieRateLimitStore = new Map();
  }

  return globalRateLimitStore.__pregnancyCalorieRateLimitStore;
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedClient = forwardedFor?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedClient || realIp || "unknown";
}

function pruneExpiredEntries(now: number) {
  const store = getStore();

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function checkRateLimit({
  namespace,
  request,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const store = getStore();
  const key = `${namespace}:${getClientKey(request)}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    pruneExpiredEntries(now);

    return {
      allowed: true,
      limit,
      retryAfterSeconds: 0,
      remaining: Math.max(limit - 1, 0),
      resetAt: now + windowMs,
    };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      limit,
      retryAfterSeconds: Math.max(Math.ceil((current.resetAt - now) / 1000), 1),
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(key, current);

  return {
    allowed: true,
    limit,
    retryAfterSeconds: 0,
    remaining: Math.max(limit - current.count, 0),
    resetAt: current.resetAt,
  };
}

export function buildRateLimitHeaders(result: RateLimitResult) {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  };

  if (!result.allowed) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }

  return headers;
}
