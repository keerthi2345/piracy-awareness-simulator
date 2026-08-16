import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ScenarioRouter from "./pages/ScenarioRouter";
import UrlChecker from "./pages/UrlChecker";
import SummaryReport from "./pages/SummaryReport";
import ThreatLibrary from "./pages/ThreatLibrary";

export default function App() {
  const location = useLocation();
  const inScenario = location.pathname.startsWith("/scenario/");

  return (
    <div className="app-shell">
      {!inScenario && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scenario/:key" element={<ScenarioRouter />} />
        <Route path="/url-checker" element={<UrlChecker />} />
        <Route path="/summary" element={<SummaryReport />} />
        <Route path="/threat-library" element={<ThreatLibrary />} />
      </Routes>
    </div>
  );
}