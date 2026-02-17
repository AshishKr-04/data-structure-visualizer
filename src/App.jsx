import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DSInfo from "./components/DSInfo";
import ArrayVisualizer from "./components/ArrayVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import StackVisualizer from "./components/StackVisualizer";
import QueueVisualizer from "./components/QueueVisualizer";
import TreeVisualizer from "./components/TreeVisualizer";

function App() {
  const [activeDS, setActiveDS] = useState("array");
  const [viewMode, setViewMode] = useState("info"); // info | visualize
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const renderVisualizer = () => {
    switch (activeDS) {
      case "array":
        return <ArrayVisualizer />;
      case "linkedlist":
        return <LinkedListVisualizer />;
      case "stack":
        return <StackVisualizer />;
      case "queue":
        return <QueueVisualizer />;
      case "tree":
        return <TreeVisualizer />;
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="dashboard">
        <Sidebar
          activeDS={activeDS}
          setActiveDS={(ds) => {
            setActiveDS(ds);
            setViewMode("info"); // always reset to info
          }}
        />

        <main className="main-panel">
          {/* Header Section */}
          <div className="panel-header">
            <h2>{activeDS.toUpperCase()}</h2>

            <div className="view-switch">
              <button
                className={viewMode === "info" ? "active" : ""}
                onClick={() => setViewMode("info")}
              >
                📘 Info
              </button>

              <button
                className={viewMode === "visualize" ? "active" : ""}
                onClick={() => setViewMode("visualize")}
              >
                🚀 Visualize
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="panel-content">
            {viewMode === "info" && (
              <DSInfo activeDS={activeDS} />
            )}

            {viewMode === "visualize" && renderVisualizer()}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
