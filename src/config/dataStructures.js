export const dataStructures = {
  array: {
    id: "array",
    label: "Array",
    group: "Core",
    badge: "Linear / Contiguous",
    description: "Indexed collection with direct O(1) memory access via pointer arithmetic.",
    accent: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    definition: "A contiguous block of memory where elements of uniform type are addressed by numeric indices, maximizing CPU L1/L2 cache line hits.",
    topics: ["Static Array", "Dynamic Array", "Multidimensional", "Ring Buffer"],
    spaceComplexity: "O(n)",
    complexity: { access: "O(1)", search: "O(n)", insertion: "O(n)", deletion: "O(n)" },
    bestWorst: { best: "O(1) append/read", worst: "O(n) shift on unshift" },
    interviewTips: "Emphasize spatial cache locality during technical interviews: contiguous memory yields rapid sequential read benchmarks over linked structures.",
    realWorldUses: [
      { name: "CPU Cache & RAM Locality", desc: "Sequential memory addresses trigger CPU hardware prefetchers." },
      { name: "OS Network Ring Buffers", desc: "Linux kernel packet rings (AF_PACKET) use fixed-size cyclic array buffers." },
      { name: "V8 ArrayBuffer & WebGL", desc: "TypedArrays directly map byte buffers for high-performance GPU vertex shader streams." }
    ],
    industryCompanies: ["Google", "Apple", "Nvidia", "Meta"]
  },
  linkedlist: {
    id: "linkedlist",
    label: "Linked List",
    group: "Core",
    badge: "Linear / Disjoint",
    description: "Pointer-connected nodes offering dynamic O(1) head/tail insertions without memory reallocation.",
    accent: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
    definition: "A dynamic linear sequence where each node encapsulates data alongside forward/backward memory pointers, bypassing rigid allocation limits.",
    topics: ["Singly Linked", "Doubly Linked", "Circular Linked", "Skip List"],
    spaceComplexity: "O(n)",
    complexity: { access: "O(n)", search: "O(n)", insertion: "O(1)", deletion: "O(1)" },
    bestWorst: { best: "O(1) prepend/append with pointer", worst: "O(n) traversal access" },
    interviewTips: "Classic interview pattern: fast & slow two-pointer technique for cycle detection (Floyd's algorithm) and mid-point partition.",
    realWorldUses: [
      { name: "LRU Cache Architecture", desc: "Doubly linked list coupled with a Hash Map enables O(1) eviction in Redis & Memcached." },
      { name: "Browser Session History", desc: "Back & forward tab navigation stacks dynamically link URLs." },
      { name: "OS Memory Free Lists", desc: "Kernel memory allocators (glibc malloc) chain released memory chunks in intrusive lists." }
    ],
    industryCompanies: ["Amazon", "Uber", "Salesforce", "Microsoft"]
  },
  stack: {
    id: "stack",
    label: "Stack",
    group: "Core",
    badge: "LIFO Primitive",
    description: "Last-In, First-Out sequence essential for recursive call stacks, parsing, and state history.",
    accent: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    definition: "A constrained linear container adhering strictly to LIFO semantics, powering state restoration and syntax validation in compiler frontends.",
    topics: ["Array Stack", "Linked Stack", "Monotonic Stack", "Call Stack"],
    spaceComplexity: "O(n)",
    complexity: { push: "O(1)", pop: "O(1)", peek: "O(1)" },
    bestWorst: { best: "O(1) all operations", worst: "O(n) reallocation on dynamic resize" },
    interviewTips: "Monotonic stacks solve 'Next Greater Element' and 'Histogram Maximum Area' in linear O(N) runtime.",
    realWorldUses: [
      { name: "V8 JavaScript Call Stack", desc: "Tracks active execution contexts, stack frames, lexical environments, and return pointers." },
      { name: "Compiler AST Parsing", desc: "Shunting-yard algorithm evaluates mathematical expressions and validates balanced delimiters." },
      { name: "Undo / Redo Engines", desc: "Figma and Google Docs command-pattern transaction managers maintain dual undo/redo stacks." }
    ],
    industryCompanies: ["Microsoft", "Adobe", "Figma", "Stripe"]
  },
  queue: {
    id: "queue",
    label: "Queue",
    group: "Core",
    badge: "FIFO Primitive",
    description: "First-In, First-Out buffer ensuring ordered scheduling, stream buffering, and level-order traversal.",
    accent: "#10b981",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    definition: "A sequential container enforcing First-In First-Out dispatch, coordinating asynchronous workload processing between decoupled producers and consumers.",
    topics: ["Simple Queue", "Circular Ring", "Deque (Double-Ended)", "Priority Queue"],
    spaceComplexity: "O(n)",
    complexity: { enqueue: "O(1)", dequeue: "O(1)", peek: "O(1)" },
    bestWorst: { best: "O(1) enqueue/dequeue", worst: "O(n) search" },
    interviewTips: "Double-ended queues (deque) provide O(1) operations at both boundaries, crucial for sliding window maximum problems.",
    realWorldUses: [
      { name: "Message Brokers (Kafka/RabbitMQ)", desc: "Guarantees FIFO order partitioned message streaming across distributed microservices." },
      { name: "Web Server Request Backlog", desc: "Nginx and Node.js libuv event loop queue incoming TCP socket connections." },
      { name: "Graph BFS Traversal", desc: "Maintains level-by-level frontier nodes in pathfinding and web crawler engines." }
    ],
    industryCompanies: ["Netflix", "LinkedIn", "Uber", "Spotify"]
  },
  tree: {
    id: "tree",
    label: "Tree & BST",
    group: "Core",
    badge: "Hierarchical",
    description: "Multi-level branching structure guaranteeing logarithmic O(log n) lookups in balanced states.",
    accent: "#f97316",
    gradient: "linear-gradient(135deg, #f97316, #c2410c)",
    definition: "A connected, acyclic graph featuring a single root node where children maintain hierarchical relationships, forming the foundation of database indexing.",
    topics: ["Binary Tree", "Binary Search Tree", "AVL / Red-Black", "Trie", "B-Tree"],
    spaceComplexity: "O(n)",
    complexity: { insertion: "O(log n)", deletion: "O(log n)", traversal: "O(n)" },
    bestWorst: { best: "O(log n) balanced depth", worst: "O(n) degenerate linked chain" },
    interviewTips: "Remember that Inorder Traversal on a valid BST always yields strictly sorted values.",
    realWorldUses: [
      { name: "Database B+ Tree Indexing", desc: "PostgreSQL & MySQL InnoDB store table indexes in multi-way balanced B+ trees on disk." },
      { name: "DOM & React Fiber Tree", desc: "Browser HTML elements and React Virtual DOM reconciliation diff hierarchical node trees." },
      { name: "Trie Typeahead Autocomplete", desc: "Prefix trees power Google search suggestion and dictionary lookups in O(length) time." }
    ],
    industryCompanies: ["Google", "Oracle", "MongoDB", "Meta"]
  },
  searchsort: {
    id: "searchsort",
    label: "Search & Sort",
    group: "Algorithms",
    badge: "Algorithm Suite",
    description: "Benchmark comparison sorting (O(n log n)) and logarithmic binary search partitioning.",
    accent: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899, #be185d)",
    definition: "Core computational algorithmic paradigms spanning divide-and-conquer (Merge/Quick) and interval halving (Binary Search).",
    topics: ["Binary Search", "Bubble Sort", "Merge Sort (Stable)", "Quick Sort (In-Place)"],
    spaceComplexity: "O(1) to O(n)",
    complexity: {
      "binary search": "O(log n)",
      "bubble sort": "O(n²)",
      "merge sort": "O(n log n)",
      "quick sort": "O(n log n) avg"
    },
    bestWorst: { best: "O(n log n) Merge/Quick", worst: "O(n²) Quick worst-case on poor pivot" },
    interviewTips: "Merge Sort is stable and preferred for linked lists/external sorting; Quick Sort is cache-friendly and in-place.",
    realWorldUses: [
      { name: "V8 Timsort Engine", desc: "JavaScript Array.prototype.sort uses an adaptive hybrid of Merge Sort & Insertion Sort." },
      { name: "Log Binary Search in Distributed Logs", desc: "Datadog and Elasticsearch quickly isolate timestamp log records via binary range scans." },
      { name: "Database External Merge Sort", desc: "Sorts terabytes of query records that exceed available RAM by streaming disk runs." }
    ],
    industryCompanies: ["Amazon", "Databricks", "Cloudflare", "Palantir"]
  },
  graph: {
    id: "graph",
    label: "Graph",
    group: "Algorithms",
    badge: "Network Topology",
    description: "Non-linear network of vertices connected by weighted or directed relationship edges.",
    accent: "#14b8a6",
    gradient: "linear-gradient(135deg, #14b8a6, #0f766e)",
    definition: "A set of vertices V coupled with edges E modelling interconnected dependencies, transportation routes, circuit design, and social networks.",
    topics: ["BFS & DFS", "Dijkstra Shortest Path", "Topological Sort", "A* Search", "MST"],
    spaceComplexity: "O(V + E)",
    complexity: { bfs: "O(V + E)", dfs: "O(V + E)", dijkstra: "O((V + E) log V)" },
    bestWorst: { best: "O(1) edge check in adj-matrix", worst: "O(V + E) exhaustive search" },
    interviewTips: "Use BFS for unweighted shortest paths; use Dijkstra with Min-Heap priority queue for non-negative weighted graphs.",
    realWorldUses: [
      { name: "Google Maps / Uber Routing", desc: "Contraction hierarchies & bidirectional Dijkstra compute fastest route across city meshes." },
      { name: "Social Graph (Meta / LinkedIn)", desc: "Breadth-first search identifies mutual friends and degrees of connection separation." },
      { name: "NPM / Webpack Dependency Graph", desc: "Topological sorting resolves package build dependencies without circular deadlocks." }
    ],
    industryCompanies: ["Uber", "Google", "Meta", "Lyft"]
  },
  heap: {
    id: "heap",
    label: "Heap & Priority",
    group: "Advanced",
    badge: "Priority Tree",
    description: "Complete binary tree satisfying the heap invariant, providing instant O(1) extremum extraction.",
    accent: "#a855f7",
    gradient: "linear-gradient(135deg, #a855f7, #7e22ce)",
    definition: "An array-backed complete binary tree guaranteeing parent nodes maintain dominance over children, optimizing priority stream scheduling.",
    topics: ["Max Heap", "Min Heap", "Heap Sort", "Priority Queue", "Binomial Heap"],
    spaceComplexity: "O(n)",
    complexity: { insert: "O(log n)", extract: "O(log n)", peek: "O(1)" },
    bestWorst: { best: "O(1) peek max/min", worst: "O(log n) sift-up / sift-down" },
    interviewTips: "Two-heap pattern (Min-Heap + Max-Heap) solves the classic 'Find Median from Data Stream' in O(1) query time.",
    realWorldUses: [
      { name: "Linux OS Task Scheduler", desc: "Completely Fair Scheduler (CFS) leverages priority structures to balance CPU quantum slices." },
      { name: "Dijkstra Path Optimization", desc: "Indexed min-heaps accelerate neighbor node relaxation from O(V²) down to O((V + E) log V)." },
      { name: "Top-K Frequent Stream Metrics", desc: "Real-time analytics pipelines track trending Twitter topics and top streaming video chunks." }
    ],
    industryCompanies: ["Apple", "Netflix", "Twitter/X", "ByteDance"]
  }
};

export const dataStructureList = Object.values(dataStructures);

