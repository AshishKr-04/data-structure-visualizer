import {
  Server,
  Building2,
  Sparkles,
  Clock,
  ArrowRight,
  BookOpen,
  Layers,
  Cpu
} from "lucide-react";
import ComplexityTable from "./ComplexityTable";
import { dataStructures } from "../config/dataStructures";

function DSInfo({ activeDS, onVisualize }) {
  const info = dataStructures[activeDS];

  if (!info) return null;

  return (
    <div className="modern-info-card">
      {/* Top Hero Banner */}
      <div className="info-hero-banner" style={{ "--item-accent": info.accent }}>
        <div className="info-hero-header">
          <div className="info-badge-row">
            <span className="info-pill">{info.badge || info.group}</span>
            <span className="space-pill">
              <Cpu size={12} /> Space: {info.spaceComplexity || "O(n)"}
            </span>
          </div>
          <h2>{info.label}</h2>
          <p className="info-lead">{info.definition}</p>
        </div>

        <button className="launch-lab-btn" onClick={onVisualize}>
          <span>Launch Interactive Lab</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Grid: Topics & Complexity */}
      <div className="info-grid-modern">
        <section className="info-sub-card">
          <div className="card-sub-header">
            <Layers size={16} className="header-icon" />
            <h3>Core Variants & Topics</h3>
          </div>
          <div className="topic-pill-list">
            {info.topics.map((type) => (
              <span key={type} className="topic-pill">
                {type}
              </span>
            ))}
          </div>

          {info.bestWorst && (
            <div className="performance-summary">
              <div className="perf-item">
                <span className="perf-label">Best Scenario</span>
                <span className="perf-val optimal">{info.bestWorst.best}</span>
              </div>
              <div className="perf-item">
                <span className="perf-label">Worst Scenario</span>
                <span className="perf-val heavy">{info.bestWorst.worst}</span>
              </div>
            </div>
          )}
        </section>

        <section className="info-sub-card">
          <div className="card-sub-header">
            <Clock size={16} className="header-icon" />
            <h3>Time Complexity Matrix</h3>
          </div>
          <ComplexityTable complexity={info.complexity} />
        </section>
      </div>

      {/* Industry Real-World Applications */}
      {info.realWorldUses && info.realWorldUses.length > 0 && (
        <section className="info-sub-card realworld-section">
          <div className="card-sub-header">
            <Server size={16} className="header-icon" />
            <h3>Where is this used in High-Scale Production?</h3>
            <span className="recruiter-badge">Recruiter & System Design Focus</span>
          </div>
          <div className="realworld-grid">
            {info.realWorldUses.map((item, idx) => (
              <div key={idx} className="realworld-item">
                <div className="rw-header">
                  <span className="rw-index">0{idx + 1}</span>
                  <h4>{item.name}</h4>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>

          {info.industryCompanies && (
            <div className="companies-row">
              <span className="companies-label">
                <Building2 size={14} /> Frequently Asked At:
              </span>
              <div className="company-tags">
                {info.industryCompanies.map((c) => (
                  <span key={c} className="company-tag">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Interview Pro-Tip */}
      {info.interviewTips && (
        <div className="interview-pro-tip">
          <div className="tip-header">
            <Sparkles size={16} className="tip-icon" />
            <strong>Engineering Interview Insight</strong>
          </div>
          <p>{info.interviewTips}</p>
        </div>
      )}
    </div>
  );
}

export default DSInfo;

