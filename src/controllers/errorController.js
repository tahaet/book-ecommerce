const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    if (err.isOperational)
      res.status(err, statusCode).json({
        status: err.status,
        message: err.message,
      });
    else
      res.status.json({
        status: 'error',
        message: 'Something went very wrong!',
      });
  }
};

module.exports = globalErrorHandler;
