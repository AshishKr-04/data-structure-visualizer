function Sidebar({ activeDS, setActiveDS }) {
  return (
    <aside className="sidebar">
      <div className="ds-section">
        <h2>Data Structures</h2>

        <div className="ds-buttons">
          {/* Array */}
          <button
            className={activeDS === "array" ? "active" : ""}
            onClick={() => setActiveDS("array")}
          >
            Array
          </button>

          {/* Linked List */}
          <button
            className={activeDS === "linkedlist" ? "active" : ""}
            onClick={() => setActiveDS("linkedlist")}
          >
            Linked List
          </button>

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
          <button
            className={activeDS === "tree" ? "active" : ""}
            onClick={() => setActiveDS("tree")}
          >
            Tree
          </button>

        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
