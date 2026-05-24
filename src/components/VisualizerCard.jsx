function VisualizerCard({ eyebrow, title, description, children, actions }) {
  return (
    <section className="visualizer-card">
      <div className="visualizer-card-header">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="button-row">{actions}</div>}
      </div>

      {children}
    </section>
  );
}

export default VisualizerCard;
