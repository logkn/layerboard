import React from 'react';
import Breadcrumb from './Breadcrumb';
import { useCanvasStore } from '../../store/canvasStore';

const Header: React.FC = () => {
    const { canvases, currentCanvasId, breadcrumb } = useCanvasStore();

    return (
        <header className="h-14 flex items-center px-4 bg-surface border-b border-border">
            <div className="flex-1 flex items-center">
                <h1 className="text-xl font-semibold text-text mr-6">Layerboard</h1>
                <Breadcrumb />
            </div>

            <div className="flex items-center gap-4">
                {/* Future additions: User menu, settings, etc. */}
            </div>
        </header>
    );
};

export default Header;
