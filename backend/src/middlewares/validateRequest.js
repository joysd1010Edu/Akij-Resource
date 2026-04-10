/* ==========  backend/src/middlewares/validateRequest.js  ===============*/
const { validationResult } = require("express-validator");

const ApiError = require("../utils/apiError");

/* ==========  Function validateRequest validates input and access before the next logic runs.  ===============*/
function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new ApiError(
      400,
      "Validation failed",
      errors.array().map((item) => ({
        field: item.path,
        message: item.msg,
      })),
    ),
  );
}

module.exports = validateRequest;
