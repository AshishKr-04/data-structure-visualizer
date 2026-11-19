import { useEffect, useMemo, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { parseNumber, parseNumberList } from "../lib/validation";
import { binarySearch } from "../lib/sortSearchOps";

const algorithms = {
  binary: {
    label: "Binary Search",
    complexity: "O(log n)",
    code: [
      "sort values in ascending order",
      "left = 0, right = n - 1",
      "while left <= right",
      "mid = floor((left + right) / 2)",
      "if values[mid] === target, return mid",
      "if values[mid] < target, left = mid + 1",
      "else right = mid - 1"
    ]
  },
  bubble: {
    label: "Bubble Sort",
    complexity: "O(n²)",
    code: [
      "for each outer pass i from 0 to n-1",
      "for each adjacent pair j and j+1",
      "if values[j] > values[j+1], swap them",
      "largest unsettled value bubbles to right",
      "terminate early if zero swaps occurred"
    ]
  },
  merge: {
    label: "Merge Sort",
    complexity: "O(n log n)",
    code: [
      "divide array into left and right halves",
      "recursively sort the left sub-array",
      "recursively sort the right sub-array",
      "merge sorted halves comparing heads",
      "copy merged buffer back to original"
    ]
  },
  quick: {
    label: "Quick Sort",
    complexity: "O(n log n) avg",
    code: [
      "select pivot element (last index)",
      "partition array: elements <= pivot move left",
      "place pivot in its final sorted index",
      "recursively sort left partition",
      "recursively sort right partition"
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
  const [comparisonsCount, setComparisonsCount] = useState(0);
  const [swapsCount, setSwapsCount] = useState(0);
  const [message, setMessage] = useState("Choose an algorithm preset and run it.");
  const [isRunning, setIsRunning] = useState(false);

  const maxValue = useMemo(() => Math.max(...values, 1), [values]);

  useEffect(() => {
    resetLab();
  }, [resetSignal]);

  useEffect(() => {
    applyPreset("random");
  }, [randomSignal]);

  const resetLab = () => {
    setValues(sampleValues);
    setInput(sampleValues.join(", "));
    setTarget("31");
    setActiveLine(null);
    setActiveIndexes([]);
    setSortedIndexes([]);
    setComparisonsCount(0);
    setSwapsCount(0);
    setIsRunning(false);
    setMessage("Lab reset to initial benchmark sample.");
  };

  const applyPreset = (type) => {
    let next = [];
    if (type === "random") {
      next = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    } else if (type === "nearlySorted") {
      next = [10, 18, 25, 33, 48, 42, 65, 80]; // one swap
    } else if (type === "reversed") {
      next = [88, 72, 61, 53, 44, 30, 21, 11]; // worst case
    } else if (type === "fewUnique") {
      next = [15, 45, 15, 80, 45, 15, 80, 45];
    }
    setValues(next);
    setInput(next.join(", "));
    setTarget(String(next[Math.floor(next.length / 2)]));
    setActiveLine(null);
    setActiveIndexes([]);
    setSortedIndexes([]);
    setComparisonsCount(0);
    setSwapsCount(0);
    setMessage(`Applied "${type}" dataset preset.`);
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
    setComparisonsCount(0);
    setSwapsCount(0);
    setMessage("Custom inputs applied.");
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
    let comps = 0;
    await setStep(0, [], "Binary search requires a sorted array.");

    let left = 0;
    let right = sorted.length - 1;
    await setStep(1, [left, right], `Initial search interval: [${left}..${right}].`);

    while (left <= right) {
      comps += 1;
      setComparisonsCount(comps);
      await setStep(2, [left, right], `Valid window: left index ${left}, right index ${right}.`);
      const mid = Math.floor((left + right) / 2);
      await setStep(3, [mid], `Inspecting midpoint index ${mid} (value = ${sorted[mid]}).`);

      if (sorted[mid] === needle) {
        await setStep(4, [mid], `SUCCESS: Target ${needle} matched at index ${mid}!`);
        setSortedIndexes([mid]);
        logOperation("Binary search", `Found ${needle} at index ${mid} in ${comps} comparisons`);
        return;
      }

      if (sorted[mid] < needle) {
        left = mid + 1;
        await setStep(5, [left, right], `${sorted[mid]} < ${needle}: Narrowing to right half.`);
      } else {
        right = mid - 1;
        await setStep(6, [left, right], `${sorted[mid]} > ${needle}: Narrowing to left half.`);
      }
    }

    setMessage(`NOT FOUND: Target ${needle} is absent from array.`);
    logOperation("Binary search", `${needle} not found after ${comps} comparisons`);
  };

  const runBubbleSort = async (sourceValues) => {
    const arr = [...sourceValues];
    let comps = 0;
    let swaps = 0;
    await setStep(0, [], "Starting Bubble Sort passes (O(n²) worst-case).");

    for (let i = 0; i < arr.length - 1; i++) {
      let swapped = false;
      for (let j = 0; j < arr.length - i - 1; j++) {
        comps += 1;
        setComparisonsCount(comps);
        await setStep(1, [j, j + 1], `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}.`);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swaps += 1;
          setSwapsCount(swaps);
          setValues([...arr]);
          swapped = true;
          await setStep(2, [j, j + 1], `Inversion detected! Swapped ${arr[j + 1]} and ${arr[j]}.`);
        }
      }
      setSortedIndexes((prev) => [...prev, arr.length - i - 1]);
      await setStep(3, [arr.length - i - 1], `Position ${arr.length - i - 1} is now in final sorted position.`);
      if (!swapped) break;
    }

    setSortedIndexes(arr.map((_, index) => index));
    await setStep(4, [], `Bubble sort complete! ${comps} comparisons, ${swaps} swaps.`);
    logOperation("Bubble sort", `Sorted ${arr.length} elements (${comps} comps, ${swaps} swaps)`);
  };

  const runMergeSort = async (sourceValues) => {
    const arr = [...sourceValues];
    let comps = 0;
    let writes = 0;

    const mergeSort = async (start, end) => {
      if (start >= end) return;

      const mid = Math.floor((start + end) / 2);
      await setStep(0, [start, end], `Subdividing range [${start}..${end}] at mid ${mid}.`);
      await setStep(1, [start, mid], `Recursing into left partition [${start}..${mid}].`);
      await mergeSort(start, mid);
      await setStep(2, [mid + 1, end], `Recursing into right partition [${mid + 1}..${end}].`);
      await mergeSort(mid + 1, end);

      const merged = [];
      let left = start;
      let right = mid + 1;
      await setStep(3, [left, right], `Merging sorted halves: left [${start}..${mid}] and right [${mid + 1}..${end}].`);

      while (left <= mid && right <= end) {
        comps += 1;
        setComparisonsCount(comps);
        if (arr[left] <= arr[right]) {
          merged.push(arr[left++]);
        } else {
          merged.push(arr[right++]);
        }
      }

      while (left <= mid) merged.push(arr[left++]);
      while (right <= end) merged.push(arr[right++]);

      for (let offset = 0; offset < merged.length; offset++) {
        writes += 1;
        setSwapsCount(writes);
        arr[start + offset] = merged[offset];
      }
      setValues([...arr]);
      await setStep(4, Array.from({ length: end - start + 1 }, (_, i) => start + i), "Merged partition written back to array.");
    };

    await mergeSort(0, arr.length - 1);
    setSortedIndexes(arr.map((_, index) => index));
    logOperation("Merge sort", `Completed in O(n log n) with ${comps} comps and ${writes} writes`);
  };

  const runQuickSort = async (sourceValues) => {
    const arr = [...sourceValues];
    let comps = 0;
    let swaps = 0;

    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      await setStep(0, [high], `Selected pivot = ${pivot} at index ${high}.`);

      for (let j = low; j < high; j++) {
        comps += 1;
        setComparisonsCount(comps);
        await setStep(1, [j, high], `Comparing element ${arr[j]} with pivot ${pivot}.`);
        if (arr[j] < pivot) {
          i += 1;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps += 1;
          setSwapsCount(swaps);
          setValues([...arr]);
          await setStep(2, [i, j], `Moved smaller element ${arr[i]} to index ${i}.`);
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swaps += 1;
      setSwapsCount(swaps);
      setValues([...arr]);
      await setStep(3, [i + 1], `Placed pivot ${pivot} in final sorted position index ${i + 1}.`);
      return i + 1;
    };

    const quickSort = async (low, high) => {
      if (low < high) {
        const pivotIndex = await partition(low, high);
        await setStep(4, [low, pivotIndex - 1], "QuickSort on left sub-partition.");
        await quickSort(low, pivotIndex - 1);
        await setStep(4, [pivotIndex + 1, high], "QuickSort on right sub-partition.");
        await quickSort(pivotIndex + 1, high);
      }
    };

    await quickSort(0, arr.length - 1);
    setSortedIndexes(arr.map((_, index) => index));
    logOperation("Quick sort", `Completed with ${comps} comparisons, ${swaps} swaps`);
  };

  const runAlgorithm = async () => {
    const sourceValues = parseInput();
    if (!sourceValues) return;
    setIsRunning(true);
    setSortedIndexes([]);
    setComparisonsCount(0);
    setSwapsCount(0);

    if (algorithm === "binary") await runBinarySearch(sourceValues);
    if (algorithm === "bubble") await runBubbleSort(sourceValues);
    if (algorithm === "merge") await runMergeSort(sourceValues);
    if (algorithm === "quick") await runQuickSort(sourceValues);

    setActiveIndexes([]);
    setIsRunning(false);
  };

  return (
    <div className="visualizer-layout modern-layout">
      <VisualizerCard
        eyebrow="Divide & Conquer / Comparison Suite"
        title={algorithms[algorithm].label}
        actions={(
          <button className="primary-run-btn" onClick={runAlgorithm} disabled={isRunning}>
            {isRunning ? "Executing..." : "Execute Algorithm"}
          </button>
        )}
      >
        {/* Algorithm & Target Controls */}
        <ControlPanel className="control-grid modern-controls-grid">
          <label>
            Algorithm Model
            <select
              value={algorithm}
              onChange={(event) => setAlgorithm(event.target.value)}
              disabled={isRunning}
            >
              {Object.entries(algorithms).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label} ({item.complexity})
                </option>
              ))}
            </select>
          </label>

          <label>
            Dataset Values (Comma Separated)
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={isRunning}
            />
          </label>

          {algorithm === "binary" && (
            <label>
              Search Target
              <input
                value={target}
                onChange={(event) => setTarget(event.target.value)}
                disabled={isRunning}
              />
            </label>
          )}
        </ControlPanel>

        {/* Dataset Presets Row */}
        <div className="dataset-presets-bar">
          <span className="presets-label">Datasets for Benchmarking:</span>
          <div className="preset-buttons">
            <button disabled={isRunning} onClick={() => applyPreset("random")}>Random</button>
            <button disabled={isRunning} onClick={() => applyPreset("nearlySorted")}>Nearly Sorted</button>
            <button disabled={isRunning} onClick={() => applyPreset("reversed")}>Reversed (Worst)</button>
            <button disabled={isRunning} onClick={() => applyPreset("fewUnique")}>Few Unique</button>
          </div>
        </div>

        {/* Real-time Execution Telemetry Header */}
        <div className="sort-telemetry-header">
          <div className="telemetry-chip">
            <span className="chip-label">Complexity:</span>
            <span className="chip-val highlight">{algorithms[algorithm].complexity}</span>
          </div>
          <div className="telemetry-chip">
            <span className="chip-label">Comparisons:</span>
            <span className="chip-val">{comparisonsCount}</span>
          </div>
          <div className="telemetry-chip">
            <span className="chip-label">Swaps/Writes:</span>
            <span className="chip-val">{swapsCount}</span>
          </div>
        </div>

        {/* Modern Bar Chart Stage */}
        <div className="bar-stage modern-bar-stage">
          {values.map((value, index) => {
            const isActive = activeIndexes.includes(index);
            const isSorted = sortedIndexes.includes(index);
            const heightPercent = Math.max(15, (value / maxValue) * 100);

            return (
              <div className="bar-column-modern" key={`${value}-${index}`}>
                <span className="bar-val-badge">{value}</span>
                <div
                  className={`bar-modern ${isActive ? "active-bar" : ""} ${
                    isSorted ? "sorted-bar" : ""
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="bar-index-label">[{index}]</span>
              </div>
            );
          })}
        </div>

        <p className="message modern-message">{message}</p>
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
