import { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import { NodePosition } from '../types/Node';

interface UseCanvasGesturesOptions {
    canvasId: string;
    onNodeDragStart?: (nodeId: string, position: NodePosition) => void;
    onNodeDrag?: (nodeId: string, position: NodePosition) => void;
    onNodeDragEnd?: (nodeId: string, position: NodePosition) => void;
}

interface CanvasGestures {
    isPanning: boolean;
    draggedNodeId: string | null;
    handleCanvasMouseDown: (e: React.MouseEvent) => void;
    handleCanvasMouseMove: (e: React.MouseEvent) => void;
    handleCanvasMouseUp: () => void;
    handleCanvasWheel: (e: React.WheelEvent) => void;
    startNodeDrag: (nodeId: string, e: React.MouseEvent) => void;
}

export function useCanvasGestures({
    canvasId,
    onNodeDragStart,
    onNodeDrag,
    onNodeDragEnd
}: UseCanvasGesturesOptions): CanvasGestures {
    const { canvases, updateViewport } = useCanvasStore();
    const canvas = canvases[canvasId];

    const [isPanning, setIsPanning] = useState(false);
    const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

    // Store the last drag position to calculate delta
    const lastDragPosRef = useRef({ x: 0, y: 0 });
    const lastMousePosRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (draggedNodeId && onNodeDragEnd) {
                onNodeDragEnd(draggedNodeId, {
                    x: lastMousePosRef.current.x,
                    y: lastMousePosRef.current.y
                });
            }

            setIsPanning(false);
            setDraggedNodeId(null);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [draggedNodeId, onNodeDragEnd]);

    // Handle canvas pan start
    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        // Only handle left mouse button and don't start panning if we're already dragging a node
        if (e.button !== 0 || draggedNodeId) return;

        setIsPanning(true);
        setStartPanPoint({ x: e.clientX, y: e.clientY });
    };

    // Handle canvas pan move
    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        if (isPanning) {
            const dx = e.clientX - startPanPoint.x;
            const dy = e.clientY - startPanPoint.y;

            updateViewport(canvasId, {
                offset: {
                    x: canvas.viewport.offset.x + dx / canvas.viewport.zoom,
                    y: canvas.viewport.offset.y + dy / canvas.viewport.zoom
                }
            });

            setStartPanPoint({ x: e.clientX, y: e.clientY });
        } else if (draggedNodeId && onNodeDrag) {
            // Calculate delta movement since last mouse position
            const dx = (e.clientX - lastDragPosRef.current.x) / canvas.viewport.zoom;
            const dy = (e.clientY - lastDragPosRef.current.y) / canvas.viewport.zoom;

            // Update the position based on delta
            onNodeDrag(draggedNodeId, { x: dx, y: dy });

            // Update last drag position
            lastDragPosRef.current = { x: e.clientX, y: e.clientY };
        }
    };

    // Handle canvas pan end
    const handleCanvasMouseUp = () => {
        setIsPanning(false);

        if (draggedNodeId && onNodeDragEnd) {
            onNodeDragEnd(draggedNodeId, lastMousePosRef.current);
        }

        setDraggedNodeId(null);
    };

    // Handle zoom with mouse wheel
    const handleCanvasWheel = (e: React.WheelEvent) => {
        e.preventDefault();

        const { clientX, clientY, deltaY } = e;
        const direction = deltaY > 0 ? -1 : 1;
        const factor = 0.05;
        const zoom = Math.max(0.1, Math.min(5, canvas.viewport.zoom * (1 + factor * direction)));

        // Calculate cursor position in canvas space
        const canvasRect = e.currentTarget.getBoundingClientRect();
        const x = (clientX - canvasRect.left) / canvas.viewport.zoom;
        const y = (clientY - canvasRect.top) / canvas.viewport.zoom;

        // Calculate new offset to zoom toward cursor
        const newZoom = zoom;
        const newOffsetX = x - (x - canvas.viewport.offset.x) * (canvas.viewport.zoom / newZoom);
        const newOffsetY = y - (y - canvas.viewport.offset.y) * (canvas.viewport.zoom / newZoom);

        updateViewport(canvasId, {
            zoom,
            offset: { x: newOffsetX, y: newOffsetY }
        });
    };

    // Start dragging a node
    const startNodeDrag = (nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDraggedNodeId(nodeId);
        lastDragPosRef.current = { x: e.clientX, y: e.clientY };

        if (onNodeDragStart) {
            onNodeDragStart(nodeId, { x: e.clientX, y: e.clientY });
        }
    };

    return {
        isPanning,
        draggedNodeId,
        handleCanvasMouseDown,
        handleCanvasMouseMove,
        handleCanvasMouseUp,
        handleCanvasWheel,
        startNodeDrag
    };
}
