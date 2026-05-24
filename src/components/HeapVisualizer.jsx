/* eslint-disable react-hooks/immutability */
import { useEffect, useMemo, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { buildMaxHeap } from "../lib/heapOps";
import { parseNumber } from "../lib/validation";

const heapCode = [
  "insert value at the end",
  "compare with parent",
  "swap while child is greater than parent",
  "for extract, swap root with last value",
  "remove last value",
  "heapify down from root"
];

const sampleHeap = [90, 72, 61, 44, 35, 28, 18];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function HeapVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [heap, setHeap] = useState(sampleHeap);
  const [input, setInput] = useState("64");
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [message, setMessage] = useState("Max heap keeps the largest value at the root.");
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
        y: levels === 1 ? 50 : 16 + level * 24
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
    setMessage("Random heap data generated.");
  }, [randomSignal]);

  const resetHeap = () => {
    setHeap(sampleHeap);
    setInput("64");
    setActiveIndexes([]);
    setActiveLine(null);
    setIsRunning(false);
    setMessage("Heap reset to sample data.");
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
    await setStep(0, [child], `${value} inserted at the next open array slot.`);

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      await setStep(1, [parent, child], `Compare child ${next[child]} with parent ${next[parent]}.`);
      if (next[parent] >= next[child]) break;
      [next[parent], next[child]] = [next[child], next[parent]];
      setHeap([...next]);
      await setStep(2, [parent, child], "Swap to restore max heap order.");
      child = parent;
    }

    setActiveIndexes([]);
    setIsRunning(false);
    logOperation("Heap insert", `Inserted ${value}`);
  };

  const extractMax = async () => {
    if (!heap.length) {
      setMessage("Heap is empty.");
      return;
    }

    setIsRunning(true);
    const next = [...heap];
    const max = next[0];
    await setStep(3, [0, next.length - 1], `Swap root ${max} with the last value.`);
    [next[0], next[next.length - 1]] = [next[next.length - 1], next[0]];
    setHeap([...next]);

    next.pop();
    setHeap([...next]);
    await setStep(4, [0], `${max} removed from the heap.`);

    let parent = 0;
    while (true) {
      const left = parent * 2 + 1;
      const right = parent * 2 + 2;
      let largest = parent;

      if (left < next.length && next[left] > next[largest]) largest = left;
      if (right < next.length && next[right] > next[largest]) largest = right;
      await setStep(5, [parent, left, right].filter((index) => index < next.length), "Heapify down checks children.");

      if (largest === parent) break;
      [next[parent], next[largest]] = [next[largest], next[parent]];
      setHeap([...next]);
      parent = largest;
    }

    setActiveIndexes([]);
    setIsRunning(false);
    logOperation("Extract max", `Removed ${max}`);
  };

  return (
    <div className="visualizer-layout">
      <VisualizerCard
        eyebrow="Advanced structure"
        title="Max Heap"
        actions={(
          <>
            <button onClick={insertValue} disabled={isRunning}>Insert</button>
            <button onClick={extractMax} disabled={isRunning}>Extract Max</button>
          </>
        )}
      >

        <ControlPanel className="control-grid">
          <label>
            Value
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isRunning}
            />
          </label>
        </ControlPanel>

        <svg className="heap-stage" viewBox="0 0 640 360" role="img" aria-label="Max heap tree">
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
                  className="heap-edge"
                />
              );
            });
          })}

          {heap.map((value, index) => (
            <g key={`${value}-${index}`}>
              <circle
                cx={`${positions[index].x}%`}
                cy={`${positions[index].y}%`}
                r="23"
                className={activeIndexes.includes(index) ? "heap-node active" : "heap-node"}
              />
              <text
                x={`${positions[index].x}%`}
                y={`${positions[index].y}%`}
                className="heap-label"
              >
                {value}
              </text>
            </g>
          ))}
        </svg>

        <div className="array-strip">
          {heap.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className={activeIndexes.includes(index) ? "active" : ""}
            >
              {value}
            </span>
          ))}
        </div>

        <p className="message">{message}</p>
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
