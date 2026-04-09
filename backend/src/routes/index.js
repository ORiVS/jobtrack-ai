const express = require("express");
const authRoutes = require("./auth.routes");
const jobApplicationRoutes = require("./jobApplication.routes");
const aiRoutes = require("./ai.routes");
const reminderRoutes = require("./reminder.routes");
const technologyRoutes = require("./technology.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/applications", jobApplicationRoutes);
router.use("/ai", aiRoutes);
router.use("/reminders", reminderRoutes);
router.use("/technologies", technologyRoutes);

module.exports = router;
