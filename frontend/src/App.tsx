import "./App.css";
import { DiagramCanvas } from "./features/diagram/DiagramCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { KeyboardShortcuts } from "./components/KeyboardShortcuts";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Keyboard shortcuts handler (invisible component) */}
      <KeyboardShortcuts />

      <div style={{ flex: 1, position: "relative" }}>
        <DiagramCanvas />
      </div>
      <PropertiesPanel />
    </div>
  );
}

export default App;
