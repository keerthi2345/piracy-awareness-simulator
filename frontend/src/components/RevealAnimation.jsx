import { useEffect, useState } from "react";
import "../styles/terminal.css";

/**
 * Renders a sequence of lines one at a time, terminal-style.
 * Purely a visual animation — no scripts referenced here actually execute
 * anything; `lines` is just an array of strings supplied by the scenario.
 *
 * props:
 *  - lines: string[]            lines to reveal in order
 *  - onDone: () => void         called once the sequence finishes
 *  - lineDelayMs: number        delay between lines (default 700ms)
 */
export default function RevealAnimation({ lines, onDone, lineDelayMs = 700 }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (visibleCount >= lines.length) {
      setFinished(true);
      return;
    }
    const t = setTimeout(() => setVisibleCount((c) => c + 1), lineDelayMs);
    return () => clearTimeout(t);
  }, [visibleCount, lines.length, lineDelayMs]);

  return (
    <div className="terminal-screen">
      <div className="terminal-window">
        <div className="terminal-titlebar">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
        </div>
        <div className="terminal-body">
          {lines.slice(0, visibleCount).map((line, i) => (
            <div
              key={i}
              className={`terminal-line ${line.warn ? "warn" : ""}`}
            >
              {typeof line === "string" ? line : line.text}
            </div>
          ))}
          {!finished && <span className="terminal-cursor" />}
          {finished && (
            <button className="terminal-continue" onClick={onDone}>
              Continue &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
