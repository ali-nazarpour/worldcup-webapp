export function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: 'مسیر یافت نشد.' });
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'خطای داخلی سرور';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && err.details ? { details: err.details } : {}),
  });
}

export default { notFoundHandler, errorHandler };
