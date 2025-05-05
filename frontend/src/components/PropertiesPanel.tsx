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

  // Create a styled form input component for reuse
  const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
  }> = ({ label, children }) => (
    <div style={{ marginBottom: "12px" }}>
      <label
        style={{
          display: "block",
          fontWeight: "bold",
          marginBottom: "4px",
          fontSize: "14px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );

  // Create a styled button component
  const Button: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    variant?: "primary" | "danger" | "default";
  }> = ({ onClick, children, variant = "default" }) => {
    const getStyle = () => {
      switch (variant) {
        case "primary":
          return { backgroundColor: "#4f46e5", color: "white" };
        case "danger":
          return { backgroundColor: "#ef4444", color: "white" };
        default:
          return {};
      }
    };

    return (
      <button
        onClick={onClick}
        style={{
          padding: "6px 12px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          cursor: "pointer",
          ...getStyle(),
        }}
      >
        {children}
      </button>
    );
  };

  // Create a styled input component
  const Input: React.FC<{
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  }> = ({ value, onChange, placeholder }) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
      }}
    />
  );

  const renderNodeProperties = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return null;

    return (
      <div>
        <h3
          style={{
            marginTop: 0,
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}
        >
          Node Properties
        </h3>

        <FormField label="ID">
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {node.id}
          </div>
        </FormField>

        <FormField label="Label">
          <Input
            value={node.label}
            onChange={(e) => updateNodeLabel(node.id, e.target.value)}
            placeholder="Enter node label"
          />
        </FormField>

        <FormField label="Position">
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                X
              </label>
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {Math.round(node.x)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                Y
              </label>
              <div
                style={{
                  padding: "8px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {Math.round(node.y)}
              </div>
            </div>
          </div>
        </FormField>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <Button
            onClick={() => {
              const expanded = useDiagramStore.getState().expandNode;
              expanded(node.id);
            }}
            variant="primary"
          >
            Expand Node
          </Button>
        </div>
      </div>
    );
  };

  const renderEdgeProperties = (edgeId: string) => {
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return null;

    // Find the source and target node labels
    const fromNode = nodes.find((n) => n.id === edge.from);
    const toNode = nodes.find((n) => n.id === edge.to);

    return (
      <div>
        <h3
          style={{
            marginTop: 0,
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}
        >
          Edge Properties
        </h3>

        <FormField label="ID">
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {edge.id}
          </div>
        </FormField>

        <FormField label="Label">
          <Input
            value={edge.label}
            onChange={(e) => updateEdgeLabel(edge.id, e.target.value)}
            placeholder="Enter edge label"
          />
        </FormField>

        <FormField label="Connection">
          <div
            style={{
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          >
            {fromNode?.label || edge.from} → {toNode?.label || edge.to}
          </div>
        </FormField>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <Button
            onClick={() => {
              const reverse = useDiagramStore.getState().reverseEdgeDirection;
              reverse(edge.id);
            }}
          >
            Reverse Direction
          </Button>
          <Button
            onClick={() => {
              const deleteEdge = useDiagramStore.getState().deleteEdge;
              deleteEdge(edge.id);
            }}
            variant="danger"
          >
            Delete Edge
          </Button>
        </div>
      </div>
    );
  };

  const renderMultiSelection = () => {
    return (
      <div>
        <h3
          style={{
            marginTop: 0,
            borderBottom: "1px solid #eee",
            paddingBottom: "8px",
          }}
        >
          Multiple Selection
        </h3>
        <p>{selectedNodeIds.length} nodes selected</p>
        <div style={{ marginTop: "16px" }}>
          <Button
            onClick={() => {
              // Clear selection
              useDiagramStore.getState().setSelectedNodes([]);
            }}
          >
            Clear Selection
          </Button>
        </div>
      </div>
    );
  };

  const renderNoSelection = () => {
    return (
      <div style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
        <p>No element selected</p>
        <p style={{ fontSize: "14px" }}>
          Select a node or edge to view and edit its properties.
        </p>
        <div style={{ marginTop: "20px", fontSize: "14px" }}>
          <p>
            <strong>Keyboard Shortcuts:</strong>
          </p>
          <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
            <li>Double-click: Create new node</li>
            <li>Delete: Remove selected elements</li>
            <li>Esc: Return to parent graph</li>
          </ul>
        </div>
      </div>
    );
  };

  let content: React.ReactNode;

  // Determine what to show in the panel based on selection
  if (selectedEdgeId) {
    content = renderEdgeProperties(selectedEdgeId);
  } else if (selectedNodeIds.length === 1) {
    content = renderNodeProperties(selectedNodeIds[0]);
  } else if (selectedNodeIds.length > 1) {
    content = renderMultiSelection();
  } else {
    content = renderNoSelection();
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
        height: "100%",
      }}
    >
      <div style={{ padding: "8px" }}>{content}</div>
    </div>
  );
};
