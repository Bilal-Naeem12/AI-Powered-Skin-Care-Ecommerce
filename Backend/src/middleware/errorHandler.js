function describeError(err) {
  if (["ValidationError", "CastError"].includes(err.name)) return { status: 400, message: "Invalid request data." };
  if (err.code === 11000) return { status: 409, message: "A record with those details already exists." };
  if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(err.name)) return { status: 401, message: "Invalid or expired token." };
  if (["MongoNetworkError", "MongoServerSelectionError", "MongooseServerSelectionError"].includes(err.name)) return { status: 503, message: "Database temporarily unavailable. Please try again later." };
  if (err.type === "entity.parse.failed") return { status: 400, message: "Invalid JSON body." };
  if (err.name === "MulterError") return { status: err.code === "LIMIT_FILE_SIZE" ? 413 : 400, message: "Invalid upload or upload limit exceeded." };
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status <= 599 ? err.status : 500;
  return { status, message: status < 500 || err.expose ? err.message : "Internal server error." };
}
function sendError(res, err) {
  if (res.headersSent) return;
  const { status, message } = describeError(err);
  if (status >= 500) console.error("Request failed", { name: err.name, code: err.code });
  return res.status(status).json({ success: false, message, error: message });
}
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  return sendError(res, err);
}
module.exports = { errorHandler, sendError, describeError };
