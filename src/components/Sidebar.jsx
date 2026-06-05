import { dataStructureList } from "../config/dataStructures";

function Sidebar({ activeDS, setActiveDS, isOpen, onClose }) {
  const groups = dataStructureList.reduce((acc, item) => {
    acc[item.group] = [...(acc[item.group] || []), item];
    return acc;
  }, {});

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>DSV</span>
          <p>Visualizer Lab</p>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav className="nav-group" aria-label="Overview">
        <h2>Overview</h2>
        <button
          className={activeDS === "home" ? "active" : ""}
          onClick={() => setActiveDS("home")}
        >
          Home
        </button>
      </nav>

      {Object.entries(groups).map(([group, items]) => (
        <nav className="nav-group" key={group} aria-label={group}>
          <h2>{group}</h2>
          {items.map((item) => (
            <button
              key={item.id}
              className={activeDS === item.id ? "active" : ""}
              onClick={() => setActiveDS(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      ))}
    </aside>
  );
}

export default Sidebar;
