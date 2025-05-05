import { Group, Rect, Text } from "react-konva";
import { useState } from "react";
import { useGraphStore } from "../state/graphStore";
import { NodeData } from "../types";

export default function Node({ node }: { node: NodeData }) {
    const updateNode = useGraphStore(state => state.updateNode);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Group
            x={node.x}
            y={node.y}
            draggable
            onDragEnd={e => updateNode(node.id, { x: e.target.x(), y: e.target.y() })}
            onDblClick={() => setIsEditing(true)}
        >
            <Rect width={150} height={60} fill="#1f2937" cornerRadius={8} />
            <Text
                text={node.label}
                fill="#fff"
                fontSize={16}
                padding={10}
                onDblClick={() => setIsEditing(true)}
            />
        </Group>
    );
}
