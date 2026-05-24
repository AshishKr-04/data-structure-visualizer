function AlgorithmTrace({ title, steps, activeLine, explanation }) {
  return (
    <aside className="trace-panel">
      <div className="trace-header">
        <span>Pseudocode</span>
        <strong>{title}</strong>
      </div>

      <ol className="pseudocode">
        {steps.map((step, index) => (
          <li
            key={`${step}-${index}`}
            className={activeLine === index ? "active" : ""}
          >
            <code>{step}</code>
          </li>
        ))}
      </ol>

      <div className="step-explanation">
        <span>Current step</span>
        <p>{explanation || "Run an operation to see guided execution."}</p>
      </div>
    </aside>
  );
}

export default AlgorithmTrace;
