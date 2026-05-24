/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import ControlPanel from "./ControlPanel";
import VisualizerCard from "./VisualizerCard";
import { popStack, pushStack } from "../lib/stackOps";

function StackVisualizer({ resetSignal, randomSignal, logOperation }) {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Push values to inspect LIFO behavior.");
  const [poppingIndex, setPoppingIndex] = useState(null);

  useEffect(() => {
    setStack([]);
    setInput("");
    setPoppingIndex(null);
    setMessage("Stack reset.");
  }, [resetSignal]);

  useEffect(() => {
    const sample = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 90) + 10));
    setStack(sample);
    setMessage("Random stack generated.");
  }, [randomSignal]);

  const handlePush = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to push.");
      return;
    }

    setStack((prev) => pushStack(prev, input));
    setInput("");
    setMessage(`Pushed ${input}. The newest value becomes the top.`);
    logOperation?.("Push", `${input} added to stack`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage("Stack underflow: there is no top value to pop.");
      return;
    }

    const lastIndex = stack.length - 1;
    setPoppingIndex(lastIndex);

    setTimeout(() => {
      setStack((prev) => popStack(prev).next);
      setPoppingIndex(null);
    }, 200);

    setMessage(`Popped ${stack[lastIndex]} from the top.`);
    logOperation?.("Pop", `${stack[lastIndex]} removed from stack`);
  };

  return (
    <VisualizerCard
      eyebrow="Core structure"
      title="Stack Visualizer"
      description="Stack follows LIFO: the last value inserted is the first value removed."
    >
      <ControlPanel className="stack-controls">
        <input
          type="text"
          value={input}
          placeholder="Enter value"
          onChange={(event) => setInput(event.target.value)}
        />
        <button onClick={handlePush}>Push</button>
        <button onClick={handlePop}>Pop</button>
      </ControlPanel>

      <div className="stack-container">
        <span className="label">Top</span>
        <div className="stack-box">
          {stack.length === 0 ? (
            <div className="empty">Stack is empty</div>
          ) : (
            [...stack].reverse().map((item, index) => {
              const realIndex = stack.length - 1 - index;

              return (
                <div
                  key={`${item}-${realIndex}`}
                  className={`stack-item ${realIndex === poppingIndex ? "popping" : ""}`}
                >
                  {item}
                </div>
              );
            })
          )}
        </div>
        <span className="label">Bottom</span>
      </div>

      <p className="message">{message}</p>
    </VisualizerCard>
  );
}

export default StackVisualizer;
