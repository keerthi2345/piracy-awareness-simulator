import { useState } from "react";

/**
 * Mimics a fake "prove you're human" checkbox — a well-documented trick
 * where the checkbox is actually a disguised ad-click trigger. Purely
 * visual: clicking it just calls onChoice, nothing is verified or executed.
 */
export default function FakeCaptcha({ onChoice }) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        color: "#14171a",
        borderRadius: 8,
        padding: 16,
        maxWidth: 320,
        margin: "16px auto",
        border: "1px solid #d3d3d3",
      }}
    >
      <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => {
            setChecked(true);
            onChoice("clicked_fake_captcha");
          }}
        />
        <span>I'm not a robot</span>
      </label>
      <div style={{ fontSize: "0.65rem", color: "#999", marginTop: 8 }}>
        reCAPTCHA-style verification
      </div>
    </div>
  );
}
