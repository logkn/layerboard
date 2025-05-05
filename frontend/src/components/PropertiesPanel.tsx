import React from "react";
import { useDiagramStore } from "../store/diagramStore";

const PANEL_WIDTH = 300;

export const PropertiesPanel: React.FC = () => {
  const currentGraphId = useDiagramStore((state) => state.currentGraphId);
  const nodes = useDiagramStore((state) => state.graphs[currentGraphId].nodes);
  const edges = useDiagramStore((state) => state.graphs[currentGraphId].edges);
  const selectedNodeIds = useDiagramStore((state) => state.selectedNodeIds);
  const selectedEdgeId = useDiagramStore((state) => state.selectedEdgeId);
  const updateNodeLabel = useDiagramStore((state) => state.updateNodeLabel);
  const updateEdgeLabel = useDiagramStore((state) => state.updateEdgeLabel);

  let content: React.ReactNode = <p>No selection</p>;
  // Edge selected
  if (selectedEdgeId) {
    const edge = edges.find((e) => e.id === selectedEdgeId);
    if (edge) {
      content = (
        <div>
          <h3>Edge Properties</h3>
          <label>
            Label:
            <input
              type="text"
              value={edge.label}
              onChange={(e) => updateEdgeLabel(edge.id, e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
      );
    }
  } else if (selectedNodeIds.length === 1) {
    const node = nodes.find((n) => n.id === selectedNodeIds[0]);
    if (node) {
      content = (
        <div>
          <h3>Node Properties</h3>
          <label>
            Label:
            <input
              type="text"
              value={node.label}
              onChange={(e) => updateNodeLabel(node.id, e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
      );
    }
  } else if (selectedNodeIds.length > 1) {
    content = <p>Multiple nodes selected</p>;
  }

  return (
    <div
      style={{
        width: PANEL_WIDTH,
        borderLeft: "1px solid #ccc",
        padding: "1rem",
        boxSizing: "border-box",
        background: "#f9f9f9",
        overflowY: "auto",
      }}
    >
      {content}
    </div>
  );
};
