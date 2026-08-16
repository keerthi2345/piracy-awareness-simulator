const LegalFact = require("../models/LegalFact");

async function getLegalFacts(req, res) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const facts = await LegalFact.find(filter).sort({ category: 1, type: 1, order: 1 });
    res.json(facts);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch legal facts." });
  }
}

module.exports = { getLegalFacts };
