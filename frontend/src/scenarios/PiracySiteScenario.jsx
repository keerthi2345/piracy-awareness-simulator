import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import TabMultiplyAnimation from "../components/TabMultiplyAnimation";
import FakeCaptcha from "../components/FakeCaptcha";
import FakeNotificationPrompt from "../components/FakeNotificationPrompt";
import RevealAnimation from "../components/RevealAnimation";
import RemediationShowcase from "../components/RemediationShowcase";
import ConsequenceScreen from "../components/ConsequenceScreen";
import "../styles/shady.css";

const STAGES = {
  SITE: "site",
  TABS: "tabs",
  CAPTCHA: "captcha",
  NOTIF: "notif",
  REVEAL: "reveal",
  CONSEQUENCE: "consequence",
  REMEDIATION: "remediation",
};

const REVEAL_LINES = [
  "Redirect chain triggered: 4 unknown domains...",
  { text: "Notification access granted...", warn: true },
  { text: "Site can now send ads even when browser is closed...", warn: true },
  "Browser fingerprint collected...",
  { text: "Ad-click fraud script loaded...", warn: true },
];

export default function PiracySiteScenario({ onComplete }) {
  const { logChoice, markComplete } = useSession();
  const [stage, setStage] = useState(STAGES.SITE);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  function handleWatchNow() {
    logChoice("piracy_site", "clicked_watch_now");
    setStage(STAGES.TABS);
  }

  function handleCaptcha(action) {
    logChoice("piracy_site", action);
    setStage(STAGES.NOTIF);
  }

  function handleNotif(action) {
    logChoice("piracy_site", action);
    setStage(STAGES.REVEAL);
  }

  const showSite = [STAGES.SITE, STAGES.TABS, STAGES.CAPTCHA, STAGES.NOTIF].includes(stage);

  return (
    <>
      {showSite && (
        <div className="shady-page">
          <div className="shady-topbar">
            <span>MovieZone-HD.example</span>
            <span>🔥 Trending</span>
          </div>
          <h1 className="shady-title">Now Playing: Evil Dead Burn Movie (2026)</h1>

          {stage === STAGES.SITE && (
            <button className="watch-now-btn" onClick={handleWatchNow}>
              ▶ Watch Now
            </button>
          )}

          {stage === STAGES.TABS && (
            <>
              <p>Opening stream...</p>
              <TabMultiplyAnimation count={6} onDone={() => setStage(STAGES.CAPTCHA)} />
            </>
          )}

          {stage === STAGES.CAPTCHA && (
            <>
              <p style={{ textAlign: "center" }}>Verify you're human to continue:</p>
              <FakeCaptcha onChoice={handleCaptcha} />
            </>
          )}

          {stage === STAGES.NOTIF && (
            <>
              <p style={{ textAlign: "center" }}>Allow notifications to continue watching:</p>
              <FakeNotificationPrompt onChoice={handleNotif} />
            </>
          )}

          <div className="safety-note">
            Simulated site for a college project — no real tabs, permissions, or trackers.
          </div>
        </div>
      )}

      {stage === STAGES.REVEAL && (
        <RevealAnimation lines={REVEAL_LINES} onDone={() => setStage(STAGES.CONSEQUENCE)} />
      )}

      {stage === STAGES.CONSEQUENCE && (
        <ConsequenceScreen
          category="piracy_site"
          nextLabel="See what you should actually do"
          onNext={() => setStage(STAGES.REMEDIATION)}
        />
      )}

      {stage === STAGES.REMEDIATION && (
        <RemediationShowcase
          category="piracy_site"
          onDone={() => {
            markComplete("piracy_site");
            onComplete && onComplete();
          }}
        />
      )}
    </>
  );
}