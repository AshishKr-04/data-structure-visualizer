/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { parseNumber } from "../lib/validation";

function TreeVisualizer({ speed = 500, resetSignal, randomSignal, logOperation }) {
  const [treeMode, setTreeMode] = useState("binary"); // binary | bst
  const [root, setRoot] = useState(null); // Binary Tree
  const [bstFromBinary, setBstFromBinary] = useState(null);
  const [bstDirect, setBstDirect] = useState(null);
  const [showBST, setShowBST] = useState(false);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const [deletingValue, setDeletingValue] = useState(null);

  // Traversal
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [traversalType, setTraversalType] = useState("");
  const [isTraversing, setIsTraversing] = useState(false);

  useEffect(() => {
    setRoot(null);
    setBstFromBinary(null);
    setBstDirect(null);
    setShowBST(false);
    setInput("");
    setMessage("Tree reset.");
    setDeletingValue(null);
    resetTraversal();
  }, [resetSignal]);

  useEffect(() => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    let nextRoot = null;
    values.forEach((value) => {
      const node = { value, left: null, right: null };
      if (!nextRoot) {
        nextRoot = node;
        return;
      }
      const queue = [nextRoot];
      while (queue.length) {
        const current = queue.shift();
        if (!current.left) {
          current.left = node;
          break;
        }
        queue.push(current.left);
        if (!current.right) {
          current.right = node;
          break;
        }
        queue.push(current.right);
      }
    });
    setRoot(nextRoot);
    setBstDirect(null);
    setBstFromBinary(null);
    setMessage("Random binary tree generated.");
  }, [randomSignal]);

  /* ===============================
     RESET TRAVERSAL
  =============================== */
  const resetTraversal = () => {
    setTraversalOutput([]);
    setTraversalType("");
    setIsTraversing(false);
  };

  /* ===============================
     BINARY INSERT (LEVEL ORDER)
  =============================== */
  const insertBinary = () => {
    if (!input.trim()) return;

    const result = parseNumber(input);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    const value = result.value;
    const newNode = { value, left: null, right: null };

    if (!root) {
      setRoot(newNode);
      setInput("");
      logOperation?.("Tree insert", `${value} inserted as root`);
      return;
    }

    const queue = [root];

    while (queue.length) {
      const current = queue.shift();

      if (!current.left) {
        current.left = newNode;
        break;
      } else queue.push(current.left);

      if (!current.right) {
        current.right = newNode;
        break;
      } else queue.push(current.right);
    }

    setRoot({ ...root });
    setInput("");
    logOperation?.("Tree insert", `${value} inserted level-order`);
  };

  /* ===============================
     BST INSERT (Standalone)
  =============================== */
  const insertBST = () => {
    if (!input.trim()) return;

    const result = parseNumber(input);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    const value = result.value;

    const insertNode = (node, value) => {
      if (!node) return { value, left: null, right: null };

      if (value < node.value)
        node.left = insertNode(node.left, value);
      else if (value > node.value)
        node.right = insertNode(node.right, value);

      return node;
    };

    setBstDirect((prev) => insertNode(prev, value));
    setInput("");
    logOperation?.("BST insert", `${value} inserted in logarithmic BST`);
  };

  /* ===============================
     BUILD BST FROM BINARY
  =============================== */
  const buildBSTFromBinary = () => {
    if (!root) return;

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

      if (value < node.value)
        node.left = insertNode(node.left, value);
      else if (value > node.value)
        node.right = insertNode(node.right, value);

      return node;
    };

    values.forEach((v) => {
      newBST = insertNode(newBST, v);
    });

    setBstFromBinary(newBST);
    setShowBST(true);
    setMessage("Binary tree values re-indexed into a valid Binary Search Tree (BST).");
    logOperation?.("Build BST", "BST created from binary tree values");
  };

  /* ===============================
     DELETE (BST STYLE)
  =============================== */
  const deleteNode = async () => {
    if (!input.trim()) return;

    const result = parseNumber(input);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    const value = result.value;
    setDeletingValue(value);
    setMessage(`Deleting ${value}...`);

    await new Promise((res) => setTimeout(res, speed));

    const remove = (node, value) => {
      if (!node) return null;

      if (value < node.value)
        node.left = remove(node.left, value);
      else if (value > node.value)
        node.right = remove(node.right, value);
      else {
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let successor = node.right;
        while (successor.left)
          successor = successor.left;

        node.value = successor.value;
        node.right = remove(node.right, successor.value);
      }

      return node;
    };

    if (treeMode === "binary")
      setRoot((prev) => remove(prev, value));
    else
      setBstDirect((prev) => remove(prev, value));

    setDeletingValue(null);
    setInput("");
    setMessage(`Deleted ${value}`);
    logOperation?.("Tree delete", `${value} deleted`);
  };

  /* ===============================
     TRAVERSAL
  =============================== */
  const startTraversal = async (type) => {
    const currentRoot =
      treeMode === "binary"
        ? root
        : bstDirect;

    if (!currentRoot) {
      setMessage("Cannot traverse an empty tree.");
      return;
    }

    resetTraversal();
    setTraversalType(type);
    setIsTraversing(true);

    const result = [];

    const delay = () =>
      new Promise((res) => setTimeout(res, speed));

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
    logOperation?.("Tree traversal", `${type.toUpperCase()} traversal completed`);
  };

  const getTraversalExplanation = () => {
    switch (traversalType) {
      case "inorder":
        return "Inorder (LNR): Left Subtree ➔ Current Node ➔ Right Subtree. (Yields ascending sorted values on a BST!)";
      case "preorder":
        return "Preorder (NLR): Current Node ➔ Left Subtree ➔ Right Subtree. (Used in tree serialization/cloning)";
      case "postorder":
        return "Postorder (LRN): Left Subtree ➔ Right Subtree ➔ Current Node. (Used in bottom-up syntax tree evaluation/deletion)";
      default:
        return "";
    }
  };

  /* ===============================
     RENDER TREE
  =============================== */
  const renderTree = (node) => {
    if (!node) return null;

    const isDeleting = node.value === deletingValue;
    const isVisitedInTraversal = traversalOutput.includes(node.value);

    return (
      <div className="tree-node modern-tree-node">
        <div
          className={`tree-circle modern-tree-circle ${isDeleting ? "deleting" : ""} ${
            isVisitedInTraversal ? "visited-traversal" : ""
          }`}
        >
          <span className="tree-node-val">{node.value}</span>
        </div>

        {(node.left || node.right) && (
          <div className="tree-children modern-tree-children">
            <div className="tree-branch-col">
              {node.left ? renderTree(node.left) : <div className="tree-null-placeholder" />}
            </div>
            <div className="tree-branch-col">
              {node.right ? renderTree(node.right) : <div className="tree-null-placeholder" />}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="visualizer-card modern-card">
      <div className="visualizer-card-header modern-header">
        <div>
          <span className="modern-eyebrow">Hierarchical Index Structure</span>
          <h2 className="modern-title">Tree & Binary Search Tree Visualizer</h2>
          <p className="modern-desc">
            Multi-level branching structure guaranteeing logarithmic O(log n) lookups, power of database indexes and DOM trees.
          </p>
        </div>
      </div>

      {/* MODE SWITCH */}
      <div className="ds-buttons modern-pill-switch">
        <button
          className={`pill-switch-btn ${treeMode === "binary" ? "active" : ""}`}
          onClick={() => {
            setTreeMode("binary");
            resetTraversal();
          }}
        >
          Binary Tree (Level-Order)
        </button>

        <button
          className={`pill-switch-btn ${treeMode === "bst" ? "active" : ""}`}
          onClick={() => {
            setTreeMode("bst");
            resetTraversal();
          }}
        >
          Binary Search Tree (O(log n) Partition)
        </button>
      </div>

      {/* CONTROLS */}
      <div className="stack-controls modern-controls">
        <input
          type="text"
          placeholder="Enter number (e.g. 45)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (treeMode === "binary" ? insertBinary() : insertBST())}
        />

        {treeMode === "binary" && (
          <>
            <button className="ctrl-btn-primary" onClick={insertBinary}>Insert Level-Order</button>
            <button className="ctrl-btn-accent" onClick={buildBSTFromBinary}>
              Convert to BST
            </button>
            <button className="ctrl-btn-secondary" onClick={() => setShowBST(!showBST)}>
              {showBST ? "Hide Converted BST" : "Show Converted BST"}
            </button>
          </>
        )}

        {treeMode === "bst" && (
          <button className="ctrl-btn-primary" onClick={insertBST}>Insert in BST (O(log n))</button>
        )}

        <button className="ctrl-btn-danger" onClick={deleteNode}>
          Delete Node
        </button>
      </div>

      {/* TRAVERSAL ENGINE */}
      <div className="traversal-control-bar">
        <div className="traversal-label-group">
          <span className="traversal-bar-title">Traversal Algorithms:</span>
        </div>
        <div className="traversal-btn-group">
          <button
            className={`traversal-btn ${traversalType === "inorder" ? "active" : ""}`}
            disabled={isTraversing}
            onClick={() => startTraversal("inorder")}
          >
            Inorder (LNR)
          </button>
          <button
            className={`traversal-btn ${traversalType === "preorder" ? "active" : ""}`}
            disabled={isTraversing}
            onClick={() => startTraversal("preorder")}
          >
            Preorder (NLR)
          </button>
          <button
            className={`traversal-btn ${traversalType === "postorder" ? "active" : ""}`}
            disabled={isTraversing}
            onClick={() => startTraversal("postorder")}
          >
            Postorder (LRN)
          </button>
        </div>
      </div>

      {/* TRAVERSAL EXPLANATION */}
      {traversalType && (
        <div className="traversal-explanation-banner">
          <span className="expl-tag">Pattern</span>
          <p>{getTraversalExplanation()}</p>
        </div>
      )}

      {/* TRAVERSAL OUTPUT STREAM */}
      {traversalOutput.length > 0 && (
        <div className="traversal-stream-row">
          <span className="stream-label">Traversal Stream:</span>
          <div className="stream-pills">
            {traversalOutput.map((val, idx) => (
              <span key={idx} className="stream-node-chip">
                {val}
                {idx < traversalOutput.length - 1 && <span className="chip-arrow">➔</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TREE CANVAS DISPLAY */}
      <div className="tree-canvas-stage">
        {treeMode === "binary" && (
          <>
            <div className="tree-container">
              {root ? renderTree(root) : <div className="empty-tree-state">Binary Tree is empty. Insert nodes above.</div>}
            </div>

            {showBST && (
              <div className="bst-converted-section">
                <div className="section-divider-title">
                  <span>Converted Binary Search Tree (Sorted Invariants)</span>
                </div>
                <div className="tree-container">
                  {bstFromBinary ? (
                    renderTree(bstFromBinary)
                  ) : (
                    <div className="empty-tree-state">Click "Convert to BST" above</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {treeMode === "bst" && (
          <div className="tree-container">
            {bstDirect ? renderTree(bstDirect) : <div className="empty-tree-state">BST is empty. Insert values to partition.</div>}
          </div>
        )}
      </div>

      {message && <p className="message modern-message">{message}</p>}
    </div>
  );
}

export default TreeVisualizer;
