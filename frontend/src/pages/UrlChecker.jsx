import { useState } from "react";
import { checkUrlSafety } from "../api/api";
import "../styles/cyber-home.css";

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await checkUrlSafety(url);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Could not check this URL right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cyber-page">
      <div className="cyber-grid-overlay" />
      <div className="cyber-container">
        <div className="cyber-eyebrow">// Live check — Google Safe Browsing v4</div>
        <h1 className="cyber-title" style={{ fontSize: "2.2rem" }}>URL Safety Checker</h1>
        <p className="cyber-subtext">
          This is a real check, not a simulation — the URL is sent to your
          backend, which queries Google Safe Browsing server-side. Note:
          only <em>known</em> listed threats are flagged, so a clean result
          doesn't guarantee a brand-new scam site is safe.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
          <input
            type="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="cyber-input"
          />
          <button className="cyber-cta primary" type="submit" disabled={loading} style={{ border: "none", cursor: "pointer" }}>
            {loading ? "Checking…" : "▸ Check URL"}
          </button>
        </form>

        {error && (
          <div className="cyber-result-card unsafe">
            <p style={{ color: "#ff8f8f", margin: 0, fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className={`cyber-result-card ${result.safe ? "safe" : "unsafe"}`}>
            <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 6px", color: "#eafffb" }}>
              {result.safe ? "No known threats found" : "Flagged as unsafe"}
            </h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#9fc4bb", margin: 0 }}>
              {result.url}
            </p>
            {!result.safe && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#ff8f8f", marginTop: 6 }}>
                Threat types: {result.threats.join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}