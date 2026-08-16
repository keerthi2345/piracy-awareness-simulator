const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { checkUrl } = require("../controllers/checkUrlController");

// Protects your Safe Browsing quota from abuse — 15 checks per minute per IP.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { error: "Too many checks — please wait a moment and try again." },
});

router.post("/", limiter, checkUrl);

module.exports = router;
