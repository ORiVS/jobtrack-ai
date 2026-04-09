const express = require("express");
const authRoutes = require("./auth.routes");
const jobApplicationRoutes = require("./jobApplication.routes");
const aiRoutes = require("./ai.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/applications", jobApplicationRoutes);
router.use("/ai", aiRoutes);

module.exports = router;