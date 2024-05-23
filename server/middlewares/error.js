/* eslint-disable prettier/prettier */
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode ? err.statusCode : 500;

  if(err.code === 11000){
    statusCode = 400;
    err.message = Object.keys(err.keyValue)[0] + " already exists";
  }
  if(err.name==='CastError') {
    statusCode = 400;
    err.message =  "Invalid " + err.path;
  }

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
