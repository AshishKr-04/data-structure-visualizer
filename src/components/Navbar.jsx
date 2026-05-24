function Navbar({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="navbar">
      <div>
        <p className="nav-kicker">Algorithm studio</p>
        <h1>Data Structure Visualizer</h1>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </header>
  );
}

export default Navbar;
