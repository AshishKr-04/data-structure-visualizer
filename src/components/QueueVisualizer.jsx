import { useState } from "react";

function QueueVisualizer() {
  const [queue, setQueue] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [dequeuingIndex, setDequeuingIndex] = useState(null);

  const handleEnqueue = () => {
    if (input.trim() === "") {
      setMessage("Enter a value to enqueue");
      return;
    }

    setQueue((prev) => [...prev, input]);
    setInput("");
    setMessage(`Enqueued ${input}`);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage("Queue is empty");
      return;
    }

    setDequeuingIndex(0);

    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setDequeuingIndex(null);
    }, 250);

    setMessage("Dequeued front element");
  };

  return (
    <div className="stack-card">
      <h2>Queue Visualizer</h2>

      {/* Definition */}
      <div className="stack-definition">
        <h4>Definition</h4>
        <p>
          A <strong>Queue</strong> is a linear data structure that follows{" "}
          <strong>FIFO (First In, First Out)</strong>.
        </p>
      </div>

      {/* Controls */}
      <div className="stack-controls">
        <input
          type="text"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleEnqueue}>Enqueue</button>
        <button onClick={handleDequeue}>Dequeue</button>
      </div>

      {/* Queue Visual */}
      <div className="queue-container">
        <div className="queue-row">
          <span className="queue-label">Front</span>

          <div className="queue-box">
            {queue.length === 0 ? (
              <div className="empty">Queue is empty</div>
            ) : (
              queue.map((item, index) => (
                <div
                  key={index}
                  className={`queue-item ${
                    index === dequeuingIndex ? "dequeuing" : ""
                  }`}
                >
                  {item}
                </div>
              ))
            )}
          </div>

          <span className="queue-label">Rear</span>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default QueueVisualizer;