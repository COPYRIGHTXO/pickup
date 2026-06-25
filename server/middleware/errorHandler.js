/**
 * Global error handler middleware
 * Catches unhandled errors and returns proper JSON responses.
 *
 * Express 5 requires all four arguments to identify this as an error handler.
 */
export default function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message);

  // If headers have already been sent, let Express default handler deal with it
  if (res.headersSent) {
    return _next(err);
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
