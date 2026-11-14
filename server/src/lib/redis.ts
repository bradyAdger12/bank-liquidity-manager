import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = new Redis(redisUrl);

const DEFAULT_TTL_SECONDS = 60 * 5;
const isDev = process.env.NODE_ENV !== "production";

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await redis.get(key);
    if (isDev) console.log(`cache ${value ? "hit" : "miss"} for ${key}`);
    return value ? (JSON.parse(value) as T) : null;
  } catch (err) {
    console.error(`Redis GET failed for key "${key}"`, err);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error(`Redis SET failed for key "${key}"`, err);
  }
}
