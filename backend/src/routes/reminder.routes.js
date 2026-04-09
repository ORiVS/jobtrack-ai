const express = require("express");
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
} = require("../controllers/reminder.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// Tous les endpoints reminders sont protégés
router.use(protect);

router.get("/", getReminders);
router.post("/", createReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);

module.exports = router;
