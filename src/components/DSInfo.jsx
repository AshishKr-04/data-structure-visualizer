function DSInfo({ activeDS, onVisualize }) {

  const getInfo = () => {
    switch (activeDS) {

      case "array":
        return {
          title: "Array",
          definition:
            "An Array is a linear data structure that stores elements in contiguous memory locations.",
          types: [
            "Static Array",
            "Dynamic Array",
            "Multidimensional Array"
          ],
          complexity: {
            access: "O(1)",
            search: "O(n)",
            insertion: "O(n)",
            deletion: "O(n)"
          }
        };

      case "linkedlist":
        return {
          title: "Linked List",
          definition:
            "A Linked List is a linear structure where elements are connected using pointers.",
          types: [
            "Singly Linked List",
            "Doubly Linked List",
            "Circular Linked List"
          ],
          complexity: {
            access: "O(n)",
            search: "O(n)",
            insertion: "O(1)",
            deletion: "O(1)"
          }
        };

      case "stack":
        return {
          title: "Stack",
          definition:
            "A Stack is a linear data structure that follows LIFO (Last In First Out).",
          types: [
            "Array-based Stack",
            "Linked List Stack"
          ],
          complexity: {
            push: "O(1)",
            pop: "O(1)",
            peek: "O(1)"
          }
        };

      case "queue":
        return {
          title: "Queue",
          definition:
            "A Queue follows FIFO (First In First Out).",
          types: [
            "Simple Queue",
            "Circular Queue",
            "Deque",
            "Priority Queue"
          ],
          complexity: {
            enqueue: "O(1)",
            dequeue: "O(1)"
          }
        };

      case "tree":
        return {
          title: "Tree",
          definition:
            "A Tree is a hierarchical data structure consisting of nodes.",
          types: [
            "Binary Tree",
            "Binary Search Tree",
            "AVL Tree",
            "Heap",
            "Trie"
          ],
          complexity: {
            insertion: "O(log n)",
            deletion: "O(log n)",
            traversal: "O(n)"
          }
        };

      default:
        return {};
    }
  };

  const info = getInfo();

  return (
    <div className="info-card">
      <h2>{info.title}</h2>

      <p>{info.definition}</p>

      <h3>Types</h3>
      <ul>
        {info.types?.map((type, index) => (
          <li key={index}>{type}</li>
        ))}
      </ul>

      <h3>Time Complexity</h3>
      <ul>
        {Object.entries(info.complexity || {}).map(([key, value]) => (
          <li key={key}>
            <strong>{key}</strong> : {value}
          </li>
        ))}
      </ul>

      <button 
        className="visualize-btn"
        onClick={onVisualize}
      >
        🚀 Visualize Data Structure
      </button>
    </div>
  );
}

export default DSInfo;
