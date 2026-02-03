function Navbar({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="navbar">
      <div className="title-box">
        <h1>Data Structure Visualizer</h1>
        <p>Visualize Stack, Queue, Linked List & more</p>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark" : "🌞 Light"}
      </button>
    </header>
  );
}

export default Navbar;