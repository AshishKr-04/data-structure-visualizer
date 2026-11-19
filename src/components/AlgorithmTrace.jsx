import { Terminal, PlayCircle, CheckCircle2 } from "lucide-react";

function AlgorithmTrace({ title, steps, activeLine, explanation }) {
  const isExecuting = activeLine !== null && activeLine !== undefined;

  return (
    <aside className="trace-panel modern-terminal">
      {/* Terminal Title Bar */}
      <div className="terminal-topbar">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-filename">
          <Terminal size={13} className="term-icon" />
          <span>{title ? title.toLowerCase().replace(/\s+/g, "_") + ".algo" : "algorithm.algo"}</span>
        </div>
        <div className="terminal-badge">
          {isExecuting ? (
            <span className="exec-badge live">
              <span className="live-dot" /> STEP {activeLine + 1}
            </span>
          ) : (
            <span className="exec-badge idle">IDLE</span>
          )}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="terminal-code-body">
        <ol className="pseudocode-modern">
          {steps.map((step, index) => {
            const isActive = activeLine === index;
            return (
              <li
                key={`${step}-${index}`}
                className={`code-line ${isActive ? "active-line" : ""}`}
              >
                <span className="line-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="line-marker">{isActive ? "▶" : " "}</span>
                <code className="line-content">{step}</code>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Live Step Explanation Bar */}
      <div className={`step-telemetry-box ${isExecuting ? "executing" : ""}`}>
        <div className="telemetry-header">
          {isExecuting ? (
            <PlayCircle size={15} className="telemetry-icon live" />
          ) : (
            <CheckCircle2 size={15} className="telemetry-icon" />
          )}
          <span>EXECUTION TRACE EXPLANATION</span>
        </div>
        <p className="telemetry-text">
          {explanation || "Trigger an operation or algorithm to inspect real-time pointer movements."}
        </p>
      </div>
    </aside>
  );
}

export default AlgorithmTrace;

