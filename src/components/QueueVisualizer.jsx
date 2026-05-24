/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { parseNumber } from "../lib/validation";

const MAX_SIZE = 5;

function QueueVisualizer({ resetSignal, randomSignal, logOperation }) {
  const [queueType, setQueueType] = useState("simple");

  // shared
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState(1);
  const [message, setMessage] = useState("");
  const [dequeuingIndex, setDequeuingIndex] = useState(null);

  // simple & circular queue (fixed size)
  const [queue, setQueue] = useState(Array(MAX_SIZE).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(-1);
  const [size, setSize] = useState(0);

  // deque & priority queue (dynamic)
  const [listQueue, setListQueue] = useState([]);

  useEffect(() => {
    resetQueue(queueType);
  }, [resetSignal]);

  useEffect(() => {
    const sample = Array.from({ length: 4 }, () => String(Math.floor(Math.random() * 90) + 10));
    if (queueType === "priority") {
      setListQueue(sample.map((value, index) => ({ value, priority: sample.length - index })));
    } else if (queueType === "deque") {
      setListQueue(sample);
    } else {
      const next = Array(MAX_SIZE).fill(null);
      sample.forEach((value, index) => {
        next[index] = value;
      });
      setQueue(next);
      setFront(0);
      setRear(sample.length - 1);
      setSize(sample.length);
    }
    setMessage("Random queue generated.");
  }, [randomSignal]);

  /* =========================
     RESET WHEN TYPE CHANGES
  ========================= */
  const resetQueue = (type) => {
    setQueueType(type);
    setQueue(Array(MAX_SIZE).fill(null));
    setFront(0);
    setRear(-1);
    setSize(0);
    setListQueue([]);
    setDequeuingIndex(null);
    setMessage("");
  };

  /* =========================
     ENQUEUE
  ========================= */
  const handleEnqueue = () => {
    if (input.trim() === "") {
      setMessage("Enter a value");
      return;
    }

    // PRIORITY QUEUE
    if (queueType === "priority") {
      const priorityResult = parseNumber(priority, "Priority");
      if (!priorityResult.ok) {
        setMessage(priorityResult.error);
        return;
      }

      const newItem = { value: input, priority: priorityResult.value };
      const newQueue = [...listQueue, newItem].sort(
        (a, b) => b.priority - a.priority
      );
      setListQueue(newQueue);
      setMessage(`Enqueued ${input} with priority ${priority}`);
      logOperation?.("Priority enqueue", `${input} queued with priority ${priority}`);
      setInput("");
      return;
    }

    // DEQUE
    if (queueType === "deque") {
      setListQueue((prev) => [input, ...prev]);
      setMessage(`Inserted ${input} at front`);
      logOperation?.("Deque insert", `${input} inserted at front`);
      setInput("");
      return;
    }

    // SIMPLE / CIRCULAR
    if (size === MAX_SIZE) {
      setMessage("Queue Overflow");
      return;
    }

    const newRear =
      queueType === "circular" ? (rear + 1) % MAX_SIZE : rear + 1;

    const newQueue = [...queue];
    newQueue[newRear] = input;

    setQueue(newQueue);
    setRear(newRear);
    setSize(size + 1);
    setMessage(`Enqueued ${input}`);
    logOperation?.("Enqueue", `${input} added to queue`);
    setInput("");
  };

  /* =========================
     DEQUEUE
  ========================= */
  const handleDequeue = () => {
    // PRIORITY QUEUE
    if (queueType === "priority") {
      if (listQueue.length === 0) {
        setMessage("Queue is empty");
        return;
      }
      setListQueue((prev) => prev.slice(1));
      setMessage("Dequeued highest priority element");
      logOperation?.("Priority dequeue", "Removed highest priority element");
      return;
    }

    // DEQUE
    if (queueType === "deque") {
      if (listQueue.length === 0) {
        setMessage("Deque is empty");
        return;
      }
      setDequeuingIndex(listQueue.length - 1);
      setTimeout(() => {
        setListQueue((prev) => prev.slice(0, -1));
        setDequeuingIndex(null);
      }, 250);
      setMessage("Removed element from rear");
      logOperation?.("Deque remove", "Removed element from rear");
      return;
    }

    // SIMPLE / CIRCULAR
    if (size === 0) {
      setMessage("Queue is empty");
      return;
    }

    setDequeuingIndex(front);
    setTimeout(() => {
      const newQueue = [...queue];
      newQueue[front] = null;

      const newFront =
        queueType === "circular" ? (front + 1) % MAX_SIZE : front + 1;

      setQueue(newQueue);
      setFront(newFront);
      setSize(size - 1);
      setDequeuingIndex(null);
    }, 250);

    setMessage("Dequeued front element");
    logOperation?.("Dequeue", "Removed front queue element");
  };

  /* =========================
     DEFINITIONS
  ========================= */
  const getDefinition = () => {
    switch (queueType) {
      case "simple":
        return "Simple Queue follows FIFO. Space freed at front is not reused.";
      case "circular":
        return "Circular Queue reuses freed space using modulo arithmetic.";
      case "deque":
        return "Deque allows insertion and deletion at both front and rear.";
      case "priority":
        return "Priority Queue dequeues elements based on priority, not order.";
      default:
        return "";
    }
  };

  /* =========================
     RENDER QUEUE
  ========================= */
  const renderQueue = () => {
    if (queueType === "deque") {
      return listQueue.length === 0 ? (
        <div className="empty">Deque is empty</div>
      ) : (
        listQueue.map((item, index) => (
          <div
            key={index}
            className={`queue-item ${index === dequeuingIndex ? "dequeuing" : ""
              }`}
          >
            {item}
          </div>
        ))
      );
    }

    if (queueType === "priority") {
      return listQueue.length === 0 ? (
        <div className="empty">Priority Queue is empty</div>
      ) : (
        listQueue.map((item, index) => (
          <div key={index} className="queue-item">
            {item.value} (P{item.priority})
          </div>
        ))
      );
    }

    // SIMPLE & CIRCULAR
    return queue.map((item, index) => (
      <div
        key={index}
        className={`queue-item ${index === dequeuingIndex ? "dequeuing" : ""
          }`}
      >
        {item ?? "_"}
      </div>
    ));
  };

  return (
    <div className="stack-card">
      
      <h2>Queue Visualizer</h2>

      <div className="stack-definition">
        <h4>Definition</h4>
        <p>{getDefinition()}</p>
      </div>

      {/* Queue Type Selector */}
      <div className="ds-buttons">
        <button
          className={queueType === "simple" ? "active" : ""}
          onClick={() => resetQueue("simple")}
        >
          Simple
        </button>
        <button
          className={queueType === "circular" ? "active" : ""}
          onClick={() => resetQueue("circular")}
        >
          Circular
        </button>
        <button
          className={queueType === "deque" ? "active" : ""}
          onClick={() => resetQueue("deque")}
        >
          Deque
        </button>
        <button
          className={queueType === "priority" ? "active" : ""}
          onClick={() => resetQueue("priority")}
        >
          Priority
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

        {queueType === "priority" && (
          <input
            type="number"
            min="1"
            max="10"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Priority"
          />
        )}

        <button onClick={handleEnqueue}>Enqueue</button>
        <button onClick={handleDequeue}>Dequeue</button>
      </div>

      {queueType === "circular" && (
        <div className="message">
          Front: {front} | Rear: {rear} | Size: {size}
        </div>
      )}

      <div className="queue-container">
        <div className="queue-row">
          <span className="queue-label">Front</span>
          <div className="queue-box">{renderQueue()}</div>
          <span className="queue-label">Rear</span>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default QueueVisualizer;
