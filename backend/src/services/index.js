const {
  generateAccessToken,
  loginUser,
  createSeedUser,
  getMyProfile,
} = require("./authService");
const studentService = require("./studentService");
const resultService = require("./resultService");

module.exports = {
  generateAccessToken,
  loginUser,
  createSeedUser,
  getMyProfile,
  ...studentService,
  ...resultService,
};
