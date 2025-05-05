import { nanoid } from "nanoid";
import { useDiagramStore } from "../../store/diagramStore";
import { Canvas } from "../../components/Canvas";

export const DiagramCanvas = () => {
  const addNode = useDiagramStore((s) => s.addNode);
  const collapse = useDiagramStore((s) => s.collapse);
  // breadcrumb / context bar: show current graph path
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const rootNodes = useDiagramStore((s) => s.graphs["root"].nodes);
  // derive label for current graph (root or node label)
  const breadcrumbLabel =
    currentGraphId === "root"
      ? "Root"
      : rootNodes.find((n) => n.id === currentGraphId)?.label || currentGraphId;

  return (
    <>
      {/* Context bar / breadcrumb showing current graph and Back button */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 80,
          zIndex: 10,
          background: "rgba(255,255,255,0.9)",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {currentGraphId !== "root" && (
          <button
            onClick={collapse}
            style={{
              marginRight: 8,
            }}
          >
            Back
          </button>
        )}
        <span>{breadcrumbLabel}</span>
      </div>
      <button
        onClick={() => addNode({ id: nanoid(), x: 100, y: 100, label: "Node" })}
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
      >
        + Node
      </button>
      <Canvas />
    </>
  );
};
