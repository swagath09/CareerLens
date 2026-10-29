const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: `File too large. Maximum size is ${process.env.MAX_FILE_SIZE_MB || 5}MB`,
    });
  }

  if (err.message?.includes('Only PDF and Word')) {
    return res.status(400).json({ success: false, error: err.message });
  }

  const status = err.statusCode || err.status || 500;
  const isServerError = status >= 500;

  res.status(status).json({
    success: false,
    // Avoid exposing internal exception details to API clients.
    error: isServerError ? 'Internal Server Error' : (err.message || 'Request failed'),
  });
};

module.exports = errorHandler;
