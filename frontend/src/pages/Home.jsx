import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "../context/SessionContext";
import "../styles/cyber-home.css";

const CARDS = [
  {
    key: "popup",
    to: "/scenario/popup",
    title: "The Pop-up Ad",
    severity: "medium",
    desc: "\"You've won a free iPhone!\" — what really happens when you click.",
    preview: ["> connecting to unknown server...", "> installing tracking cookie..."],
  },
  {
    key: "piracy_site",
    to: "/scenario/piracy_site",
    title: "The Piracy Site",
    severity: "medium",
    desc: "Clicking Watch Now on a streaming site rarely plays the video.",
    preview: ["> notification access granted...", "> redirect chain: 4 domains..."],
  },
  {
    key: "fake_apk",
    to: "/scenario/fake_apk",
    title: "The Fake APK",
    severity: "high",
    desc: "\"Free Netflix\" apps ask for far more than they need.",
    preview: ["> reading incoming SMS...", "> accessibility service: taps simulated..."],
  },
];

export default function Home() {
  const { completedScenarios } = useSession();
  const [hovered, setHovered] = useState(null);
  const doneCount = completedScenarios.length;
  const scanPercent = Math.round((doneCount / CARDS.length) * 100);

  return (
    <div className="cyber-home">
      <div className="cyber-grid-overlay" />
      <div className="cyber-scanline" />

      <div className="cyber-container">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="cyber-badge-row">
            <span className="cyber-badge"><span className="dot" /> Simulation Mode</span>
            <span className="cyber-badge">No Real Exploits Executed</span>
            <span className="cyber-badge">MERN Stack Project</span>
          </div>

          <div className="cyber-eyebrow">// Digital Risk Awareness Console</div>
          <h1 className="cyber-title">
            What Actually Happens<br />
            If You <span className="accent">Get Caught</span>
          </h1>
          <p className="cyber-subtext">
            Three common risky actions, walked through as a realistic —
            fully simulated — consequence chain. Research-backed legal
            context, not scare tactics. Nothing here runs real code.
          </p>
        </motion.div>

        <div className="cyber-stats-row">
          <div className="cyber-stat">
            <div className="value">03</div>
            <div className="label">Attack Vectors</div>
          </div>
          <div className="cyber-stat">
            <div className="value">{doneCount}/3</div>
            <div className="label">Scenarios Run</div>
          </div>
          <div className="cyber-stat">
            <div className="value">12</div>
            <div className="label">Sourced Legal Facts</div>
          </div>
          <div className="cyber-stat">
            <div className="value">0</div>
            <div className="label">Real Scripts Executed</div>
          </div>
        </div>

        <div className="cyber-scan-progress">
          <span>SESSION SCAN</span>
          <div className="cyber-scan-track">
            <motion.div
              className="cyber-scan-fill"
              animate={{ width: `${scanPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span>{scanPercent}%</span>
        </div>

        <div className="cyber-section-label">Select a scenario</div>

        <div className="cyber-card-grid">
          {CARDS.map((c, i) => {
            const done = completedScenarios.includes(c.key);
            const isHovered = hovered === c.key;
            return (
              <motion.div
                key={c.to}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -3 }}
              >
                <Link
                  to={c.to}
                  className="cyber-threat-card"
                  onMouseEnter={() => setHovered(c.key)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    borderColor: isHovered ? "rgba(77,255,176,0.55)" : undefined,
                    boxShadow: isHovered ? "0 0 24px -6px rgba(77,255,176,0.35)" : undefined,
                  }}
                >
                  <div className="top-row">
                    <h3>{c.title}</h3>
                    <span className={`severity-tag severity-${c.severity}`}>
                      {c.severity === "high" ? "High Risk" : "Medium Risk"}
                    </span>
                  </div>

                  {!isHovered && <p className="desc">{c.desc}</p>}

                  {isHovered && (
                    <div className="preview-box">
                      {c.preview.map((l, idx) => (
                        <div key={idx}>{l}</div>
                      ))}
                    </div>
                  )}

                  {done && <div className="done-tag" style={{ marginTop: 10 }}>✓ scenario completed</div>}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="cyber-cta-row">
          <Link to="/url-checker" className="cyber-cta primary">▸ Run Live URL Scan</Link>
          <Link to="/summary" className="cyber-cta">▸ View Session Report</Link>
        </div>
      </div>
    </div>
  );
}