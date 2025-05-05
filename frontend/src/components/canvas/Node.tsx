import React, { useState } from 'react'
import { Node as NodeType } from '../../types/Node'
import { useEdgeStore } from '../../store/edgeStore'
import NodeContextMenu from './NodeContextMenu'

interface NodeProps {
    node: NodeType
    onDragStart: (e: React.MouseEvent) => void
    onNodeExpand: () => void
    onPortClick: () => void
}

const Node: React.FC<NodeProps> = ({ node, onDragStart, onNodeExpand }) => {
    const { pendingEdge, startEdgeCreation, finishEdgeCreation } = useEdgeStore()
    const [contextMenuOpen, setContextMenuOpen] = useState(false)
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

    // Node default styles
    const defaultColor = '#6E56CF'

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onNodeExpand()
    }

    const handlePortMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation()
        startEdgeCreation(node.id)
    }

    const handlePortMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (pendingEdge.pending && pendingEdge.sourceId !== node.id) {
            finishEdgeCreation(node.id)
        }
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        setContextMenuPosition({ x: e.clientX, y: e.clientY })
        setContextMenuOpen(true)
    }

    return (
        <>
            <g
                transform={`translate(${node.position.x}, ${node.position.y})`}
                onContextMenu={handleContextMenu}
            >
                {/* Main node rectangle */}
                <rect
                    x={0}
                    y={0}
                    width={node.size.width}
                    height={node.size.height}
                    rx={4}
                    className="fill-surface stroke-border stroke-2 cursor-pointer"
                    style={{
                        fill: node.style.color || defaultColor,
                        fillOpacity: 0.1,
                        stroke: node.style.color || defaultColor,
                    }}
                    onMouseDown={onDragStart}
                    onDoubleClick={handleDoubleClick}
                />

                {/* Node label */}
                <text
                    x={node.size.width / 2}
                    y={node.size.height / 2}
                    className="text-sm font-medium fill-text cursor-pointer select-none"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    onMouseDown={onDragStart}
                    onDoubleClick={handleDoubleClick}
                >
                    {node.label}
                </text>

                {/* Expansion indicator (small circle at bottom) */}
                {node.expanded ? (
                    <circle
                        cx={node.size.width / 2}
                        cy={node.size.height - 4}
                        r={3}
                        fill={node.style.color || defaultColor}
                        className="cursor-pointer"
                        onDoubleClick={handleDoubleClick}
                    />
                ) : null}

                {/* Connection ports */}
                <circle
                    cx={0}
                    cy={node.size.height / 2}
                    r={5}
                    className="fill-surface stroke-primary stroke-2 cursor-crosshair"
                    onMouseDown={handlePortMouseDown}
                    onMouseUp={handlePortMouseUp}
                />

                <circle
                    cx={node.size.width}
                    cy={node.size.height / 2}
                    r={5}
                    className="fill-surface stroke-primary stroke-2 cursor-crosshair"
                    onMouseDown={handlePortMouseDown}
                    onMouseUp={handlePortMouseUp}
                />

                <circle
                    cx={node.size.width / 2}
                    cy={0}
                    r={5}
                    className="fill-surface stroke-primary stroke-2 cursor-crosshair"
                    onMouseDown={handlePortMouseDown}
                    onMouseUp={handlePortMouseUp}
                />

                <circle
                    cx={node.size.width / 2}
                    cy={node.size.height}
                    r={5}
                    className="fill-surface stroke-primary stroke-2 cursor-crosshair"
                    onMouseDown={handlePortMouseDown}
                    onMouseUp={handlePortMouseUp}
                />
            </g>

            {contextMenuOpen && (
                <NodeContextMenu
                    node={node}
                    position={contextMenuPosition}
                    onClose={() => setContextMenuOpen(false)}
                />
            )}
        </>
    )
}

export default Node
