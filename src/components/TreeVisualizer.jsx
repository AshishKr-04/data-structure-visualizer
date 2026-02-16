import { useState } from "react";

function TreeVisualizer() {
  const [treeMode, setTreeMode] = useState("binary"); // binary | bst
  const [root, setRoot] = useState(null); // Binary Tree
  const [bstFromBinary, setBstFromBinary] = useState(null);
  const [bstDirect, setBstDirect] = useState(null);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [showBST, setShowBST] = useState(false);

  const [deletingValue, setDeletingValue] = useState(null);

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
     INSERT BINARY TREE (LEVEL ORDER)
  ========================================= */
  const insertBinary = () => {
    if (!input.trim()) return;

    const value = Number(input);
    const newNode = { value, left: null, right: null };

    if (!root) {
      setRoot(newNode);
      setInput("");
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
    setMessage(`Inserted ${value} in Binary Tree`);
  };

  /* =========================================
     DELETE BINARY TREE
  ========================================= */
  const deleteBinary = async () => {
    if (!input.trim()) return;

    const value = Number(input);
    if (!root) return;

    setDeletingValue(value);
    setMessage(`Deleting ${value}...`);

    await new Promise((res) => setTimeout(res, 800));

    let nodeToDelete = null;
    let deepestNode = null;
    let parentOfDeepest = null;

    const queue = [{ node: root, parent: null }];

    while (queue.length) {
      const { node, parent } = queue.shift();

      if (node.value === value) nodeToDelete = node;

      if (node.left) queue.push({ node: node.left, parent: node });
      if (node.right) queue.push({ node: node.right, parent: node });

      deepestNode = node;
      parentOfDeepest = parent;
    }

    if (!nodeToDelete) {
      setDeletingValue(null);
      setMessage("Value not found");
      return;
    }

    nodeToDelete.value = deepestNode.value;

    if (parentOfDeepest) {
      if (parentOfDeepest.left === deepestNode)
        parentOfDeepest.left = null;
      else parentOfDeepest.right = null;
    } else setRoot(null);

    setRoot({ ...root });
    setDeletingValue(null);
    setInput("");
    setMessage(`Deleted ${value}`);
  };

  /* =========================================
     INSERT BST
  ========================================= */
  const insertBST = () => {
    if (!input.trim()) return;

    const value = Number(input);

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
    setMessage(`Inserted ${value} in BST`);
  };

  /* =========================================
     DELETE BST
  ========================================= */
  const deleteBST = async () => {
    if (!input.trim()) return;

    const value = Number(input);
    if (!bstDirect) return;

    setDeletingValue(value);
    setMessage(`Deleting ${value}...`);

    await new Promise((res) => setTimeout(res, 800));

    const deleteNode = (node, value) => {
      if (!node) return null;

      if (value < node.value)
        node.left = deleteNode(node.left, value);
      else if (value > node.value)
        node.right = deleteNode(node.right, value);
      else {
        if (!node.left && !node.right) return null;
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let successor = node.right;
        while (successor.left) successor = successor.left;

        node.value = successor.value;
        node.right = deleteNode(node.right, successor.value);
      }
      return node;
    };

    setBstDirect((prev) => deleteNode(prev, value));
    setDeletingValue(null);
    setInput("");
    setMessage(`Deleted ${value}`);
  };

  /* =========================================
     BUILD BST FROM BINARY
  ========================================= */
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
  };

  /* =========================================
     TRAVERSALS
  ========================================= */
  const startTraversal = async (type) => {
    const currentRoot =
      treeMode === "binary" ? root : bstDirect;

    if (!currentRoot) return;

    resetTraversal();
    setTraversalType(type);
    setIsTraversing(true);

    const result = [];
    const delay = () =>
      new Promise((res) => setTimeout(res, 500));

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
     TREE RENDER
  ========================================= */
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
      <h2>Tree Visualizer</h2>

      <div className="ds-buttons">
        <button
          className={treeMode === "binary" ? "active" : ""}
          onClick={() => {
            setTreeMode("binary");
            resetTraversal();
            setShowBST(false);
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

      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {treeMode === "binary" && (
          <>
            <button onClick={insertBinary}>Insert</button>
            <button onClick={deleteBinary} style={{ background: "#e74c3c" }}>
              Delete
            </button>
            <button onClick={buildBSTFromBinary}>
              Build BST
            </button>
            <button onClick={() => setShowBST(!showBST)}>
              {showBST ? "Hide BST" : "Show BST"}
            </button>
          </>
        )}

        {treeMode === "bst" && (
          <>
            <button onClick={insertBST}>Insert</button>
            <button onClick={deleteBST} style={{ background: "#e74c3c" }}>
              Delete
            </button>
          </>
        )}
      </div>

      <div className="ds-buttons">
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

      {treeMode === "binary" && (
        <>
          <div className="tree-container">
            {root ? renderTree(root) : <div className="empty">Binary Tree is empty</div>}
          </div>

          {showBST && (
            <>
              <h3>BST (From Binary)</h3>
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
          {bstDirect ? renderTree(bstDirect) : <div className="empty">BST is empty</div>}
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
