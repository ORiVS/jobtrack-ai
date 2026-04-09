const express = require("express");
const { parseJobOffer } = require("../controllers/ai.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /api/ai/parse
// Protégé : seul un utilisateur connecté peut parser une offre
router.post("/parse", protect, parseJobOffer);

module.exports = router;
