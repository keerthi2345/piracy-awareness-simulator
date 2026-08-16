const mongoose = require("mongoose");

// A reference-library entry for attacks that don't happen inside a browser
// (calls, texts, QR tampering, remote-access apps) — presented as structured
// reference content rather than an interactive simulation.
const threatEntrySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // slug, e.g. "upi_collect_fraud"
  title: { type: String, required: true },
  severity: { type: String, enum: ["medium", "high"], required: true },
  vector: { type: String, required: true }, // e.g. "Phone call", "SMS / WhatsApp", "QR code"
  howItWorks: { type: String, required: true },
  redFlags: [{ type: String, required: true }],
  whatToDo: [{ type: String, required: true }],
  source: { type: String, required: true },
  order: { type: Number, default: 0 },
});

module.exports = mongoose.model("ThreatEntry", threatEntrySchema);

