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
    logOperation?.("BST insert", `${value} inserted`);
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
    setMessage("BST built from Binary Tree");
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

    if (!currentRoot) return;

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
    logOperation?.("Tree traversal", `${type} traversal completed`);
  };

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
            backgroundColor: isDeleting ? "#ff4d4d" : "#2563eb",
            transition: "0.3s"
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
      
      <h2>Tree Visualizer</h2>

      {/* MODE SWITCH */}
      <div className="ds-buttons">
        <button
          className={treeMode === "binary" ? "active" : ""}
          onClick={() => {
            setTreeMode("binary");
            resetTraversal();
          }}
        >
          Binary Tree
        </button>

        <button
          className={treeMode === "bst" ? "active" : ""}
          onClick={() => {
            setTreeMode("bst");
            resetTraversal();
          }}
        >
          BST
        </button>
      </div>

      {/* CONTROLS */}
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

        <button
          onClick={deleteNode}
          style={{ backgroundColor: "#e74c3c" }}
        >
          Delete
        </button>
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

      {/* TRAVERSAL EXPLANATION */}
      {traversalType && (
        <div className="message" style={{ marginTop: "15px" }}>
          {getTraversalExplanation()}
        </div>
      )}

      {/* TREE DISPLAY */}
      {treeMode === "binary" && (
        <>
          <div className="tree-container">
            {root ? renderTree(root) : <div className="empty">Binary Tree is empty</div>}
          </div>

          {showBST && (
            <>
              <h3 style={{ marginTop: "30px" }}>
                BST Built From Binary
              </h3>
              <div className="tree-container">
                {bstFromBinary
                  ? renderTree(bstFromBinary)
                  : <div className="empty">Build BST first</div>}
              </div>
            </>
          )}
        </>
      )}

      {treeMode === "bst" && (
        <div className="tree-container">
          {bstDirect
            ? renderTree(bstDirect)
            : <div className="empty">BST is empty</div>}
        </div>
      )}

      {/* TRAVERSAL OUTPUT */}
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
