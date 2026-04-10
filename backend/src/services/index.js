/* ==========  backend/src/services/index.js  ===============*/
const {
  generateAccessToken,
  generateRefreshToken,
  loginUser,
  registerUser,
  refreshAuthTokens,
  logoutUser,
  createSeedUser,
  getMyProfile,
} = require("./authService");
const studentService = require("./studentService");
const resultService = require("./resultService");

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  loginUser,
  registerUser,
  refreshAuthTokens,
  logoutUser,
  createSeedUser,
  getMyProfile,
  ...studentService,
  ...resultService,
};
