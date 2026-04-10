function healthCheck(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "Online test backend is running",
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  healthCheck,
};
