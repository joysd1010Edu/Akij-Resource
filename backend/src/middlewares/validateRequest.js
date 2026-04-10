const { validationResult } = require("express-validator");

const ApiError = require("../utils/apiError");

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
