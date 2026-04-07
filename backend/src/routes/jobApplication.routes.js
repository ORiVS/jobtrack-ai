const express = require("express");
const protect = require("../middlewares/auth.middleware");
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getApplicationEvents,
} = require("../controllers/jobApplication.controller");

const router = express.Router();

router.use(protect);

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id/events", getApplicationEvents);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;