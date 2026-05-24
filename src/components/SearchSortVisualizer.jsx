import { useEffect, useMemo, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { parseNumber, parseNumberList } from "../lib/validation";
import { binarySearch } from "../lib/sortSearchOps";

const algorithms = {
  binary: {
    label: "Binary Search",
    code: [
      "sort values",
      "left = 0, right = n - 1",
      "while left <= right",
      "mid = floor((left + right) / 2)",
      "if values[mid] is target, return mid",
      "if values[mid] < target, move left",
      "else move right"
    ]
  },
  bubble: {
    label: "Bubble Sort",
    code: [
      "for each pass",
      "compare adjacent values",
      "swap if left value is greater",
      "largest unsettled value moves right",
      "stop when no swaps occur"
    ]
  },
  merge: {
    label: "Merge Sort",
    code: [
      "split array into halves",
      "sort the left half",
      "sort the right half",
      "merge smaller values first",
      "copy merged result back"
    ]
  },
  quick: {
    label: "Quick Sort",
    code: [
      "choose pivot",
      "scan values around pivot",
      "move smaller values left",
      "place pivot in final position",
      "repeat for left and right partitions"
    ]
  }
};

const sampleValues = [42, 12, 68, 21, 9, 55, 31, 74];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function SearchSortVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [values, setValues] = useState(sampleValues);
  const [input, setInput] = useState(sampleValues.join(", "));
  const [target, setTarget] = useState("31");
  const [algorithm, setAlgorithm] = useState("binary");
  const [activeLine, setActiveLine] = useState(null);
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [sortedIndexes, setSortedIndexes] = useState([]);
  const [message, setMessage] = useState("Choose an algorithm and run it.");
  const [isRunning, setIsRunning] = useState(false);

  const maxValue = useMemo(() => Math.max(...values, 1), [values]);

  useEffect(() => {
    resetLab();
  }, [resetSignal]);

  useEffect(() => {
    const next = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    setValues(next);
    setInput(next.join(", "));
    setTarget(String(next[Math.floor(next.length / 2)]));
    setActiveLine(null);
    setActiveIndexes([]);
    setSortedIndexes([]);
    setMessage("Random data loaded.");
  }, [randomSignal]);

  const resetLab = () => {
    setValues(sampleValues);
    setInput(sampleValues.join(", "));
    setTarget("31");
    setActiveLine(null);
    setActiveIndexes([]);
    setSortedIndexes([]);
    setIsRunning(false);
    setMessage("Lab reset to sample data.");
  };

  const parseInput = () => {
    const parsed = parseNumberList(input, 2);

    if (!parsed.ok) {
      setMessage(parsed.error);
      return null;
    }

    setValues(parsed.value);
    setActiveIndexes([]);
    setSortedIndexes([]);
    setMessage("Input applied.");
    return parsed.value;
  };

  const setStep = async (line, indexes, text) => {
    setActiveLine(line);
    setActiveIndexes(indexes);
    setMessage(text);
    await wait(speed);
  };

  const runBinarySearch = async (sourceValues) => {
    const targetResult = parseNumber(target, "Target");
    if (!targetResult.ok) {
      setMessage(targetResult.error);
      return;
    }

    const needle = targetResult.value;
    const { sorted } = binarySearch(sourceValues, needle);
    setValues(sorted);
    await setStep(0, [], "Binary search needs sorted data.");

    let left = 0;
    let right = sorted.length - 1;
    await setStep(1, [left, right], `Search window starts from ${left} to ${right}.`);

    while (left <= right) {
      await setStep(2, [left, right], "The search window is still valid.");
      const mid = Math.floor((left + right) / 2);
      await setStep(3, [mid], `Checking middle index ${mid}.`);

      if (sorted[mid] === needle) {
        await setStep(4, [mid], `Found ${needle} at index ${mid}.`);
        setSortedIndexes([mid]);
        logOperation("Binary search", `Found ${needle} at index ${mid}`);
        return;
      }

      if (sorted[mid] < needle) {
        left = mid + 1;
        await setStep(5, [left, right], `${sorted[mid]} is smaller, move left bound.`);
      } else {
        right = mid - 1;
        await setStep(6, [left, right], `${sorted[mid]} is larger, move right bound.`);
      }
    }

    setMessage(`${needle} was not found.`);
    logOperation("Binary search", `${needle} was not found`);
  };

  const runBubbleSort = async (sourceValues) => {
    const arr = [...sourceValues];
    await setStep(0, [], "Starting bubble sort passes.");

    for (let i = 0; i < arr.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        await setStep(1, [j, j + 1], `Compare ${arr[j]} and ${arr[j + 1]}.`);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setValues([...arr]);
          swapped = true;
          await setStep(2, [j, j + 1], "Values swapped.");
        }
      }
      setSortedIndexes((prev) => [...prev, arr.length - i - 1]);
      await setStep(3, [arr.length - i - 1], "Largest unsettled value is fixed.");
      if (!swapped) break;
    }

    setSortedIndexes(arr.map((_, index) => index));
    await setStep(4, [], "Array is sorted.");
    logOperation("Bubble sort", `Sorted ${arr.length} values`);
  };

  const runMergeSort = async (sourceValues) => {
    const arr = [...sourceValues];

    const mergeSort = async (start, end) => {
      if (start >= end) return;

      const mid = Math.floor((start + end) / 2);
      await setStep(0, [start, end], `Split indexes ${start} to ${end}.`);
      await setStep(1, [start, mid], "Sort the left half.");
      await mergeSort(start, mid);
      await setStep(2, [mid + 1, end], "Sort the right half.");
      await mergeSort(mid + 1, end);

      const merged = [];
      let left = start;
      let right = mid + 1;
      await setStep(3, [left, right], "Merge the two sorted halves.");

      while (left <= mid && right <= end) {
        if (arr[left] <= arr[right]) merged.push(arr[left++]);
        else merged.push(arr[right++]);
      }

      while (left <= mid) merged.push(arr[left++]);
      while (right <= end) merged.push(arr[right++]);

      merged.forEach((value, offset) => {
        arr[start + offset] = value;
      });
      setValues([...arr]);
      await setStep(4, Array.from({ length: end - start + 1 }, (_, i) => start + i), "Merged result copied back.");
    };

    await mergeSort(0, arr.length - 1);
    setSortedIndexes(arr.map((_, index) => index));
    logOperation("Merge sort", `Sorted ${arr.length} values`);
  };

  const runQuickSort = async (sourceValues) => {
    const arr = [...sourceValues];

    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      await setStep(0, [high], `Pivot selected: ${pivot}.`);

      for (let j = low; j < high; j++) {
        await setStep(1, [j, high], `Compare ${arr[j]} with pivot ${pivot}.`);
        if (arr[j] < pivot) {
          i += 1;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setValues([...arr]);
          await setStep(2, [i, j], "Smaller value moved left.");
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setValues([...arr]);
      await setStep(3, [i + 1], "Pivot placed in final position.");
      return i + 1;
    };

    const quickSort = async (low, high) => {
      if (low < high) {
        const pivotIndex = await partition(low, high);
        await setStep(4, [low, pivotIndex - 1], "Sort left partition.");
        await quickSort(low, pivotIndex - 1);
        await setStep(4, [pivotIndex + 1, high], "Sort right partition.");
        await quickSort(pivotIndex + 1, high);
      }
    };

    await quickSort(0, arr.length - 1);
    setSortedIndexes(arr.map((_, index) => index));
    logOperation("Quick sort", `Sorted ${arr.length} values`);
  };

  const runAlgorithm = async () => {
    const sourceValues = parseInput();
    if (!sourceValues) return;
    setIsRunning(true);
    setSortedIndexes([]);

    if (algorithm === "binary") await runBinarySearch(sourceValues);
    if (algorithm === "bubble") await runBubbleSort(sourceValues);
    if (algorithm === "merge") await runMergeSort(sourceValues);
    if (algorithm === "quick") await runQuickSort(sourceValues);

    setActiveIndexes([]);
    setIsRunning(false);
  };

  return (
    <div className="visualizer-layout">
      <VisualizerCard
        eyebrow="Search and sorting"
        title={algorithms[algorithm].label}
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
              {Object.entries(algorithms).map(([key, item]) => (
                <option key={key} value={key}>{item.label}</option>
              ))}
            </select>
          </label>

          <label>
            Values
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isRunning}
            />
          </label>

          {algorithm === "binary" && (
            <label>
              Target
              <input
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                disabled={isRunning}
              />
            </label>
          )}
        </ControlPanel>

        <div className="bar-stage">
          {values.map((value, index) => (
            <div className="bar-column" key={`${value}-${index}`}>
              <div
                className={[
                  "bar",
                  activeIndexes.includes(index) ? "active" : "",
                  sortedIndexes.includes(index) ? "sorted" : ""
                ].join(" ")}
                style={{ height: `${Math.max(18, (value / maxValue) * 220)}px` }}
              />
              <span>{value}</span>
            </div>
          ))}
        </div>

        <p className="message">{message}</p>
      </VisualizerCard>

      <AlgorithmTrace
        title={algorithms[algorithm].label}
        steps={algorithms[algorithm].code}
        activeLine={activeLine}
        explanation={message}
      />
    </div>
  );
}

export default SearchSortVisualizer;
