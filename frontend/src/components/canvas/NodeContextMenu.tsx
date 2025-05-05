import React, { useEffect, useRef } from 'react';
import { Node as NodeType } from '../../types/Node';
import { useNodeStore } from '../../store/nodeStore';
import { useEdgeStore } from '../../store/edgeStore';

interface NodeContextMenuProps {
    node: NodeType;
    position: { x: number; y: number };
    onClose: () => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ node, position, onClose }) => {
    const { updateNode, deleteNode, expandNode } = useNodeStore();
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside the context menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleExpand = () => {
        expandNode(node.id);
        onClose();
    };

    const handleRename = () => {
        const newLabel = prompt('Enter new name:', node.label);
        if (newLabel && newLabel.trim() !== '') {
            updateNode(node.id, { label: newLabel.trim() });
        }
        onClose();
    };

    const handleChangeColor = () => {
        // For MVP, we'll use a set of predefined colors
        const colors = [
            '#6E56CF', // Primary (default)
            '#E5484D', // Red
            '#F76808', // Orange
            '#FFB224', // Amber
            '#599E47', // Green
            '#4AA5FF', // Blue
        ];

        const currentColorIndex = colors.indexOf(node.style.color || '#6E56CF');
        const nextColorIndex = (currentColorIndex + 1) % colors.length;

        updateNode(node.id, {
            style: {
                ...node.style,
                color: colors[nextColorIndex]
            }
        });

        onClose();
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this node?')) {
            deleteNode(node.id);
        }
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute bg-surface rounded-md shadow-lg py-1 z-50 min-w-[150px]"
            style={{
                left: position.x,
                top: position.y
            }}
        >
            <div className="px-3 py-2 text-sm font-medium text-text border-b border-border truncate">
                {node.label}
            </div>
            <ul>
                <li>
                    <button
                        className="w-full text-left px-3 py-2 text-sm text-text hover:bg-border"
                        onClick={handleExpand}
                    >
                        {node.expanded ? 'Open Canvas' : 'Expand Node'}
                    </button>
                </li>
                <li>
                    <button
                        className="w-full text-left px-3 py-2 text-sm text-text hover:bg-border"
                        onClick={handleRename}
                    >
                        Rename
                    </button>
                </li>
                <li>
                    <button
                        className="w-full text-left px-3 py-2 text-sm text-text hover:bg-border"
                        onClick={handleChangeColor}
                    >
                        Change Color
                    </button>
                </li>
                <li className="border-t border-border">
                    <button
                        className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-border hover:text-red-500"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default NodeContextMenu;
