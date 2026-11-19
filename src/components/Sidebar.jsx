import {
  Home,
  LayoutGrid,
  Link2,
  Layers,
  ArrowRightLeft,
  Network,
  ArrowDownUp,
  Share2,
  Crown,
  X,
  Code2,
  Sparkles
} from "lucide-react";
import { dataStructureList } from "../config/dataStructures";

const iconMap = {
  array: LayoutGrid,
  linkedlist: Link2,
  stack: Layers,
  queue: ArrowRightLeft,
  tree: Network,
  searchsort: ArrowDownUp,
  graph: Share2,
  heap: Crown
};

function Sidebar({ activeDS, setActiveDS, isOpen, onClose }) {
  const groups = dataStructureList.reduce((acc, item) => {
    acc[item.group] = [...(acc[item.group] || []), item];
    return acc;
  }, {});

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Code2 size={18} />
          </div>
          <div>
            <span className="sidebar-title">AlgoStudio</span>
            <span className="sidebar-subtitle">Visual Labs</span>
          </div>
        </div>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Close Sidebar Drawer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="sidebar-scrollable-content">
        <nav className="nav-group" aria-label="Overview">
          <span className="nav-group-title">Overview</span>
          <button
            className={`nav-item-btn ${activeDS === "home" ? "active" : ""}`}
            onClick={() => setActiveDS("home")}
          >
            <Home size={17} className="nav-icon" />
            <span className="nav-item-text">Explore Home</span>
          </button>
        </nav>

        {Object.entries(groups).map(([group, items]) => (
          <nav className="nav-group" key={group} aria-label={group}>
            <span className="nav-group-title">{group}</span>
            {items.map((item) => {
              const IconComp = iconMap[item.id] || Layers;
              const isActive = activeDS === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item-btn ${isActive ? "active" : ""}`}
                  style={{ "--item-accent": item.accent }}
                  onClick={() => setActiveDS(item.id)}
                >
                  <IconComp size={17} className="nav-icon" />
                  <span className="nav-item-text">{item.label}</span>
                  {item.badge && (
                    <span className="nav-item-tag">{item.group === "Core" ? "Core" : "Algo"}</span>
                  )}
                </button>
              );
            })}
          </nav>
        ))}

        <div className="sidebar-pro-box">
          <div className="pro-box-header">
            <Sparkles size={14} className="pro-icon" />
            <span>Interactive Sandbox</span>
          </div>
          <p>Real-time memory pointer tracing, Big-O metrics, and production system use cases.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

