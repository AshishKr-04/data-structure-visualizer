import { useState } from "react";


function StackVisualizer() {
  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [poppingIndex, setPoppingIndex] = useState(null); // 🔥 for pop animation

  const handlePush = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to push");
      return;
    }

    setStack((prev) => [...prev, input]);
    setInput("");
    setMessage(`Pushed ${input}`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty");
      return;
    }

    const lastIndex = stack.length - 1;

    // mark top element as popping
    setPoppingIndex(lastIndex);

    // wait for animation, then remove
    setTimeout(() => {
      setStack((prev) => prev.slice(0, -1));
      setPoppingIndex(null);
    }, 200); // must match CSS animation time

    setMessage("Popped top element");
  };

  return (
    <div className="stack-card">
     
      <h2>Stack Visualizer</h2>

      {/* Definition */}
      <div className="stack-definition">
        <h4>Definition</h4>
        <p>
          Stack is a <strong>linear data structure</strong> that follows
          <strong> LIFO (Last In, First Out)</strong>.
        </p>
      </div>

      {/* Controls */}
      <div className="stack-controls">
        <input
          type="text"
          value={input}
          placeholder="Enter value"
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handlePush}>Push</button>
        <button onClick={handlePop}>Pop</button>
      </div>

      {/* Stack Visual */}
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
                  key={realIndex}
                  className={`stack-item ${realIndex === poppingIndex ? "popping" : ""
                    }`}
                >
                  {item}
                </div>
              );
            })
          )}
        </div>

        <span className="label">Bottom</span>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default StackVisualizer;