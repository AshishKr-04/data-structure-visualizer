import { History, Trash2, Clock, Check } from "lucide-react";

function OperationLog({ history, onClear }) {
  return (
    <div className="inspector-section history-section-modern">
      <div className="section-heading">
        <div className="heading-title-group">
          <History size={15} className="heading-icon" />
          <span>Execution Telemetry</span>
          <span className="log-count-pill">{history.length}</span>
        </div>
        {history.length > 0 && (
          <button className="clear-btn" onClick={onClear} title="Clear telemetry log">
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="history-list-modern">
        {history.length === 0 ? (
          <div className="empty-telemetry">
            <Clock size={24} className="empty-icon" />
            <p>Ready for input</p>
            <span>Operations & pointer mutations will stream here in real-time.</span>
          </div>
        ) : (
          history.map((item) => (
            <article className="history-item-modern" key={item.id}>
              <div className="item-top-row">
                <span className="item-op-badge">
                  <Check size={11} className="badge-check" />
                  {item.label}
                </span>
                <span className="item-time">{item.time}</span>
              </div>
              <p className="item-detail">{item.detail}</p>
              <div className="item-struct-tag">{item.structure}</div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default OperationLog;

