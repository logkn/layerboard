import { Node, NodePosition } from '../types/Node';
import { Edge } from '../types/Edge';

/**
 * Calculate connection points between nodes
 */
export function calculateConnectionPoints(
    sourceNode: Node,
    targetNode: Node
): { source: NodePosition; target: NodePosition } {
    const sourceCenter = {
        x: sourceNode.position.x + sourceNode.size.width / 2,
        y: sourceNode.position.y + sourceNode.size.height / 2
    };

    const targetCenter = {
        x: targetNode.position.x + targetNode.size.width / 2,
        y: targetNode.position.y + targetNode.size.height / 2
    };

    // Calculate direction vector
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    // Normalize direction vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / length;
    const dirY = dy / length;

    // Source node intersection
    const sourceIntersection = getNodeIntersection(
        sourceNode,
        dirX,
        dirY
    );

    // Target node intersection (reverse direction)
    const targetIntersection = getNodeIntersection(
        targetNode,
        -dirX,
        -dirY
    );

    return {
        source: sourceIntersection,
        target: targetIntersection
    };
}

/**
 * Get the intersection point of a line from the center of a node in a given direction
 */
function getNodeIntersection(
    node: Node,
    dirX: number,
    dirY: number
): NodePosition {
    const nodeCenter = {
        x: node.position.x + node.size.width / 2,
        y: node.position.y + node.size.height / 2
    };

    // Half width and height
    const halfWidth = node.size.width / 2;
    const halfHeight = node.size.height / 2;

    // Calculate intersection with edges
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

    return {
        x: nodeCenter.x + tx,
        y: nodeCenter.y + ty
    };
}

/**
 * Generate layout suggestions for better node arrangement
 */
export function suggestLayout(nodes: Node[]): NodePosition[] {
    // Simple grid layout
    const gridSize = Math.ceil(Math.sqrt(nodes.length));
    const nodeWidth = 150;
    const nodeHeight = 80;
    const padding = 50;

    return nodes.map((_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        return {
            x: col * (nodeWidth + padding) + 100,
            y: row * (nodeHeight + padding) + 100
        };
    });
}

/**
 * Check for unresolved connections across abstraction layers
 */
export function findUnresolvedConnections(
    nodes: Record<string, Node>,
    edges: Record<string, Edge>
): Edge[] {
    const result: Edge[] = [];

    // For each edge, check if both source and target nodes exist in the same canvas
    Object.values(edges).forEach(edge => {
        const sourceNode = nodes[edge.source];
        const targetNode = nodes[edge.target];

        if (!sourceNode || !targetNode) {
            result.push(edge);
            return;
        }

        if (sourceNode.parentId !== targetNode.parentId) {
            result.push(edge);
        }
    });

    return result;
}

/**
 * Calculate the bounds of all nodes in a canvas
 */
export function calculateCanvasBounds(nodes: Node[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
} {
    if (nodes.length === 0) {
        return {
            minX: 0,
            minY: 0,
            maxX: 1000,
            maxY: 1000,
            width: 1000,
            height: 1000
        };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach(node => {
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
}
