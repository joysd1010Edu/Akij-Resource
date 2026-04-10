/* ==========  backend/src/utils/asyncHandler.js  ===============*/
/* ==========  Function asyncHandler contains reusable module logic used by this feature.  ===============*/
function asyncHandler(fn) {
  return function wrappedAsyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
