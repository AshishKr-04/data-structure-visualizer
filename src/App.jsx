import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DSInfo from "./components/DSInfo";
import ArrayVisualizer from "./components/ArrayVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import StackVisualizer from "./components/StackVisualizer";
import QueueVisualizer from "./components/QueueVisualizer";
import TreeVisualizer from "./components/TreeVisualizer";
import SearchSortVisualizer from "./components/SearchSortVisualizer";
import GraphVisualizer from "./components/GraphVisualizer";
import HeapVisualizer from "./components/HeapVisualizer";
import OperationLog from "./components/OperationLog";
import { dataStructures } from "./config/dataStructures";

function App() {
  const [activeDS, setActiveDS] = useState("array");
  const [viewMode, setViewMode] = useState("info");
  const [theme, setTheme] = useState("light");
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState([]);
  const [resetCounter, setResetCounter] = useState(0);
  const [randomCounter, setRandomCounter] = useState(0);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const activeMeta = dataStructures[activeDS];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.matches("input, select, textarea")) return;

      if (event.key.toLowerCase() === "i") setViewMode("info");
      if (event.key.toLowerCase() === "v") setViewMode("visualize");
      if (event.key.toLowerCase() === "r" && viewMode === "visualize") {
        setRandomCounter((count) => count + 1);
      }
      if (event.key === "Escape" && viewMode === "visualize") {
        setResetCounter((count) => count + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode]);

  const logOperation = (label, detail) => {
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        structure: activeMeta.label,
        label,
        detail,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        })
      },
      ...prev
    ].slice(0, 12));
  };

  const resetActive = () => {
    setResetCounter((count) => count + 1);
    logOperation("Reset", `${activeMeta.label} workspace cleared`);
  };

  const randomizeActive = () => {
    setRandomCounter((count) => count + 1);
    logOperation("Randomize", `${activeMeta.label} sample data generated`);
  };

  const exportState = async () => {
    const snapshot = {
      project: "Data Structure Visualizer",
      activeWorkspace: activeMeta.label,
      viewMode,
      speed,
      exportedAt: new Date().toISOString(),
      recentOperations: history
    };

    const encoded = btoa(JSON.stringify(snapshot));
    const shareUrl = `${window.location.origin}${window.location.pathname}?state=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      logOperation("Share state", "Workspace snapshot copied to clipboard");
    } catch {
      logOperation("Export state", "Clipboard unavailable, snapshot generated");
    }
  };

  const visualizerProps = {
    speed,
    resetSignal: resetCounter,
    randomSignal: randomCounter,
    logOperation
  };

  const renderVisualizer = () => {
    switch (activeDS) {
      case "array":
        return <ArrayVisualizer {...visualizerProps} />;
      case "linkedlist":
        return <LinkedListVisualizer {...visualizerProps} />;
      case "stack":
        return <StackVisualizer {...visualizerProps} />;
      case "queue":
        return <QueueVisualizer {...visualizerProps} />;
      case "tree":
        return <TreeVisualizer {...visualizerProps} />;
      case "searchsort":
        return <SearchSortVisualizer {...visualizerProps} />;
      case "graph":
        return <GraphVisualizer {...visualizerProps} />;
      case "heap":
        return <HeapVisualizer {...visualizerProps} />;
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
            setViewMode("info");
          }}
        />

        <main className="main-panel">
          <section
            className="workspace-hero"
            style={{ "--active-accent": activeMeta.accent }}
          >
            <div>
              <span className="eyebrow">Interactive workspace</span>
              <h2>{activeMeta.label}</h2>
              <p>{activeMeta.description}</p>
            </div>

            <div className="workspace-actions">
              <div className="view-switch" aria-label="View switch">
                <button
                  className={viewMode === "info" ? "active" : ""}
                  onClick={() => setViewMode("info")}
                >
                  Info
                </button>
                <button
                  className={viewMode === "visualize" ? "active" : ""}
                  onClick={() => setViewMode("visualize")}
                >
                  Visualize
                </button>
              </div>

              {viewMode === "visualize" && (
                <div className="quick-actions">
                  <button onClick={randomizeActive}>Random</button>
                  <button onClick={resetActive}>Reset</button>
                  <button onClick={exportState}>Share</button>
                </div>
              )}
            </div>
          </section>

          <div className="workspace-grid">
            <section className="panel-content">
              {viewMode === "info" && (
                <DSInfo
                  activeDS={activeDS}
                  onVisualize={() => setViewMode("visualize")}
                />
              )}

              {viewMode === "visualize" && renderVisualizer()}
            </section>

            <aside className="inspector-panel">
              <div className="inspector-section">
                <div className="section-heading">
                  <span>Animation Speed</span>
                  <strong>{speed}ms</strong>
                </div>
                <input
                  className="speed-slider"
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                />
                <div className="speed-labels">
                  <span>Fast</span>
                  <span>Detailed</span>
                </div>
              </div>

              <OperationLog history={history} onClear={() => setHistory([])} />

              <div className="inspector-section shortcuts-section">
                <div className="section-heading">
                  <span>Keyboard</span>
                  <strong>Shortcuts</strong>
                </div>
                <div className="shortcut-list">
                  <span><kbd>V</kbd> Visualize</span>
                  <span><kbd>I</kbd> Info</span>
                  <span><kbd>R</kbd> Random</span>
                  <span><kbd>Esc</kbd> Reset</span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
