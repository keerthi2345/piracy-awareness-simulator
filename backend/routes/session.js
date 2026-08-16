const express = require("express");
const router = express.Router();
const { createSession, logEvent, getScore } = require("../controllers/sessionController");
const { getReport } = require("../controllers/reportController");

router.post("/", createSession);
router.post("/:id/event", logEvent);
router.get("/:id/score", getScore);
router.get("/:id/report", getReport);

module.exports = router;
