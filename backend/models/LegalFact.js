const mongoose = require("mongoose");

// Structured legal/preventive facts, kept separate from the UI code so
// they can be sourced, updated, and cited independently.
const legalFactSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["popup", "piracy_site", "fake_apk", "general"],
    required: true,
  },
  type: {
    type: String,
    enum: ["law", "prevention", "remediation"],
    required: true,
  },
  title: { type: String, required: true }, // e.g. "IT Act Section 66C"
  summary: { type: String, required: true }, // plain-language paraphrase
  source: { type: String, required: true }, // URL cited
  order: { type: Number, default: 0 }, // display order within a category/type
});

module.exports = mongoose.model("LegalFact", legalFactSchema);
