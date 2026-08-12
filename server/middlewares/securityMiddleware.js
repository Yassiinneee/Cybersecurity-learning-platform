import crypto from "crypto";
import { check, validationResult } from "express-validator";
import mongoSanitize from "mongo-sanitize";

// Track security logs in memory to display on the dashboard
export const securityLogs = [];

/**
 * Middleware: Malformed JSON Error Handler
 * Catches SyntaxError from express.json() when incoming request body is invalid/malformed JSON.
 */
export const handleMalformedJson = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    const originIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    console.warn(`⚠️ [SECURITY SHIELD] Malformed JSON payload received from IP: ${originIp}`);

    const logEntry = {
      id: `sec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "MALFORMED_JSON",
      severity: "WARNING",
      details: `Malformed JSON payload rejected on ${req.method} ${req.originalUrl || req.url}: ${err.message}`,
      origin: originIp,
    };

    securityLogs.unshift(logEntry);
    if (securityLogs.length > 50) securityLogs.pop();

    const io = req.app.get("socketio");
    if (io) {
      io.emit("security_feed_update", {
        id: `feed_${Date.now()}`,
        message: `🛡️ [DEFENSE] Malformed JSON request blocked from IP: ${originIp}`,
        type: "warning",
        time: new Date().toLocaleTimeString(),
      });
    }

    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload. Please ensure request body contains valid JSON syntax.",
      code: "INVALID_JSON_PAYLOAD",
      details: err.message,
    });
  }
  next(err);
};

/**
 * express-validator Rule: Scans all fields in body, query, and params for NoSQL Injection patterns.
 * Detects NoSQL operators ($gt, $ne, $where, $regex, $exists, etc.) and object structures injected into query/body params.
 */
export const expressValidatorNoSqlGuard = [
  check("*").custom((value, { req, path }) => {
    const scanForNoSql = (val, currentPath) => {
      if (val === null || val === undefined) return true;

      if (typeof val === "object") {
        for (const key of Object.keys(val)) {
          if (key.startsWith("$") || key.includes(".")) {
            throw new Error(`NoSQL Injection operator '${key}' detected in parameter '${currentPath}'`);
          }
          scanForNoSql(val[key], `${currentPath}.${key}`);
        }
      } else if (typeof val === "string") {
        if (/\$(gt|gte|lt|lte|ne|in|nin|where|regex|expr|exists|mod|text|all|elemMatch|size)\b/i.test(val)) {
          throw new Error(`NoSQL Injection operator string pattern detected in parameter '${currentPath}'`);
        }
      }
      return true;
    };

    return scanForNoSql(value, path);
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const originIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
      const firstError = errors.array()[0];

      const logEntry = {
        id: `sec_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: "NOSQL_INJECTION",
        severity: "CRITICAL",
        details: `express-validator blocked NoSQL Injection: ${firstError.msg} on ${req.method} ${req.originalUrl || req.url}`,
        origin: originIp,
      };

      securityLogs.unshift(logEntry);
      if (securityLogs.length > 50) securityLogs.pop();

      console.warn(`⚠️ [SECURITY SHIELD] express-validator NoSQL Injection blocked! IP: ${originIp}, Details: ${firstError.msg}`);

      const io = req.app.get("socketio");
      if (io) {
        io.emit("security_feed_update", {
          id: `feed_${Date.now()}`,
          message: `🛡️ [DEFENSE] express-validator blocked NoSQL Injection attempt from IP: ${originIp}. Details: ${firstError.msg}`,
          type: "alert",
          time: new Date().toLocaleTimeString(),
        });
      }

      return res.status(400).json({
        success: false,
        error: "Security Policy Violation: NoSQL Injection detected.",
        details: firstError.msg,
        errors: errors.array(),
      });
    }
    next();
  }
];

/**
 * Recursively scans and sanitizes inputs, detecting NoSQL operators.
 * Keys starting with $ are blocked/stripped and flagged.
 */
function containsNoSqlOperators(obj, flaggedKeys = []) {
  if (!obj || typeof obj !== "object") return false;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      flaggedKeys.push(key);
    }
    // Recurse into nested objects or arrays
    if (typeof obj[key] === "object") {
      containsNoSqlOperators(obj[key], flaggedKeys);
    }
  }
  return flaggedKeys.length > 0;
}

/**
 * Deep sanitization helper that uses mongo-sanitize to strip $ and . operators
 */
export function deepSanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;
  return mongoSanitize(obj);
}

/**
 * Middleware: NoSQL Injection Guard
 * Detects NoSQL operators, blocks/logs the incident, sanitizes the payload,
 * and notifies active clients using Socket.io to showcase active defense systems.
 */
export const nosqlPreventMiddleware = (req, res, next) => {
  const flagged = [];
  
  // Inspect Body, Query, and Params
  if (req.body) containsNoSqlOperators(req.body, flagged);
  if (req.query) containsNoSqlOperators(req.query, flagged);
  if (req.params) containsNoSqlOperators(req.params, flagged);

  if (flagged.length > 0) {
    const originIp = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const logEntry = {
      id: `sec_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "NOSQL_INJECTION",
      severity: "CRITICAL",
      details: `Detected query operator injection attempt: "${flagged.join(", ")}" in ${req.method} ${req.originalUrl || req.url}`,
      origin: originIp,
    };

    securityLogs.unshift(logEntry);
    if (securityLogs.length > 50) securityLogs.pop();

    console.warn(`⚠️ [SECURITY SHIELD] NoSQL Injection blocked! Source: ${originIp}, Key: ${flagged.join(", ")}`);

    // Broadcast safety event dynamically via socket.io if attached to app
    const io = req.app.get("socketio");
    if (io) {
      io.emit("security_feed_update", {
        id: `feed_${Date.now()}`,
        message: `🛡️ [DEFENSE] NoSQL Injection blocked from IP: ${originIp}. Flagged parameters: \`${flagged.join(", ")}\``,
        type: "alert",
        time: new Date().toLocaleTimeString()
      });
    }

    // Fully sanitize the request properties before proceeding
    if (req.body) req.body = deepSanitize(req.body);
    if (req.query) req.query = deepSanitize(req.query);
    if (req.params) req.params = deepSanitize(req.params);
  }

  next();
};

/**
 * Middleware: CSRF Protection
 * Disabled by request. No-op middleware.
 */
export const csrfMiddleware = (req, res, next) => {
  if (req.cookies && req.cookies["XSRF-TOKEN"]) {
    res.clearCookie("XSRF-TOKEN", {
      secure: true,
      sameSite: "none",
      path: "/"
    });
  }
  next();
};
