export const dataStructures = {
  array: {
    id: "array",
    label: "Array",
    group: "Core",
    description: "Indexed collection with contiguous-style access patterns.",
    accent: "#2563eb",
    definition: "A linear structure that stores values by index and makes direct access fast.",
    topics: ["Static Array", "Dynamic Array", "Multidimensional Array"],
    complexity: { access: "O(1)", search: "O(n)", insertion: "O(n)", deletion: "O(n)" }
  },
  linkedlist: {
    id: "linkedlist",
    label: "Linked List",
    group: "Core",
    description: "Pointer-based sequence for dynamic insertions.",
    accent: "#0891b2",
    definition: "A node-based sequence where each node stores data and one or more references.",
    topics: ["Singly Linked List", "Doubly Linked List", "Circular Linked List"],
    complexity: { access: "O(n)", search: "O(n)", insertion: "O(1)", deletion: "O(1)" }
  },
  stack: {
    id: "stack",
    label: "Stack",
    group: "Core",
    description: "LIFO structure for scoped, reversible workflows.",
    accent: "#7c3aed",
    definition: "A last-in-first-out structure used in recursion, parsing, and undo flows.",
    topics: ["Array Stack", "Linked List Stack"],
    complexity: { push: "O(1)", pop: "O(1)", peek: "O(1)" }
  },
  queue: {
    id: "queue",
    label: "Queue",
    group: "Core",
    description: "FIFO scheduling model with multiple queue variants.",
    accent: "#16a34a",
    definition: "A first-in-first-out structure used for scheduling and breadth-first traversal.",
    topics: ["Simple Queue", "Circular Queue", "Deque", "Priority Queue"],
    complexity: { enqueue: "O(1)", dequeue: "O(1)", peek: "O(1)" }
  },
  tree: {
    id: "tree",
    label: "Tree",
    group: "Core",
    description: "Hierarchical nodes with traversal and search behavior.",
    accent: "#ea580c",
    definition: "A hierarchical structure for representing parent-child relationships.",
    topics: ["Binary Tree", "Binary Search Tree", "AVL Tree", "Heap", "Trie"],
    complexity: { insertion: "O(log n)", deletion: "O(log n)", traversal: "O(n)" }
  },
  searchsort: {
    id: "searchsort",
    label: "Search and Sort",
    group: "Algorithms",
    description: "Binary search plus classic comparison sorting algorithms.",
    accent: "#db2777",
    definition: "Core algorithms for finding values and arranging data efficiently.",
    topics: ["Binary Search", "Bubble Sort", "Merge Sort", "Quick Sort"],
    complexity: {
      "binary search": "O(log n)",
      "bubble sort": "O(n^2)",
      "merge sort": "O(n log n)",
      "quick sort": "O(n log n) average"
    }
  },
  graph: {
    id: "graph",
    label: "Graph",
    group: "Algorithms",
    description: "Traversal and shortest-path algorithms on a weighted network.",
    accent: "#0d9488",
    definition: "A set of nodes connected by edges, useful for networks, routing, and dependencies.",
    topics: ["BFS", "DFS", "Dijkstra"],
    complexity: { bfs: "O(V + E)", dfs: "O(V + E)", dijkstra: "O((V + E) log V)" }
  },
  heap: {
    id: "heap",
    label: "Heap",
    group: "Advanced",
    description: "Priority structure with insert and extract-max operations.",
    accent: "#9333ea",
    definition: "A complete tree stored as an array where the parent keeps priority over children.",
    topics: ["Max Heap", "Min Heap", "Priority Queue"],
    complexity: { insert: "O(log n)", extract: "O(log n)", peek: "O(1)" }
  }
};

export const dataStructureList = Object.values(dataStructures);
