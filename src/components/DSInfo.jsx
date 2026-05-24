import ComplexityTable from "./ComplexityTable";
import { dataStructures } from "../config/dataStructures";

function DSInfo({ activeDS, onVisualize }) {
  const info = dataStructures[activeDS];

  return (
    <div className="info-card">
      <div>
        <span className="eyebrow">Concept brief</span>
        <h2>{info.label}</h2>
        <p>{info.definition}</p>
      </div>

      <div className="info-grid">
        <section>
          <h3>Included Topics</h3>
          <ul>
            {info.topics.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3>Complexity</h3>
          <ComplexityTable complexity={info.complexity} />
        </section>
      </div>

      <button className="visualize-btn" onClick={onVisualize}>
        Open Visualizer
      </button>
    </div>
  );
}

export default DSInfo;
