import { Circle, Text, Group, Rect } from "react-konva";
import { useState, useRef } from "react";
import { useDiagramStore } from "../store/diagramStore";

type Props = {
  id: string;
  x: number;
  y: number;
  label: string;
};

export const Node = ({ id, x, y, label }: Props) => {
  const update = useDiagramStore((s) => s.updateNodePosition);
  const updateLabel = useDiagramStore((s) => s.updateNodeLabel);
  const startConnecting = useDiagramStore((s) => s.startConnecting);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const width = 120;
  const height = 60;
  // ref for the Konva Text node to enable inline editing
  const textRef = useRef<any>(null);
  // handle double-click to edit the node label inline
  const handleTextDblClick = (e: any) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    const layer = e.target.getLayer();
    const textNode = textRef.current;
    // hide the Konva text and redraw layer
    textNode.hide();
    layer.draw();
    // calculate position for the HTML input
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    // create and style the input element
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = textNode.text();
    input.style.position = "absolute";
    input.style.top = areaPosition.y + "px";
    input.style.left = areaPosition.x + "px";
    input.style.width = width + "px";
    input.style.fontSize = textNode.fontSize() + "px";
    input.style.border = "none";
    input.style.padding = "0px";
    input.style.margin = "0px";
    input.style.outline = "none";
    input.style.textAlign = "center";
    // match the node height and center text vertically
    input.style.height = height + "px";
    input.style.lineHeight = height + "px";
    input.style.color = textNode.fill();
    input.focus();
    input.select();
    // helper to remove the input and restore text
    const removeInput = () => {
      input.remove();
      textNode.show();
      layer.draw();
    };
    // on blur, commit changes
    input.addEventListener("blur", () => {
      updateLabel(id, input.value);
      removeInput();
    });
    // handle Enter (commit) and Escape (cancel)
    input.addEventListener("keydown", (ev: any) => {
      if (ev.key === "Enter") {
        input.blur();
      }
      if (ev.key === "Escape") {
        removeInput();
      }
    });
  };

  return (
    <Group
      id={id}
      x={x}
      y={y}
      draggable
      scaleX={isDragging ? 1.05 : 1}
      scaleY={isDragging ? 1.05 : 1}
      onMouseEnter={(e) => {
        setHovered(true);
        const container = e.target.getStage().container();
        container.style.cursor = "grab";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const container = e.target.getStage().container();
        container.style.cursor = "default";
      }}
      onMouseDown={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        const container = e.target.getStage().container();
        container.style.cursor = "grab";
      }}
      onDragStart={(e) => {
        setIsDragging(true);
        const container = e.target.getStage().container();
        container.style.cursor = "grabbing";
      }}
      onDragMove={(e) => {
        update(id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        update(id, e.target.x(), e.target.y());
        const container = e.target.getStage().container();
        container.style.cursor = "grab";
      }}
    >
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: height }}
        fillLinearGradientColorStops={[0, "#6366f1", 1, "#4f46e5"]}
        cornerRadius={8}
        stroke="#ffffff"
        strokeWidth={2}
        shadowColor="black"
        shadowBlur={isDragging ? 20 : 10}
        shadowOffset={{ x: isDragging ? 4 : 2, y: isDragging ? 4 : 2 }}
        shadowOpacity={isDragging ? 0.5 : 0.3}
      />
      <Text
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        text={label}
        fontSize={16}
        fill="white"
        align="center"
        verticalAlign="middle"
        ref={textRef}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
      />
      {hovered && (
        <>
          {/* Edge handles */}
          {/* Top */}
          <Group
            x={0}
            y={-height / 2}
            onMouseEnter={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage();
              const pos = stage.getPointerPosition()!;
              startConnecting(id, pos.x, pos.y);
            }}
          >
            <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
          </Group>
          {/* Right */}
          <Group
            x={width / 2}
            y={0}
            onMouseEnter={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage();
              const pos = stage.getPointerPosition()!;
              startConnecting(id, pos.x, pos.y);
            }}
          >
            <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
          </Group>
          {/* Bottom */}
          <Group
            x={0}
            y={height / 2}
            onMouseEnter={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage();
              const pos = stage.getPointerPosition()!;
              startConnecting(id, pos.x, pos.y);
            }}
          >
            <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
          </Group>
          {/* Left */}
          <Group
            x={-width / 2}
            y={0}
            onMouseEnter={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage();
              const pos = stage.getPointerPosition()!;
              startConnecting(id, pos.x, pos.y);
            }}
          >
            <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
          </Group>
        </>
      )}
    </Group>
  );
};
