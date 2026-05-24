/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { deleteFirstMatch, insertAtEnd, reverseWithSwaps } from "../lib/arrayOps";

const reverseCode = [
  "left = 0, right = n - 1",
  "while left < right",
  "swap values at left and right",
  "move left forward",
  "move right backward"
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function ArrayVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [array, setArray] = useState(["12", "24", "36", "48"]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Insert, delete, or reverse the array.");
  const [activeIndexes, setActiveIndexes] = useState([]);
  const [activeLine, setActiveLine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setArray([]);
    setInput("");
    setActiveIndexes([]);
    setActiveLine(null);
    setMessage("Array reset.");
  }, [resetSignal]);

  useEffect(() => {
    const sample = Array.from({ length: 6 }, () => String(Math.floor(Math.random() * 90) + 10));
    setArray(sample);
    setActiveIndexes([]);
    setActiveLine(null);
    setMessage("Random array generated.");
  }, [randomSignal]);

  const insertElement = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to insert.");
      return;
    }

    setArray((prev) => insertAtEnd(prev, input));
    setInput("");
    setMessage(`${input} inserted at index ${array.length}.`);
    logOperation?.("Array insert", `${input} inserted at index ${array.length}`);
  };

  const deleteElement = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to delete.");
      return;
    }

    const index = array.indexOf(input);
    if (index === -1) {
      setMessage(`${input} was not found.`);
      return;
    }

    setArray((prev) => deleteFirstMatch(prev, input).next);
    setInput("");
    setMessage(`${input} deleted from index ${index}.`);
    logOperation?.("Array delete", `${input} deleted from index ${index}`);
  };

  const setStep = async (line, indexes, text) => {
    setActiveLine(line);
    setActiveIndexes(indexes);
    setMessage(text);
    await wait(speed);
  };

  const reverseArray = async () => {
    if (array.length <= 1) {
      setMessage("Nothing to reverse.");
      return;
    }

    setIsRunning(true);
    const { next, swaps } = reverseWithSwaps(array);
    let left = 0;
    let right = next.length - 1;
    await setStep(0, [left, right], "Two pointers start at both ends.");

    for (const swap of swaps) {
      await setStep(1, [swap.left, swap.right], `Compare positions ${swap.left} and ${swap.right}.`);
      setArray(swap.after);
      await setStep(2, [swap.left, swap.right], "Values swapped.");
      left += 1;
      await setStep(3, [left], "Left pointer moves forward.");
      right -= 1;
      await setStep(4, [right], "Right pointer moves backward.");
    }

    setActiveIndexes([]);
    setIsRunning(false);
    setMessage("Array reversed successfully.");
    logOperation?.("Array reverse", `Reversed ${next.length} values`);
  };

  return (
    <div className="visualizer-layout">
      <VisualizerCard
        eyebrow="Core structure"
        title="Array Visualizer"
        description="An array stores values by index, making direct access efficient."
      >
        <ControlPanel className="stack-controls">
          <input
            type="text"
            placeholder="Enter value"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isRunning}
          />
          <button onClick={insertElement} disabled={isRunning}>Insert</button>
          <button onClick={deleteElement} disabled={isRunning}>Delete</button>
          <button onClick={reverseArray} disabled={isRunning}>Reverse</button>
        </ControlPanel>

        <div className="queue-container">
          <span className="label">Array</span>
          <div className="queue-box">
            {array.length === 0 ? (
              <div className="empty">Array is empty</div>
            ) : (
              array.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={`queue-item ${activeIndexes.includes(index) ? "active" : ""}`}
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        <p className="message">{message}</p>
      </VisualizerCard>

      <AlgorithmTrace
        title="Reverse Array"
        steps={reverseCode}
        activeLine={activeLine}
        explanation={message}
      />
    </div>
  );
}

export default ArrayVisualizer;
