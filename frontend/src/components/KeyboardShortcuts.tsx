import { useEffect } from "react";
import { useDiagramStore } from "../store/diagramStore";
import { nanoid } from "nanoid";

/**
 * Component to handle keyboard shortcuts for diagram manipulation.
 * This is a headless component that just attaches event listeners.
 */
export const KeyboardShortcuts = () => {
  const deleteEdge = useDiagramStore((s) => s.deleteEdge);
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const selectedNodeIds = useDiagramStore((s) => s.selectedNodeIds);
  const setSelectedNodes = useDiagramStore((s) => s.setSelectedNodes);
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const graphs = useDiagramStore((s) => s.graphs);
  const addNode = useDiagramStore((s) => s.addNode);
  const collapse = useDiagramStore((s) => s.collapse);
  const zoomIn = useDiagramStore((s) => s.zoomIn);
  const zoomOut = useDiagramStore((s) => s.zoomOut);
  const copyEdgeProperties = useDiagramStore((s) => s.copyEdgeProperties);
  const pasteEdgeProperties = useDiagramStore((s) => s.pasteEdgeProperties);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle keyboard events if the user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Delete key: remove selected elements
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedEdgeId) {
          e.preventDefault();
          deleteEdge(selectedEdgeId);
        } else if (selectedNodeIds.length > 0) {
          e.preventDefault();
          // This is a simplified version; a more complete implementation would
          // need to handle removing nodes and their connected edges
          setSelectedNodes([]);
        }
      }

      // Escape: collapse to parent graph or clear selection
      if (e.key === "Escape") {
        if (currentGraphId !== "root") {
          e.preventDefault();
          collapse();
        } else if (selectedEdgeId || selectedNodeIds.length > 0) {
          e.preventDefault();
          useDiagramStore.getState().setSelectedEdge(null);
          setSelectedNodes([]);
        }
      }

      // Ctrl/Cmd + N: add new node at center of view
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        // Get the center of the current view
        const width = window.innerWidth;
        const height = window.innerHeight;
        addNode({
          id: nanoid(),
          x: width / 2,
          y: height / 2,
          label: "New Node",
        });
      }

      // Ctrl/Cmd + Z: undo (placeholder - would need proper history management)
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        // Placeholder for undo functionality
        console.log("Undo operation not implemented yet");
      }

      // Ctrl/Cmd + Y: redo (placeholder - would need proper history management)
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        // Placeholder for redo functionality
        console.log("Redo operation not implemented yet");
      }

      // Ctrl/Cmd + +/-: zoom in/out
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoomIn();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
      }

      // Ctrl/Cmd + 0: reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        useDiagramStore.setState({ zoom: 1 });
      }

      // Ctrl/Cmd + C: copy properties of selected edge
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedEdgeId) {
        e.preventDefault();
        copyEdgeProperties(selectedEdgeId);
      }

      // Ctrl/Cmd + V: paste properties to selected edge
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && selectedEdgeId) {
        e.preventDefault();
        pasteEdgeProperties(selectedEdgeId);
      }

      // Ctrl/Cmd + A: select all nodes in current graph
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const nodeIds = graphs[currentGraphId].nodes.map((node) => node.id);
        setSelectedNodes(nodeIds);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    deleteEdge,
    selectedEdgeId,
    selectedNodeIds,
    setSelectedNodes,
    currentGraphId,
    graphs,
    addNode,
    collapse,
    zoomIn,
    zoomOut,
    copyEdgeProperties,
    pasteEdgeProperties,
  ]);

  // This is a headless component that doesn't render anything
  return null;
};
