/* ==========  backend/src/controllers/healthController.js  ===============*/
/* ==========  Function healthCheck contains reusable module logic used by this feature.  ===============*/
function healthCheck(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "Online test backend is running after the CI/CD pipeline deployment.",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  healthCheck,
};
