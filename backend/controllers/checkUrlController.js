const axios = require("axios");

const SAFE_BROWSING_ENDPOINT =
  "https://safebrowsing.googleapis.com/v4/threatMatches:find";

// Very loose URL sanity check before we forward anything to Google —
// cheap validation, and thematically appropriate for a security app.
function looksLikeUrl(str) {
  try {
    const u = new URL(str);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

async function checkUrl(req, res) {
  const { url } = req.body;

  if (!url || typeof url !== "string" || !looksLikeUrl(url)) {
    return res.status(400).json({ error: "Please provide a valid http(s) URL." });
  }

  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    return res.status(501).json({
      error:
        "Safe Browsing API key is not configured on the server. Add SAFE_BROWSING_API_KEY to backend/.env to enable this feature.",
    });
  }

  try {
    const response = await axios.post(
      `${SAFE_BROWSING_ENDPOINT}?key=${apiKey}`,
      {
        client: { clientId: "awareness-simulator", clientVersion: "1.0.0" },
        threatInfo: {
          threatTypes: [
            "MALWARE",
            "SOCIAL_ENGINEERING",
            "UNWANTED_SOFTWARE",
            "POTENTIALLY_HARMFUL_APPLICATION",
          ],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }
    );

    const matches = response.data.matches || [];
    res.json({
      url,
      safe: matches.length === 0,
      threats: matches.map((m) => m.threatType),
    });
  } catch (err) {
    res.status(502).json({ error: "Could not reach Safe Browsing API right now." });
  }
}

module.exports = { checkUrl };
