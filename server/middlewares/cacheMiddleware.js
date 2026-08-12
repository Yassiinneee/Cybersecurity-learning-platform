import { getCachedData, setCachedData } from "../services/redisService.js";

/**
 * Express middleware to cache responses.
 * @param {string} keyPrefix - The namespace key prefix for the cache
 * @param {number} ttlSeconds - Time-To-Live in seconds for cache item
 */
export const cacheMiddleware = (keyPrefix, ttlSeconds = 120) => {
  return async (req, res, next) => {
    // Generate a secure and clear cache key
    const cacheKey = `${keyPrefix}:${req.originalUrl || req.url}`;
    
    try {
      const cachedResponse = await getCachedData(cacheKey);
      if (cachedResponse) {
        // Tag responses so our developers can audit cache performance (HIT vs MISS)
        res.setHeader("X-Cache", "HIT");
        return res.json(cachedResponse);
      }
      
      res.setHeader("X-Cache", "MISS");
      const originalJson = res.json;
      
      res.json = function (body) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCachedData(cacheKey, body, ttlSeconds).catch((err) => 
            console.error("⚠️ [Cache Store Error]", err.message || err)
          );
        }
        return originalJson.call(this, body);
      };
      
      next();
    } catch (err) {
      console.error("⚠️ [Cache Middleware Error]", err.message || err);
      next();
    }
  };
};
