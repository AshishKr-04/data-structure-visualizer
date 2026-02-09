import { useState } from "react";

function ArrayVisualizer() {
  const [array, setArray] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [reversedArray, setReversedArray] = useState([]);
  const [isReversing, setIsReversing] = useState(false);

  /* =========================
     INSERT
  ========================= */
  const insertElement = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to insert");
      return;
    }

    setArray((prev) => [...prev, input]);
    setInput("");
    setMessage(`Inserted ${input}`);
  };

  /* =========================
     DELETE
  ========================= */
  const deleteElement = () => {
    if (input.trim() === "") {
      setMessage("Enter value to delete");
      return;
    }

    const index = array.indexOf(input);
    if (index === -1) {
      setMessage("Value not found");
      return;
    }

    setArray((prev) => prev.filter((_, i) => i !== index));
    setMessage(`Deleted ${input}`);
    setInput("");
  };

  /* =========================
     STEP-BY-STEP REVERSE
  ========================= */
  const reverseArray = async () => {
    if (array.length <= 1) {
      setMessage("Nothing to reverse");
      return;
    }

    setIsReversing(true);
    setMessage("Reversing array step by step...");
    setReversedArray([]);

    let temp = [...array];
    let result = [];

    for (let i = temp.length - 1; i >= 0; i--) {
      result.push(temp[i]);

      // show animation step
      setArray([...result, ...temp.slice(0, i)]);
      await new Promise((res) => setTimeout(res, 500));
    }

    setArray([...result]);
    setReversedArray([...result]);
    setIsReversing(false);
    setMessage("Array reversed successfully");
  };

  return (
    <div className="stack-card">
      <h2>Array Visualizer</h2>

      {/* Definition */}
      <div className="stack-definition">
        <h4>Definition</h4>
        <p>
          An <strong>Array</strong> is a linear data structure that stores
          elements in contiguous memory locations.
        </p>
      </div>

      {isReversing && (
        <div className="message">Reversing elements one by one...</div>
      )}

      {/* Controls */}
      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isReversing}
        />
        <button onClick={insertElement} disabled={isReversing}>
          Insert
        </button>
        <button onClick={deleteElement} disabled={isReversing}>
          Delete
        </button>
        <button onClick={reverseArray} disabled={isReversing}>
          Reverse
        </button>
      </div>

      {/* Current Array */}
      <div className="queue-container">
        <span className="label">Array</span>

        <div className="queue-box">
          {array.length === 0 ? (
            <div className="empty">Array is empty</div>
          ) : (
            array.map((item, index) => (
              <div key={index} className="queue-item">
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Final Reversed Array */}
      {reversedArray.length > 0 && !isReversing && (
        <div className="queue-container" style={{ marginTop: "16px" }}>
          <span className="label">Final Reversed Array</span>

          <div className="queue-box">
            {reversedArray.map((item, index) => (
              <div key={index} className="queue-item">
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default ArrayVisualizer;
