/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import AlgorithmTrace from "./AlgorithmTrace";

const reverseCode = [
  "previous = null",
  "current = head",
  "store next node",
  "point current.next to previous",
  "move previous and current forward",
  "previous becomes new head"
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function LinkedListVisualizer({ speed, resetSignal, randomSignal, logOperation }) {
  const [listType, setListType] = useState("singly");
  const [list, setList] = useState([{ value: "18" }, { value: "32" }, { value: "47" }]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("Linked lists trade direct access for flexible insertion.");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeLine, setActiveLine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setList([]);
    setInput("");
    setActiveIndex(null);
    setActiveLine(null);
    setMessage("Linked list reset.");
  }, [resetSignal]);

  useEffect(() => {
    const sample = Array.from({ length: 4 }, () => ({ value: String(Math.floor(Math.random() * 90) + 10) }));
    setList(sample);
    setActiveIndex(null);
    setActiveLine(null);
    setMessage("Random linked list generated.");
  }, [randomSignal]);

  const insertFront = () => {
    if (!input.trim()) {
      setMessage("Enter a value.");
      return;
    }
    setList((prev) => [{ value: input }, ...prev]);
    setMessage(`${input} inserted at the head.`);
    logOperation?.("List insert front", `${input} inserted at head`);
    setInput("");
  };

  const insertEnd = () => {
    if (!input.trim()) {
      setMessage("Enter a value.");
      return;
    }
    setList((prev) => [...prev, { value: input }]);
    setMessage(`${input} inserted at the tail.`);
    logOperation?.("List insert end", `${input} inserted at tail`);
    setInput("");
  };

  const deleteValue = () => {
    const index = list.findIndex((node) => node.value === input);
    if (!input.trim() || index === -1) {
      setMessage("Enter an existing value to delete.");
      return;
    }
    setList((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
    setMessage(`${input} deleted from node ${index}.`);
    logOperation?.("List delete", `${input} deleted`);
    setInput("");
  };

  const setStep = async (line, index, text) => {
    setActiveLine(line);
    setActiveIndex(index);
    setMessage(text);
    await wait(speed);
  };

  const reverseList = async () => {
    if (list.length <= 1) {
      setMessage("Nothing to reverse.");
      return;
    }

    setIsRunning(true);
    await setStep(0, null, "Previous starts as null.");
    await setStep(1, 0, "Current starts at the head.");

    const reversed = [];
    for (let index = list.length - 1; index >= 0; index--) {
      await setStep(2, index, `Store next link before changing node ${index}.`);
      reversed.push(list[index]);
      await setStep(3, index, "Pointer direction is reversed.");
      setList([...reversed, ...list.slice(0, index)]);
      await setStep(4, index, "Move to the next original node.");
    }

    setList(reversed);
    await setStep(5, 0, "New head is the previous tail.");
    setActiveIndex(null);
    setIsRunning(false);
    logOperation?.("List reverse", `Reversed ${reversed.length} nodes`);
  };

  const definition = {
    singly: "Each node points to the next node.",
    doubly: "Each node points to both previous and next nodes.",
    circular: "The tail points back to the head."
  }[listType];

  return (
    <div className="visualizer-layout">
      <section className="stack-card">
        <h2>Linked List Visualizer</h2>

        <div className="stack-definition">
          <h4>Definition</h4>
          <p>{definition}</p>
        </div>

        <div className="ds-buttons">
          {["singly", "doubly", "circular"].map((type) => (
            <button
              key={type}
              className={listType === type ? "active" : ""}
              onClick={() => setListType(type)}
              disabled={isRunning}
            >
              {type[0].toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="stack-controls">
          <input
            type="text"
            placeholder="Enter value"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isRunning}
          />
          <button onClick={insertFront} disabled={isRunning}>Insert Front</button>
          <button onClick={insertEnd} disabled={isRunning}>Insert End</button>
          <button onClick={deleteValue} disabled={isRunning}>Delete</button>
          <button onClick={reverseList} disabled={isRunning}>Reverse</button>
        </div>

        {listType === "circular" && (
          <div className="circular-indicator">Tail links back to head.</div>
        )}

        <div className={listType === "doubly" ? "dll-container" : "linked-list"}>
          {list.length === 0 ? (
            <div className="empty">Linked list is empty</div>
          ) : (
            list.map((node, index) => (
              <div className="ll-node-wrapper" key={`${node.value}-${index}`}>
                {listType === "doubly" && index === 0 && <span className="dll-null">NULL</span>}
                <div className={listType === "doubly" ? "dll-node" : "ll-node"}>
                  {listType === "doubly" ? (
                    <>
                      <span className="dll-part">prev</span>
                      <span className={`dll-value ${activeIndex === index ? "active" : ""}`}>{node.value}</span>
                      <span className="dll-part">next</span>
                    </>
                  ) : (
                    <span className={activeIndex === index ? "active-node" : ""}>{node.value}</span>
                  )}
                </div>
                {index !== list.length - 1 && (
                  <span className="ll-arrow">{listType === "doubly" ? "<->" : "->"}</span>
                )}
                {listType === "circular" && index === list.length - 1 && list.length > 1 && (
                  <span className="circular-arrow">{"-> head"}</span>
                )}
                {listType === "doubly" && index === list.length - 1 && <span className="dll-null">NULL</span>}
              </div>
            ))
          )}
        </div>

        <p className="message">{message}</p>
      </section>

      <AlgorithmTrace
        title="Reverse Linked List"
        steps={reverseCode}
        activeLine={activeLine}
        explanation={message}
      />
    </div>
  );
}

export default LinkedListVisualizer;
