import { useEffect, useState } from "react";
import {
  Info,
  Play,
  Shuffle,
  RotateCcw,
  Share2,
  Check,
  Sliders,
  Keyboard,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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
import HomePage from "./components/HomePage";
import { dataStructures } from "./config/dataStructures";

function App() {
  const [activeDS, setActiveDS] = useState("home");
  const [viewMode, setViewMode] = useState("info");
  const [theme, setTheme] = useState("light");
  const [speed, setSpeed] = useState(500);
  const [history, setHistory] = useState([]);
  const [resetCounter, setResetCounter] = useState(0);
  const [randomCounter, setRandomCounter] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const isHome = activeDS === "home";
  const activeMeta = isHome
    ? {
        label: "Home",
        description: "A guided overview of data structures, algorithms, and visual labs.",
        accent: "#2563eb"
      }
    : dataStructures[activeDS];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.matches("input, select, textarea")) return;

      if (event.key.toLowerCase() === "h") setActiveDS("home");
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

  const [copiedShare, setCopiedShare] = useState(false);

  const exportState = async () => {
    const snapshot = {
      project: "AlgoStudio | Data Structure Visualizer",
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
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
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

  const openVisualizer = (id) => {
    setActiveDS(id);
    setViewMode("visualize");
  };

  const goHome = () => {
    setActiveDS("home");
    setViewMode("info");
  };

  return (
    <>
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
        activeDSLabel={!isHome ? activeMeta.label : null}
        onGoHome={goHome}
      />

      <div className="dashboard">
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
        )}

        <Sidebar
          activeDS={activeDS}
          setActiveDS={(ds) => {
            setActiveDS(ds);
            setViewMode("info");
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="main-panel">
          {!isHome && (
            <section
              className="workspace-hero modern-workspace-hero"
              style={{ "--active-accent": activeMeta.accent }}
            >
              <div className="hero-left-content">
                <div className="hero-badge-group">
                  <span className="eyebrow modern-eyebrow-accent">
                    {activeMeta.badge || activeMeta.group}
                  </span>
                  <span className="workspace-status-badge">
                    <span className="pulse-indicator" /> Live Session
                  </span>
                </div>
                <h2>{activeMeta.label}</h2>
                <p className="hero-description">{activeMeta.description}</p>
              </div>

              <div className="workspace-actions modern-workspace-actions">
                <div className="view-switch modern-view-switch" aria-label="Workspace View Switch">
                  <button
                    className={`switch-tab ${viewMode === "info" ? "active" : ""}`}
                    onClick={() => setViewMode("info")}
                  >
                    <Info size={15} />
                    <span>Theory & System Use</span>
                  </button>
                  <button
                    className={`switch-tab ${viewMode === "visualize" ? "active" : ""}`}
                    onClick={() => setViewMode("visualize")}
                  >
                    <Play size={15} />
                    <span>Interactive Lab</span>
                  </button>
                </div>

                {viewMode === "visualize" && (
                  <div className="quick-actions modern-quick-actions">
                    <button
                      className="action-pill-btn"
                      onClick={randomizeActive}
                      title="Generate new randomized sample data"
                    >
                      <Shuffle size={14} />
                      <span>Randomize</span>
                    </button>
                    <button
                      className="action-pill-btn"
                      onClick={resetActive}
                      title="Reset structure to initial state"
                    >
                      <RotateCcw size={14} />
                      <span>Reset</span>
                    </button>
                    <button
                      className={`action-pill-btn share-btn ${copiedShare ? "copied" : ""}`}
                      onClick={exportState}
                      title="Share workspace snapshot link"
                    >
                      {copiedShare ? <Check size={14} /> : <Share2 size={14} />}
                      <span>{copiedShare ? "Link Copied!" : "Share"}</span>
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {isHome ? (
            <HomePage onVisualize={openVisualizer} />
          ) : (
            <div className="workspace-grid modern-workspace-grid">
              <section className="panel-content modern-panel-content">
                {viewMode === "info" && (
                  <DSInfo
                    activeDS={activeDS}
                    onVisualize={() => setViewMode("visualize")}
                  />
                )}

                {viewMode === "visualize" && renderVisualizer()}
              </section>

              <aside className={`inspector-panel modern-inspector-panel ${isInspectorExpanded ? "expanded" : ""}`}>
                <button
                  className="inspector-toggle modern-inspector-toggle"
                  onClick={() => setIsInspectorExpanded((prev) => !prev)}
                >
                  <div className="toggle-left">
                    <Sliders size={16} />
                    <span>Visualizer Controls & Telemetry</span>
                  </div>
                  <span className="toggle-icon">
                    {isInspectorExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                <div className="inspector-content modern-inspector-content">
                  {/* Speed Controls Section */}
                  <div className="inspector-section speed-section-modern">
                    <div className="section-heading">
                      <div className="heading-title-group">
                        <Sliders size={15} className="heading-icon" />
                        <span>Execution Speed</span>
                      </div>
                      <span className="speed-ms-badge">{speed}ms</span>
                    </div>

                    <div className="speed-presets-row">
                      {[
                        { label: "Slow", ms: 900 },
                        { label: "1x", ms: 500 },
                        { label: "Fast", ms: 250 },
                        { label: "Turbo", ms: 150 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          className={`speed-preset-btn ${speed === preset.ms ? "active" : ""}`}
                          onClick={() => setSpeed(preset.ms)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <input
                      className="speed-slider modern-slider"
                      type="range"
                      min="150"
                      max="1000"
                      step="50"
                      value={speed}
                      onChange={(event) => setSpeed(Number(event.target.value))}
                    />
                    <div className="speed-labels modern-speed-labels">
                      <span>⚡ 150ms (Turbo)</span>
                      <span>🐢 1000ms (Detailed)</span>
                    </div>
                  </div>

                  {/* Operation Log */}
                  <OperationLog history={history} onClear={() => setHistory([])} />

                  {/* Keyboard Shortcuts */}
                  <div className="inspector-section shortcuts-section-modern">
                    <div className="section-heading">
                      <div className="heading-title-group">
                        <Keyboard size={15} className="heading-icon" />
                        <span>Keyboard Shortcuts</span>
                      </div>
                      <span className="shortcut-tip-badge">Pro Tip</span>
                    </div>
                    <div className="shortcut-grid-modern">
                      <div className="shortcut-row">
                        <span><kbd>H</kbd> Go to Home</span>
                        <span><kbd>V</kbd> Visualizer</span>
                      </div>
                      <div className="shortcut-row">
                        <span><kbd>I</kbd> Theory Info</span>
                        <span><kbd>R</kbd> Randomize</span>
                      </div>
                      <div className="shortcut-row full">
                        <span><kbd>Esc</kbd> Reset Workspace</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
