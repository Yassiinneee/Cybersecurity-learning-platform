import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the logs folder exists and write to server.log
const logFilePath = path.join(__dirname, "../logs/server.log");

// Ensure directory exists
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * Custom request logger middleware.
 * Logs methods, endpoints, IP addresses, and response status to stdout and server.log.
 */
export default function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${ip} - ${method} ${url} ${status} - ${duration}ms\n`;

    // Output to stdout
    console.log(logLine.trim());

    // Append to server.log asynchronously
    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) {
        console.error("Failed to append to log file:", err);
      }
    });
  });

  next();
}
