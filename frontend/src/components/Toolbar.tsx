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

  // Start edge creation from the selected node (from its center)
  const selectedNodeIds = useDiagramStore((s) => s.selectedNodeIds);
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const graphNodes = useDiagramStore((s) => s.graphs[currentGraphId].nodes);
  const startConnecting = useDiagramStore((s) => s.startConnecting);
  const handleAddEdge = () => {
    if (selectedNodeIds.length !== 1) {
      console.warn("Add Edge: please select exactly one node to start from.");
      return;
    }
    const fromId = selectedNodeIds[0];
    const node = graphNodes.find((n) => n.id === fromId);
    if (!node) {
      console.warn(`Add Edge: selected node '${fromId}' not found.`);
      return;
    }
    // initiate connecting from the center of the node
    startConnecting(fromId, node.x, node.y);
  };

  const zoomIn = useDiagramStore((s) => s.zoomIn);
  const handleZoomIn = () => {
    zoomIn();
  };

  const zoomOut = useDiagramStore((s) => s.zoomOut);
  const handleZoomOut = () => {
    zoomOut();
  };

  // Reset zoom to default (fit-to-screen)
  const handleFit = () => {
    // reset zoom scale to 1
    useDiagramStore.setState({ zoom: 1 });
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
