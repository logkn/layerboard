import React from 'react';
import { Edge as EdgeType } from '../../types/Edge';
import { Node as NodeType, NodePosition } from '../../types/Node';

interface EdgeProps {
    edge: EdgeType;
    sourceNode: NodeType;
    targetNode?: NodeType;
    targetPosition?: NodePosition;
    isPending?: boolean;
}

const Edge: React.FC<EdgeProps> = ({
    edge,
    sourceNode,
    targetNode,
    targetPosition,
    isPending = false
}) => {
    if (!sourceNode) return null;

    // Default styles
    const defaultColor = '#6E56CF';
    const defaultStrokeWidth = 2;
    const defaultDashArray = '';

    // Calculate source port position
    const sourceX = sourceNode.position.x + sourceNode.size.width / 2;
    const sourceY = sourceNode.position.y + sourceNode.size.height / 2;

    // Calculate target port position
    let targetX: number, targetY: number;

    if (isPending && targetPosition) {
        targetX = targetPosition.x;
        targetY = targetPosition.y;
    } else if (targetNode) {
        targetX = targetNode.position.x + targetNode.size.width / 2;
        targetY = targetNode.position.y + targetNode.size.height / 2;
    } else {
        return null;
    }

    // Find intersection points of line with node rectangles for better edge routing
    const calcIntersection = (
        node: NodeType,
        fromX: number,
        fromY: number
    ): [number, number] => {
        const centerX = node.position.x + node.size.width / 2;
        const centerY = node.position.y + node.size.height / 2;

        // Calculate slopes
        const dx = fromX - centerX;
        const dy = fromY - centerY;

        // Normalize direction vector
        const length = Math.sqrt(dx * dx + dy * dy);
        const dirX = dx / length;
        const dirY = dy / length;

        // Half width and height
        const halfWidth = node.size.width / 2;
        const halfHeight = node.size.height / 2;

        // Calculate candidate intersection points
        let tx, ty;

        if (Math.abs(dirX) * halfHeight > Math.abs(dirY) * halfWidth) {
            // Intersection with vertical edges
            tx = halfWidth * Math.sign(dirX);
            ty = tx * dirY / dirX;
        } else {
            // Intersection with horizontal edges
            ty = halfHeight * Math.sign(dirY);
            tx = ty * dirX / dirY;
        }

        return [centerX + tx, centerY + ty];
    };

    let sourcePoint: [number, number] = [sourceX, sourceY];
    let targetPoint: [number, number] = [targetX, targetY];

    // Only calculate intersections if this isn't a pending edge
    if (!isPending && targetNode) {
        sourcePoint = calcIntersection(sourceNode, targetX, targetY);
        targetPoint = calcIntersection(targetNode, sourceX, sourceY);
    }

    // Arrow marker for directional edges
    const markerId = `arrow-${edge.id}`;

    return (
        <>
            {/* Arrow marker definition for edges */}
            <defs>
                <marker
                    id={markerId}
                    viewBox="0 0 10 10"
                    refX="5"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                >
                    <path
                        d="M 0 0 L 10 5 L 0 10 z"
                        fill={edge.style.color || defaultColor}
                    />
                </marker>
            </defs>

            {/* Edge line */}
            <line
                x1={sourcePoint[0]}
                y1={sourcePoint[1]}
                x2={targetPoint[0]}
                y2={targetPoint[1]}
                stroke={edge.style.color || defaultColor}
                strokeWidth={edge.style.strokeWidth || defaultStrokeWidth}
                strokeDasharray={edge.style.dashArray || defaultDashArray}
                markerEnd={edge.bidirectional ? undefined : `url(#${markerId})`}
                className="pointer-events-none"
            />

            {/* Add second marker if bidirectional */}
            {edge.bidirectional && (
                <line
                    x1={sourcePoint[0]}
                    y1={sourcePoint[1]}
                    x2={targetPoint[0]}
                    y2={targetPoint[1]}
                    stroke="transparent"
                    strokeWidth={edge.style.strokeWidth || defaultStrokeWidth}
                    markerStart={`url(#${markerId})`}
                    className="pointer-events-none"
                />
            )}

            {/* Edge label */}
            {edge.label && !isPending && (
                <text
                    x={(sourcePoint[0] + targetPoint[0]) / 2}
                    y={(sourcePoint[1] + targetPoint[1]) / 2}
                    dx={0}
                    dy={-5}
                    fontSize={12}
                    textAnchor="middle"
                    fill={edge.style.color || defaultColor}
                    className="select-none pointer-events-none fill-text-secondary"
                >
                    {edge.label}
                </text>
            )}
        </>
    );
};

export default Edge;
