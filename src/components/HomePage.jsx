import { useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  Activity,
  Layers,
  CheckCircle2,
  Compass
} from "lucide-react";
import { dataStructureList } from "../config/dataStructures";

const learningRoadmap = [
  {
    step: "01",
    title: "Linear Memory",
    desc: "Contiguous arrays vs. pointer linked lists, LIFO call stacks & FIFO buffers.",
    items: ["Array", "Linked List", "Stack", "Queue"]
  },
  {
    step: "02",
    title: "Hierarchical Trees",
    desc: "Branching logarithmic lookup, binary search trees, and priority heaps.",
    items: ["Binary Tree", "BST", "Max Heap"]
  },
  {
    step: "03",
    title: "Graph Networks",
    desc: "Adjacency traversal, BFS queue frontiers, and Dijkstra shortest paths.",
    items: ["BFS", "DFS", "Dijkstra"]
  },
  {
    step: "04",
    title: "Divide & Conquer",
    desc: "Partitioning, logarithmic binary search, and O(n log n) comparison sorts.",
    items: ["Binary Search", "Merge Sort", "Quick Sort"]
  }
];

function MinimalPreview({ id, accent }) {
  if (id === "graph") {
    return (
      <svg className="minimal-mini-svg" viewBox="0 0 160 70" aria-hidden="true">
        <line x1="30" y1="22" x2="80" y2="48" stroke={accent} strokeWidth="2" />
        <line x1="80" y1="48" x2="130" y2="22" stroke={accent} strokeWidth="2" />
        <line x1="30" y1="22" x2="130" y2="22" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="30" cy="22" r="11" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <circle cx="80" cy="48" r="11" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <circle cx="130" cy="22" r="11" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <text x="30" y="26" textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="bold">A</text>
        <text x="80" y="52" textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="bold">B</text>
        <text x="130" y="26" textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="bold">C</text>
      </svg>
    );
  }

  if (id === "tree" || id === "heap") {
    return (
      <svg className="minimal-mini-svg" viewBox="0 0 160 70" aria-hidden="true">
        <line x1="80" y1="16" x2="44" y2="48" stroke={accent} strokeWidth="2" />
        <line x1="80" y1="16" x2="116" y2="48" stroke={accent} strokeWidth="2" />
        <circle cx="80" cy="16" r="11" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <circle cx="44" cy="48" r="10" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <circle cx="116" cy="48" r="10" fill="var(--panel)" stroke={accent} strokeWidth="2" />
        <text x="80" y="20" textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="bold">50</text>
        <text x="44" y="52" textAnchor="middle" fill="var(--text)" fontSize="8" fontWeight="bold">25</text>
        <text x="116" y="52" textAnchor="middle" fill="var(--text)" fontSize="8" fontWeight="bold">75</text>
      </svg>
    );
  }

  if (id === "searchsort") {
    return (
      <div className="minimal-mini-bars" aria-hidden="true">
        <span style={{ height: "40%", background: accent }} />
        <span style={{ height: "75%", background: accent }} />
        <span style={{ height: "25%", background: accent }} />
        <span style={{ height: "90%", background: accent }} />
        <span style={{ height: "55%", background: accent }} />
      </div>
    );
  }

  return (
    <div className="minimal-mini-cells" aria-hidden="true">
      <span style={{ borderColor: accent }} />
      <span style={{ borderColor: accent }} />
      <span style={{ borderColor: accent }} />
      <span style={{ borderColor: accent }} />
    </div>
  );
}

function HomePage({ onVisualize }) {
  const [filter, setFilter] = useState("all");

  const filteredItems = dataStructureList.filter((item) => {
    if (filter === "core") return item.group === "Core";
    if (filter === "algo") return item.group !== "Core";
    return true;
  });

  return (
    <div className="home-minimal-container">
      {/* Sleek Minimal Hero */}
      <section className="minimal-hero">
        <div className="minimal-hero-inner">
          <div className="minimal-pill-tag">
            <Sparkles size={13} className="sparkle-icon" />
            <span>Interactive Algorithm Studio</span>
          </div>

          <h1 className="minimal-headline">
            Data Structures & <span className="minimal-gradient-text">Algorithms</span>
          </h1>

          <p className="minimal-subline">
            A focused interactive workspace to visualize real-time pointer movements, 
            memory layouts, and step-by-step Big-O complexity execution.
          </p>

          <div className="minimal-hero-actions">
            <button className="minimal-btn-primary" onClick={() => onVisualize("array")}>
              <span>Start with Arrays</span>
              <ArrowRight size={15} />
            </button>
            <button
              className="minimal-btn-secondary"
              onClick={() => onVisualize("searchsort")}
            >
              <Terminal size={15} />
              <span>Explore Algorithms</span>
            </button>
          </div>
        </div>

        {/* Minimal Quick Stats Strip */}
        <div className="minimal-stat-strip">
          <div className="stat-unit">
            <Cpu size={16} className="stat-icon" />
            <span><strong>8</strong> Labs</span>
          </div>
          <div className="stat-sep">•</div>
          <div className="stat-unit">
            <Activity size={16} className="stat-icon" />
            <span><strong>O(1) – O(N²)</strong> Big-O Matrix</span>
          </div>
          <div className="stat-sep">•</div>
          <div className="stat-unit">
            <Layers size={16} className="stat-icon" />
            <span><strong>System Design</strong> Production Insights</span>
          </div>
          <div className="stat-sep">•</div>
          <div className="stat-unit">
            <CheckCircle2 size={16} className="stat-icon" />
            <span><strong>16/16</strong> Tests Passing</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs Bar */}
      <section className="minimal-filter-section">
        <div className="filter-title-group">
          <h2>Interactive Visualizer Catalog</h2>
          <span className="filter-count">{filteredItems.length} Available</span>
        </div>

        <div className="minimal-filter-tabs">
          {[
            { id: "all", label: "All Labs" },
            { id: "core", label: "Core Structures (5)" },
            { id: "algo", label: "Algorithms (3)" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab-btn ${filter === tab.id ? "active" : ""}`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Clean Minimalist Cards Grid */}
      <section className="minimal-grid">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className="minimal-card"
            style={{ "--card-accent": item.accent }}
            onClick={() => onVisualize(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onVisualize(item.id)}
          >
            <div className="card-header-minimal">
              <span className="card-badge-minimal">{item.badge || item.group}</span>
              <span className="card-space-minimal">{item.spaceComplexity || "O(n)"}</span>
            </div>

            <div className="card-preview-minimal">
              <MinimalPreview id={item.id} accent={item.accent} />
            </div>

            <div className="card-body-minimal">
              <h3>{item.label}</h3>
              <p>{item.definition || item.description}</p>
            </div>

            <div className="card-footer-minimal">
              <span className="card-link-text">Launch Visualizer</span>
              <ArrowRight size={14} className="card-arrow" />
            </div>
          </article>
        ))}
      </section>

      {/* Minimal 4-Step Technical Interview Roadmap */}
      <section className="minimal-roadmap-section">
        <div className="roadmap-header-minimal">
          <Compass size={18} className="roadmap-icon-minimal" />
          <div>
            <h3>Recommended Interview Progression</h3>
            <p>4-stage structured curriculum for technical interview preparation.</p>
          </div>
        </div>

        <div className="minimal-roadmap-grid">
          {learningRoadmap.map((item) => (
            <div key={item.step} className="roadmap-box-minimal">
              <span className="step-num-minimal">{item.step}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <div className="roadmap-tags-minimal">
                {item.items.map((ds) => (
                  <span key={ds} className="tag-minimal">{ds}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
