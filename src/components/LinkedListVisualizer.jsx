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

        <div className="ds-buttons modern-pill-switch">
          {["singly", "doubly", "circular"].map((type) => (
            <button
              key={type}
              className={`pill-switch-btn ${listType === type ? "active" : ""}`}
              onClick={() => setListType(type)}
              disabled={isRunning}
            >
              {type === "singly" && "Singly Linked"}
              {type === "doubly" && "Doubly Linked (LRU Cache)"}
              {type === "circular" && "Circular Ring"}
            </button>
          ))}
        </div>

        <div className="stack-controls modern-controls">
          <input
            type="text"
            placeholder="Enter node value"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={isRunning}
            onKeyDown={(e) => e.key === "Enter" && insertEnd()}
          />
          <button className="ctrl-btn-primary" onClick={insertFront} disabled={isRunning}>Insert Head</button>
          <button className="ctrl-btn-primary" onClick={insertEnd} disabled={isRunning}>Insert Tail</button>
          <button className="ctrl-btn-danger" onClick={deleteValue} disabled={isRunning}>Delete Value</button>
          <button className="ctrl-btn-accent" onClick={reverseList} disabled={isRunning}>Reverse Pointers</button>
        </div>

        {listType === "circular" && (
          <div className="circular-indicator-modern">
            <span className="ring-pulse" /> Tail cyclic reference loops back to Head node.
          </div>
        )}

        <div className="linked-list-stage">
          <div className="linked-list-scroll-box">
            {list.length === 0 ? (
              <div className="empty-state-modern">Linked list is empty. Add a node above.</div>
            ) : (
              list.map((node, index) => {
                const isHead = index === 0;
                const isTail = index === list.length - 1;
                const isActive = activeIndex === index;

                return (
                  <div className="ll-node-wrapper-modern" key={`${node.value}-${index}`}>
                    {/* Head / Tail Pointer Flags */}
                    <div className="ll-pointer-flags">
                      {isHead && <span className="pointer-flag head-flag">HEAD</span>}
                      {isTail && <span className="pointer-flag tail-flag">TAIL</span>}
                    </div>

                    {listType === "doubly" && isHead && (
                      <div className="dll-null-badge">NULL</div>
                    )}

                    <div className={`ll-node-box ${listType === "doubly" ? "doubly" : "singly"} ${isActive ? "active-node" : ""}`}>
                      {listType === "doubly" && (
                        <div className="node-partition prev-partition">prev*</div>
                      )}
                      <div className="node-partition val-partition">
                        <span className="node-val">{node.value}</span>
                        <span className="node-meta-addr">0x{node.value.charCodeAt(0)?.toString(16) || "4"}A</span>
                      </div>
                      <div className="node-partition next-partition">next*</div>
                    </div>

                    {/* Arrow Connection */}
                    {!isTail && (
                      <div className="ll-connector">
                        {listType === "doubly" ? (
                          <div className="bi-directional-arrow">
                            <span className="arrow-left">‹──</span>
                            <span className="arrow-right">──›</span>
                          </div>
                        ) : (
                          <span className="single-arrow">──▶</span>
                        )}
                      </div>
                    )}

                    {listType === "circular" && isTail && list.length > 1 && (
                      <div className="circular-return-arrow">
                        <span>⤴ [cycles back to Head]</span>
                      </div>
                    )}

                    {listType === "doubly" && isTail && (
                      <div className="dll-null-badge">NULL</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <p className="message modern-message">{message}</p>
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
