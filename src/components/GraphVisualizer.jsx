/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { buildAdjacency } from "../lib/graphOps";

const graphAlgorithms = {
  bfs: {
    label: "Breadth First Search",
    code: [
      "create queue with start node",
      "mark start as visited",
      "while queue is not empty",
      "remove front node",
      "visit each unvisited neighbor",
      "push neighbor into queue"
    ]
  },
  dfs: {
    label: "Depth First Search",
    code: [
      "start from selected node",
      "mark node as visited",
      "for each neighbor",
      "if neighbor is unvisited",
      "recursively visit neighbor"
    ]
  },
  dijkstra: {
    label: "Dijkstra",
    code: [
      "set all distances to infinity",
      "distance[start] = 0",
      "choose unvisited node with smallest distance",
      "relax each outgoing edge",
      "update distance if shorter path is found",
      "repeat until all reachable nodes are settled"
    ]
  }
};

const nodePositions = {
  A: { x: 50, y: 42 },
  B: { x: 190, y: 28 },
  C: { x: 185, y: 145 },
  D: { x: 335, y: 62 },
  E: { x: 355, y: 178 },
  F: { x: 500, y: 110 }
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
  const [message, setMessage] = useState("Run a graph algorithm to inspect traversal.");
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
    setMessage("Graph reset to sample network.");
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
    await setStep(0, startNode, null, `Queue starts with ${startNode}.`);
    await setStep(1, startNode, null, `${startNode} is marked visited.`);

    while (queue.length) {
      await setStep(2, queue[0], null, `Queue: ${queue.join(", ")}.`);
      const current = queue.shift();
      await setStep(3, current, null, `Visiting ${current}.`);

      for (const neighbor of adjacency[current] || []) {
        await setStep(4, neighbor.node, [current, neighbor.node], `Check neighbor ${neighbor.node}.`);
        if (!seen.has(neighbor.node)) {
          seen.add(neighbor.node);
          queue.push(neighbor.node);
          setVisited([...seen]);
          await setStep(5, neighbor.node, [current, neighbor.node], `${neighbor.node} added to queue.`);
        }
      }
    }

    logOperation("BFS", `Visited ${[...seen].join(" -> ")}`);
  };

  const runDfs = async (adjacency) => {
    const seen = new Set();

    const visit = async (node) => {
      await setStep(0, node, null, `DFS enters ${node}.`);
      seen.add(node);
      setVisited([...seen]);
      await setStep(1, node, null, `${node} marked visited.`);

      for (const neighbor of adjacency[node] || []) {
        await setStep(2, neighbor.node, [node, neighbor.node], `Inspect ${neighbor.node}.`);
        if (!seen.has(neighbor.node)) {
          await setStep(3, neighbor.node, [node, neighbor.node], `${neighbor.node} is unvisited.`);
          await setStep(4, neighbor.node, [node, neighbor.node], `Recursing into ${neighbor.node}.`);
          await visit(neighbor.node);
        }
      }
    };

    await visit(startNode);
    logOperation("DFS", `Visited ${[...seen].join(" -> ")}`);
  };

  const runDijkstra = async (adjacency) => {
    const nodes = Object.keys(nodePositions);
    const dist = Object.fromEntries(nodes.map((node) => [node, Infinity]));
    const settled = new Set();
    dist[startNode] = 0;
    setDistances({ ...dist });
    await setStep(0, null, null, "All distances start at infinity.");
    await setStep(1, startNode, null, `${startNode} distance is 0.`);

    while (settled.size < nodes.length) {
      const current = nodes
        .filter((node) => !settled.has(node))
        .sort((a, b) => dist[a] - dist[b])[0];

      if (!current || dist[current] === Infinity) break;
      settled.add(current);
      setVisited([...settled]);
      await setStep(2, current, null, `${current} has the smallest temporary distance.`);

      for (const neighbor of adjacency[current] || []) {
        await setStep(3, neighbor.node, [current, neighbor.node], `Relax edge ${current}-${neighbor.node}.`);
        const candidate = dist[current] + neighbor.weight;
        if (candidate < dist[neighbor.node]) {
          dist[neighbor.node] = candidate;
          setDistances({ ...dist });
          await setStep(4, neighbor.node, [current, neighbor.node], `Distance to ${neighbor.node} becomes ${candidate}.`);
        }
      }
    }

    await setStep(5, null, null, "Shortest distances are settled.");
    logOperation("Dijkstra", `Computed paths from ${startNode}`);
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
    <div className="visualizer-layout">
      <VisualizerCard
        eyebrow="Graph algorithms"
        title={graphAlgorithms[algorithm].label}
        actions={(
          <button onClick={runAlgorithm} disabled={isRunning}>
            {isRunning ? "Running" : "Run"}
          </button>
        )}
      >

        <ControlPanel className="control-grid">
          <label>
            Algorithm
            <select
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value)}
              disabled={isRunning}
            >
              {Object.entries(graphAlgorithms).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </label>

          <label>
            Start node
            <select
              value={startNode}
              onChange={(event) => setStartNode(event.target.value)}
              disabled={isRunning}
            >
              {Object.keys(nodePositions).map((node) => (
                <option key={node} value={node}>{node}</option>
              ))}
            </select>
          </label>
        </ControlPanel>

        <svg className="graph-stage" viewBox="0 0 560 240" role="img" aria-label="Weighted graph">
          {edges.map(([from, to, weight]) => {
            const start = nodePositions[from];
            const end = nodePositions[to];
            return (
              <g key={`${from}-${to}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  className={isActiveEdge(from, to) ? "graph-edge active" : "graph-edge"}
                />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 - 6}
                  className="edge-label"
                >
                  {weight}
                </text>
              </g>
            );
          })}

          {Object.entries(nodePositions).map(([node, position]) => (
            <g key={node}>
              <circle
                cx={position.x}
                cy={position.y}
                r="22"
                className={[
                  "graph-node",
                  visited.includes(node) ? "visited" : "",
                  activeNode === node ? "active" : ""
                ].join(" ")}
              />
              <text x={position.x} y={position.y + 5} className="node-label">
                {node}
              </text>
            </g>
          ))}
        </svg>

        {algorithm === "dijkstra" && (
          <div className="distance-grid">
            {Object.keys(nodePositions).map((node) => (
              <span key={node}>
                {node}: {distances[node] === Infinity || distances[node] == null ? "inf" : distances[node]}
              </span>
            ))}
          </div>
        )}

        <p className="message">{message}</p>
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
