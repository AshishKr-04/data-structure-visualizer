function Navbar({ theme, setTheme, onMenuToggle }) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onMenuToggle} aria-label="Toggle Navigation">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
            <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
            <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
          </svg>
        </button>
        <div>
          <p className="nav-kicker">Algorithm studio</p>
          <h1>Data Structure Visualizer</h1>
        </div>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </header>
  );
}

export default Navbar;
