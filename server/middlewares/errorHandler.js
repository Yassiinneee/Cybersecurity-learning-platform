/**
 * Express global error handling middleware.
 */
export default function errorHandler(err, req, res, next) {
  console.error("Global Server Error Handled:", err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "An unexpected system error occurred on the CyberNexus server.";

  res.status(status).json({
    error: message,
    status: "error",
    timestamp: new Date().toISOString()
  });
}
