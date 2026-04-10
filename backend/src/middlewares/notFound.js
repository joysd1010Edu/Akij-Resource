/* ==========  backend/src/middlewares/notFound.js  ===============*/
/* ==========  Function notFound contains reusable module logic used by this feature.  ===============*/
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

module.exports = notFound;
