import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import StackVisualizer from "./components/StackVisualizer";

function App() {
  const [activeDS, setActiveDS] = useState("stack");

  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar activeDS={activeDS} setActiveDS={setActiveDS} />
        <main className="content">
          {activeDS === "stack" && <StackVisualizer />}
        </main>
      </div>
    </>
  );
}

export default App;