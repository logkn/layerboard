import React, { useRef } from "react";
import { nanoid } from "nanoid";
import { useDiagramStore, DiagramData } from "../store/diagramStore";

/**
 * Top toolbar for canvas actions: add node/edge, zoom, fit, and search
 */
export const Toolbar: React.FC = () => {
  const addNode = useDiagramStore((s) => s.addNode);
  const selectedNodeIds = useDiagramStore((s) => s.selectedNodeIds);
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const graphNodes = useDiagramStore((s) => s.graphs[currentGraphId].nodes);
  const startConnecting = useDiagramStore((s) => s.startConnecting);
  const zoomIn = useDiagramStore((s) => s.zoomIn);
  const zoomOut = useDiagramStore((s) => s.zoomOut);
  const exportDiagram = useDiagramStore((s) => s.exportDiagram);
  const importDiagram = useDiagramStore((s) => s.importDiagram);
  const clearGraph = useDiagramStore((s) => s.clearGraph);

  // Reference to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddNode = () => {
    // Add a node at a default position; later support click-to-place
    addNode({ id: nanoid(), x: 100, y: 100, label: "Node" });
  };

  // Start edge creation from the selected node (from its center)
  const handleAddEdge = () => {
    if (selectedNodeIds.length !== 1) {
      alert("Please select exactly one node to start connecting from");
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

  const handleZoomIn = () => {
    zoomIn();
  };

  const handleZoomOut = () => {
    zoomOut();
  };

  // Reset zoom to default (fit-to-screen)
  const handleFit = () => {
    // reset zoom scale to 1
    useDiagramStore.setState({ zoom: 1 });
  };

  // Export the current diagram as a JSON file
  const handleExport = () => {
    const diagramData = exportDiagram();
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    // Create a link element and trigger a download
    const exportFileDefaultName = `diagram-${currentGraphId}-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Trigger the file input click to open file selector
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle the file selection and import
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as DiagramData;

        // Basic validation to ensure the imported file has the expected structure
        if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          throw new Error("Invalid diagram file format");
        }

        // Confirm before replacing current diagram
        if (
          graphNodes.length > 0 &&
          !confirm("This will replace your current diagram. Continue?")
        ) {
          return;
        }

        importDiagram(data);
      } catch (error) {
        alert(
          `Failed to import diagram: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  // Clear the current graph after confirmation
  const handleClear = () => {
    if (
      confirm(
        "Are you sure you want to clear the current diagram? This cannot be undone.",
      )
    ) {
      clearGraph();
    }
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
        padding: "8px 12px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={handleAddNode}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
          }}
        >
          Add Node
        </button>
        <button
          onClick={handleAddEdge}
          disabled={selectedNodeIds.length !== 1}
          style={{
            opacity: selectedNodeIds.length !== 1 ? 0.6 : 1,
          }}
        >
          Add Edge
        </button>
      </div>

      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleFit}>Fit</button>
      </div>

      <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
        <button onClick={handleExport}>Export</button>
        <button onClick={handleImportClick}>Import</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".json"
          onChange={handleFileChange}
        />
        <button
          onClick={handleClear}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
          }}
        >
          Clear
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        style={{
          padding: "6px 10px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "200px",
        }}
      />
    </div>
  );
};
