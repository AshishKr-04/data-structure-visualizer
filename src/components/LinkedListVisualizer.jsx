import { useState } from "react";

function LinkedListVisualizer() {
    const [listType, setListType] = useState("singly"); // singly | doubly | circular
    const [list, setList] = useState([]);
    const [input, setInput] = useState("");
    const [message, setMessage] = useState("");
    const [isReversing, setIsReversing] = useState(false);

    /* =========================
       INSERT AT FRONT
    ========================= */
    const insertFront = () => {
        if (input.trim() === "") {
            setMessage("Enter a value");
            return;
        }

        setList((prev) => [{ value: input }, ...prev]);
        setInput("");
        setMessage(`Inserted ${input} at front`);
    };

    /* =========================
       INSERT AT END
    ========================= */
    const insertEnd = () => {
        if (input.trim() === "") {
            setMessage("Enter a value");
            return;
        }

        setList((prev) => [...prev, { value: input }]);
        setInput("");
        setMessage(`Inserted ${input} at end`);
    };

    /* =========================
       DELETE BY VALUE
    ========================= */
    const deleteValue = () => {
        if (input.trim() === "") {
            setMessage("Enter value to delete");
            return;
        }

        const index = list.findIndex((node) => node.value === input);
        if (index === -1) {
            setMessage("Value not found");
            return;
        }

        setList((prev) => prev.filter((_, i) => i !== index));
        setInput("");
        setMessage(`Deleted ${input}`);
    };

    /* =========================
       REVERSE (ANIMATED)
    ========================= */
    const reverseList = async () => {
        if (list.length <= 1) {
            setMessage("Nothing to reverse");
            return;
        }

        setIsReversing(true);
        setMessage("Reversing linked list...");

        let temp = [...list];
        let reversed = [];

        for (let i = temp.length - 1; i >= 0; i--) {
            reversed.push(temp[i]);
            setList([...reversed, ...temp.slice(0, i)]);
            await new Promise((res) => setTimeout(res, 500));
        }

        setList(reversed);
        setIsReversing(false);
        setMessage("Linked list reversed");
    };

    /* =========================
       DEFINITIONS
    ========================= */
    const getDefinition = () => {
        switch (listType) {
            case "singly":
                return "A Singly Linked List has nodes pointing to the next node.";
            case "doubly":
                return "A Doubly Linked List has nodes pointing to both previous and next nodes.";
            case "circular":
                return "A Circular Linked List connects the last node back to the first node.";
            default:
                return "";
        }
    };

    return (
        <div className="stack-card">
            <h2>Linked List Visualizer</h2>

            {/* Definition */}
            <div className="stack-definition">
                <h4>Definition</h4>
                <p>{getDefinition()}</p>
            </div>

            {/* Reverse message */}
            {isReversing && (
                <div className="message">Reversing nodes step by step...</div>
            )}

            {/* List Type Selector */}
            <div className="ds-buttons">
                <button
                    className={listType === "singly" ? "active" : ""}
                    onClick={() => setListType("singly")}
                    disabled={isReversing}
                >
                    Singly
                </button>

                <button
                    className={listType === "doubly" ? "active" : ""}
                    onClick={() => setListType("doubly")}
                    disabled={isReversing}
                >
                    Doubly
                </button>

                <button
                    className={listType === "circular" ? "active" : ""}
                    onClick={() => setListType("circular")}
                    disabled={isReversing}
                >
                    Circular
                </button>
            </div>


            {/* Controls */}
            <div className="stack-controls">
                <input
                    type="text"
                    placeholder="Enter value"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isReversing}
                />

                <button onClick={insertFront} disabled={isReversing}>
                    Insert Front
                </button>

                <button onClick={insertEnd} disabled={isReversing}>
                    Insert End
                </button>

                <button onClick={deleteValue} disabled={isReversing}>
                    Delete
                </button>

                <button onClick={reverseList} disabled={isReversing}>
                    Reverse
                </button>
            </div>

            {/* =========================
          SINGLY LINKED LIST
      ========================= */}
            {listType === "singly" && (
                <div className="linked-list">
                    {list.length === 0 ? (
                        <div className="empty">Linked List is empty</div>
                    ) : (
                        list.map((node, index) => (
                            <div key={index} className="ll-node-wrapper">
                                <div className="ll-node">{node.value}</div>
                                {index !== list.length - 1 && (
                                    <span className="ll-arrow">→</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
            {/* =========================
    CIRCULAR LINKED LIST
========================= */}
{listType === "circular" && (
  <>
    <div className="circular-indicator">
      Last node points back to the Head
    </div>

    <div className="linked-list">
      {list.length === 0 ? (
        <div className="empty">Linked List is empty</div>
      ) : (
        list.map((node, index) => (
          <div key={index} className="ll-node-wrapper">
            <div className="ll-node">{node.value}</div>

            {/* Normal arrows */}
            {index !== list.length - 1 && (
              <span className="ll-arrow">→</span>
            )}

            {/* Last → First circular arrow */}
            {index === list.length - 1 && list.length > 1 && (
              <span className="ll-arrow circular-arrow">↺</span>
            )}
          </div>
        ))
      )}
    </div>
  </>
)}


            {/* =========================
          DOUBLY LINKED LIST
      ========================= */}
            {listType === "doubly" && (
                <div className="dll-container">
                    {list.length === 0 ? (
                        <div className="empty">Linked List is empty</div>
                    ) : (
                        list.map((node, index) => (
                            <div key={index} className="dll-node-wrapper">
                                {index === 0 && <span className="dll-null">NULL</span>}

                                <div className="dll-node">
                                    <span className="dll-part">prev</span>
                                    <span className="dll-value">{node.value}</span>
                                    <span className="dll-part">next</span>
                                </div>

                                {index !== list.length - 1 && (
                                    <span className="dll-arrow">↔</span>
                                )}

                                {index === list.length - 1 && (
                                    <span className="dll-null">NULL</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
            {/* =========================
    CIRCULAR LINKED LIST
========================= */}
{listType === "circular" && (
  <>
    <div className="circular-indicator">
      Last node points back to the Head
    </div>

    <div className="linked-list">
      {list.length === 0 ? (
        <div className="empty">Linked List is empty</div>
      ) : (
        list.map((node, index) => (
          <div key={index} className="ll-node-wrapper">
            <div className="ll-node">{node.value}</div>

            {/* Normal arrows */}
            {index !== list.length - 1 && (
              <span className="ll-arrow">→</span>
            )}

            {/* Last → First circular arrow */}
            {index === list.length - 1 && list.length > 1 && (
              <span className="ll-arrow circular-arrow">↺</span>
            )}
          </div>
        ))
      )}
    </div>
  </>
)}


            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default LinkedListVisualizer;
