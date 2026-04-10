/* ==========  backend/src/controllers/authController.js  ===============*/
const {
  loginUser,
  registerUser,
  refreshAuthTokens,
  logoutUser,
  createSeedUser,
  getMyProfile,
} = require("../services/authService");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

/* ==========  Function getTokenMaxAge gets get token max age data for the current module flow.  ===============*/
function getTokenMaxAge(token) {
  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    return undefined;
  }

  return Math.max(0, decoded.exp * 1000 - Date.now());
}

/* ==========  Function buildCookieOptions builds helper output used by other functions in this file.  ===============*/
function buildCookieOptions(token) {
  const maxAge = getTokenMaxAge(token);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  if (maxAge !== undefined) {
    options.maxAge = maxAge;
  }

  return options;
}

/* ==========  Function setAuthCookies updates set auth cookies values for this workflow.  ===============*/
function setAuthCookies(res, authResult) {
  res.cookie(
    "access_token",
    authResult.access_token,
    buildCookieOptions(authResult.access_token),
  );
  res.cookie(
    "refresh_token",
    authResult.refresh_token,
    buildCookieOptions(authResult.refresh_token),
  );
}

/* ==========  Function clearAuthCookies removes clear auth cookies related data in this module.  ===============*/
function clearAuthCookies(res) {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  res.clearCookie("access_token", options);
  res.clearCookie("refresh_token", options);
}

/* ==========  Function buildRequestContext builds helper output used by other functions in this file.  ===============*/
function buildRequestContext(req) {
  /*===== keep possible refresh token sources in one place ===========*/
  return {
    ip: req.ip,
    userAgent: req.headers["user-agent"] || null,
    cookieRefreshToken: req.cookies.refresh_token || null,
    bodyRefreshToken: req.body?.refresh_token || null,
  };
}

/* ==========  Function login contains reusable module logic used by this feature.  ===============*/
const login = asyncHandler(async (req, res) => {
  const authResult = await loginUser({
    ...req.body,
    context: buildRequestContext(req),
  });

  setAuthCookies(res, authResult);

  sendSuccess(
    res,
    {
      token: authResult.token,
      access_token: authResult.access_token,
      refresh_token: authResult.refresh_token,
      access_expires_in: authResult.access_expires_in,
      refresh_expires_in: authResult.refresh_expires_in,
      user: authResult.user,
    },
    "Login successful",
  );
});

/* ==========  Function register creates register data used by this module.  ===============*/
const register = asyncHandler(async (req, res) => {
  const authResult = await registerUser({
    ...req.body,
    context: buildRequestContext(req),
  });

  setAuthCookies(res, authResult);

  sendSuccess(
    res,
    {
      token: authResult.token,
      access_token: authResult.access_token,
      refresh_token: authResult.refresh_token,
      access_expires_in: authResult.access_expires_in,
      refresh_expires_in: authResult.refresh_expires_in,
      user: authResult.user,
    },
    "Registration successful",
    201,
  );
});

/* ==========  Function refresh contains reusable module logic used by this feature.  ===============*/
const refresh = asyncHandler(async (req, res) => {
  /*===== refresh can use body token or cookie token ===========*/
  const authResult = await refreshAuthTokens({
    refresh_token: req.body?.refresh_token,
    context: buildRequestContext(req),
  });

  setAuthCookies(res, authResult);

  sendSuccess(
    res,
    {
      token: authResult.token,
      access_token: authResult.access_token,
      refresh_token: authResult.refresh_token,
      access_expires_in: authResult.access_expires_in,
      refresh_expires_in: authResult.refresh_expires_in,
      user: authResult.user,
    },
    "Token refreshed successfully",
  );
});

/* ==========  Function logout contains reusable module logic used by this feature.  ===============*/
const logout = asyncHandler(async (req, res) => {
  await logoutUser({
    refresh_token: req.body?.refresh_token,
    context: buildRequestContext(req),
  });

  clearAuthCookies(res);

  sendSuccess(res, { logged_out: true }, "Logout successful");
});

/* ==========  Function me contains reusable module logic used by this feature.  ===============*/
const me = asyncHandler(async (req, res) => {
  const profile = await getMyProfile(req.user._id);
  sendSuccess(res, profile, "Current user profile fetched");
});

/* ==========  Function registerSeedUser creates register seed user data used by this module.  ===============*/
const registerSeedUser = asyncHandler(async (req, res) => {
  const user = await createSeedUser(req.body);
  sendSuccess(res, user, "Seed user created", 201);
});

module.exports = {
  login,
  register,
  refresh,
  logout,
  me,
  registerSeedUser,
};
