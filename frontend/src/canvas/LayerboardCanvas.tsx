import { Stage, Layer } from "react-konva";
import { useState } from "react";
import { useGraphStore } from "../state/graphStore";
import Node from "./Node";
import { v4 as uuid } from "uuid";

export default function LayerboardCanvas() {
    const nodes = useGraphStore(state => state.nodes);
    const addNode = useGraphStore(state => state.addNode);

    const [stageSize, setStageSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const handleClick = (e: any) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
        if (pointer) {
            addNode({
                id: uuid(),
                label: "New Node",
                x: pointer.x,
                y: pointer.y,
            });
        }
    };

    return (
        <Stage
            width={stageSize.width}
            height={stageSize.height}
            onMouseDown={handleClick}
            draggable
        >
            <Layer>
                {nodes.map(node => (
                    <Node key={node.id} node={node} />
                ))}
            </Layer>
        </Stage>
    );
}
