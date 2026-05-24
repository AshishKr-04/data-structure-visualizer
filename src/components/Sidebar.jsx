import { dataStructureList } from "../config/dataStructures";

function Sidebar({ activeDS, setActiveDS }) {
  const groups = dataStructureList.reduce((acc, item) => {
    acc[item.group] = [...(acc[item.group] || []), item];
    return acc;
  }, {});

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span>DSV</span>
        <p>Visualizer Lab</p>
      </div>

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
