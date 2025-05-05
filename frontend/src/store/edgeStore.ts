import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { Edge, EdgeStyle } from '../types/Edge'
import { useCanvasStore } from './canvasStore'

interface EdgeState {
    edges: Record<string, Edge>
    pendingEdge: {
        sourceId: string | null
        pending: boolean
    }

    // Actions
    createEdge: (canvasId: string, edge: Omit<Edge, 'id'>) => string
    updateEdge: (edgeId: string, updates: Partial<Edge>) => void
    deleteEdge: (edgeId: string) => void
    styleEdge: (edgeId: string, style: EdgeStyle) => void
    startEdgeCreation: (sourceId: string) => void
    finishEdgeCreation: (targetId: string) => void
    cancelEdgeCreation: () => void
}

export const useEdgeStore = create<EdgeState>((set, get) => ({
    edges: {},
    pendingEdge: {
        sourceId: null,
        pending: false,
    },

    createEdge: (canvasId, edge) => {
        const id = nanoid()

        set((state) => ({
            edges: {
                ...state.edges,
                [id]: {
                    ...edge,
                    id,
                },
            },
        }))

        // Add the edge to the current canvas
        const canvasStore = useCanvasStore.getState()
        canvasStore.addEdgeToCanvas(canvasId, { id })

        return id
    },

    updateEdge: (edgeId, updates) => {
        set((state) => ({
            edges: {
                ...state.edges,
                [edgeId]: {
                    ...state.edges[edgeId],
                    ...updates,
                },
            },
        }))
    },

    deleteEdge: (edgeId) => {
        set((state) => {
            const { [edgeId]: _, ...remainingEdges } = state.edges
            return { edges: remainingEdges }
        })

        // Remove the edge from all canvases
        const canvasStore = useCanvasStore.getState()
        Object.keys(canvasStore.canvases).forEach((canvasId) => {
            canvasStore.removeEdgeFromCanvas(canvasId, edgeId)
        })
    },

    styleEdge: (edgeId, style) => {
        set((state) => ({
            edges: {
                ...state.edges,
                [edgeId]: {
                    ...state.edges[edgeId],
                    style: {
                        ...state.edges[edgeId].style,
                        ...style,
                    },
                },
            },
        }))
    },

    startEdgeCreation: (sourceId) => {
        set({
            pendingEdge: {
                sourceId,
                pending: true,
            },
        })
    },

    finishEdgeCreation: (targetId) => {
        const { pendingEdge } = get()

        if (!pendingEdge.pending || !pendingEdge.sourceId) {
            return
        }

        // Don't create self-loops
        if (pendingEdge.sourceId === targetId) {
            set({
                pendingEdge: {
                    sourceId: null,
                    pending: false,
                },
            })
            return
        }

        // Create the edge
        const canvasStore = useCanvasStore.getState()
        const currentCanvasId = canvasStore.currentCanvasId

        get().createEdge(currentCanvasId, {
            source: pendingEdge.sourceId,
            target: targetId,
            style: {},
            bidirectional: false,
        })

        // Reset pending edge
        set({
            pendingEdge: {
                sourceId: null,
                pending: false,
            },
        })
    },

    cancelEdgeCreation: () => {
        set({
            pendingEdge: {
                sourceId: null,
                pending: false,
            },
        })
    },
}))
