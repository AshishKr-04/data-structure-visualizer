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
      setMessage("Queue Overflow (Max buffer size reached)");
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
        setMessage("Queue is empty (Underflow)");
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
        setMessage("Deque is empty (Underflow)");
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
      setMessage("Queue is empty (Underflow)");
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
        return "FIFO Pipeline: Space freed at front is not reused without shift.";
      case "circular":
        return "Circular Ring Buffer: Reuses head memory slots via modulo arithmetic index wrap.";
      case "deque":
        return "Double-Ended Queue (Deque): Instant O(1) push and pop at both boundaries.";
      case "priority":
        return "Priority Stream: Dequeues items strictly by highest priority score.";
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
        <div className="empty-queue-msg">Deque buffer is empty</div>
      ) : (
        listQueue.map((item, index) => (
          <div
            key={index}
            className={`queue-item-modern ${index === dequeuingIndex ? "dequeuing" : ""}`}
          >
            <span className="queue-item-val">{item}</span>
          </div>
        ))
      );
    }

    if (queueType === "priority") {
      return listQueue.length === 0 ? (
        <div className="empty-queue-msg">Priority Queue is empty</div>
      ) : (
        listQueue.map((item, index) => (
          <div key={index} className="queue-item-modern priority-item">
            <span className="queue-item-val">{item.value}</span>
            <span className="priority-tag">P{item.priority}</span>
          </div>
        ))
      );
    }

    // SIMPLE & CIRCULAR
    return queue.map((item, index) => {
      const isFront = index === front && size > 0;
      const isRear = index === rear && size > 0;

      return (
        <div
          key={index}
          className={`queue-item-modern ${item === null ? "slot-empty" : ""} ${
            index === dequeuingIndex ? "dequeuing" : ""
          }`}
        >
          <div className="slot-pointers">
            {isFront && <span className="pointer-chip front-chip">FRONT</span>}
            {isRear && <span className="pointer-chip rear-chip">REAR</span>}
          </div>
          <span className="queue-item-val">{item ?? "·"}</span>
          <span className="slot-index-tag">[{index}]</span>
        </div>
      );
    });
  };

  return (
    <div className="visualizer-card modern-card">
      <div className="visualizer-card-header modern-header">
        <div>
          <span className="modern-eyebrow">FIFO Pipeline Primitive</span>
          <h2 className="modern-title">Queue Visualizer</h2>
          <p className="modern-desc">{getDefinition()}</p>
        </div>
      </div>

      {/* Queue Type Selector */}
      <div className="ds-buttons modern-pill-switch">
        {[
          { id: "simple", label: "Simple FIFO" },
          { id: "circular", label: "Circular Ring Buffer" },
          { id: "deque", label: "Deque (Double-Ended)" },
          { id: "priority", label: "Priority Queue" }
        ].map((item) => (
          <button
            key={item.id}
            className={`pill-switch-btn ${queueType === item.id ? "active" : ""}`}
            onClick={() => resetQueue(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="stack-controls modern-controls">
        <input
          type="text"
          placeholder="Enter value"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
        />

        {queueType === "priority" && (
          <input
            type="number"
            min="1"
            max="10"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Priority (1-10)"
            style={{ maxWidth: "150px" }}
          />
        )}

        <button className="ctrl-btn-primary" onClick={handleEnqueue}>
          Enqueue
        </button>
        <button className="ctrl-btn-danger" onClick={handleDequeue}>
          Dequeue
        </button>
      </div>

      {queueType === "circular" && (
        <div className="queue-telemetry-badge-row">
          <span className="telemetry-pill">Front Pointer: [{front}]</span>
          <span className="telemetry-pill">Rear Pointer: [{rear}]</span>
          <span className="telemetry-pill">Active Slots: {size} / {MAX_SIZE}</span>
        </div>
      )}

      <div className="queue-pipeline-stage">
        <div className="pipeline-terminal-marker exit-marker">
          <span className="marker-tag">FRONT (Exit)</span>
          <span className="marker-arrow">◀ Dequeue</span>
        </div>

        <div className="queue-pipeline-track">
          <div className="queue-items-flow">{renderQueue()}</div>
        </div>

        <div className="pipeline-terminal-marker entry-marker">
          <span className="marker-tag">REAR (Entry)</span>
          <span className="marker-arrow">Enqueue ◀</span>
        </div>
      </div>

      {message && <p className="message modern-message">{message}</p>}
    </div>
  );
}

export default QueueVisualizer;
