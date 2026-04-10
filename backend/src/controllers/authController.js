const {
  loginUser,
  registerUser,
  createSeedUser,
  getMyProfile,
} = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const login = asyncHandler(async (req, res) => {
  const { token, user } = await loginUser(req.body);

  sendSuccess(
    res,
    {
      token,
      user,
    },
    "Login successful",
  );
});

const register = asyncHandler(async (req, res) => {
  const { token, user } = await registerUser(req.body);

  sendSuccess(
    res,
    {
      token,
      user,
    },
    "Registration successful",
    201,
  );
});

const me = asyncHandler(async (req, res) => {
  const profile = await getMyProfile(req.user._id);
  sendSuccess(res, profile, "Current user profile fetched");
});

const registerSeedUser = asyncHandler(async (req, res) => {
  const user = await createSeedUser(req.body);
  sendSuccess(res, user, "Seed user created", 201);
});

module.exports = {
  login,
  register,
  me,
  registerSeedUser,
};
