const express = require("express");
const router = express.Router();
const { getLegalFacts } = require("../controllers/legalFactsController");

router.get("/", getLegalFacts);

module.exports = router;
