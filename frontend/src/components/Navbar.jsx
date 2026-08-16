import { Link } from "react-router-dom";
import "../styles/cyber-home.css";

export default function Navbar() {
  return (
    <div className="cyber-navbar-wrap">
      <div className="cyber-disclaimer">
        Every scenario here is a scripted simulation — no real scripts run, no real
        permissions are requested, and no real files are installed.
      </div>
      <nav className="cyber-nav">
        <Link to="/" className="cyber-nav-logo">
          <span className="dot" /> Awareness Console
        </Link>
        <Link to="/scenario/popup" className="cyber-nav-link">Pop-up</Link>
        <Link to="/scenario/piracy_site" className="cyber-nav-link">Piracy Site</Link>
        <Link to="/scenario/fake_apk" className="cyber-nav-link">Fake APK</Link>
        <Link to="/threat-library" className="cyber-nav-link">Threat Library</Link>
        <Link to="/url-checker" className="cyber-nav-link">URL Checker</Link>
        <Link to="/summary" className="cyber-nav-link">My Report</Link>
      </nav>
    </div>
  );
}