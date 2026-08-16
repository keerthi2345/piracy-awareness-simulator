const Session = require("../models/Session");
const Event = require("../models/Event");
const LegalFact = require("../models/LegalFact");
const { scoreEvents } = require("../utils/riskScore");
const generateReportPDF = require("../utils/pdfGenerator");

async function getReport(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found." });

    const events = await Event.find({ sessionId: id }).sort({ ts: 1 });
    const { score, band, byScenario } = scoreEvents(events);

    const categories = [...session.scenariosCompleted, "general"];
    const legalFacts = await LegalFact.find({
      category: { $in: categories },
      type: { $in: ["law", "remediation"] },
    }).sort({ category: 1, order: 1 });

    generateReportPDF(res, { score, band, byScenario, events, legalFacts });
  } catch (err) {
    res.status(500).json({ error: "Could not generate report." });
  }
}

module.exports = { getReport };
