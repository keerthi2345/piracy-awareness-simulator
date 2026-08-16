import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getThreats } from "../api/api";
import "../styles/cyber-home.css";

const SEVERITY_LABEL = { high: "High Risk", medium: "Medium Risk" };

export default function ThreatLibrary() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getThreats()
      .then((data) => !cancelled && setThreats(data))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = threats.filter((t) => filter === "all" || t.severity === filter);

  return (
    <div className="cyber-page">
      <div className="cyber-grid-overlay" />
      <div className="cyber-container">
        <div className="cyber-eyebrow">// Reference library — not a simulation</div>
        <h1 className="cyber-title" style={{ fontSize: "2.1rem" }}>Threat Library</h1>
        <p className="cyber-subtext">
          These attacks don't happen inside a browser — they arrive by phone
          call, SMS, WhatsApp, or physical tampering, so they're presented
          here as quick reference cards instead of interactive simulations.
          Tap a card to expand it.
        </p>

        <div className="tl-filter-row">
          {["all", "high", "medium"].map((f) => (
            <button
              key={f}
              className={`tl-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : SEVERITY_LABEL[f]}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#8fb8b0" }}>Loading threat library…</p>}

        {!loading && error && (
          <div className="cyber-result-card unsafe">
            <p style={{ color: "#ff8f8f", fontFamily: "var(--font-mono)", fontSize: "0.85rem", margin: 0 }}>
              Couldn't reach the backend to load the threat library. Make sure
              the server is running and try again.
            </p>
          </div>
        )}

        {!loading && !error && visible.map((t) => (
          <ThreatEntryCard
            key={t.key}
            entry={t}
            isOpen={openKey === t.key}
            onToggle={() => setOpenKey(openKey === t.key ? null : t.key)}
          />
        ))}
      </div>
    </div>
  );
}

function ThreatEntryCard({ entry, isOpen, onToggle }) {
  return (
    <div className="tl-entry">
      <div className="tl-entry-header" onClick={onToggle}>
        <div className="tl-entry-title-row">
          <span className="tl-entry-title">{entry.title}</span>
          <span className={`severity-tag severity-${entry.severity}`}>
            {SEVERITY_LABEL[entry.severity]}
          </span>
          <span className="tl-vector-tag">via {entry.vector}</span>
        </div>
        <span className={`tl-chevron ${isOpen ? "open" : ""}`}>▸</span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div className="tl-entry-body">
              <div className="tl-subhead">How it works</div>
              <p className="tl-body-text">{entry.howItWorks}</p>

              <div className="tl-subhead">Red flags</div>
              <ul className="tl-list red-flags">
                {entry.redFlags.map((rf, i) => (
                  <li key={i}>{rf}</li>
                ))}
              </ul>

              <div className="tl-subhead">What to do</div>
              <ul className="tl-list what-to-do">
                {entry.whatToDo.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>

              <div className="tl-source">Source: {entry.source}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}