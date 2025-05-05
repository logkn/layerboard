import { create } from "zustand";
import { NodeData } from "../types";

type GraphState = {
    nodes: NodeData[];
    addNode: (node: NodeData) => void;
    updateNode: (id: string, data: Partial<NodeData>) => void;
};

export const useGraphStore = create<GraphState>()(set => ({
    nodes: [],
    addNode: node => set(state => ({ nodes: [...state.nodes, node] })),
    updateNode: (id, data) =>
        set(state => ({
            nodes: state.nodes.map(n => (n.id === id ? { ...n, ...data } : n)),
        })),
}));
