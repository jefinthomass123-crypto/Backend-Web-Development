module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message:
        status >= 500
          ? 'An unexpected error occurred'
          : err.message || 'Request failed'
    }
  });
};