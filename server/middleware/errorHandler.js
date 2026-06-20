/**
 * Global error handler middleware
 * Catches unhandled errors and returns proper JSON responses
 */
export default function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
