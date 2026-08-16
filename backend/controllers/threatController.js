const ThreatEntry = require("../models/ThreatEntry");

async function getThreats(req, res) {
  try {
    const { severity } = req.query;
    const filter = severity ? { severity } : {};
    const threats = await ThreatEntry.find(filter).sort({ order: 1 });
    res.json(threats);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch threat library." });
  }
}

module.exports = { getThreats };