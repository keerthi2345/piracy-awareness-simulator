// Maps a logged action to a risk weight. Higher = riskier choice.
// Kept server-side and computed from stored Events only, so it can't be
// edited via devtools the way a purely client-side score could.
const ACTION_WEIGHTS = {
  // popup scenario
  clicked_continue: 8,
  clicked_x_on_popup: 5, // still risky — closing a fake ad isn't always safe
  ignored_popup: 0,

  // piracy_site scenario
  clicked_watch_now: 4,
  allowed_notifications: 9,
  clicked_fake_captcha: 6,
  denied_notifications: 0,
  left_site: 0,

  // fake_apk scenario
  installed_apk: 5,
  allowed_sms_permission: 9,
  allowed_accessibility_permission: 10,
  denied_permissions: 0,
  uninstalled_before_granting: 0,
};

const MAX_POSSIBLE_PER_SCENARIO = 20; // rough ceiling used to normalize to 0-100

function scoreEvents(events) {
  const byScenario = {};
  for (const e of events) {
    const weight = ACTION_WEIGHTS[e.action] ?? 0;
    byScenario[e.scenario] = (byScenario[e.scenario] || 0) + weight;
  }

  const scenarioCount = Object.keys(byScenario).length || 1;
  const totalRaw = Object.values(byScenario).reduce((a, b) => a + b, 0);
  const maxPossible = MAX_POSSIBLE_PER_SCENARIO * scenarioCount;

  const normalized = Math.min(
    100,
    Math.round((totalRaw / maxPossible) * 100)
  );

  let band;
  if (normalized <= 20) band = "Cautious";
  else if (normalized <= 50) band = "Moderate Risk";
  else if (normalized <= 75) band = "High Risk";
  else band = "Very High Risk";

  return { score: normalized, band, byScenario };
}

module.exports = { scoreEvents, ACTION_WEIGHTS };
