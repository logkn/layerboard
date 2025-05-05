import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useNodeStore } from '../../store/nodeStore';
import IconButton from '../ui/IconButton';

interface CanvasControlsProps {
    canvasId: string;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({ canvasId }) => {
    const { canvases, navigateUp, updateViewport } = useCanvasStore();
    const { createNode } = useNodeStore();

    const canvas = canvases[canvasId];

    if (!canvas) return null;

    const handleZoomIn = () => {
        updateViewport(canvasId, {
            zoom: Math.min(5, canvas.viewport.zoom * 1.2)
        });
    };

    const handleZoomOut = () => {
        updateViewport(canvasId, {
            zoom: Math.max(0.1, canvas.viewport.zoom / 1.2)
        });
    };

    const handleResetView = () => {
        updateViewport(canvasId, {
            zoom: 1,
            offset: { x: 0, y: 0 }
        });
    };

    const handleAddNode = () => {
        // Create a node in the center of the viewport
        const centerX = -canvas.viewport.offset.x + window.innerWidth / (2 * canvas.viewport.zoom);
        const centerY = -canvas.viewport.offset.y + window.innerHeight / (2 * canvas.viewport.zoom);

        createNode(canvasId, {
            label: 'New Node',
            position: { x: centerX, y: centerY },
            size: { width: 150, height: 80 },
            style: { color: '#6E56CF' },
            parentId: canvas.parentNodeId || null,
        });
    };

    const handleGoUp = () => {
        navigateUp();
    };

    return (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-surface rounded-lg p-2 shadow-lg z-10">
            <IconButton
                icon="+"
                title="Add Node"
                onClick={handleAddNode}
            />
            <IconButton
                icon="↑"
                title="Go Up"
                onClick={handleGoUp}
                disabled={!canvas.parentNodeId}
            />
            <IconButton
                icon="🔍+"
                title="Zoom In"
                onClick={handleZoomIn}
            />
            <IconButton
                icon="🔍-"
                title="Zoom Out"
                onClick={handleZoomOut}
            />
            <IconButton
                icon="⟳"
                title="Reset View"
                onClick={handleResetView}
            />
        </div>
    );
};

export default CanvasControls;
