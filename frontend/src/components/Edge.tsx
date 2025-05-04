import React from "react";
import { Arrow } from "react-konva";
import { useDiagramStore, Edge as EdgeType } from "../store/diagramStore";

// Node dimensions (must match Node component)
const NODE_WIDTH = 120;
const NODE_HEIGHT = 60;

type Props = EdgeType;

export const Edge = ({ id, from, to }: Props) => {
  const nodes = useDiagramStore((s) => s.nodes);
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  // determine offset for handles based on relative positions
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let startX: number, startY: number, endX: number, endY: number;
  if (absDx > absDy) {
    // horizontal connection: attach to left/right handles
    startX = fromNode.x + (dx > 0 ? NODE_WIDTH / 2 : -NODE_WIDTH / 2);
    startY = fromNode.y;
    endX = toNode.x + (dx > 0 ? -NODE_WIDTH / 2 : NODE_WIDTH / 2);
    endY = toNode.y;
  } else {
    // vertical connection: attach to top/bottom handles
    startX = fromNode.x;
    startY = fromNode.y + (dy > 0 ? NODE_HEIGHT / 2 : -NODE_HEIGHT / 2);
    endX = toNode.x;
    endY = toNode.y + (dy > 0 ? -NODE_HEIGHT / 2 : NODE_HEIGHT / 2);
  }
  return (
    <Arrow
      points={[startX, startY, endX, endY]}
      stroke="black"
      fill="black"
    />
  );
};
