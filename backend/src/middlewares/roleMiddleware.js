const ApiError = require("../utils/apiError");

function allowRoles(...roles) {
  const acceptedRoles = new Set(roles);

  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!acceptedRoles.has(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to access this resource"),
      );
    }

    return next();
  };
}

module.exports = allowRoles;
