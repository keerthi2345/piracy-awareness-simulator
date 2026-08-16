const mongoose = require("mongoose");

// A Session represents one visitor's run through the simulator.
// We deliberately do NOT store any personally identifying info —
// anonId is a random token generated client-side, not tied to a real identity.
const sessionSchema = new mongoose.Schema(
  {
    anonId: { type: String, required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    scenariosCompleted: [
      { type: String, enum: ["popup", "piracy_site", "fake_apk"] },
    ],
    score: { type: Number, default: null }, // filled in once /score is called
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", sessionSchema);
