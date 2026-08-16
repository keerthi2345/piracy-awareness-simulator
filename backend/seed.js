require("dotenv").config();
const connectDB = require("./config/db");
const LegalFact = require("./models/LegalFact");
const ThreatEntry = require("./models/ThreatEntry");
const facts = require("./data/legalFacts.json");
const threats = require("./data/threatEntries.json");

(async () => {
  await connectDB();

  await LegalFact.deleteMany({});
  await LegalFact.insertMany(facts);
  console.log(`Seeded ${facts.length} legal facts.`);

  await ThreatEntry.deleteMany({});
  await ThreatEntry.insertMany(threats);
  console.log(`Seeded ${threats.length} threat library entries.`);

  process.exit(0);
})();