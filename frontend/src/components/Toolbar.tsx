import React from "react";
import { nanoid } from "nanoid";
import { useDiagramStore } from "../store/diagramStore";

/**
 * Top toolbar for canvas actions: add node/edge, zoom, fit, and search
 */
export const Toolbar: React.FC = () => {
  const addNode = useDiagramStore((s) => s.addNode);
  // TODO: implement addEdge mode
  // const addEdge = useDiagramStore((s) => s.addEdge);

  const handleAddNode = () => {
    // Add a node at a default position; later support click-to-place
    addNode({ id: nanoid(), x: 100, y: 100, label: "Node" });
  };

  const handleAddEdge = () => {
    console.log("Add Edge mode not implemented");
  };

  const handleZoomIn = () => {
    console.log("Zoom In not implemented");
  };

  const handleZoomOut = () => {
    console.log("Zoom Out not implemented");
  };

  const handleFit = () => {
    console.log("Fit to Screen not implemented");
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        right: 10,
        zIndex: 10,
        background: "rgba(255, 255, 255, 0.9)",
        padding: "4px 8px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <button onClick={handleAddNode}>Add Node</button>
      <button onClick={handleAddEdge}>Add Edge</button>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <button onClick={handleFit}>Fit</button>
      <input
        type="text"
        placeholder="Search..."
        style={{ marginLeft: "auto", padding: "4px" }}
      />
    </div>
  );
};
