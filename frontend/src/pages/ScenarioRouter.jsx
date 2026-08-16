import { useParams, useNavigate } from "react-router-dom";
import PopupScenario from "../scenarios/PopupScenario";
import PiracySiteScenario from "../scenarios/PiracySiteScenario";
import FakeApkScenario from "../scenarios/FakeApkScenario";

const SCENARIO_MAP = {
  popup: PopupScenario,
  piracy_site: PiracySiteScenario,
  fake_apk: FakeApkScenario,
};

export default function ScenarioRouter() {
  const { key } = useParams();
  const navigate = useNavigate();
  const ScenarioComponent = SCENARIO_MAP[key];

  if (!ScenarioComponent) {
    return (
      <div className="container" style={{ padding: 40 }}>
        <p>Unknown scenario.</p>
      </div>
    );
  }

  return <ScenarioComponent onComplete={() => navigate("/summary")} />;
}
