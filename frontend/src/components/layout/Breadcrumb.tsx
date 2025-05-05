import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { useNodeStore } from '../../store/nodeStore';

const Breadcrumb: React.FC = () => {
    const { canvases, breadcrumb, navigateToCanvas } = useCanvasStore();
    const { nodes } = useNodeStore();

    const getBreadcrumbItems = () => {
        return breadcrumb.map(canvasId => {
            const canvas = canvases[canvasId];
            if (!canvas) return null;

            // For nested canvases, use the parent node label
            let label = canvas.name;
            if (canvas.parentNodeId) {
                const parentNode = nodes[canvas.parentNodeId];
                if (parentNode) {
                    label = parentNode.label;
                }
            }

            return {
                id: canvasId,
                label
            };
        }).filter(Boolean);
    };

    const handleNavigate = (canvasId: string) => {
        navigateToCanvas(canvasId);
    };

    const breadcrumbItems = getBreadcrumbItems();

    if (breadcrumbItems.length <= 1) {
        return null;
    }

    return (
        <nav className="flex items-center text-sm">
            {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item?.id}>
                    {index > 0 && (
                        <span className="mx-2 text-text-secondary">/</span>
                    )}
                    <button
                        className={`hover:text-primary transition-colors ${index === breadcrumbItems.length - 1
                                ? 'text-text font-medium'
                                : 'text-text-secondary'
                            }`}
                        onClick={() => handleNavigate(item?.id || '')}
                    >
                        {item?.label}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
