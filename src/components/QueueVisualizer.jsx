import { useState } from "react";

function QueueVisualizer() {
  const [queueType, setQueueType] = useState("simple");
  const [queue, setQueue] = useState([]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [dequeuingIndex, setDequeuingIndex] = useState(null);

  /* =========================
     ENQUEUE
  ========================= */
  const handleEnqueue = () => {
    if (input.trim() === "") {
      setMessage("Enter a value");
      return;
    }

    if (queueType === "deque") {
      // insert at front for deque
      setQueue((prev) => [input, ...prev]);
      setMessage(`Inserted ${input} at front`);
    } else {
      // simple & circular queue
      setQueue((prev) => [...prev, input]);
      setMessage(`Enqueued ${input}`);
    }

    setInput("");
  };

  /* =========================
     DEQUEUE
  ========================= */
  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage("Queue is empty");
      return;
    }

    if (queueType === "deque") {
      // remove from rear
      setDequeuingIndex(queue.length - 1);
      setTimeout(() => {
        setQueue((prev) => prev.slice(0, -1));
        setDequeuingIndex(null);
      }, 250);
      setMessage("Removed element from rear");
    } else {
      // remove from front
      setDequeuingIndex(0);
      setTimeout(() => {
        setQueue((prev) => prev.slice(1));
        setDequeuingIndex(null);
      }, 250);
      setMessage("Dequeued front element");
    }
  };

  /* =========================
     DEFINITIONS
  ========================= */
  const getDefinition = () => {
    switch (queueType) {
      case "simple":
        return "A Simple Queue follows FIFO (First In, First Out).";
      case "circular":
        return "A Circular Queue connects the rear back to the front to reuse space efficiently.";
      case "deque":
        return "A Deque allows insertion and deletion at both front and rear.";
      default:
        return "";
    }
  };

  return (
    <div className="stack-card">
      <h2>Queue Visualizer</h2>

      {/* Definition */}
      <div className="stack-definition">
        <h4>Definition</h4>
        <p>{getDefinition()}</p>
      </div>

      {/* Queue Type Selector */}
      <div className="ds-buttons">
        <button
          className={queueType === "simple" ? "active" : ""}
          onClick={() => setQueueType("simple")}
        >
          Simple
        </button>

        <button
          className={queueType === "circular" ? "active" : ""}
          onClick={() => setQueueType("circular")}
        >
          Circular
        </button>

        <button
          className={queueType === "deque" ? "active" : ""}
          onClick={() => setQueueType("deque")}
        >
          Deque
        </button>
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
      {/* Circular Queue Indicator */}
      {queueType === "circular" && (
        <div className="circular-indicator">
          Rear ➜ Front (Circular Connection)
        </div>
      )}


      {/* Circular queue hint */}
      {queueType === "circular" && (
        <div className="message">Rear connects back to Front</div>
      )}

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
                  className={`queue-item ${index === dequeuingIndex ? "dequeuing" : ""
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
