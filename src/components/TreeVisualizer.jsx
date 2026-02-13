import { useState } from "react";

function TreeVisualizer() {
  const [treeMode, setTreeMode] = useState("binary"); // binary | bst
  const [root, setRoot] = useState(null); // Binary Tree
  const [bstFromBinary, setBstFromBinary] = useState(null); // Built BST
  const [bstDirect, setBstDirect] = useState(null); // Standalone BST
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const [showBST, setShowBST] = useState(false);

  // Traversal
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [traversalType, setTraversalType] = useState("");
  const [isTraversing, setIsTraversing] = useState(false);

  /* =========================================
     RESET TRAVERSAL
  ========================================= */
  const resetTraversal = () => {
    setTraversalOutput([]);
    setTraversalType("");
    setIsTraversing(false);
  };

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
     BST INSERT (Standalone)
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

    const collect = (node) => {
      if (!node) return;
      values.push(node.value);
      collect(node.left);
      collect(node.right);
    };

    collect(root);

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

    values.forEach((v) => {
      newBST = insertNode(newBST, v);
    });

    setBstFromBinary(newBST);
    setMessage("BST built from Binary Tree");
  };

  /* =========================================
     TRAVERSAL LOGIC
  ========================================= */
  const startTraversal = async (type) => {
    let currentRoot =
      treeMode === "binary"
        ? root
        : treeMode === "bst"
        ? bstDirect
        : null;

    if (!currentRoot) {
      setMessage("Tree is empty");
      return;
    }

    resetTraversal();
    setTraversalType(type);
    setIsTraversing(true);

    const result = [];

    const delay = () =>
      new Promise((resolve) => setTimeout(resolve, 500));

    const inorder = async (node) => {
      if (!node) return;
      await inorder(node.left);
      result.push(node.value);
      setTraversalOutput([...result]);
      await delay();
      await inorder(node.right);
    };

    const preorder = async (node) => {
      if (!node) return;
      result.push(node.value);
      setTraversalOutput([...result]);
      await delay();
      await preorder(node.left);
      await preorder(node.right);
    };

    const postorder = async (node) => {
      if (!node) return;
      await postorder(node.left);
      await postorder(node.right);
      result.push(node.value);
      setTraversalOutput([...result]);
      await delay();
    };

    if (type === "inorder") await inorder(currentRoot);
    if (type === "preorder") await preorder(currentRoot);
    if (type === "postorder") await postorder(currentRoot);

    setIsTraversing(false);
  };

  /* =========================================
     TRAVERSAL EXPLANATION
  ========================================= */
  const getTraversalExplanation = () => {
    switch (traversalType) {
      case "inorder":
        return "Traversal Pattern: Left → Node → Right";
      case "preorder":
        return "Traversal Pattern: Node → Left → Right";
      case "postorder":
        return "Traversal Pattern: Left → Right → Node";
      default:
        return "";
    }
  };

  /* =========================================
     TREE RENDER
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

      {/* MODE SWITCH */}
      <div className="ds-buttons">
        <button
          className={treeMode === "binary" ? "active" : ""}
          onClick={() => {
            setTreeMode("binary");
            resetTraversal();
            setShowBST(false);
            setMessage("");
          }}
        >
          Binary Tree
        </button>

        <button
          className={treeMode === "bst" ? "active" : ""}
          onClick={() => {
            setTreeMode("bst");
            resetTraversal();
            setMessage("");
          }}
        >
          BST
        </button>
      </div>

      {/* INPUT + BUTTONS */}
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

            <button onClick={() => setShowBST(!showBST)}>
              {showBST ? "Hide BST" : "Show BST"}
            </button>
          </>
        )}

        {treeMode === "bst" && (
          <button onClick={insertBST}>Insert in BST</button>
        )}
      </div>

      {/* TRAVERSAL BUTTONS */}
      <div className="ds-buttons" style={{ marginTop: "15px" }}>
        <button disabled={isTraversing} onClick={() => startTraversal("inorder")}>
          Inorder
        </button>

        <button disabled={isTraversing} onClick={() => startTraversal("preorder")}>
          Preorder
        </button>

        <button disabled={isTraversing} onClick={() => startTraversal("postorder")}>
          Postorder
        </button>
      </div>

      {/* DISPLAY SECTION */}

      {treeMode === "binary" && (
        <>
          <div className="tree-container">
            {root ? renderTree(root) : <div className="empty">Binary Tree is empty</div>}
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

      {treeMode === "bst" && (
        <div className="tree-container">
          {bstDirect ? renderTree(bstDirect) : <div className="empty">BST is empty</div>}
        </div>
      )}

      {/* TRAVERSAL INFO */}
      {traversalType && (
        <div className="message" style={{ marginTop: "15px" }}>
          {getTraversalExplanation()}
        </div>
      )}

      {traversalOutput.length > 0 && (
        <div className="message">
          Traversal Output: {traversalOutput.join(" → ")}
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default TreeVisualizer;
