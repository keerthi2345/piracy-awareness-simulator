import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { getScore, getReportUrl } from "../api/api";
import "../styles/cyber-home.css";

const BAND_COLOR = {
  Cautious: "#4dffb0",
  "Moderate Risk": "#ffd400",
  "High Risk": "#ff9d4d",
  "Very High Risk": "#ff6b6b",
};

export default function SummaryReport() {
  const { sessionId, completedScenarios } = useSession();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    getScore(sessionId)
      .then(setResult)
      .catch(() => setError("Could not load your score — try completing at least one scenario first."));
  }, [sessionId, completedScenarios.length]);

  return (
    <div className="cyber-page">
      <div className="cyber-grid-overlay" />
      <div className="cyber-container">
        <div className="cyber-eyebrow">// Your session</div>
        <h1 className="cyber-title" style={{ fontSize: "2.2rem" }}>Digital Risk Awareness Score</h1>

        {error && (
          <p style={{ color: "#8fb8b0", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{error}</p>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "24px 0 36px" }}>
            <ScoreRing score={result.score} color={BAND_COLOR[result.band]} />
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                marginTop: 10,
                color: BAND_COLOR[result.band],
              }}
            >
              {result.band}
            </div>
          </div>
        )}

        <div className="cyber-helpline">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, color: "#eafffb" }}>
              Think you've experienced real harm?
            </div>
            <div style={{ fontSize: "0.85rem", color: "#c99" }}>
              Report it — this is the correct first step, not a last resort.
            </div>
          </div>
          <div className="num">1930 · cybercrime.gov.in</div>
        </div>

        <div className="cyber-cta-row">
          <a
            className="cyber-cta primary"
            href={sessionId ? getReportUrl(sessionId) : "#"}
            target="_blank"
            rel="noreferrer"
          >
            ▸ Download PDF report
          </a>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score, color }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
      <text x="90" y="98" textAnchor="middle" fontSize="32" fontFamily="var(--font-display)" fill="#eafffb">
        {score}
      </text>
    </svg>
  );
}