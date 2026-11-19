/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { buildAdjacency } from "../lib/graphOps";

const graphAlgorithms = {
  bfs: {
    label: "Breadth First Search (BFS)",
    complexity: "O(V + E)",
    code: [
      "initialize queue with start node",
      "mark start node as visited",
      "while queue is not empty",
      "dequeue current front node",
      "inspect each unvisited neighbor",
      "enqueue unvisited neighbor"
    ]
  },
  dfs: {
    label: "Depth First Search (DFS)",
    complexity: "O(V + E)",
    code: [
      "start traversal from selected node",
      "mark current node as visited",
      "for each outgoing neighbor",
      "if neighbor is not visited yet",
      "recursively branch into neighbor"
    ]
  },
  dijkstra: {
    label: "Dijkstra Shortest Path",
    complexity: "O((V + E) log V)",
    code: [
      "initialize distance[v] = ∞, distance[start] = 0",
      "extract unvisited node with smallest distance",
      "relax each outgoing weighted edge (u, v)",
      "if dist[u] + weight < dist[v], update dist[v]",
      "mark current node as permanently settled",
      "repeat until all nodes are settled"
    ]
  }
};

const nodePositions = {
  A: { x: 55, y: 45 },
  B: { x: 195, y: 32 },
  C: { x: 190, y: 155 },
  D: { x: 345, y: 68 },
  E: { x: 365, y: 185 },
  F: { x: 505, y: 115 }
};

const baseEdges = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "D", 5],
  ["C", "D", 8],
  ["C", "E", 10],
  ["D", "E", 2],
  ["D", "F", 6],
  ["E", "F", 3]
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function GraphVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [algorithm, setAlgorithm] = useState("bfs");
  const [startNode, setStartNode] = useState("A");
  const [edges, setEdges] = useState(baseEdges);
  const [visited, setVisited] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [activeEdge, setActiveEdge] = useState(null);
  const [distances, setDistances] = useState({});
  const [activeLine, setActiveLine] = useState(null);
  const [message, setMessage] = useState("Run a graph traversal to inspect edge relaxations.");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    resetGraph();
  }, [resetSignal]);

  useEffect(() => {
    const shuffled = baseEdges.map(([from, to]) => [
      from,
      to,
      Math.floor(Math.random() * 9) + 1
    ]);
    setEdges(shuffled);
    setVisited([]);
    setDistances({});
    setMessage("Random edge weights generated.");
  }, [randomSignal]);

  const resetGraph = () => {
    setEdges(baseEdges);
    setVisited([]);
    setActiveNode(null);
    setActiveEdge(null);
    setDistances({});
    setActiveLine(null);
    setMessage("Graph reset to standard topology.");
  };

  const setStep = async (line, node, edge, text) => {
    setActiveLine(line);
    setActiveNode(node);
    setActiveEdge(edge);
    setMessage(text);
    await wait(speed);
  };

  const runBfs = async (adjacency) => {
    const queue = [startNode];
    const seen = new Set([startNode]);
    setVisited([startNode]);
    await setStep(0, startNode, null, `Queue initialized with source node ${startNode}.`);
    await setStep(1, startNode, null, `Node ${startNode} marked visited.`);

    while (queue.length) {
      await setStep(2, queue[0], null, `Queue frontier: [${queue.join(", ")}].`);
      const current = queue.shift();
      await setStep(3, current, null, `Visiting node ${current}.`);

      for (const neighbor of adjacency[current] || []) {
        await setStep(4, neighbor.node, [current, neighbor.node], `Inspecting edge (${current} ➔ ${neighbor.node}).`);
        if (!seen.has(neighbor.node)) {
          seen.add(neighbor.node);
          queue.push(neighbor.node);
          setVisited([...seen]);
          await setStep(5, neighbor.node, [current, neighbor.node], `Node ${neighbor.node} marked visited & enqueued.`);
        }
      }
    }

    logOperation("BFS", `Visited order: ${[...seen].join(" ➔ ")}`);
  };

  const runDfs = async (adjacency) => {
    const seen = new Set();

    const visit = async (node) => {
      await setStep(0, node, null, `DFS entering node ${node}.`);
      seen.add(node);
      setVisited([...seen]);
      await setStep(1, node, null, `Node ${node} marked visited.`);

      for (const neighbor of adjacency[node] || []) {
        await setStep(2, neighbor.node, [node, neighbor.node], `Checking branch to ${neighbor.node}.`);
        if (!seen.has(neighbor.node)) {
          await setStep(3, neighbor.node, [node, neighbor.node], `Neighbor ${neighbor.node} is unvisited.`);
          await setStep(4, neighbor.node, [node, neighbor.node], `Recursing into ${neighbor.node}...`);
          await visit(neighbor.node);
        }
      }
    };

    await visit(startNode);
    logOperation("DFS", `Visited order: ${[...seen].join(" ➔ ")}`);
  };

  const runDijkstra = async (adjacency) => {
    const nodes = Object.keys(nodePositions);
    const dist = Object.fromEntries(nodes.map((node) => [node, Infinity]));
    const settled = new Set();
    dist[startNode] = 0;
    setDistances({ ...dist });
    await setStep(0, null, null, `Distances initialized to ∞. Source dist[${startNode}] = 0.`);
    await setStep(1, startNode, null, `Selecting initial vertex ${startNode}.`);

    while (settled.size < nodes.length) {
      const current = nodes
        .filter((node) => !settled.has(node))
        .sort((a, b) => dist[a] - dist[b])[0];

      if (!current || dist[current] === Infinity) break;
      settled.add(current);
      setVisited([...settled]);
      await setStep(2, current, null, `Vertex ${current} has minimum tentative distance (${dist[current]}).`);

      for (const neighbor of adjacency[current] || []) {
        await setStep(3, neighbor.node, [current, neighbor.node], `Edge relaxation on (${current} ➔ ${neighbor.node}, weight ${neighbor.weight}).`);
        const candidate = dist[current] + neighbor.weight;
        if (candidate < dist[neighbor.node]) {
          dist[neighbor.node] = candidate;
          setDistances({ ...dist });
          await setStep(4, neighbor.node, [current, neighbor.node], `Relaxation: dist[${neighbor.node}] improved to ${candidate}!`);
        }
      }
    }

    await setStep(5, null, null, `Dijkstra complete! Shortest paths from ${startNode} settled.`);
    logOperation("Dijkstra", `Computed shortest paths from ${startNode}`);
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    setVisited([]);
    setDistances({});
    const adjacency = buildAdjacency(edges);

    if (algorithm === "bfs") await runBfs(adjacency);
    if (algorithm === "dfs") await runDfs(adjacency);
    if (algorithm === "dijkstra") await runDijkstra(adjacency);

    setActiveNode(null);
    setActiveEdge(null);
    setIsRunning(false);
  };

  const isActiveEdge = (from, to) => {
    if (!activeEdge) return false;
    return activeEdge.includes(from) && activeEdge.includes(to);
  };

  return (
    <div className="visualizer-layout modern-layout">
      <VisualizerCard
        eyebrow="Network Topology & Shortest Path"
        title={graphAlgorithms[algorithm].label}
        actions={(
          <button className="primary-run-btn" onClick={runAlgorithm} disabled={isRunning}>
            {isRunning ? "Traversing..." : "Run Traversal"}
          </button>
        )}
      >
        <ControlPanel className="control-grid modern-controls-grid">
          <label>
            Algorithm Engine
            <select
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value)}
              disabled={isRunning}
            >
              {Object.entries(graphAlgorithms).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.complexity})
                </option>
              ))}
            </select>
          </label>

          <label>
            Source Vertex (Root)
            <select
              value={startNode}
              onChange={(event) => setStartNode(event.target.value)}
              disabled={isRunning}
            >
              {Object.keys(nodePositions).map((node) => (
                <option key={node} value={node}>
                  Vertex {node}
                </option>
              ))}
            </select>
          </label>
        </ControlPanel>

        {/* SVG Network Canvas */}
        <div className="graph-stage-wrapper">
          <svg className="graph-stage modern-graph-stage" viewBox="0 0 570 240" role="img" aria-label="Weighted network graph">
            <defs>
              <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Edges */}
            {edges.map(([from, to, weight]) => {
              const start = nodePositions[from];
              const end = nodePositions[to];
              const active = isActiveEdge(from, to);
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2;

              return (
                <g key={`${from}-${to}`}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    className={`graph-edge-modern ${active ? "active-edge" : ""}`}
                  />
                  {/* Edge Weight Badge */}
                  <rect
                    x={midX - 10}
                    y={midY - 14}
                    width="20"
                    height="16"
                    rx="4"
                    className="edge-weight-bg"
                  />
                  <text
                    x={midX}
                    y={midY - 3}
                    className="edge-weight-label"
                  >
                    {weight}
                  </text>
                </g>
              );
            })}

            {/* Render Vertices */}
            {Object.entries(nodePositions).map(([node, position]) => {
              const isVisited = visited.includes(node);
              const isActive = activeNode === node;
              const isSource = startNode === node;

              return (
                <g key={node} className="node-group">
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="22"
                    className={`graph-node-modern ${isVisited ? "visited-node" : ""} ${
                      isActive ? "active-node" : ""
                    } ${isSource ? "source-node" : ""}`}
                  />
                  <text x={position.x} y={position.y + 5} className="node-label-modern">
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dijkstra Distance Table */}
        {algorithm === "dijkstra" && (
          <div className="dijkstra-distance-bar">
            <span className="dist-title">Shortest Distances from [{startNode}]:</span>
            <div className="distance-grid-modern">
              {Object.keys(nodePositions).map((node) => {
                const d = distances[node];
                const isInfinity = d === Infinity || d == null;
                return (
                  <div key={node} className={`dist-cell ${node === startNode ? "is-source" : ""}`}>
                    <span className="dist-vertex">{node}</span>
                    <span className="dist-val">{isInfinity ? "∞" : d}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="message modern-message">{message}</p>
      </VisualizerCard>

      <AlgorithmTrace
        title={graphAlgorithms[algorithm].label}
        steps={graphAlgorithms[algorithm].code}
        activeLine={activeLine}
        explanation={message}
      />
    </div>
  );
}

export default GraphVisualizer;
