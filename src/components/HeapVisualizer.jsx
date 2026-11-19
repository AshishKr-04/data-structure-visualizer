/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { buildMaxHeap } from "../lib/heapOps";
import { parseNumber } from "../lib/validation";

const heapCode = [
  "insert new value at next open array index",
  "compare child with its parent: parent = floor((i-1)/2)",
  "swap while child > parent (sift-up)",
  "for extract-max: swap root with last leaf element",
  "remove last element from heap array",
  "sift-down from root: swap with largest child"
];

const sampleHeap = [90, 72, 61, 44, 35, 28, 18];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function HeapVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [heap, setHeap] = useState(sampleHeap);
  const [input, setInput] = useState("64");
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [message, setMessage] = useState("Max heap maintains root as greatest element in O(1) peek.");
  const [isRunning, setIsRunning] = useState(false);

  const positions = useMemo(() => {
    const levels = Math.floor(Math.log2(Math.max(heap.length, 1))) + 1;
    return heap.map((_, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const levelStart = 2 ** level - 1;
      const indexInLevel = index - levelStart;
      const nodesInLevel = 2 ** level;
      return {
        x: ((indexInLevel + 1) * 100) / (nodesInLevel + 1),
        y: levels === 1 ? 50 : 18 + level * 26
      };
    });
  }, [heap]);

  useEffect(() => {
    resetHeap();
  }, [resetSignal]);

  useEffect(() => {
    const next = Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 10);
    next.sort((a, b) => b - a);
    setHeap(buildMaxHeap(next));
    setActiveIndexes([]);
    setActiveLine(null);
    setMessage("Random heap tree generated.");
  }, [randomSignal]);

  const resetHeap = () => {
    setHeap(sampleHeap);
    setInput("64");
    setActiveIndexes([]);
    setActiveLine(null);
    setIsRunning(false);
    setMessage("Heap reset to initial sample priority tree.");
  };

  const setStep = async (line, indexes, text) => {
    setActiveLine(line);
    setActiveIndexes(indexes);
    setMessage(text);
    await wait(speed);
  };

  const insertValue = async () => {
    const result = parseNumber(input);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    const value = result.value;
    setIsRunning(true);
    const next = [...heap, value];
    setHeap(next);
    let child = next.length - 1;
    await setStep(0, [child], `Appended ${value} at end index ${child}.`);

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      await setStep(1, [parent, child], `Comparing child ${next[child]} with parent ${next[parent]} at index ${parent}.`);
      if (next[parent] >= next[child]) break;
      [next[parent], next[child]] = [next[child], next[parent]];
      setHeap([...next]);
      await setStep(2, [parent, child], `Swapped ${next[parent]} and ${next[child]} to restore max-heap invariant.`);
      child = parent;
    }

    setActiveIndexes([]);
    setIsRunning(false);
    logOperation("Heap insert", `Inserted ${value} (Sift-Up complete)`);
  };

  const extractMax = async () => {
    if (!heap.length) {
      setMessage("Heap is empty (underflow).");
      return;
    }

    setIsRunning(true);
    const next = [...heap];
    const max = next[0];
    await setStep(3, [0, next.length - 1], `Swapping root max element (${max}) with last leaf (${next[next.length - 1]}).`);
    [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
    setHeap([...next]);

    next.pop();
    setHeap([...next]);
    await setStep(4, [0], `Extracted max value ${max}. Beginning sift-down restoration.`);

    let parent = 0;
    while (true) {
      const left = parent * 2 + 1;
      const right = parent * 2 + 2;
      let largest = parent;

      if (left < next.length && next[left] > next[largest]) largest = left;
      if (right < next.length && next[right] > next[largest]) largest = right;
      await setStep(5, [parent, left, right].filter((index) => index < next.length), "Inspecting children for heap property violation.");

      if (largest === parent) break;
      [next[parent], next[largest]] = [next[largest], next[parent]];
      setHeap([...next]);
      parent = largest;
    }

    setActiveIndexes([]);
    setIsRunning(false);
    logOperation("Extract max", `Extracted ${max} (Sift-Down complete)`);
  };

  return (
    <div className="visualizer-layout modern-layout">
      <VisualizerCard
        eyebrow="Priority Queue & Complete Binary Tree"
        title="Max Heap Visualizer"
        actions={(
          <div className="heap-actions-group">
            <button className="ctrl-btn-primary" onClick={insertValue} disabled={isRunning}>
              Insert (O(log n))
            </button>
            <button className="ctrl-btn-danger" onClick={extractMax} disabled={isRunning}>
              Extract Max (O(log n))
            </button>
          </div>
        )}
      >
        <ControlPanel className="control-grid modern-controls-grid">
          <label>
            Value to Insert
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isRunning}
              placeholder="e.g. 75"
              onKeyDown={(e) => e.key === "Enter" && insertValue()}
            />
          </label>
        </ControlPanel>

        {/* Tree Representation */}
        <div className="heap-canvas-stage">
          <div className="stage-top-indicator">
            <span className="indicator-pill">Tree Structure (Parent Dominance)</span>
            <span className="indicator-pill highlight">Root Extremum: {heap[0] ?? "None"}</span>
          </div>

          <svg className="heap-stage modern-heap-stage" viewBox="0 0 640 360" role="img" aria-label="Max heap complete binary tree">
            {heap.map((_, index) => {
              const left = index * 2 + 1;
              const right = index * 2 + 2;
              return [left, right].map((child) => {
                if (child >= heap.length) return null;
                return (
                  <line
                    key={`${index}-${child}`}
                    x1={`${positions[index].x}%`}
                    y1={`${positions[index].y}%`}
                    x2={`${positions[child].x}%`}
                    y2={`${positions[child].y}%`}
                    className="heap-edge-modern"
                  />
                );
              });
            })}

            {heap.map((value, index) => (
              <g key={`${value}-${index}`}>
                <circle
                  cx={`${positions[index].x}%`}
                  cy={`${positions[index].y}%`}
                  r="24"
                  className={`heap-node-modern ${activeIndexes.includes(index) ? "active-node" : ""} ${
                    index === 0 ? "root-node" : ""
                  }`}
                />
                <text
                  x={`${positions[index].x}%`}
                  y={`${positions[index].y}%`}
                  className="heap-label-modern"
                >
                  {value}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Contiguous Array Mapping */}
        <div className="heap-array-sync-box">
          <div className="sync-box-header">
            <span>Contiguous Array Representation in Memory</span>
            <span className="sync-formula">left = 2i + 1 | right = 2i + 2</span>
          </div>
          <div className="array-strip-modern">
            {heap.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={`heap-array-cell ${activeIndexes.includes(index) ? "active-cell" : ""} ${
                  index === 0 ? "root-cell" : ""
                }`}
              >
                <span className="cell-index">[{index}]</span>
                <span className="cell-val">{value}</span>
                {index === 0 && <span className="cell-tag">MAX</span>}
              </div>
            ))}
          </div>
        </div>

        <p className="message modern-message">{message}</p>
      </VisualizerCard>

      <AlgorithmTrace
        title="Max Heap"
        steps={heapCode}
        activeLine={activeLine}
        explanation={message}
      />
    </div>
  );
}

export default HeapVisualizer;
