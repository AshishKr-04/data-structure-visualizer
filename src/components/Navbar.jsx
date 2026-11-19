import { Sun, Moon, Menu, Terminal, Code2 } from "lucide-react";

function GithubIcon({ size = 17 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Navbar({ theme, setTheme, onMenuToggle, activeDSLabel, onGoHome }) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-toggle-btn"
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        <button
          className="brand-group brand-home-btn"
          onClick={onGoHome}
          title="Go to Homepage"
          aria-label="Algorithm Studio - Return to Homepage"
        >
          <div className="brand-logo-badge">
            <Terminal size={17} className="brand-icon" />
          </div>
          <div className="brand-text">
            <p className="nav-kicker">Algorithm Studio</p>
            <div className="brand-title-row">
              <span className="brand-name">Data Structure Visualizer</span>
              <span className="brand-tag">PRO</span>
            </div>
          </div>
        </button>
      </div>

      <div className="navbar-right">
        {activeDSLabel && (
          <div className="active-ds-pill" title={`Active workspace: ${activeDSLabel}`}>
            <span className="active-dot" />
            <span>{activeDSLabel}</span>
          </div>
        )}

        <div className="system-status-indicator" title="Visualizer Execution Engine Ready">
          <span className="status-dot-pulse" />
          <span className="status-text">Engine Ready</span>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="nav-icon-link"
          aria-label="GitHub Repository"
          title="View Source on GitHub"
        >
          <GithubIcon size={16} />
          <span className="github-label">GitHub</span>
        </a>

        <button
          className="theme-toggle-modern"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
        >
          {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          <span className="theme-toggle-text">
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;

