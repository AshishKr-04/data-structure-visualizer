import { useState } from "react";

function TreeVisualizer() {
  const [treeMode, setTreeMode] = useState("binary"); // binary | bst
  const [root, setRoot] = useState(null); // Binary Tree
  const [bstFromBinary, setBstFromBinary] = useState(null); // BST built from Binary
  const [bstDirect, setBstDirect] = useState(null); // Standalone BST
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [showBST, setShowBST] = useState(false);

  /* =========================================
     BINARY TREE INSERT (LEVEL ORDER)
  ========================================= */
  const insertBinary = () => {
    if (!input.trim()) {
      setMessage("Enter a value");
      return;
    }

    const value = Number(input);
    const newNode = { value, left: null, right: null };

    if (!root) {
      setRoot(newNode);
      setInput("");
      setMessage(`Inserted ${value} in Binary Tree`);
      return;
    }

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
    setMessage(`Inserted ${value} in Binary Tree`);
  };

  /* =========================================
     BST INSERT (Standalone Mode)
  ========================================= */
  const insertBST = () => {
    if (!input.trim()) {
      setMessage("Enter a value");
      return;
    }

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

    setBstDirect((prev) => insertNode(prev, value));
    setInput("");
    setMessage(`Inserted ${value} in BST`);
  };

  /* =========================================
     BUILD BST FROM BINARY TREE
  ========================================= */
  const buildBSTFromBinary = () => {
    if (!root) {
      setMessage("Binary Tree is empty");
      return;
    }

    const values = [];

    const collectValues = (node) => {
      if (!node) return;
      values.push(node.value);
      collectValues(node.left);
      collectValues(node.right);
    };

    collectValues(root);

    let newBST = null;

    const insertNode = (node, value) => {
      if (!node) return { value, left: null, right: null };

      if (value < node.value) {
        node.left = insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = insertNode(node.right, value);
      }

      return node;
    };

    values.forEach((val) => {
      newBST = insertNode(newBST, val);
    });

    setBstFromBinary(newBST);
    setMessage("BST built from Binary Tree");
  };

  /* =========================================
     TREE RENDER (Recursive)
  ========================================= */
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

      {/* =========================
         Definition
      ========================= */}
      <div className="stack-definition">
        <h4>Definition</h4>

        {treeMode === "binary" ? (
          <p>
            A <strong>Binary Tree</strong> is a hierarchical structure where
            each node has at most two children.
          </p>
        ) : (
          <p>
            A <strong>Binary Search Tree (BST)</strong> maintains:
            <br />
            Left subtree values &lt; Root &lt; Right subtree values.
          </p>
        )}
      </div>

      {/* =========================
         MODE SWITCH
      ========================= */}
      <div className="ds-buttons">
        <button
          className={treeMode === "binary" ? "active" : ""}
          onClick={() => {
            setTreeMode("binary");
            setMessage("");
          }}
        >
          Binary Tree
        </button>

        <button
          className={treeMode === "bst" ? "active" : ""}
          onClick={() => {
            setTreeMode("bst");
            setShowBST(false);
            setMessage("");
          }}
        >
          BST
        </button>
      </div>

      {/* =========================
         CONTROLS
      ========================= */}
      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {treeMode === "binary" && (
          <>
            <button onClick={insertBinary}>Insert Binary</button>
            <button onClick={buildBSTFromBinary}>
              Build BST from Binary
            </button>

            {!showBST ? (
              <button onClick={() => setShowBST(true)}>
                Show BST
              </button>
            ) : (
              <button onClick={() => setShowBST(false)}>
                Hide BST
              </button>
            )}
          </>
        )}

        {treeMode === "bst" && (
          <button onClick={insertBST}>
            Insert in BST
          </button>
        )}
      </div>

      {/* =========================
         DISPLAY SECTION
      ========================= */}

      {/* Binary Mode Display */}
      {treeMode === "binary" && (
        <>
          <div className="tree-container">
            {root ? (
              renderTree(root)
            ) : (
              <div className="empty">Binary Tree is empty</div>
            )}
          </div>

          {showBST && (
            <>
              <h3 style={{ marginTop: "30px" }}>
                Binary Search Tree (From Binary)
              </h3>

              <div className="tree-container">
                {bstFromBinary ? (
                  renderTree(bstFromBinary)
                ) : (
                  <div className="empty">
                    Click "Build BST from Binary"
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Standalone BST Mode */}
      {treeMode === "bst" && (
        <div className="tree-container">
          {bstDirect ? (
            renderTree(bstDirect)
          ) : (
            <div className="empty">BST is empty</div>
          )}
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default TreeVisualizer;
