import React, { useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Canvas from './components/canvas/Canvas';
import { useCanvasStore } from './store/canvasStore';
import { useNodeStore } from './store/nodeStore';

const App: React.FC = () => {
    const { canvases, currentCanvasId, createCanvas } = useCanvasStore();
    const { createNode } = useNodeStore();

    // Initialize with some sample data on first load
    useEffect(() => {
        // Only initialize if we have an empty root canvas
        if (canvases['root'] && canvases['root'].nodes.length === 0) {
            // Create some initial nodes
            const node1Id = createNode('root', {
                label: 'System',
                position: { x: 200, y: 200 },
                size: { width: 150, height: 80 },
                style: { color: '#6E56CF' },
                parentId: null
            });

            const node2Id = createNode('root', {
                label: 'Database',
                position: { x: 500, y: 200 },
                size: { width: 150, height: 80 },
                style: { color: '#F76808' },
                parentId: null
            });

            const node3Id = createNode('root', {
                label: 'API',
                position: { x: 200, y: 400 },
                size: { width: 150, height: 80 },
                style: { color: '#599E47' },
                parentId: null
            });
        }
    }, []);

    return (
        <>
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-hidden">
                    <Canvas canvasId={currentCanvasId} />
                </main>
            </div>
        </>
    );
};

export default App;
