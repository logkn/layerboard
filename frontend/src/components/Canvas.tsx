import { Stage, Layer, Arrow, Rect, Text, Group } from "react-konva";
import { nanoid } from "nanoid";
import { useDiagramStore } from "../store/diagramStore";
import { Node } from "./Node";
import { Edge } from "./Edge";
import { useState, useEffect } from "react";

export const Canvas = () => {
  const currentGraphId = useDiagramStore((s) => s.currentGraphId);
  const rootNodes = useDiagramStore((s) => s.graphs["root"].nodes);
  const nodes = useDiagramStore((s) => s.graphs[currentGraphId].nodes);
  const edges = useDiagramStore((s) => s.graphs[currentGraphId].edges);
  const connecting = useDiagramStore((s) => s.connecting);
  const updateConnecting = useDiagramStore((s) => s.updateConnecting);
  const finishConnecting = useDiagramStore((s) => s.finishConnecting);
  const collapse = useDiagramStore((s) => s.collapse);
  // zoom scale from store
  const scale = useDiagramStore((s) => s.zoom);
  // keyboard shortcut: Esc or Backspace to drill up (collapse to parent graph)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Backspace") collapse();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [collapse]);
  const addNode = useDiagramStore((s) => s.addNode);
  // action to deselect selected edge when clicking on canvas background
  const setSelectedEdge = useDiagramStore((s) => s.setSelectedEdge);
  // action to select nodes (for marquee selection)
  const setSelectedNodes = useDiagramStore((s) => s.setSelectedNodes);
  // marquee selection state
  const [marqueeStart, setMarqueeStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  // background context menu state
  const [bgContextMenuOpen, setBgContextMenuOpen] = useState(false);
  const [bgMenuPos, setBgMenuPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [bgHoveredMenuItem, setBgHoveredMenuItem] = useState<number | null>(
    null,
  );
  // dimensions accounting for properties panel on the right (in px)
  const PANEL_WIDTH = 300;
  // canvas width excludes the right-sidebar panel
  const width = window.innerWidth - PANEL_WIDTH;
  const height = window.innerHeight;
  const BORDER_MARGIN = 50;

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      // enable dragging the canvas to pan and show off-screen nodes (disabled during marquee)
      draggable={!marqueeStart}
      // apply zoom scale
      scaleX={scale}
      scaleY={scale}
      // background mouse down: start marquee selection or clear selection
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !connecting) {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (pos) {
            setSelectedEdge(null);
            setSelectedNodes([]);
            setMarqueeStart(pos);
            setMarqueeEnd(pos);
          }
        }
      }}
      // subtle grid background that moves with the canvas
      style={{
        border: "1px solid rgba(0,0,0,0.2)",
        // grid cells 25×25px
        backgroundSize: "25px 25px",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), " +
          "linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
      }}
      onMouseMove={(e) => {
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (connecting) {
          if (pos) updateConnecting(pos.x, pos.y);
        } else if (marqueeStart && pos) {
          setMarqueeEnd(pos);
        }
      }}
      onMouseUp={(e) => {
        // finish edge connection
        if (connecting) {
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
          return;
        }
        // finish marquee selection
        if (marqueeStart && marqueeEnd) {
          const x1 = marqueeStart.x;
          const y1 = marqueeStart.y;
          const x2 = marqueeEnd.x;
          const y2 = marqueeEnd.y;
          const left = Math.min(x1, x2);
          const right = Math.max(x1, x2);
          const top = Math.min(y1, y2);
          const bottom = Math.max(y1, y2);
          const selectedIds = nodes
            .filter(
              (n) => n.x >= left && n.x <= right && n.y >= top && n.y <= bottom,
            )
            .map((n) => n.id);
          setSelectedNodes(selectedIds);
          setMarqueeStart(null);
          setMarqueeEnd(null);
        }
      }}
      // background context menu for canvas
      onContextMenu={(e) => {
        e.evt && e.evt.preventDefault();
        if (e.target === e.currentTarget) {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (pos) {
            setBgContextMenuOpen(true);
            setBgMenuPos({ x: pos.x, y: pos.y });
          }
        }
      }}
      onClick={(e) => {
        // close background context menu
        if (bgContextMenuOpen) {
          setBgContextMenuOpen(false);
        }
        // Deselect any selected edge when clicking on empty canvas
        if (e.target === e.currentTarget) {
          setSelectedEdge(null);
        }
        // Collapse to parent graph when clicking near canvas border in child graph
        if (currentGraphId !== "root") {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (
            pos &&
            (pos.x < BORDER_MARGIN ||
              pos.x > width - BORDER_MARGIN ||
              pos.y < BORDER_MARGIN ||
              pos.y > height - BORDER_MARGIN)
          ) {
            collapse();
          }
        }
      }}
      onDblClick={(e) => {
        if (connecting) return;
        // only add node when double-clicking on empty canvas
        if (e.target === e.currentTarget) {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (pos) {
            addNode({ id: nanoid(), x: pos.x, y: pos.y, label: "Node" });
          }
        }
      }}
      onDblTap={(e) => {
        if (connecting) return;
        if (e.target === e.currentTarget) {
          const stage = e.target.getStage();
          const pos = stage?.getPointerPosition();
          if (pos) {
            addNode({ id: nanoid(), x: pos.x, y: pos.y, label: "Node" });
          }
        }
      }}
    >
      <Layer>
        {/* If in a child graph, render a margin-inside dashed border and centered title */}
        {currentGraphId !== "root" &&
          (() => {
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
        {/* marquee selection rectangle */}
        {marqueeStart && marqueeEnd && (
          <Rect
            x={Math.min(marqueeStart.x, marqueeEnd.x)}
            y={Math.min(marqueeStart.y, marqueeEnd.y)}
            width={Math.abs(marqueeEnd.x - marqueeStart.x)}
            height={Math.abs(marqueeEnd.y - marqueeStart.y)}
            stroke="black"
            dash={[4, 4]}
            fill="rgba(0, 0, 255, 0.1)"
          />
        )}
        {/* background context menu */}
        {bgContextMenuOpen && (
          <Group x={bgMenuPos.x} y={bgMenuPos.y}>
            <Rect
              width={180}
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
              {
                label: "Add Node Here",
                action: () => {
                  addNode({
                    id: nanoid(),
                    x: bgMenuPos.x,
                    y: bgMenuPos.y,
                    label: "Node",
                  });
                },
              },
              { label: "Canvas Settings…", action: () => {} },
              { label: "Paste", action: () => {} },
              { label: "Zoom to Fit", action: () => {} },
              { label: "Export Current View", action: () => {} },
            ].map((item, i) => (
              <Group
                key={i}
                y={i * 24}
                onMouseEnter={() => setBgHoveredMenuItem(i)}
                onMouseLeave={() => setBgHoveredMenuItem(null)}
                onClick={(e) => {
                  e.cancelBubble = true;
                  item.action();
                  setBgContextMenuOpen(false);
                }}
              >
                <Rect
                  width={180}
                  height={24}
                  fill={bgHoveredMenuItem === i ? "#e8e8e8" : "white"}
                />
                <Text
                  text={item.label}
                  fontSize={14}
                  fill="black"
                  padding={4}
                  width={180}
                  height={24}
                  verticalAlign="middle"
                />
              </Group>
            ))}
          </Group>
        )}
      </Layer>
    </Stage>
  );
};
