const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
  });
};
const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (err) {
    next(err);
  }
};
export { errorMiddleware, TryCatch };
