import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import FakePermissionDialog from "../components/FakePermissionDialog";
import RevealAnimation from "../components/RevealAnimation";
import RemediationShowcase from "../components/RemediationShowcase";
import ConsequenceScreen from "../components/ConsequenceScreen";
import "../styles/shady.css";

const STAGES = {
  INSTALL: "install",
  PERMISSIONS: "permissions",
  REVEAL: "reveal",
  CONSEQUENCE: "consequence",
  REMEDIATION: "remediation",
};

const REVEAL_LINES = [
  "Reading incoming SMS...",
  { text: "OTP intercepted...", warn: true },
  { text: "Accessibility service simulating taps...", warn: true },
  "Opening banking app in background...",
  { text: "Hidden app installed: com.unknown.service", warn: true },
];

export default function FakeApkScenario({ onComplete }) {
  const { logChoice, markComplete } = useSession();
  const [stage, setStage] = useState(STAGES.INSTALL);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  useEffect(() => {
    if (stage !== STAGES.INSTALL) return;
    if (progress >= 100) {
      const t = setTimeout(() => setStage(STAGES.PERMISSIONS), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setProgress((p) => Math.min(100, p + 8)), 120);
    return () => clearTimeout(t);
  }, [stage, progress]);

  function handleAllow() {
    logChoice("fake_apk", "installed_apk");
    logChoice("fake_apk", "allowed_sms_permission");
    logChoice("fake_apk", "allowed_accessibility_permission");
    setStage(STAGES.REVEAL);
  }

  function handleDeny() {
    logChoice("fake_apk", "denied_permissions");
    setStage(STAGES.REVEAL);
  }

  const showSite = stage === STAGES.INSTALL || stage === STAGES.PERMISSIONS;

  return (
    <>
      {showSite && (
        <div className="shady-page">
          <div className="shady-topbar">
            <span>Download NetMirror APK</span>
            <span>⭐ 4.8 (1.2M)</span>
          </div>

          {stage === STAGES.INSTALL && (
            <div className="apk-card">
              <div className="apk-icon" />
              <h3>Installing NetMirror...</h3>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {stage === STAGES.PERMISSIONS && (
            <FakePermissionDialog onAllowAll={handleAllow} onDenyAll={handleDeny} />
          )}

          <div className="safety-note">
            No real APK file exists in this project — this is a purely visual
            simulation of an install/permissions flow.
          </div>
        </div>
      )}

      {stage === STAGES.REVEAL && (
        <RevealAnimation lines={REVEAL_LINES} onDone={() => setStage(STAGES.CONSEQUENCE)} />
      )}

      {stage === STAGES.CONSEQUENCE && (
        <ConsequenceScreen
          category="fake_apk"
          nextLabel="See what you should actually do"
          onNext={() => setStage(STAGES.REMEDIATION)}
        />
      )}

      {stage === STAGES.REMEDIATION && (
        <RemediationShowcase
          category="fake_apk"
          onDone={() => {
            markComplete("fake_apk");
            onComplete && onComplete();
          }}
        />
      )}
    </>
  );
}