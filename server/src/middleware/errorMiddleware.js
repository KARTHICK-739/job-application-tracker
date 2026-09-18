import mongoose from 'mongoose';

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'An account with this email already exists';
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (message === 'Not allowed by CORS') {
    statusCode = 403;
    message = 'This origin is not allowed to access the API';
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

