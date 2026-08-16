const mongoose = require("mongoose");

// Each Event is a single choice a user made inside a scenario.
// riskWeight is assigned server-side (see utils/riskScore.js) so the
// score can't be tampered with by editing client-side state.
const eventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },
    scenario: {
      type: String,
      enum: ["popup", "piracy_site", "fake_apk"],
      required: true,
    },
    action: { type: String, required: true }, // e.g. "clicked_allow", "closed_early"
    ts: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
