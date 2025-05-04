import React from 'react'
import { Arrow } from 'react-konva'
import { useDiagramStore, Edge as EdgeType } from '../store/diagramStore'

type Props = EdgeType

export const Edge = ({ id, from, to }: Props) => {
    const nodes = useDiagramStore((s) => s.nodes)
    const fromNode = nodes.find((n) => n.id === from)
    const toNode = nodes.find((n) => n.id === to)
    if (!fromNode || !toNode) return null

    return (
        <Arrow
            points={[fromNode.x, fromNode.y, toNode.x, toNode.y]}
            stroke="black"
            fill="black"
        />
    )
}
