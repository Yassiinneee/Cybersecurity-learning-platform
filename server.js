import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createServer as createHttpServer } from "http";
import { Server as SocketServer } from "socket.io";

// Import requested security middlewares
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import mongoSanitize from "mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import session from "express-session";

// Import custom configurations, routes, and middlewares
import mongoose from "mongoose";
import { connectDatabase } from "./server/config/db.js";
import { autoSeedDatabase } from "./server/utils/autoSeeder.js";
import { connectRedis, getRedisStatus } from "./server/services/redisService.js";
import { nosqlPreventMiddleware, csrfMiddleware, securityLogs, handleMalformedJson, expressValidatorNoSqlGuard } from "./server/middlewares/securityMiddleware.js";
import passport from "./server/config/passport.js";
import requestLogger from "./server/middlewares/logger.js";
import errorHandler from "./server/middlewares/errorHandler.js";
import apiRouter from "./server/routes/api.js";
import socketHandler from "./server/socket/socketHandler.js";

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), '.env.example') });

// Derive __dirname in ES Modules environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createHttpServer(app);

  // Configure CORS origin validation delegate to eliminate Access-Control-Allow-Origin: *
  const allowedOriginsList = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
    : [process.env.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean);

  const corsOriginDelegate = (origin, callback) => {
    // Allow non-browser or same-origin requests (where Origin header is omitted)
    if (!origin) {
      return callback(null, true);
    }

    // Explicit origin check against configured whitelist
    if (allowedOriginsList.includes(origin)) {
      return callback(null, true);
    }

    // Dynamic verification for Cloud Run / AI Studio preview iframe containers and localhost
    try {
      const hostname = new URL(origin).hostname;
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".run.app") ||
        hostname.endsWith(".ai.studio")
      ) {
        return callback(null, true);
      }
    } catch (_) {}

    // In production, reject unlisted origins
    console.warn(`⚠️ [CORS SHIELD] Blocked unauthorized cross-origin request from: ${origin}`);
    return callback(new Error("CORS Policy Violation: Cross-origin request blocked for this origin."));
  };

  // Initialize Socket.io attached to our HTTP server
  const io = new SocketServer(httpServer, {
    cors: {
      origin: corsOriginDelegate,
      methods: ["GET", "POST"],
      credentials: true,
    }
  });

  // Handle live socket.io connections and security feeds
  socketHandler(io);
  app.set("socketio", io);

  // Trust reverse proxy (required for express-rate-limit behind Cloud Run / Nginx)
  app.set("trust proxy", 1);

  // Initialize Mongoose connection asynchronously and register lifecycle listeners
  mongoose.connection.on("connected", () => {
    console.log("💚 [Mongoose Event] Connected successfully to MongoDB");
  });
  mongoose.connection.on("error", (err) => {
    console.log("ℹ️ [Mongoose Event] Connection status update:", err.message || err);
  });
  mongoose.connection.on("disconnected", () => {
    console.log("🔌 [Mongoose Event] Disconnected from MongoDB");
  });

  await connectDatabase();
  await connectRedis();

  // Run auto-seeding if connection is fully active
  if (mongoose.connection.readyState === 1) {
    await autoSeedDatabase();
  }

  // 1. Set Comprehensive Security HTTP Headers using Helmet & Custom Policies
  const isProd = process.env.NODE_ENV === "production";

  const cspDirectives = {
    defaultSrc: ["'self'"],
    // Restrict script execution exclusively to self-hosted application bundles
    scriptSrc: isProd
      ? ["'self'"]
      : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
    imgSrc: ["'self'", "data:", "blob:", "https:"],
    // Tighten connection targets to same-origin and WebSockets and EmailJS API
    connectSrc: ["'self'", "ws:", "wss:", "https://api.emailjs.com"],
    // Protect against Clickjacking by restricting framing to same-origin and AI Studio/Cloud Run preview domains
    frameAncestors: [
      "'self'",
      "https://*.run.app",
      "https://*.ai.studio",
      "https://*.google.com"
    ],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    upgradeInsecureRequests: [],
  };

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: cspDirectives,
      },
      xContentTypeOptions: true, // X-Content-Type-Options: nosniff
      xFrameOptions: { action: "sameorigin" }, // X-Frame-Options: SAMEORIGIN
      referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Referrer-Policy
      crossOriginResourcePolicy: { policy: "cross-origin" }, // Cross-Origin-Resource-Policy (CORP)
      crossOriginEmbedderPolicy: false, // COEP: set via middleware below to credentialless for compatibility
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Cross-Origin-Opener-Policy (COOP)
      dnsPrefetchControl: { allow: false }, // X-DNS-Prefetch-Control: off
      hidePoweredBy: true, // Hide X-Powered-By header
    })
  );

  // Additional explicit headers for Permissions-Policy, COEP, and Cache-Control for sensitive API responses
  app.use((req, res, next) => {
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
    );
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");

    // Prevent caching of sensitive API response data (OWASP ZAP recommendation)
    if (req.path.startsWith("/api/")) {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    }
    next();
  });

  // 2. Enable Strict CORS with credentials support and specific origin validation
  app.use(
    cors({
      origin: corsOriginDelegate,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-CSRF-Token"],
    })
  );

  // 3. Rate Limiting for API routes to prevent DDoS and brute-force
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: { error: "Too many requests from this IP. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", limiter);

  // 4. Configure Express Session (required for Passport.js session serialize/deserialize support)
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "cybernexus_session_secret_xyz",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: true, // required for SameSite=None inside preview iframe
        sameSite: "none", // required for cross-origin iframe context
        httpOnly: true,
      },
    })
  );

  // 5. Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // 6. Parse Cookies
  app.use(cookieParser());

  // 7. Parse JSON bodies & urlencoded data
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Handle Malformed JSON payload syntax errors cleanly
  app.use(handleMalformedJson);

  // Apply mongo-sanitize to strip $ and . keys from body, query, and params
  app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize(req.body);
    if (req.query) req.query = mongoSanitize(req.query);
    if (req.params) req.params = mongoSanitize(req.params);
    next();
  });

  // express-validator NoSQL Injection Guard
  app.use(expressValidatorNoSqlGuard);

  // 6. Advanced NoSQL Injection Prevention Middleware
  app.use(nosqlPreventMiddleware);

  // 7. CSRF Prevention Middleware
  app.use(csrfMiddleware);

  // 7. Sanitize data against Cross-Site Scripting (XSS)
  app.use(xss());

  // 8. Prevent HTTP Parameter Pollution
  app.use(hpp());

  // Custom Logger Middleware
  app.use(requestLogger);

  // Expose Mongoose DB Status Endpoint
  app.get("/api/db-status", (req, res) => {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
      4: "unknown"
    };
    const readyState = mongoose.connection.readyState;
    res.json({
      status: states[readyState] || "unknown",
      readyState,
      database: mongoose.connection.name || "cyber_nexus",
    });
  });

  // Expose Redis Status Endpoint
  app.get("/api/redis-status", (req, res) => {
    res.json(getRedisStatus());
  });

  // Expose Security Status Endpoint
  app.get("/api/security-status", (req, res) => {
    res.json({
      nosqlPreventionActive: true,
      csrfProtectionActive: false,
      logs: securityLogs
    });
  });

  // Expose CSRF Token Endpoint
  app.get("/api/csrf-token", (req, res) => {
    res.json({ csrfToken: "DISABLED" });
  });

  // Mount Modular API Routes
  app.use("/api", apiRouter);

  // Serve static files in production, or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Catch-all route to serve index.html for React SPA Router
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind global error handler middleware (must be registered last!)
  app.use(errorHandler);

  // Listen on port 3000 and bind to host 0.0.0.0 (required for container routing)
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`[CyberNexus Server] running with Socket.io at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start custom modular Express server:", error);
});
