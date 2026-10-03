export const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : (
    process.env.NODE_ENV === 'production' 
      ? 'An unexpected server error occurred. Please try again.' 
      : err.message
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
