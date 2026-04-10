const jwt = require("jsonwebtoken");

const { User } = require("../models");
const ApiError = require("../utils/apiError");

function generateAccessToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    ...options,
  });
}

function sanitizeUser(user) {
  return {
    id: String(user._id),
    ref_id: user.ref_id || null,
    full_name: user.full_name,
    email: user.email || null,
    user_id_login: user.user_id_login || null,
    role: user.role,
    status: user.status,
    profile_image: user.profile_image || null,
    phone: user.phone || null,
    last_login_at: user.last_login_at || null,
  };
}

function resolveLoginIdentifier(payload = {}) {
  return (payload.login || payload.email || payload.user_id_login || "")
    .toString()
    .trim();
}

async function assertUniqueAuthIdentity({ email, userIdLogin }) {
  const checks = [];

  if (email) {
    checks.push({ email });
  }

  if (userIdLogin) {
    checks.push({ user_id_login: userIdLogin });
  }

  if (checks.length === 0) {
    return;
  }

  const existing = await User.findOne({ $or: checks })
    .select("_id email user_id_login")
    .lean();

  if (!existing) {
    return;
  }

  if (email && existing.email === email) {
    throw new ApiError(409, "email is already in use");
  }

  if (userIdLogin && existing.user_id_login === userIdLogin) {
    throw new ApiError(409, "user_id_login is already in use");
  }

  throw new ApiError(409, "User identity already exists");
}

async function loginUser(payload) {
  const loginIdentifier = resolveLoginIdentifier(payload);
  const password = String(payload.password || "");

  if (!loginIdentifier || !password) {
    throw new ApiError(
      400,
      "login/email/user_id_login and password are required",
    );
  }

  const identifierLower = loginIdentifier.toLowerCase();

  const user = await User.findOne({
    $or: [{ email: identifierLower }, { user_id_login: loginIdentifier }],
  }).select("+password_hash");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "User account is not active");
  }

  user.last_login_at = new Date();
  await user.save();

  const token = generateAccessToken({
    sub: String(user._id),
    role: user.role,
    ref_id: user.ref_id || null,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function createSeedUser(payload = {}) {
  const role = payload.role || "teacher";

  if (!["teacher", "student", "admin"].includes(role)) {
    throw new ApiError(400, "role must be teacher, student, or admin");
  }

  const email = payload.email?.toLowerCase().trim();
  const userIdLogin = payload.user_id_login?.trim();
  const password = payload.password;
  const fullName = payload.full_name?.trim();

  if (!fullName || !password || (!email && !userIdLogin)) {
    throw new ApiError(
      400,
      "full_name, password, and at least one of email or user_id_login are required",
    );
  }

  const user = await User.create({
    ref_id: payload.ref_id || `U-${Date.now().toString(36)}`,
    full_name: fullName,
    email,
    user_id_login: userIdLogin,
    password_hash: password,
    role,
    status: payload.status || "active",
    profile_image: payload.profile_image || null,
    phone: payload.phone || null,
  });

  return sanitizeUser(user);
}

async function registerUser(payload = {}) {
  const fullName = payload.full_name?.trim();
  const password = payload.password;
  const email = payload.email?.toLowerCase().trim();
  const userIdLogin = payload.user_id_login?.trim();
  const role = payload.role || "student";

  if (!fullName || !password || (!email && !userIdLogin)) {
    throw new ApiError(
      400,
      "full_name, password, and at least one of email or user_id_login are required",
    );
  }

  if (!["teacher", "student", "admin"].includes(role)) {
    throw new ApiError(400, "role must be teacher, student, or admin");
  }

  await assertUniqueAuthIdentity({ email, userIdLogin });

  const user = await User.create({
    ref_id: payload.ref_id || `U-${Date.now().toString(36)}`,
    full_name: fullName,
    email,
    user_id_login: userIdLogin,
    password_hash: password,
    role,
    status: "active",
    profile_image: payload.profile_image || null,
    phone: payload.phone || null,
  });

  const token = generateAccessToken({
    sub: String(user._id),
    role: user.role,
    ref_id: user.ref_id || null,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
}

async function getMyProfile(userId) {
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
}

module.exports = {
  generateAccessToken,
  loginUser,
  registerUser,
  createSeedUser,
  getMyProfile,
};
