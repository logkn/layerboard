import { Stage, Layer, Arrow } from 'react-konva'
import { useDiagramStore } from '../store/diagramStore'
import { Node } from './Node'
import { Edge } from './Edge'

export const Canvas = () => {
    const nodes = useDiagramStore((s) => s.nodes)
    const edges = useDiagramStore((s) => s.edges)
    const connecting = useDiagramStore((s) => s.connecting)
    const updateConnecting = useDiagramStore((s) => s.updateConnecting)
    const finishConnecting = useDiagramStore((s) => s.finishConnecting)

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseMove={(e) => {
                if (!connecting) return
                const stage = e.target.getStage()
                const pos = stage?.getPointerPosition()
                if (pos) updateConnecting(pos.x, pos.y)
            }}
            onMouseUp={(e) => {
                if (!connecting) return
                let target: any = e.target
                let toId: string | undefined
                while (target) {
                    const id = target.id && target.id()
                    if (nodes.find((n) => n.id === id)) {
                        toId = id
                        break
                    }
                    target = target.getParent && target.getParent()
                }
                finishConnecting(toId)
            }}
        >
            <Layer>
                {edges.map((edge) => (
                    <Edge key={edge.id} {...edge} />
                ))}
                {connecting && (() => {
                    const fromNode = nodes.find((n) => n.id === connecting.from)
                    if (!fromNode) return null
                    return (
                        <Arrow
                            points={[
                                fromNode.x,
                                fromNode.y,
                                connecting.toX,
                                connecting.toY,
                            ]}
                            stroke="black"
                            fill="black"
                            dash={[4, 4]}
                        />
                    )
                })()}
                {nodes.map((node) => (
                    <Node key={node.id} {...node} />
                ))}
            </Layer>
        </Stage>
    )
}
