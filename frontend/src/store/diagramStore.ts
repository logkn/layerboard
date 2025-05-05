import { create } from "zustand";

export type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
};
export type Edge = {
  id: string;
  from: string;
  to: string;
  /** Edge label for display and editing */
  label: string;
};
export type Connecting = {
  from: string;
  startX: number;
  startY: number;
  toX: number;
  toY: number;
};

interface DiagramState {
  /** Map of graphId to its nodes and edges */
  graphs: Record<string, { nodes: Node[]; edges: Edge[] }>;
  /** Currently visible graph */
  currentGraphId: string;
  connecting: Connecting | null;
  /** Currently selected edge ID, or null if none */
  selectedEdgeId: string | null;
  /** Set the selected edge ID */
  setSelectedEdge: (id: string | null) => void;
  /** Clipboard storage for edge properties */
  clipboardEdgeProperties: { label: string } | null;
  /** Copy properties of an edge to clipboard */
  copyEdgeProperties: (id: string) => void;
  /** Paste properties from clipboard to an edge */
  pasteEdgeProperties: (id: string) => void;
  /** Update the label of an edge */
  updateEdgeLabel: (id: string, label: string) => void;
  /** Delete an edge by ID */
  deleteEdge: (id: string) => void;
  /** Reverse the direction of an edge */
  reverseEdgeDirection: (id: string) => void;
  addNode: (node: Node) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNodeLabel: (id: string, label: string) => void;
  addEdge: (from: string, to: string) => void;
  startConnecting: (from: string, x: number, y: number) => void;
  updateConnecting: (x: number, y: number) => void;
  finishConnecting: (to?: string) => void;
  /** Expand a node into its child graph (creating if needed) */
  expandNode: (nodeId: string) => void;
  /** Collapse back to the root graph */
  collapse: () => void;
}

export const useDiagramStore = create<DiagramState>((set, _get) => ({
  // initialize root graph container
  graphs: { root: { nodes: [], edges: [] } },
  currentGraphId: 'root',
  connecting: null,
  /** Currently selected edge ID, or null */
  selectedEdgeId: null,
  /** Clipboard storage for edge properties */
  clipboardEdgeProperties: null,
  /** Select or deselect an edge */
  setSelectedEdge: (id) => set({ selectedEdgeId: id }),
  /** Copy properties of an edge to clipboard */
  copyEdgeProperties: (id) => set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      const edge = graph.edges.find((e) => e.id === id);
      return { clipboardEdgeProperties: edge ? { label: edge.label } : state.clipboardEdgeProperties };
  }),
  /** Paste properties from clipboard to an edge */
  pasteEdgeProperties: (id) => set((state) => {
      const clipboard = state.clipboardEdgeProperties;
      if (!clipboard) return {};
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: {
            nodes: graph.nodes,
            edges: graph.edges.map((e) =>
              e.id === id ? { ...e, label: clipboard.label } : e
            ),
          },
        },
      };
  }),
  addNode: (node) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: { nodes: [...graph.nodes, node], edges: graph.edges },
        },
      };
    }),
  updateNodePosition: (id, x, y) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: {
            nodes: graph.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
            edges: graph.edges,
          },
        },
      };
    }),
  updateNodeLabel: (id, label) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: {
            nodes: graph.nodes.map((n) => (n.id === id ? { ...n, label } : n)),
            edges: graph.edges,
          },
        },
      };
    }),
  /** Update the label of an edge */
  updateEdgeLabel: (id, label) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: {
            nodes: graph.nodes,
            edges: graph.edges.map((e) =>
              e.id === id ? { ...e, label } : e
            ),
          },
        },
      };
    }),
  /** Delete an edge by ID */
  deleteEdge: (id) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: { nodes: graph.nodes, edges: graph.edges.filter((e) => e.id !== id) },
        },
        // clear selection if the deleted edge was selected
        selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
      };
    }),
  /** Reverse the direction of an edge */
  reverseEdgeDirection: (id) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      return {
        graphs: {
          ...state.graphs,
          [cg]: {
            nodes: graph.nodes,
            edges: graph.edges.map((e) =>
              e.id === id ? { ...e, from: e.to, to: e.from } : e
            ),
          },
        },
      };
    }),
  addEdge: (from, to) =>
    set((state) => {
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      const newEdge = {
        id: Math.random().toString(36).substr(2, 9),
        from,
        to,
        label: '',
      };
      return {
        graphs: {
          ...state.graphs,
          [cg]: { nodes: graph.nodes, edges: [...graph.edges, newEdge] },
        },
      };
    }),
  startConnecting: (from, x, y) =>
    set(() => ({
      connecting: { from, startX: x, startY: y, toX: x, toY: y },
    })),
  updateConnecting: (x, y) =>
    set((state) => {
      if (!state.connecting) return {};
      return { connecting: { ...state.connecting, toX: x, toY: y } };
    }),
  finishConnecting: (to) =>
    set((state) => {
      const conn = state.connecting;
      if (!conn) return {};
      const cg = state.currentGraphId;
      const graph = state.graphs[cg];
      const newEdges = to
        ? [
            ...graph.edges,
            {
              id: Math.random().toString(36).substr(2, 9),
              from: conn.from,
              to,
              label: '',
            },
          ]
        : graph.edges;
      return {
        graphs: {
          ...state.graphs,
          [cg]: { nodes: graph.nodes, edges: newEdges },
        },
        connecting: null,
      };
    }),
  expandNode: (nodeId) =>
    set((state) => {
      const graphs = { ...state.graphs };
      if (!graphs[nodeId]) {
        graphs[nodeId] = { nodes: [], edges: [] };
      }
      return { graphs, currentGraphId: nodeId };
    }),
  collapse: () =>
    set(() => ({ currentGraphId: 'root', connecting: null })),
}));
