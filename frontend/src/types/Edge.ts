export interface EdgeStyle {
    color?: string;
    strokeWidth?: number;
    dashArray?: string;
}

export interface Edge {
    id: string;
    source: string; // Node ID
    target: string; // Node ID
    label?: string;
    style: EdgeStyle;
    bidirectional: boolean;
}

export interface EdgeReference {
    id: string;
}
