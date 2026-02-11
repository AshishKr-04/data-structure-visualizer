import { useState } from "react";

function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  /* =========================
     INSERT (LEVEL ORDER)
  ========================= */
  const insertNode = () => {
    if (input.trim() === "") {
      setMessage("Enter a value");
      return;
    }

    const newNode = {
      value: input,
      left: null,
      right: null,
    };

    if (!root) {
      setRoot(newNode);
      setMessage(`Inserted ${input} as root`);
      setInput("");
      return;
    }

    // BFS insertion
    const queue = [root];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current.left) {
        current.left = newNode;
        break;
      } else {
        queue.push(current.left);
      }

      if (!current.right) {
        current.right = newNode;
        break;
      } else {
        queue.push(current.right);
      }
    }

    setRoot({ ...root });
    setInput("");
    setMessage(`Inserted ${input}`);
  };

  /* =========================
     RENDER TREE (RECURSIVE)
  ========================= */
  const renderTree = (node) => {
    if (!node) return null;

    return (
      <div className="tree-node">
        <div className="tree-circle">{node.value}</div>

        <div className="tree-children">
          {node.left && renderTree(node.left)}
          {node.right && renderTree(node.right)}
        </div>
      </div>
    );
  };

  return (
    <div className="stack-card">
      <h2>Tree Visualizer</h2>

      <div className="stack-definition">
        <h4>Definition</h4>
        <p>
          A <strong>Binary Tree</strong> is a hierarchical data structure where
          each node has at most two children.
        </p>
      </div>

      {/* Controls */}
      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={insertNode}>Insert</button>
      </div>

      {/* Tree Display */}
      <div className="tree-container">
        {root ? renderTree(root) : <div className="empty">Tree is empty</div>}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default TreeVisualizer;
