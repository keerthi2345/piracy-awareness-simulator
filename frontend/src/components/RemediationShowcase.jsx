import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/showcase.css";

/**
 * "Recovery montage" — a story-style visual sequence (auto-advancing icon +
 * caption cards, like Instagram stories) that replaces the terminal-text
 * remediation reveal. This is the user's own correct response, shown as a
 * short guided sequence rather than more scrolling text.
 */

const ICONS = {
  wifiOff: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M1 1l22 22" strokeLinecap="round" />
      <path d="M16.72 11.06A10.94 10.94 0 0119 12.55" strokeLinecap="round" />
      <path d="M5 12.55a10.94 10.94 0 015.17-2.39" strokeLinecap="round" />
      <path d="M10.71 5.05A16 16 0 0122.58 9" strokeLinecap="round" />
      <path d="M1.42 9a15.91 15.91 0 014.7-2.88" strokeLinecap="round" />
      <path d="M8.53 16.11a6 6 0 016.95 0" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1" fill="#3ef2b0" />
    </svg>
  ),
  closeTab: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bank: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M3 10l9-6 9 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10v9M9 10v9M15 10v9M20 10v9" strokeLinecap="round" />
      <path d="M2 21h20" strokeLinecap="round" />
    </svg>
  ),
  bellOff: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M1 1l22 22" strokeLinecap="round" />
      <path d="M8.7 3.7A5 5 0 0117 7v4c0 .6.1 1.2.4 1.8" strokeLinecap="round" />
      <path d="M6 8v3c0 3-1.3 4.4-2 5h13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3 19a2 2 0 003.4 0" strokeLinecap="round" />
    </svg>
  ),
  trash: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" strokeLinecap="round" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  report: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3ef2b0" strokeWidth="1.8">
      <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const STEP_SETS = {
  popup: [
    { icon: "closeTab", caption: "Close the tab", sub: "Don't click anything else on the page first." },
    { icon: "wifiOff", caption: "Disconnect from the network", sub: "Wi-Fi off or airplane mode — stops any script reaching a server." },
    { icon: "shield", caption: "Run a full security scan", sub: "Check the device for anything installed in the background." },
    { icon: "bank", caption: "Contact your bank if you entered any info", sub: "Freeze the card, watch for unauthorized charges." },
  ],
  piracy_site: [
    { icon: "bellOff", caption: "Revoke the notification permission", sub: "Browser settings → site settings → notifications → remove." },
    { icon: "closeTab", caption: "Stop following redirects", sub: "Close the tab chain rather than clicking through it." },
    { icon: "shield", caption: "Treat it like phishing if a payment page loaded", sub: "Don't enter card details on any page it led to." },
  ],
  fake_apk: [
    { icon: "wifiOff", caption: "Turn off Wi-Fi / mobile data immediately", sub: "Cuts off transmission to the attacker's server." },
    { icon: "bank", caption: "Contact your bank, freeze the card", sub: "Watch statements closely for unauthorized charges." },
    { icon: "trash", caption: "Revoke Accessibility access, then uninstall", sub: "Revoke the permission first, in Settings, before removing the app." },
  ],
};

const FINAL_STEP = {
  icon: "report",
  caption: "Report it",
  sub: "cybercrime.gov.in  ·  Helpline 1930",
};

const STEP_DURATION = 3500; // ms per step, auto-advance

export default function RemediationShowcase({ category, onDone }) {
  const steps = [...(STEP_SETS[category] || []), FINAL_STEP];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef();
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now() - elapsed;
    function tick() {
      if (!paused) {
        const e = Date.now() - startRef.current;
        setElapsed(e);
        if (e >= STEP_DURATION) {
          goNext();
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused]);

  function goNext() {
    setElapsed(0);
    if (index >= steps.length - 1) {
      onDone && onDone();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function goPrev() {
    setElapsed(0);
    setIndex((i) => Math.max(0, i - 1));
  }

  const current = steps[index];

  return (
    <div
      className="showcase-screen"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="showcase-card">
        <div className="showcase-progress-row">
          {steps.map((_, i) => (
            <div className="showcase-progress-track" key={i}>
              <div
                className="showcase-progress-fill"
                style={{
                  width:
                    i < index ? "100%" : i === index ? `${Math.min(100, (elapsed / STEP_DURATION) * 100)}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
          >
            <div className="showcase-icon-wrap">{ICONS[current.icon]}</div>
            <div className="showcase-caption">{current.caption}</div>
            <div className="showcase-subcaption">{current.sub}</div>
          </motion.div>
        </AnimatePresence>

        <div className="showcase-controls">
          <button className="showcase-btn" onClick={goPrev} disabled={index === 0}>
            Back
          </button>
          <button className="showcase-btn primary" onClick={goNext}>
            {index === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}