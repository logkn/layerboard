import { Stage, Layer, Arrow, Rect, Text, Group } from "react-konva";
import { useDiagramStore } from "../store/diagramStore";
import { Node } from "./Node";
import { Edge } from "./Edge";

export const Canvas = () => {
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const rootNodes = useDiagramStore((s) => s.graphs["root"].nodes);
  const nodes = useDiagramStore((s) => s.graphs[currentGraphId].nodes);
  const edges = useDiagramStore((s) => s.graphs[currentGraphId].edges);
  const connecting = useDiagramStore((s) => s.connecting);
  const updateConnecting = useDiagramStore((s) => s.updateConnecting);
  const finishConnecting = useDiagramStore((s) => s.finishConnecting);
  const collapse = useDiagramStore((s) => s.collapse);
  // canvas dimensions and click-to-collapse margin (in px)
  const width = window.innerWidth;
  const height = window.innerHeight;
  const BORDER_MARGIN = 50;

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      // enable dragging the canvas to pan and show off-screen nodes
      draggable
      // subtle grid background that moves with the canvas
      style={{
        border: '1px solid rgba(0,0,0,0.2)',
        // grid cells 25×25px
        backgroundSize: '25px 25px',
        backgroundImage: (
          'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), ' +
          'linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)'
        ),
      }}
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
      onClick={(e) => {
        if (currentGraphId !== 'root') {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (
            pos &&
            (pos.x < BORDER_MARGIN || pos.x > width - BORDER_MARGIN ||
             pos.y < BORDER_MARGIN || pos.y > height - BORDER_MARGIN)
          ) {
            collapse();
          }
        }
      }}
    >
      <Layer>
        {/* If in a child graph, render a margin-inside dashed border and centered title */}
        {currentGraphId !== 'root' && (() => {
          const parentNode = rootNodes.find((n) => n.id === currentGraphId);
          if (!parentNode) return null;
          return (
            <Group>
              <Rect
                x={BORDER_MARGIN}
                y={BORDER_MARGIN}
                width={width - BORDER_MARGIN * 2}
                height={height - BORDER_MARGIN * 2}
                stroke="#6366f1"
                strokeWidth={3}
                dash={[8, 4]}
              />
              <Text
                text={parentNode.label}
                x={BORDER_MARGIN}
                y={BORDER_MARGIN + 10}
                width={width - BORDER_MARGIN * 2}
                align="center"
                fontSize={24}
                fill="black"
              />
            </Group>
          );
        })()}
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
