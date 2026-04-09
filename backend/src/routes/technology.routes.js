const express = require("express");
const { getTechnologies, upsertTechnology } = require("../controllers/technology.controller");
const protect = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getTechnologies);              // pas de protect : lecture publique
router.post("/", protect, upsertTechnology);   // protect : écriture protégée

module.exports = router;
