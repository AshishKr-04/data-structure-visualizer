import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StackVisualizer from "./components/StackVisualizer";
import QueueVisualizer from "./components/QueueVisualizer";
import LinkedListVisualizer from "./components/LinkedListVisualizer";
import ArrayVisualizer from "./components/ArrayVisualizer";


function App() {
  const [activeDS, setActiveDS] = useState("stack");
  const [theme, setTheme] = useState("light");

  // Apply theme to body
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

        </main>
      </div>
    </>
  );
}

export default App;
