import { Stage, Layer, Arrow } from "react-konva";
import { useDiagramStore } from "../store/diagramStore";
import { Node } from "./Node";
import { Edge } from "./Edge";

export const Canvas = () => {
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const connecting = useDiagramStore((s) => s.connecting);
  const updateConnecting = useDiagramStore((s) => s.updateConnecting);
  const finishConnecting = useDiagramStore((s) => s.finishConnecting);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      // enable dragging the canvas to pan and show off-screen nodes
      draggable
      // make canvas borders visible
      style={{ border: '1px solid rgba(0,0,0,0.2)' }}
      onMouseMove={(e) => {
        if (!connecting) return;
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (pos) updateConnecting(pos.x, pos.y);
      }}
      onMouseUp={(e) => {
        if (!connecting) return;
        let target: any = e.target;
        let toId: string | undefined;
        while (target) {
          const id = target.id && target.id();
          if (nodes.find((n) => n.id === id)) {
            toId = id;
            break;
          }
          target = target.getParent && target.getParent();
        }
        finishConnecting(toId);
      }}
    >
      <Layer>
        {edges.map((edge) => (
          <Edge key={edge.id} {...edge} />
        ))}
        {connecting &&
          (() => {
            // draw preview edge from the source handle to the current pointer position
            const { startX, startY, toX, toY } = connecting;
            return (
              <Arrow
                points={[startX, startY, toX, toY]}
                stroke="black"
                fill="black"
                dash={[4, 4]}
              />
            );
          })()}
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
      </Layer>
    </Stage>
  );
};
