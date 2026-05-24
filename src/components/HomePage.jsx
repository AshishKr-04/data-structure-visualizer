import { dataStructureList } from "../config/dataStructures";

const learningPath = [
  "Start with linear structures: Array, Linked List, Stack, Queue.",
  "Move into hierarchical structures: Tree and Heap.",
  "Finish with algorithmic thinking: Search, Sort, Graph traversal, Dijkstra."
];

function MiniVisualization({ id }) {
  if (id === "graph") {
    return (
      <svg className="home-mini-visual" viewBox="0 0 180 92" aria-hidden="true">
        <line x1="34" y1="28" x2="86" y2="58" />
        <line x1="86" y1="58" x2="142" y2="26" />
        <line x1="34" y1="28" x2="142" y2="26" />
        <circle cx="34" cy="28" r="13" />
        <circle cx="86" cy="58" r="13" />
        <circle cx="142" cy="26" r="13" />
      </svg>
    );
  }

  if (id === "tree" || id === "heap") {
    return (
      <svg className="home-mini-visual" viewBox="0 0 180 92" aria-hidden="true">
        <line x1="90" y1="20" x2="52" y2="62" />
        <line x1="90" y1="20" x2="128" y2="62" />
        <circle cx="90" cy="20" r="15" />
        <circle cx="52" cy="62" r="13" />
        <circle cx="128" cy="62" r="13" />
      </svg>
    );
  }

  if (id === "searchsort") {
    return (
      <div className="home-bars" aria-hidden="true">
        <span style={{ height: "44%" }} />
        <span style={{ height: "78%" }} />
        <span style={{ height: "34%" }} />
        <span style={{ height: "92%" }} />
        <span style={{ height: "58%" }} />
      </div>
    );
  }

  return (
    <div className="home-nodes" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function HomePage({ onVisualize }) {
  const coreItems = dataStructureList.filter((item) => item.group === "Core");
  const algorithmItems = dataStructureList.filter((item) => item.group !== "Core");

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">Data structure learning map</span>
          <h2>Understand how data moves, connects, and transforms.</h2>
          <p>
            Explore core data structures, algorithm patterns, complexity tradeoffs,
            and animated operations from one guided workspace.
          </p>
          <div className="home-actions">
            <button onClick={() => onVisualize("array")}>Start Visualizing</button>
            <button className="secondary-action" onClick={() => onVisualize("searchsort")}>
              Explore Algorithms
            </button>
          </div>
        </div>

        <div className="home-visual-stage" aria-hidden="true">
          <div className="orbit-node node-a">Array</div>
          <div className="orbit-node node-b">Tree</div>
          <div className="orbit-node node-c">Graph</div>
          <div className="orbit-node node-d">Heap</div>
          <div className="center-node">DSV</div>
        </div>
      </section>

      <section className="home-stats">
        <article>
          <strong>{dataStructureList.length}</strong>
          <span>interactive labs</span>
        </article>
        <article>
          <strong>16</strong>
          <span>core tests</span>
        </article>
        <article>
          <strong>O()</strong>
          <span>complexity focused</span>
        </article>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <span className="eyebrow">Core structures</span>
          <h3>Learn the building blocks first.</h3>
        </div>

        <div className="structure-card-grid">
          {coreItems.map((item) => (
            <article className="structure-card" key={item.id} style={{ "--card-accent": item.accent }}>
              <MiniVisualization id={item.id} />
              <div>
                <h4>{item.label}</h4>
                <p>{item.definition}</p>
              </div>
              <ul>
                {item.topics.slice(0, 3).map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <button onClick={() => onVisualize(item.id)}>Visualize</button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <span className="eyebrow">Algorithm labs</span>
          <h3>See operations execute step by step.</h3>
        </div>

        <div className="algorithm-strip">
          {algorithmItems.map((item) => (
            <article className="algorithm-card" key={item.id} style={{ "--card-accent": item.accent }}>
              <MiniVisualization id={item.id} />
              <div>
                <h4>{item.label}</h4>
                <p>{item.description}</p>
              </div>
              <button onClick={() => onVisualize(item.id)}>Open Lab</button>
            </article>
          ))}
        </div>
      </section>

      <section className="learning-path">
        <div>
          <span className="eyebrow">Suggested path</span>
          <h3>How to use this project</h3>
        </div>
        <ol>
          {learningPath.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default HomePage;
