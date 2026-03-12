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

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
