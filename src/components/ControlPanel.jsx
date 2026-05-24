function ControlPanel({ children, className = "" }) {
  return (
    <div className={`control-panel ${className}`}>
      {children}
    </div>
  );
}

export default ControlPanel;
