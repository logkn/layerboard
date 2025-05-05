import { Arrow, Circle, Group, Text, Rect } from "react-konva";
import { useState, useRef, useEffect } from "react";
import { useDiagramStore, Edge as EdgeType } from "../store/diagramStore";

// Node dimensions and stroke width (must match Node component)
const NODE_WIDTH = 160;
const NODE_HEIGHT = 80;
// Node rectangle stroke is centered: half is outside
const NODE_STROKE_WIDTH = 2;
const STROKE_OFFSET = NODE_STROKE_WIDTH / 2;

type Props = EdgeType;

export const Edge = ({ id, from, to, label }: Props) => {
  const nodes = useDiagramStore((s) => s.graphs[s.currentGraphId].nodes);
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  // selection and actions from store
  const selectedEdgeId = useDiagramStore((s) => s.selectedEdgeId);
  const setSelectedEdge = useDiagramStore((s) => s.setSelectedEdge);
  const updateEdgeLabel = useDiagramStore((s) => s.updateEdgeLabel);
  const deleteEdge = useDiagramStore((s) => s.deleteEdge);
  const reverseEdgeDirection = useDiagramStore((s) => s.reverseEdgeDirection);
  const copyEdgeProperties = useDiagramStore((s) => s.copyEdgeProperties);
  const pasteEdgeProperties = useDiagramStore((s) => s.pasteEdgeProperties);

  // determine offset for handles based on relative positions
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  let startX: number, startY: number, endX: number, endY: number;
  if (absDx > absDy) {
    // horizontal connection: attach to left/right node border (including stroke)
    startX =
      fromNode.x +
      (dx > 0
        ? NODE_WIDTH / 2 + STROKE_OFFSET
        : -NODE_WIDTH / 2 - STROKE_OFFSET);
    startY = fromNode.y;
    endX =
      toNode.x +
      (dx > 0
        ? -NODE_WIDTH / 2 - STROKE_OFFSET
        : NODE_WIDTH / 2 + STROKE_OFFSET);
    endY = toNode.y;
  } else {
    // vertical connection: attach to top/bottom node border (including stroke)
    startX = fromNode.x;
    startY =
      fromNode.y +
      (dy > 0
        ? NODE_HEIGHT / 2 + STROKE_OFFSET
        : -NODE_HEIGHT / 2 - STROKE_OFFSET);
    endX = toNode.x;
    endY =
      toNode.y +
      (dy > 0
        ? -NODE_HEIGHT / 2 - STROKE_OFFSET
        : NODE_HEIGHT / 2 + STROKE_OFFSET);
  }
  // midpoint for label placement
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  // local UI state
  const [hovered, setHovered] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
  const textRef = useRef<any>(null);
  const isSelected = selectedEdgeId === id;

  // inline edit handler for edge label
  const handleTextDblClick = (e: any) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const layer = e.target.getLayer();
    const textNode = textRef.current;
    if (!stage || !layer || !textNode) return;
    textNode.hide();
    layer.draw();
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = "100px";
    textarea.style.height = "20px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.outline = "none";
    textarea.style.background = "none";
    textarea.style.resize = "none";
    textarea.focus();
    textarea.select();
    const removeTextarea = () => {
      textarea.remove();
      textNode.show();
      layer.draw();
    };
    textarea.addEventListener("blur", () => {
      updateEdgeLabel(id, textarea.value);
      removeTextarea();
    });
    textarea.addEventListener("keydown", (ev: any) => {
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        textarea.blur();
      }
      if (ev.key === "Escape") {
        ev.preventDefault();
        removeTextarea();
      }
    });
  };

  // context menu handlers
  const handleContextMenu = (e: any) => {
    if (e.evt && e.evt.preventDefault) e.evt.preventDefault();
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (pos) {
      setMenuPos({ x: pos.x, y: pos.y });
      setContextMenuOpen(true);
    }
  };
  const closeContextMenu = () => setContextMenuOpen(false);
  const handleEditLabelMenu = () => {
    closeContextMenu();
    if (textRef.current)
      handleTextDblClick({ target: textRef.current, cancelBubble: false });
  };
  const handleDeleteEdgeMenu = () => {
    closeContextMenu();
    deleteEdge(id);
  };
  const handleReverseEdgeMenu = () => {
    closeContextMenu();
    reverseEdgeDirection(id);
  };
  const handleCopyPropsMenu = () => {
    closeContextMenu();
    copyEdgeProperties(id);
  };
  const handlePastePropsMenu = () => {
    closeContextMenu();
    pasteEdgeProperties(id);
  };

  // close menu on outside click
  useEffect(() => {
    if (!contextMenuOpen) return;
    const stage = textRef.current?.getStage();
    if (!stage) return;
    const handleStageClick = () => closeContextMenu();
    stage.on("click", handleStageClick);
    return () => {
      stage.off("click", handleStageClick);
    };
  }, [contextMenuOpen]);

  return (
    <Group
      id={id}
      onMouseEnter={(e) => {
        setHovered(true);
        e.target.getStage()!.container().style.cursor = "pointer";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.target.getStage()!.container().style.cursor = "default";
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        setSelectedEdge(id);
        if (contextMenuOpen) closeContextMenu();
      }}
      onContextMenu={handleContextMenu}
    >
      <Arrow
        points={[startX, startY, endX, endY]}
        stroke={isSelected ? "#4f46e5" : hovered ? "#4f46e5" : "black"}
        strokeWidth={isSelected ? 4 : hovered ? 3 : 2}
        fill={isSelected ? "#4f46e5" : "black"}
      />
      {/* control points for rerouting when selected */}
      {isSelected && (
        <>
          <Circle
            x={startX}
            y={startY}
            radius={6}
            fill="white"
            stroke="#4f46e5"
            strokeWidth={2}
          />
          <Circle
            x={endX}
            y={endY}
            radius={6}
            fill="white"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </>
      )}
      {/* edge label */}
      <Text
        ref={textRef}
        text={label}
        fontSize={14}
        fill="black"
        width={100}
        x={midX - 50}
        y={midY - 10}
        align="center"
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
      />
      {/* tooltip on hover: display edge label near midpoint */}
      {hovered && label && (
        <Group x={midX + 10} y={midY + 10}>
          <Rect
            width={label.length * 7 + 8}
            height={14 + 8}
            fill="white"
            stroke="gray"
            cornerRadius={4}
          />
          <Text
            text={label}
            fontSize={14}
            fill="black"
            x={4}
            y={4}
          />
        </Group>
      )}
      {/* context menu */}
      {contextMenuOpen && (
        <Group x={menuPos.x} y={menuPos.y}>
          <Rect
            width={140}
            height={24 * 5}
            fill="white"
            stroke="gray"
            cornerRadius={4}
            shadowColor="black"
            shadowBlur={4}
            shadowOffset={{ x: 2, y: 2 }}
            shadowOpacity={0.3}
          />
          {[
            { label: "Edit Label…", onClick: handleEditLabelMenu },
            { label: "Delete Edge", onClick: handleDeleteEdgeMenu },
            { label: "Reverse Direction", onClick: handleReverseEdgeMenu },
            { label: "Copy Properties", onClick: handleCopyPropsMenu },
            { label: "Paste Properties", onClick: handlePastePropsMenu },
          ].map((item, i) => (
            <Group
              key={i}
              y={i * 24}
              onMouseEnter={() => setHoveredMenuItem(i)}
              onMouseLeave={() => setHoveredMenuItem(null)}
              onClick={(e) => {
                e.cancelBubble = true;
                item.onClick();
              }}
            >
              <Rect
                width={140}
                height={24}
                fill={hoveredMenuItem === i ? "#e8e8e8" : "white"}
              />
              <Text
                text={item.label}
                fontSize={14}
                fill="black"
                padding={4}
                width={140}
                height={24}
                verticalAlign="middle"
              />
            </Group>
          ))}
        </Group>
      )}
    </Group>
  );
};
