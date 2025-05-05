import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Node, NodePosition, NodeSize, NodeStyle } from '../types/Node';
import { useCanvasStore } from './canvasStore';

interface NodeState {
    nodes: Record<string, Node>;

    // Actions
    createNode: (canvasId: string, node: Omit<Node, 'id' | 'expanded'>) => string;
    updateNode: (nodeId: string, updates: Partial<Node>) => void;
    deleteNode: (nodeId: string) => void;
    expandNode: (nodeId: string) => void;
    moveNode: (nodeId: string, position: NodePosition) => void;
    resizeNode: (nodeId: string, size: NodeSize) => void;
    styleNode: (nodeId: string, style: NodeStyle) => void;
}

export const useNodeStore = create<NodeState>((set, get) => ({
    nodes: {},

    createNode: (canvasId, node) => {
        const id = nanoid();

        set((state) => ({
            nodes: {
                ...state.nodes,
                [id]: {
                    ...node,
                    id,
                    expanded: false,
                }
            }
        }));

        // Add the node to the current canvas
        const canvasStore = useCanvasStore.getState();
        canvasStore.addNodeToCanvas(canvasId, { id });

        return id;
    },

    updateNode: (nodeId, updates) => {
        set((state) => ({
            nodes: {
                ...state.nodes,
                [nodeId]: {
                    ...state.nodes[nodeId],
                    ...updates
                }
            }
        }));
    },

    deleteNode: (nodeId) => {
        const { nodes } = get();
        const nodeToDelete = nodes[nodeId];

        if (!nodeToDelete) return;

        // Delete any child canvas if it exists
        if (nodeToDelete.childCanvasId) {
            // Future enhancement: Delete child canvas and all its nodes
        }

        set((state) => {
            const { [nodeId]: _, ...remainingNodes } = state.nodes;
            return { nodes: remainingNodes };
        });

        // Remove the node from its parent canvas
        const canvasStore = useCanvasStore.getState();
        Object.keys(canvasStore.canvases).forEach(canvasId => {
            canvasStore.removeNodeFromCanvas(canvasId, nodeId);
        });
    },

    expandNode: (nodeId) => {
        const { nodes } = get();
        const node = nodes[nodeId];

        if (!node) return;

        // Create a new canvas for the expanded node if it doesn't exist
        const canvasStore = useCanvasStore.getState();
        let childCanvasId = node.childCanvasId;

        if (!childCanvasId) {
            childCanvasId = canvasStore.createCanvas({
                name: node.label,
                parentNodeId: nodeId,
            });

            // Update the node with the child canvas ID
            set((state) => ({
                nodes: {
                    ...state.nodes,
                    [nodeId]: {
                        ...state.nodes[nodeId],
                        childCanvasId,
                        expanded: true
                    }
                }
            }));
        } else {
            // Just mark the node as expanded
            set((state) => ({
                nodes: {
                    ...state.nodes,
                    [nodeId]: {
                        ...state.nodes[nodeId],
                        expanded: true
                    }
                }
            }));
        }

        // Navigate to the child canvas
        canvasStore.navigateToCanvas(childCanvasId);
    },

    moveNode: (nodeId, position) => {
        set((state) => ({
            nodes: {
                ...state.nodes,
                [nodeId]: {
                    ...state.nodes[nodeId],
                    position
                }
            }
        }));
    },

    resizeNode: (nodeId, size) => {
        set((state) => ({
            nodes: {
                ...state.nodes,
                [nodeId]: {
                    ...state.nodes[nodeId],
                    size
                }
            }
        }));
    },

    styleNode: (nodeId, style) => {
        set((state) => ({
            nodes: {
                ...state.nodes,
                [nodeId]: {
                    ...state.nodes[nodeId],
                    style: {
                        ...state.nodes[nodeId].style,
                        ...style
                    }
                }
            }
        }));
    }
}));
