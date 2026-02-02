function Sidebar({ activeDS, setActiveDS }) {
  return (
    <aside className="sidebar">
      <div className="ds-section">
        <h2>Data Structures</h2>

        <div className="ds-buttons">
          <button
            className={activeDS === "stack" ? "active" : ""}
            onClick={() => setActiveDS("stack")}
          >
            Stack
          </button>

          <button disabled>Queue</button>
          <button disabled>Linked List</button>
          <button disabled>Tree</button>
          <button disabled>Graph</button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;