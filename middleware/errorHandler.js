function errorHandler(err, req, res, next) {
  // Log the error in development mode
  if (req.app.get("env") === "development") {
    console.error(err.stack);
  }
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Respond with error details
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    status: err.status || 500,
    error: { message: err.message || "Internal Server Error" },
  });
}

module.exports = { errorHandler };
