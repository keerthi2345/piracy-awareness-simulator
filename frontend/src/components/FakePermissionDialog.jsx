/**
 * Styled to resemble an Android permission-request dialog. This does not
 * touch any real device permission API — it's a static list a user clicks
 * through to see how such requests are dressed up as routine.
 */
const PERMISSIONS = [
  { key: "sms", label: "Allow SMS access?", danger: true, action: "allowed_sms_permission" },
  {
    key: "accessibility",
    label: "Allow Accessibility Service?",
    danger: true,
    action: "allowed_accessibility_permission",
  },
  { key: "install", label: "Allow installing unknown apps?", danger: true },
];

export default function FakePermissionDialog({ onAllowAll, onDenyAll }) {
  return (
    <div className="fake-permission-list">
      <strong>NetMirror needs the following permissions:</strong>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
        {PERMISSIONS.map((p) => (
          <li key={p.key}>
            <span className={p.danger ? "danger" : ""}>{p.label}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button
          onClick={onDenyAll}
          style={{ flex: 1, padding: 10, border: "1px solid #ccc", borderRadius: 6, background: "#fff" }}
        >
          Deny
        </button>
        <button
          onClick={onAllowAll}
          style={{
            flex: 1,
            padding: 10,
            border: "none",
            borderRadius: 6,
            background: "var(--shady-pink)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Allow all
        </button>
      </div>
    </div>
  );
}
