const express = require("express");

const auth = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  loginValidator,
  registerValidator,
  registerSeedValidator,
} = require("../validators/authValidators");
const {
  login,
  register,
  me,
  registerSeedUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginValidator, validateRequest, login);
router.post("/register", registerValidator, validateRequest, register);
router.get("/me", auth, me);

if (process.env.NODE_ENV !== "production") {
  router.post(
    "/seed-register",
    registerSeedValidator,
    validateRequest,
    registerSeedUser,
  );
}

module.exports = router;
