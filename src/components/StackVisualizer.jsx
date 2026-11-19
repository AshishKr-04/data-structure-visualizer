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

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty (underflow on peek).");
      return;
    }
    const topVal = stack[stack.length - 1];
    setMessage(`Peek top element: ${topVal} at index ${stack.length - 1}.`);
    logOperation?.("Peek", `Inspected top element ${topVal}`);
  };

  return (
    <VisualizerCard
      eyebrow="Core LIFO Structure"
      title="Stack Visualizer"
      description="LIFO (Last-In, First-Out) primitive powering recursion, browser history, and parser call stacks."
    >
      <ControlPanel className="stack-controls modern-controls">
        <input
          type="text"
          value={input}
          placeholder="Enter value to push"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePush()}
        />
        <button className="ctrl-btn-primary" onClick={handlePush}>Push (O(1))</button>
        <button className="ctrl-btn-danger" onClick={handlePop}>Pop (O(1))</button>
        <button className="ctrl-btn-secondary" onClick={handlePeek}>Peek Top</button>
      </ControlPanel>

      <div className="stack-canister-stage">
        <div className="canister-telemetry-row">
          <span className="telemetry-pill">Stack Pointer (SP): {stack.length > 0 ? stack.length - 1 : "NULL"}</span>
          <span className="telemetry-pill">Frames Count: {stack.length}</span>
        </div>

        <div className="stack-canister-wrapper">
          <div className="stack-sp-pointer-column">
            {stack.length > 0 && (
              <div className="top-pointer-indicator">
                <span className="sp-text">TOP (SP)</span>
                <span className="sp-arrow">──▶</span>
              </div>
            )}
          </div>

          <div className="stack-glass-canister">
            <div className="canister-rim-top">OPEN TOP (Push / Pop Access)</div>
            <div className="canister-body">
              {stack.length === 0 ? (
                <div className="empty-stack-guide">
                  <span>Stack Empty</span>
                  <small>Push items to grow frames upward</small>
                </div>
              ) : (
                [...stack].reverse().map((item, index) => {
                  const realIndex = stack.length - 1 - index;
                  const isTop = index === 0;

                  return (
                    <div
                      key={`${item}-${realIndex}`}
                      className={`stack-frame-block ${isTop ? "is-top-frame" : ""} ${
                        realIndex === poppingIndex ? "popping" : ""
                      }`}
                    >
                      <div className="frame-meta">
                        <span className="frame-idx">#{realIndex}</span>
                        {isTop && <span className="top-badge">TOP</span>}
                      </div>
                      <span className="frame-value">{item}</span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="canister-base">CLOSED BASE (0x0000)</div>
          </div>
        </div>
      </div>

      <p className="message modern-message">{message}</p>
    </VisualizerCard>
  );
}

export default StackVisualizer;
