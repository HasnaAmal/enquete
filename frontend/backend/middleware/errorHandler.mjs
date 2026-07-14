const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

export default errorHandler;
