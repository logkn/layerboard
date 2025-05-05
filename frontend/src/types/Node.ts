export interface NodeStyle {
    color?: string;
    borderStyle?: string;
    icon?: string;
}

export interface NodeSize {
    width: number;
    height: number;
}

export interface NodePosition {
    x: number;
    y: number;
}

export interface Node {
    id: string;
    label: string;
    description?: string;
    position: NodePosition;
    size: NodeSize;
    style: NodeStyle;
    tags?: string[];
    expanded: boolean;
    parentId?: string | null;
    childCanvasId?: string | null;
}

export interface NodeReference {
    id: string;
}
