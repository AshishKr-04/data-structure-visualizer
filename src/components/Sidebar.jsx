function Sidebar({ activeDS, setActiveDS }) {
  return (
    <aside className="sidebar">
      <div className="ds-section">
        <h2>Data Structures</h2>

        <div className="ds-buttons">
          {/* Stack */}
          <button
            className={activeDS === "stack" ? "active" : ""}
            onClick={() => setActiveDS("stack")}
          >
            Stack
          </button>

          {/* Queue */}
          <button
            className={activeDS === "queue" ? "active" : ""}
            onClick={() => setActiveDS("queue")}
          >
            Queue
          </button>

          {/* Keep others disabled for now */}
          <button disabled>Linked List</button>
          <button disabled>Tree</button>
          <button disabled>Graph</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;