import { useEffect, useState } from "react";
import { getLegalFacts } from "../api/api";
import "../styles/cyber-home.css";

const CATEGORY_LABEL = {
  popup: "Scam Pop-up",
  piracy_site: "Piracy / Streaming Site",
  fake_apk: "Fake APK",
};

export default function ConsequenceScreen({ category, onNext, nextLabel }) {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    getLegalFacts(category)
      .then((data) => !cancelled && setFacts(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category]);

  const laws = facts.filter((f) => f.type === "law");
  const preventions = facts.filter((f) => f.type === "prevention");

  return (
    <div className="cyber-page">
      <div className="cyber-grid-overlay" />
      <div className="cyber-container">
        <div className="cyber-eyebrow">// Scenario complete — {CATEGORY_LABEL[category]}</div>
        <h1 className="cyber-title" style={{ fontSize: "1.9rem" }}>
          Here's what was actually happening
        </h1>

        {loading && <p style={{ color: "#8fb8b0" }}>Loading researched content…</p>}

        {!loading && error && (
          <div className="cyber-result-card unsafe">
            <p style={{ color: "#ff8f8f", fontFamily: "var(--font-mono)", fontSize: "0.85rem", margin: 0 }}>
              Couldn't reach the backend to load legal context. Make sure the
              server is running (npm run dev in /backend) and try again.
            </p>
          </div>
        )}

        {!loading && !error && laws.length > 0 && (
          <>
            <div className="cyber-section-label">Legal context</div>
            {laws.map((f) => (
              <FactCard key={f._id} fact={f} />
            ))}
          </>
        )}

        {!loading && !error && preventions.length > 0 && (
          <>
            <div className="cyber-section-label">How to avoid this</div>
            {preventions.map((f) => (
              <FactCard key={f._id} fact={f} />
            ))}
          </>
        )}

        <div className="cyber-cta-row">
          <button className="cyber-cta primary" onClick={onNext} style={{ border: "none", cursor: "pointer" }}>
            ▸ {nextLabel || "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FactCard({ fact }) {
  return (
    <div className="cyber-fact-card">
      <h3>{fact.title}</h3>
      <p>{fact.summary}</p>
      <div className="source-link">Source: {fact.source}</div>
    </div>
  );
}