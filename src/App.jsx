import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StackVisualizer from "./components/StackVisualizer";
import QueueVisualizer from "./components/QueueVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import ArrayVisualizer from "./components/ArrayVisualizer";
import TreeVisualizer from "./components/TreeVisualizer";

function App() {
  const [activeDS, setActiveDS] = useState("array"); // 👈 default changed
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />

      <div className="app-layout">
        <Sidebar activeDS={activeDS} setActiveDS={setActiveDS} />

        <main className="content">
          {activeDS === "array" && <ArrayVisualizer />}
          {activeDS === "linkedlist" && <LinkedListVisualizer />}
          {activeDS === "stack" && <StackVisualizer />}
          {activeDS === "queue" && <QueueVisualizer />}
          {activeDS === "tree" && <TreeVisualizer />}
        </main>
      </div>
    </>
  );
}

export default App;
