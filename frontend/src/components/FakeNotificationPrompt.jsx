/**
 * Styled to resemble a browser notification-permission bar. This is a plain
 * <div>, not a call to the real Notification.requestPermission() API — the
 * real browser API is intentionally never invoked anywhere in this app.
 */
export default function FakeNotificationPrompt({ onChoice }) {
  return (
    <div className="fake-browser-bar" role="dialog" aria-label="Mock notification prompt">
      <span className="fav" />
      <span>site-wants-to.example wants to send notifications</span>
      <div className="actions">
        <button onClick={() => onChoice("denied_notifications")}>Block</button>
        <button className="allow" onClick={() => onChoice("allowed_notifications")}>
          Allow
        </button>
      </div>
    </div>
  );
}
