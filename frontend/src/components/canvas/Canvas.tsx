import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useNodeStore } from '../../store/nodeStore';
import { useEdgeStore } from '../../store/edgeStore';
import { useCanvasGestures } from '../../hooks/useCanvasGestures';
import Node from './Node';
import Edge from './Edge';
import CanvasControls from './CanvasControls';
import { NodePosition } from '../../types/Node';

interface CanvasProps {
    canvasId: string;
}

const Canvas: React.FC<CanvasProps> = ({ canvasId }) => {
    const { canvases } = useCanvasStore();
    const { nodes, moveNode, expandNode } = useNodeStore();
    const { edges, pendingEdge, cancelEdgeCreation } = useEdgeStore();
    const [mousePosition, setMousePosition] = useState<NodePosition>({ x: 0, y: 0 });

    const canvas = canvases[canvasId];

    if (!canvas) {
        return <div className="flex items-center justify-center h-full text-text-secondary">Canvas not found</div>;
    }

    // Updated node drag handler that accounts for the delta movement
    const handleNodeDrag = (nodeId: string, delta: NodePosition) => {
        const node = nodes[nodeId];
        if (node) {
            moveNode(nodeId, {
                x: node.position.x + delta.x,
                y: node.position.y + delta.y
            });
        }
    };

    const handleNodeExpand = (nodeId: string) => {
        expandNode(nodeId);
    };

    const {
        isPanning,
        handleCanvasMouseDown,
        handleCanvasMouseMove,
        handleCanvasMouseUp,
        handleCanvasWheel,
        startNodeDrag
    } = useCanvasGestures({
        canvasId,
        onNodeDrag: handleNodeDrag
    });

    const handleCanvasClick = () => {
        // If we're in edge creation mode, cancel it on canvas click
        if (pendingEdge.pending) {
            cancelEdgeCreation();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        // Update mouse position for the pending edge
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / canvas.viewport.zoom - canvas.viewport.offset.x;
        const y = (e.clientY - rect.top) / canvas.viewport.zoom - canvas.viewport.offset.y;

        setMousePosition({ x, y });
        handleCanvasMouseMove(e);
    };

    return (
        <div className="relative w-full h-full bg-background overflow-hidden">
            <div
                className={`absolute w-full h-full cursor-${isPanning ? 'grabbing' : 'grab'}`}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onWheel={handleCanvasWheel}
                onClick={handleCanvasClick}
            >
                {/* Grid (optional) */}
                <svg
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        transform: `translate(${canvas.viewport.offset.x * canvas.viewport.zoom}px, ${canvas.viewport.offset.y * canvas.viewport.zoom}px) scale(${canvas.viewport.zoom})`,
                        transformOrigin: '0 0'
                    }}
                >
                    {/* Draw edges */}
                    {canvas.edges.map((edgeRef) => {
                        const edge = edges[edgeRef.id];
                        if (!edge) return null;

                        // Get source and target nodes
                        const sourceNode = nodes[edge.source];
                        const targetNode = nodes[edge.target];

                        if (!sourceNode || !targetNode) return null;

                        return (
                            <Edge
                                key={edge.id}
                                edge={edge}
                                sourceNode={sourceNode}
                                targetNode={targetNode}
                            />
                        );
                    })}

                    {/* Draw pending edge if we're creating one */}
                    {pendingEdge.pending && pendingEdge.sourceId && (
                        <Edge
                            isPending
                            edge={{
                                id: 'pending',
                                source: pendingEdge.sourceId,
                                target: 'pending',
                                style: { color: '#6E56CF', strokeWidth: 2 },
                                bidirectional: false
                            }}
                            sourceNode={nodes[pendingEdge.sourceId]}
                            targetPosition={mousePosition}
                        />
                    )}

                    {/* Draw nodes */}
                    {canvas.nodes.map((nodeRef) => {
                        const node = nodes[nodeRef.id];
                        if (!node) return null;

                        return (
                            <Node
                                key={node.id}
                                node={node}
                                onDragStart={(e) => startNodeDrag(node.id, e)}
                                onNodeExpand={() => handleNodeExpand(node.id)}
                                onPortClick={() => { }}
                            />
                        );
                    })}
                </svg>

                <CanvasControls canvasId={canvasId} />
            </div>
        </div>
    );
};

export default Canvas;
