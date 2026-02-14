import { useState } from "react";

function TreeVisualizer() {
  const [treeMode, setTreeMode] = useState("bst"); // focus on BST for delete
  const [bstRoot, setBstRoot] = useState(null);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const [deletingValue, setDeletingValue] = useState(null);

  /* ===============================
     INSERT BST
  =============================== */
  const insertBST = () => {
    if (!input.trim()) return;

    const value = Number(input);

    const insertNode = (node, value) => {
      if (!node) return { value, left: null, right: null };

      if (value < node.value) {
        node.left = insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = insertNode(node.right, value);
      }

      return node;
    };

    setBstRoot((prev) => insertNode(prev, value));
    setInput("");
    setMessage(`Inserted ${value}`);
  };

  /* ===============================
     DELETE BST (WITH ANIMATION)
  =============================== */
  const deleteBST = async () => {
    if (!input.trim()) return;

    const value = Number(input);
    setDeletingValue(value);
    setMessage(`Deleting ${value}...`);

    await new Promise((res) => setTimeout(res, 800));

    const deleteNode = (node, value) => {
      if (!node) return null;

      if (value < node.value) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.value) {
        node.right = deleteNode(node.right, value);
      } else {
        // Case 1: No child
        if (!node.left && !node.right) {
          return null;
        }

        // Case 2: One child
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        // Case 3: Two children
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }

        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
      }

      return node;
    };

    setBstRoot((prev) => deleteNode(prev, value));

    setDeletingValue(null);
    setInput("");
    setMessage(`Deleted ${value}`);
  };

  /* ===============================
     RENDER TREE
  =============================== */
  const renderTree = (node) => {
    if (!node) return null;

    const isDeleting = node.value === deletingValue;

    return (
      <div className="tree-node">
        <div
          className="tree-circle"
          style={{
            backgroundColor: isDeleting ? "#ff4d4d" : "#2d6cdf",
            transition: "0.3s ease"
          }}
        >
          {node.value}
        </div>

        <div className="tree-children">
          {node.left && renderTree(node.left)}
          {node.right && renderTree(node.right)}
        </div>
      </div>
    );
  };

  return (
    <div className="stack-card">
      <h2>BST Visualizer (With Delete Animation)</h2>

      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={insertBST}>
          Insert
        </button>

        <button
          onClick={deleteBST}
          style={{ backgroundColor: "#e74c3c" }}
        >
          Delete
        </button>
      </div>

      <div className="tree-container">
        {bstRoot ? renderTree(bstRoot) : <div className="empty">BST is empty</div>}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default TreeVisualizer;
