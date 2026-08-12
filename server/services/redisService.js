import { createClient } from "redis";

let redisClient = null;
let isRedisConnected = false;

export async function connectRedis() {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    console.log("ℹ️ [Redis Service] REDIS_URL not configured. Operating in high-performance in-memory cache mode.");
    isRedisConnected = false;
    redisClient = null;
    return;
  }

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 3000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log("⚠️ [Redis Service] Max reconnection attempts reached. Continuing with memory fallback.");
            return false; // stop reconnecting
          }
          return Math.min(retries * 200, 1000);
        }
      }
    });

    redisClient.on("error", (err) => {
      if (isRedisConnected) {
        console.log("⚠️ [Redis Event Error] Disconnected from Redis server:", err.message || err);
      }
      isRedisConnected = false;
    });

    redisClient.on("connect", () => {
      console.log("💚 [Redis Event] Establishing handshake with Redis...");
    });

    redisClient.on("ready", () => {
      console.log("💚 [Redis Event] Handshake completed! Redis is online and ready.");
      isRedisConnected = true;
    });

    await redisClient.connect();
  } catch (error) {
    console.log("ℹ️ [Redis Service] Could not connect to Redis server, defaulting to persistent in-memory caching simulation.");
    isRedisConnected = false;
    if (redisClient) {
      try {
        await redisClient.disconnect();
      } catch (_) {}
      redisClient = null;
    }
  }
}

// In-memory cache fallback to ensure caching protocol works in single-node sandbox
const memoryCache = new Map();

export async function getCachedData(key) {
  if (isRedisConnected && redisClient) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.log(`⚠️ [Redis Get Error] Key: ${key}`, err.message || err);
    }
  }
  // Fallback to memory cache
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  } else if (cached) {
    memoryCache.delete(key);
  }
  return null;
}

export async function setCachedData(key, value, ttlSeconds = 300) {
  if (isRedisConnected && redisClient) {
    try {
      await redisClient.set(key, JSON.stringify(value), {
        EX: ttlSeconds
      });
      return;
    } catch (err) {
      console.log(`⚠️ [Redis Set Error] Key: ${key}`, err.message || err);
    }
  }
  // Fallback to memory cache
  memoryCache.set(key, {
    data: value,
    expiry: Date.now() + (ttlSeconds * 1000)
  });
}

export async function invalidateCache(key) {
  if (isRedisConnected && redisClient) {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.log(`⚠️ [Redis Del Error] Key: ${key}`, err.message || err);
    }
  }
  memoryCache.delete(key);
}

export async function invalidateCachePattern(pattern) {
  if (isRedisConnected && redisClient) {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.log(`⚠️ [Redis Keys/Del Error] Pattern: ${pattern}`, err.message || err);
    }
  }
  
  // Clear matching keys from memory cache
  const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\\*/g, '.*');
  const regexPattern = new RegExp("^" + escapedPattern + "$");
  for (const key of memoryCache.keys()) {
    if (regexPattern.test(key)) {
      memoryCache.delete(key);
    }
  }
}

export function getRedisStatus() {
  return {
    connected: isRedisConnected,
    mode: isRedisConnected ? "redis-server" : "in-memory-fallback",
    redisUrl: process.env.REDIS_URL || "in-memory"
  };
}
