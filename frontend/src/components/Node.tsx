import { Circle, Text, Group, Rect } from "react-konva";
import { useState, useRef, useEffect } from "react";
import Konva from "konva";
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
  const expandNode = useDiagramStore((s) => s.expandNode);
  const setSelectedEdge = useDiagramStore((s) => s.setSelectedEdge);
  const setSelectedNodes = useDiagramStore((s) => s.setSelectedNodes);
  const selectedNodeIds = useDiagramStore((s) => s.selectedNodeIds);
  const isSelected = selectedNodeIds.includes(id);
  const [hovered, setHovered] = useState(false);
  // ref for the expand chevron icon
  const chevronRef = useRef<Konva.Text>(null);
  const [isDragging, setIsDragging] = useState(false);
  // context menu state: open flag and position in stage coordinates
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  // increased node dimensions for better visibility
  const width = 160;
  const height = 80;
  // extra padding around node for hover detection (in pixels)
  const hitPadding = 8;
  // ref for the Konva Text node to enable inline editing
  const textRef = useRef<any>(null);
  // handle double-click to edit the node label inline
  const handleTextDblClick = (e: any) => {
    e.cancelBubble = true;
    const stage = e.target.getStage()!;
    const layer = e.target.getLayer()!;
    const textNode = textRef.current!;
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
    // create and style the textarea element for multiline input with wrapping
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.setAttribute("wrap", "soft");
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = width + "px";
    textarea.style.height = height + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.outline = "none";
    textarea.style.textAlign = "center";
    // use a sensible line-height matching the font size to fit multiple lines
    textarea.style.lineHeight = textNode.fontSize() + "px";
    textarea.style.color = textNode.fill();
    textarea.style.resize = "none";
    textarea.style.overflowY = "auto";
    textarea.style.overflowX = "hidden";
    textarea.style.whiteSpace = "pre-wrap";
    textarea.style.wordWrap = "break-word";
    textarea.focus();
    textarea.select();
    // helper to remove the textarea and restore text
    const removeTextarea = () => {
      textarea.remove();
      textNode.show();
      layer.draw();
    };
    // on blur, commit changes
    textarea.addEventListener("blur", () => {
      updateLabel(id, textarea.value);
      removeTextarea();
    });
    // handle Enter (commit) and Escape (cancel)
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
  /**
   * Right-click handler to open custom context menu on this node
   */
  const handleContextMenu = (e: any) => {
    // prevent browser context menu
    if (e.evt && e.evt.preventDefault) {
      e.evt.preventDefault();
    }
    // stop Konva event bubbling
    e.cancelBubble = true;
    // get click position in stage coordinates
    const stage = e.target.getStage()!;
    const pos = stage.getPointerPosition();
    if (pos) {
      setMenuPos({ x: pos.x, y: pos.y });
      setContextMenuOpen(true);
    }
  };
  const closeContextMenu = () => setContextMenuOpen(false);
  // menu actions
  const handleEditTextMenu = () => {
    closeContextMenu();
    // trigger inline edit on the label text
    const fakeEvt: any = { target: textRef.current!, cancelBubble: false };
    handleTextDblClick(fakeEvt);
  };
  const handleDummyMenu = () => {
    closeContextMenu();
    // no-op
  };
  /** Expand this node into its subgraph */
  const handleExpandMenu = () => {
    closeContextMenu();
    expandNode(id);
  };
  // hover state for context menu items
  const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);
  /**
   * Close the context menu when clicking anywhere outside this node (background, other shapes, etc.)
   */
  useEffect(() => {
    if (!contextMenuOpen) return;
    // get the Konva Stage instance from any node (textRef)
    const stage = textRef.current?.getStage();
    if (!stage) return;
    // handler to close menu on stage click
    const handleStageClick = () => {
      closeContextMenu();
    };
    // listen for click events on the stage
    stage.on("click", handleStageClick);
    // cleanup when menu is closed or component unmounts
    return () => {
      stage.off("click", handleStageClick);
    };
  }, [contextMenuOpen, closeContextMenu]);
  // animate chevron opacity based on hover state
  useEffect(() => {
    if (chevronRef.current) {
      new Konva.Tween({
        node: chevronRef.current,
        duration: 0.2,
        opacity: hovered ? 1 : 0,
      }).play();
    }
  }, [hovered]);

  return (
    <Group
      // enable double-click to drill down into this node's child graph
      onDblClick={(e) => {
        e.cancelBubble = true;
        expandNode(id);
      }}
      onDblTap={(e) => {
        e.cancelBubble = true;
        expandNode(id);
      }}
      id={id}
      x={x}
      y={y}
      draggable
      onContextMenu={handleContextMenu}
      onClick={(e) => {
        e.cancelBubble = true;
        if (contextMenuOpen) {
          closeContextMenu();
          return;
        }
        // select this node and clear any selected edge
        setSelectedEdge(null);
        setSelectedNodes([id]);
      }}
      scaleX={isDragging ? 1.05 : 1}
      scaleY={isDragging ? 1.05 : 1}
      onMouseEnter={(e) => {
        setHovered(true);
        const container = e.target.getStage()!.container();
        container.style.cursor = "grab";
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        const container = e.target.getStage()!.container();
        container.style.cursor = "default";
      }}
      onMouseDown={(e) => {
        const container = e.target.getStage()!.container();
        container.style.cursor = "grabbing";
      }}
      onMouseUp={(e) => {
        const container = e.target.getStage()!.container();
        container.style.cursor = "grab";
      }}
      onDragStart={(e) => {
        setIsDragging(true);
        const container = e.target.getStage()!.container();
        container.style.cursor = "grabbing";
      }}
      onDragMove={(e) => {
        update(id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        update(id, e.target.x(), e.target.y());
        const container = e.target.getStage()!.container();
        container.style.cursor = "grab";
      }}
    >
      {/* invisible hit area for hover beyond node bounds */}
      <Rect
        x={-width / 2 - hitPadding}
        y={-height / 2 - hitPadding}
        width={width + hitPadding * 2}
        height={height + hitPadding * 2}
        fill="black"
        opacity={0.01}
      />
      {/* actual node rectangle */}
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: height }}
        fillLinearGradientColorStops={[0, "#6366f1", 1, "#4f46e5"]}
        cornerRadius={8}
        stroke={isSelected || hovered ? "#4f46e5" : "#ffffff"}
        strokeWidth={isSelected || hovered ? 3 : 2}
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
      {(hovered || isSelected) && (
        <>
          {/* Tooltip with full node label */}
          {hovered && (
            <Group x={-width / 2} y={-height / 2 - 24}>
              <Rect
                width={width}
                height={24}
                fill="black"
                cornerRadius={4}
                opacity={0.75}
              />
              <Text
                text={label}
                fontSize={12}
                fill="white"
                width={width}
                height={24}
                align="center"
                verticalAlign="middle"
              />
            </Group>
          )}
          {/* Expand chevron (click to drill down) */}
          <Text
            ref={chevronRef}
            text="▶"
            fontSize={16}
            fill="white"
            x={width / 2 - 12}
            y={-height / 2 + 4}
            opacity={0}
            onClick={(e) => {
              e.cancelBubble = true;
              expandNode(id);
            }}
          />
          {/* Edge connection handles */}
          {/* Edge handles */}
          {/* Top */}
          <Group
            x={0}
            y={-height / 2}
            onMouseEnter={(e) => {
              const container = e.target.getStage()!.container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()!.container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage()!;
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
              const container = e.target.getStage()!.container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()!.container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage()!;
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
              const container = e.target.getStage()!.container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()!.container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage()!;
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
              const container = e.target.getStage()!.container();
              container.style.cursor = "crosshair";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()!.container();
              container.style.cursor = "grab";
            }}
            onMouseDown={(e) => {
              e.cancelBubble = true;
              const stage = e.target.getStage()!;
              const pos = stage.getPointerPosition()!;
              startConnecting(id, pos.x, pos.y);
            }}
          >
            <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
          </Group>
        </>
      )}
      {/* tooltip on hover: display node label above node */}
      {hovered && (
        <Group
          // position tooltip above the node
          x={-(label.length * 7 + 8) / 2}
          y={-height / 2 - (14 + 8)}
        >
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
      {/* custom context menu rendered inside Konva when open */}
      {contextMenuOpen && (
        <Group x={menuPos.x - x} y={menuPos.y - y}>
          {/* menu background */}
          <Rect
            width={120}
            height={72}
            fill="white"
            stroke="gray"
            cornerRadius={4}
            shadowColor="black"
            shadowBlur={4}
            shadowOffset={{ x: 2, y: 2 }}
            shadowOpacity={0.3}
          />
          {[
            { label: "Edit Text", onClick: handleEditTextMenu },
            { label: "Expand", onClick: handleExpandMenu },
            { label: "Dummy", onClick: handleDummyMenu },
          ].map((item, i) => (
            <Group
              key={i}
              y={i * 24}
              onMouseEnter={() => {
                setHoveredMenuItem(i);
              }}
              onMouseLeave={() => {
                setHoveredMenuItem(null);
              }}
              onClick={(e) => {
                e.cancelBubble = true;
                item.onClick();
              }}
            >
              <Rect
                width={120}
                height={24}
                fill={hoveredMenuItem === i ? "#e8e8e8" : "white"}
              />
              <Text
                text={item.label}
                fontSize={14}
                fill="black"
                padding={4}
                width={120}
                height={24}
              />
            </Group>
          ))}
        </Group>
      )}
    </Group>
  );
};
