import { Stage, Layer } from 'react-konva'
import { useDiagramStore } from '../store/diagramStore'
import { Node } from './Node'

export const Canvas = () => {
    const nodes = useDiagramStore((s) => s.nodes)

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                {nodes.map((node) => (
                    <Node key={node.id} {...node} />
                ))}
            </Layer>
        </Stage>
    )
}
