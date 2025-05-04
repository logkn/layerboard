
import { create } from 'zustand'

export type Node = {
    id: string
    x: number
    y: number
    label: string
}
export type Edge = {
    id: string
    from: string
    to: string
}
export type Connecting = {
    from: string
    startX: number
    startY: number
    toX: number
    toY: number
}

interface DiagramState {
    nodes: Node[]
    edges: Edge[]
    connecting: Connecting | null
    addNode: (node: Node) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNodeLabel: (id: string, label: string) => void
    addEdge: (from: string, to: string) => void
    startConnecting: (from: string, x: number, y: number) => void
    updateConnecting: (x: number, y: number) => void
    finishConnecting: (to?: string) => void
}

export const useDiagramStore = create<DiagramState>((set) => ({
    nodes: [],
    edges: [],
    connecting: null,
    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
    updateNodePosition: (id, x, y) =>
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === id ? { ...n, x, y } : n
            ),
        })),
    updateNodeLabel: (id, label) =>
        set((state) => ({
            nodes: state.nodes.map((n) =>
                n.id === id ? { ...n, label } : n
            ),
        })),
    addEdge: (from, to) =>
        set((state) => ({
            edges: [
                ...state.edges,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    from,
                    to,
                },
            ],
        })),
    startConnecting: (from, x, y) =>
        set(() => ({
            connecting: { from, startX: x, startY: y, toX: x, toY: y },
        })),
    updateConnecting: (x, y) =>
        set((state) => {
            if (!state.connecting) return {}
            return { connecting: { ...state.connecting, toX: x, toY: y } }
        }),
    finishConnecting: (to) =>
        set((state) => {
            const conn = state.connecting
            if (!conn) return {}
            const newEdges = to
                ? [
                      ...state.edges,
                      {
                          id: Math.random().toString(36).substr(2, 9),
                          from: conn.from,
                          to,
                      },
                  ]
                : state.edges
            return { edges: newEdges, connecting: null }
        }),
}))
