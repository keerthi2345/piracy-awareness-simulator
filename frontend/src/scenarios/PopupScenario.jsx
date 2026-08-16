import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import FakePopup from "../components/FakePopup";
import RevealAnimation from "../components/RevealAnimation";
import RemediationShowcase from "../components/RemediationShowcase";
import ConsequenceScreen from "../components/ConsequenceScreen";
import "../styles/shady.css";

const STAGES = {
  SITE: "site",
  POPUP: "popup",
  REVEAL: "reveal",
  CONSEQUENCE: "consequence",
  REMEDIATION: "remediation",
};

const REVEAL_LINES = [
  "Connecting to unknown server...",
  { text: "Downloading hidden script...", warn: true },
  "Reading device information...",
  { text: "Installing tracking cookie...", warn: true },
  { text: "Redirecting ad revenue to attacker...", warn: true },
];

// Real-looking fake titles instead of generic placeholders — easy to edit,
// this array is the only place you need to change to customize them.
const MOVIES = [
  "Spider-Man: Brand New Day",
  "Chennai Love Story",
  "Lenin",
  "The Odyssey",
  "Evil Dead Burn",
  "Ramayana",
  "Obssession",
  "Iron Season",
];

export default function PopupScenario({ onComplete }) {
  const { logChoice, markComplete } = useSession();
  const [stage, setStage] = useState(STAGES.SITE);

  // Scroll to the top of the viewport every time the stage changes, so a
  // user who scrolled down in the mock site doesn't land mid-way through
  // the next screen — especially important on mobile.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  useEffect(() => {
    const t = setTimeout(() => setStage(STAGES.POPUP), 1800);
    return () => clearTimeout(t);
  }, []);

  function handlePopupChoice(action) {
    logChoice("popup", action);
    setStage(STAGES.REVEAL);
  }

  const showSite = stage === STAGES.SITE || stage === STAGES.POPUP;

  return (
    <>
      {showSite && (
        <div className="shady-page">
          <div className="shady-topbar">
            <span>FreeStream24.example</span>
            <span>▶ Watch Free HD</span>
          </div>
          <div className="shady-marquee">
            ⚡ LIMITED OFFER — CLICK ANYWHERE TO CLAIM YOUR PRIZE ⚡ NEW MOVIES EVERY DAY ⚡
          </div>

          <div className="shady-grid">
            {MOVIES.map((title, i) => (
              <div className="shady-card" key={i}>
                <div className="thumb" />
                <div style={{ fontSize: "0.75rem" }}>{title}</div>
              </div>
            ))}
          </div>

          <div className="safety-note">
            This is a simulated site for a college project. No real ads, scripts, or
            trackers are loaded.
          </div>

          {stage === STAGES.POPUP && <FakePopup onChoice={handlePopupChoice} />}
        </div>
      )}

      {stage === STAGES.REVEAL && (
        <RevealAnimation lines={REVEAL_LINES} onDone={() => setStage(STAGES.CONSEQUENCE)} />
      )}

      {stage === STAGES.CONSEQUENCE && (
        <ConsequenceScreen
          category="popup"
          nextLabel="See what you should actually do"
          onNext={() => setStage(STAGES.REMEDIATION)}
        />
      )}

      {stage === STAGES.REMEDIATION && (
        <RemediationShowcase
          category="popup"
          onDone={() => {
            markComplete("popup");
            onComplete && onComplete();
          }}
        />
      )}
    </>
  );
}