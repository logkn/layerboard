import React from 'react'
import { useCanvasStore } from '../../store/canvasStore'
import { useNodeStore } from '../../store/nodeStore'
import MiniMap from './MiniMap'

const Sidebar: React.FC = () => {
    const { canvases, currentCanvasId, navigateToCanvas } = useCanvasStore()
    const { nodes } = useNodeStore()

    const currentCanvas = canvases[currentCanvasId]

    // Get the current path of canvases
    const getCanvasPath = () => {
        const path: { id: string; name: string }[] = []
        let canvasId = currentCanvasId

        while (canvasId) {
            const canvas = canvases[canvasId]
            if (!canvas) break

            path.unshift({
                id: canvasId,
                name: canvas.name,
            })

            const parentNodeId = canvas.parentNodeId
            if (!parentNodeId) break

            const parentNode = nodes[parentNodeId]
            if (!parentNode) break

            canvasId = parentNode.parentId ? nodes[parentNode.parentId]?.childCanvasId || '' : ''
        }

        return path
    }

    // Get all child nodes in the current canvas
    const getChildNodes = () => {
        if (!currentCanvas) return []

        return currentCanvas.nodes
            .map((nodeRef) => nodes[nodeRef.id])
            .filter((node) => node && node.childCanvasId)
            .map((node) => ({
                id: node!.id,
                childCanvasId: node!.childCanvasId!,
                label: node!.label,
            }))
    }

    const handleNavigateToCanvas = (canvasId: string) => {
        navigateToCanvas(canvasId)
    }

    return (
        <div className="w-64 h-full bg-surface border-r border-border flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                <h2 className="text-lg font-medium text-text mb-2">Navigation</h2>

                {/* Canvas path */}
                <div className="mb-6">
                    <h3 className="text-xs uppercase text-text-secondary font-medium mb-2">Path</h3>
                    <ul className="space-y-1">
                        {getCanvasPath().map((canvas) => (
                            <li key={canvas.id}>
                                <button
                                    className={`w-full text-left px-2 py-1 rounded text-sm ${
                                        canvas.id === currentCanvasId
                                            ? 'bg-primary text-white font-medium'
                                            : 'text-text hover:bg-border'
                                    }`}
                                    onClick={() => handleNavigateToCanvas(canvas.id)}
                                >
                                    {canvas.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Child canvases */}
                <div>
                    <h3 className="text-xs uppercase text-text-secondary font-medium mb-2">
                        Contained Nodes
                    </h3>
                    <ul className="space-y-1">
                        {getChildNodes().map((node) => (
                            <li key={node.id}>
                                <button
                                    className="w-full text-left px-2 py-1 rounded text-sm text-text hover:bg-border"
                                    onClick={() => handleNavigateToCanvas(node.childCanvasId)}
                                >
                                    {node.label}
                                </button>
                            </li>
                        ))}
                        {getChildNodes().length === 0 && (
                            <li className="px-2 py-1 text-sm text-text-secondary">
                                No expandable nodes
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Mini map */}
            <div className="h-48 p-4 border-t border-border">
                <h3 className="text-xs uppercase text-text-secondary font-medium mb-2">Minimap</h3>
                <MiniMap canvasId={currentCanvasId} />
            </div>
        </div>
    )
}

export default Sidebar
