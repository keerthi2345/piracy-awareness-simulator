/**
 * A purely visual mock of a scam pop-up. Neither button navigates anywhere
 * or runs any script — both call the same onChoice callback with a label,
 * which is the point: in reality, closing or clicking such an ad can both
 * trigger unwanted behavior.
 */
export default function FakePopup({ onChoice }) {
  return (
    <div className="fake-popup-backdrop">
      <div className="fake-popup">
        <button
          className="fake-popup-btn close"
          onClick={() => onChoice("clicked_x_on_popup")}
          aria-label="Close"
        >
          ×
        </button>
        <h2>🎉 You've Won a FREE iPhone!</h2>
        <p>You are the lucky visitor of the day. Claim your prize now before it expires!</p>
        <div className="fake-popup-actions">
          <button
            className="fake-popup-btn primary"
            onClick={() => onChoice("clicked_continue")}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
