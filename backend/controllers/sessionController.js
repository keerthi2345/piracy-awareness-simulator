const crypto = require("crypto");
const Session = require("../models/Session");
const Event = require("../models/Event");
const { scoreEvents } = require("../utils/riskScore");

async function createSession(req, res) {
  try {
    const anonId = crypto.randomBytes(8).toString("hex");
    const session = await Session.create({ anonId });
    res.status(201).json({ sessionId: session._id, anonId });
  } catch (err) {
    res.status(500).json({ error: "Could not create session." });
  }
}

async function logEvent(req, res) {
  try {
    const { id } = req.params;
    const { scenario, action } = req.body;

    if (!scenario || !action) {
      return res.status(400).json({ error: "scenario and action are required." });
    }

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found." });

    const event = await Event.create({ sessionId: id, scenario, action });

    if (!session.scenariosCompleted.includes(scenario)) {
      session.scenariosCompleted.push(scenario);
      await session.save();
    }

    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ error: "Could not log event." });
  }
}

async function getScore(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found." });

    const events = await Event.find({ sessionId: id });
    const result = scoreEvents(events);

    session.score = result.score;
    session.completedAt = new Date();
    await session.save();

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not compute score." });
  }
}

module.exports = { createSession, logEvent, getScore };
