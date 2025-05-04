
import { create } from 'zustand'

export type Node = {
    id: string
    x: number
    y: number
    label: string
}

interface DiagramState {
    nodes: Node[]
    addNode: (node: Node) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    updateNodeLabel: (id: string, label: string) => void
}

export const useDiagramStore = create<DiagramState>((set) => ({
    nodes: [],
    addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, node] })),
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
}))
