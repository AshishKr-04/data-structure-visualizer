function VisualizerCard({ eyebrow, title, description, children, actions }) {
  return (
    <section className="visualizer-card modern-card">
      <div className="visualizer-card-header modern-header">
        <div className="header-copy">
          {eyebrow && <span className="modern-eyebrow">{eyebrow}</span>}
          <h2 className="modern-title">{title}</h2>
          {description && <p className="modern-desc">{description}</p>}
        </div>
        {actions && <div className="button-row modern-action-row">{actions}</div>}
      </div>

      <div className="card-canvas-wrapper">{children}</div>
    </section>
  );
}

export default VisualizerCard;

