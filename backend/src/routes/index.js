/* ==========  backend/src/routes/index.js  ===============*/
const express = require("express");

const { healthCheck } = require("../controllers/healthController");
const authRoutes = require("./authRoutes");
const teacherRoutes = require("./teacherRoutes");
const studentRoutes = require("./studentRoutes");

const router = express.Router();

router.get("/health", healthCheck);
router.use("/auth", authRoutes);
router.use("/teacher", teacherRoutes);
router.use("/student", studentRoutes);

module.exports = router;
