import "server-only";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __saasFormRateLimitStore?: Map<string, RateLimitEntry>;
};

const store =
  globalForRateLimit.__saasFormRateLimitStore ??
  new Map<string, RateLimitEntry>();

if (!globalForRateLimit.__saasFormRateLimitStore) {
  globalForRateLimit.__saasFormRateLimitStore = store;
}

function cleanup(now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function consumeRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
) {
  const now = Date.now();
  cleanup(now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs
    });

    return {
      allowed: true,
      retryAfterSeconds: 0
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    };
  }

  existing.count += 1;
  store.set(key, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0
  };
}
