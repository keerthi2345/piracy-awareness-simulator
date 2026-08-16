require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const sessionRoutes = require("./routes/session");
const checkUrlRoutes = require("./routes/checkUrl");
const legalFactsRoutes = require("./routes/legalFacts");
const threatsRoutes = require("./routes/threats");

const app = express();

connectDB();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/session", sessionRoutes);
app.use("/api/check-url", checkUrlRoutes);
app.use("/api/legal-facts", legalFactsRoutes);
app.use("/api/threats", threatsRoutes);

// Generic error handler — never leak stack traces to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
