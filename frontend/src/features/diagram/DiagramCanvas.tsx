import { nanoid } from 'nanoid'
import { useDiagramStore } from '../../store/diagramStore'
import { Canvas } from '../../components/Canvas'

export const DiagramCanvas = () => {
    const addNode = useDiagramStore((s) => s.addNode)

    return (
        <>
            <button
                onClick={() =>
                    addNode({ id: nanoid(), x: 100, y: 100, label: 'Node' })
                }
                style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}
            >
                + Node
            </button>
            <Canvas />
        </>
    )
}

