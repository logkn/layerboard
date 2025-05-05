import React, { useMemo } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useNodeStore } from '../../store/nodeStore';
import { useEdgeStore } from '../../store/edgeStore';

interface MiniMapProps {
    canvasId: string;
    width?: number;
    height?: number;
}

const MiniMap: React.FC<MiniMapProps> = ({
    canvasId,
    width = 200,
    height = 120
}) => {
    const { canvases, updateViewport } = useCanvasStore();
    const { nodes } = useNodeStore();
    const { edges } = useEdgeStore();

    const canvas = canvases[canvasId];

    if (!canvas) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-background rounded-md text-text-secondary text-xs">
                Canvas not found
            </div>
        );
    }

    // Calculate bounds of all nodes to determine the view area
    const bounds = useMemo(() => {
        if (canvas.nodes.length === 0) {
            return { minX: 0, minY: 0, maxX: 1000, maxY: 1000, width: 1000, height: 1000 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        canvas.nodes.forEach(nodeRef => {
            const node = nodes[nodeRef.id];
            if (!node) return;

            minX = Math.min(minX, node.position.x);
            minY = Math.min(minY, node.position.y);
            maxX = Math.max(maxX, node.position.x + node.size.width);
            maxY = Math.max(maxY, node.position.y + node.size.height);
        });

        // Add some padding
        minX -= 100;
        minY -= 100;
        maxX += 100;
        maxY += 100;

        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY
        };
    }, [canvas.nodes, nodes]);

    // Calculate the scale to fit all content
    const scale = useMemo(() => {
        const scaleX = width / bounds.width;
        const scaleY = height / bounds.height;
        return Math.min(scaleX, scaleY, 1); // Limit to 1 to prevent scaling up
    }, [bounds, width, height]);

    // Calculate current viewport view rect
    const viewportRect = useMemo(() => {
        const clientWidth = window.innerWidth;
        const clientHeight = window.innerHeight;

        const viewX = -canvas.viewport.offset.x;
        const viewY = -canvas.viewport.offset.y;
        const viewWidth = clientWidth / canvas.viewport.zoom;
        const viewHeight = clientHeight / canvas.viewport.zoom;

        return {
            x: (viewX - bounds.minX) * scale,
            y: (viewY - bounds.minY) * scale,
            width: viewWidth * scale,
            height: viewHeight * scale
        };
    }, [canvas.viewport, bounds, scale]);

    const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Convert click to canvas coordinates
        const canvasX = bounds.minX + x / scale;
        const canvasY = bounds.minY + y / scale;

        // Update viewport to center on clicked point
        updateViewport(canvasId, {
            offset: {
                x: -canvasX + window.innerWidth / (2 * canvas.viewport.zoom),
                y: -canvasY + window.innerHeight / (2 * canvas.viewport.zoom)
            }
        });
    };

    return (
        <div className="w-full h-full bg-background rounded relative">
            <svg
                width={width}
                height={height}
                className="w-full h-full"
                onClick={handleClick}
            >
                {/* Draw edges */}
                {canvas.edges.map(edgeRef => {
                    const edge = edges[edgeRef.id];
                    if (!edge) return null;

                    const sourceNode = nodes[edge.source];
                    const targetNode = nodes[edge.target];
                    if (!sourceNode || !targetNode) return null;

                    const sourceX = (sourceNode.position.x + sourceNode.size.width / 2 - bounds.minX) * scale;
                    const sourceY = (sourceNode.position.y + sourceNode.size.height / 2 - bounds.minY) * scale;
                    const targetX = (targetNode.position.x + targetNode.size.width / 2 - bounds.minX) * scale;
                    const targetY = (targetNode.position.y + targetNode.size.height / 2 - bounds.minY) * scale;

                    return (
                        <line
                            key={edge.id}
                            x1={sourceX}
                            y1={sourceY}
                            x2={targetX}
                            y2={targetY}
                            stroke={edge.style.color || '#6E56CF'}
                            strokeWidth={1}
                            strokeOpacity={0.6}
                        />
                    );
                })}

                {/* Draw nodes */}
                {canvas.nodes.map(nodeRef => {
                    const node = nodes[nodeRef.id];
                    if (!node) return null;

                    const nodeX = (node.position.x - bounds.minX) * scale;
                    const nodeY = (node.position.y - bounds.minY) * scale;
                    const nodeWidth = node.size.width * scale;
                    const nodeHeight = node.size.height * scale;

                    return (
                        <rect
                            key={node.id}
                            x={nodeX}
                            y={nodeY}
                            width={nodeWidth}
                            height={nodeHeight}
                            rx={2}
                            fill={node.style.color || '#6E56CF'}
                            fillOpacity={0.3}
                            stroke={node.style.color || '#6E56CF'}
                            strokeWidth={1}
                        />
                    );
                })}

                {/* Draw viewport rectangle */}
                <rect
                    x={viewportRect.x}
                    y={viewportRect.y}
                    width={viewportRect.width}
                    height={viewportRect.height}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={1}
                    strokeDasharray="2,2"
                />
            </svg>
        </div>
    );
};

export default MiniMap;
