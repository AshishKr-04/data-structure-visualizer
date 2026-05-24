function OperationLog({ history, onClear }) {
  return (
    <div className="inspector-section history-section">
      <div className="section-heading">
        <span>Operation History</span>
        <button onClick={onClear}>Clear</button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <p className="empty-state">Operations will appear here.</p>
        ) : (
          history.map((item) => (
            <article className="history-item" key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.structure}</span>
              </div>
              <p>{item.detail}</p>
              <time>{item.time}</time>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default OperationLog;
