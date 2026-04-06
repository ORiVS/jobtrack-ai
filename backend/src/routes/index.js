const express = require("express");
const authRoutes = require("./auth.routes");
const jobApplicationRoutes = require("./jobApplication.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/applications", jobApplicationRoutes);

module.exports = router;