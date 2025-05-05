import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { Canvas, CanvasViewport } from '../types/Canvas'
import { NodeReference } from '../types/Node'
import { EdgeReference } from '../types/Edge'

interface CanvasState {
    canvases: Record<string, Canvas>
    currentCanvasId: string
    breadcrumb: string[] // Array of canvas IDs representing the navigation path

    // Actions
    setCurrentCanvas: (canvasId: string) => void
    navigateToCanvas: (canvasId: string) => void
    navigateUp: () => void
    updateViewport: (canvasId: string, viewport: Partial<CanvasViewport>) => void
    createCanvas: (canvas: Omit<Canvas, 'id' | 'nodes' | 'edges' | 'viewport'>) => string
    addNodeToCanvas: (canvasId: string, nodeRef: NodeReference) => void
    addEdgeToCanvas: (canvasId: string, edgeRef: EdgeReference) => void
    removeNodeFromCanvas: (canvasId: string, nodeId: string) => void
    removeEdgeFromCanvas: (canvasId: string, edgeId: string) => void
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    canvases: {
        root: {
            id: 'root',
            name: 'Root Canvas',
            nodes: [],
            edges: [],
            viewport: {
                zoom: 1,
                offset: { x: 0, y: 0 },
            },
        },
    },
    currentCanvasId: 'root',
    breadcrumb: ['root'],

    setCurrentCanvas: (canvasId) => {
        set({ currentCanvasId: canvasId })
    },

    navigateToCanvas: (canvasId) => {
        const { breadcrumb } = get()
        const index = breadcrumb.indexOf(canvasId)

        if (index >= 0) {
            // Canvas is in breadcrumb, navigate up to it
            set({
                currentCanvasId: canvasId,
                breadcrumb: breadcrumb.slice(0, index + 1),
            })
        } else {
            // Canvas is not in breadcrumb, add it
            set({
                currentCanvasId: canvasId,
                breadcrumb: [...breadcrumb, canvasId],
            })
        }
    },

    navigateUp: () => {
        const { breadcrumb } = get()

        if (breadcrumb.length > 1) {
            const newBreadcrumb = breadcrumb.slice(0, -1)
            set({
                currentCanvasId: newBreadcrumb[newBreadcrumb.length - 1],
                breadcrumb: newBreadcrumb,
            })
        }
    },

    updateViewport: (canvasId, viewportUpdates) => {
        set((state) => ({
            canvases: {
                ...state.canvases,
                [canvasId]: {
                    ...state.canvases[canvasId],
                    viewport: {
                        ...state.canvases[canvasId].viewport,
                        ...viewportUpdates,
                    },
                },
            },
        }))
    },

    createCanvas: (canvas) => {
        const id = nanoid()
        set((state) => ({
            canvases: {
                ...state.canvases,
                [id]: {
                    ...canvas,
                    id,
                    nodes: [],
                    edges: [],
                    viewport: {
                        zoom: 1,
                        offset: { x: 0, y: 0 },
                    },
                },
            },
        }))
        return id
    },

    addNodeToCanvas: (canvasId, nodeRef) => {
        set((state) => ({
            canvases: {
                ...state.canvases,
                [canvasId]: {
                    ...state.canvases[canvasId],
                    nodes: [...state.canvases[canvasId].nodes, nodeRef],
                },
            },
        }))
    },

    addEdgeToCanvas: (canvasId, edgeRef) => {
        set((state) => ({
            canvases: {
                ...state.canvases,
                [canvasId]: {
                    ...state.canvases[canvasId],
                    edges: [...state.canvases[canvasId].edges, edgeRef],
                },
            },
        }))
    },

    removeNodeFromCanvas: (canvasId, nodeId) => {
        set((state) => ({
            canvases: {
                ...state.canvases,
                [canvasId]: {
                    ...state.canvases[canvasId],
                    nodes: state.canvases[canvasId].nodes.filter((node) => node.id !== nodeId),
                },
            },
        }))
    },

    removeEdgeFromCanvas: (canvasId, edgeId) => {
        set((state) => ({
            canvases: {
                ...state.canvases,
                [canvasId]: {
                    ...state.canvases[canvasId],
                    edges: state.canvases[canvasId].edges.filter((edge) => edge.id !== edgeId),
                },
            },
        }))
    },
}))
