import { Circle, Text, Group, Rect } from 'react-konva'
import { useState } from 'react'
import { useDiagramStore } from '../store/diagramStore'

type Props = {
    id: string
    x: number
    y: number
    label: string
}

export const Node = ({ id, x, y, label }: Props) => {
    const update = useDiagramStore((s) => s.updateNodePosition)
    const updateLabel = useDiagramStore((s) => s.updateNodeLabel)
    const startConnecting = useDiagramStore((s) => s.startConnecting)
    const [hovered, setHovered] = useState(false)
    const width = 120
    const height = 60

    return (
        <Group
            id={id}
            x={x}
            y={y}
            draggable
            onMouseEnter={(e) => {
                setHovered(true)
                const container = e.target.getStage().container()
                container.style.cursor = 'grab'
            }}
            onMouseLeave={(e) => {
                setHovered(false)
                const container = e.target.getStage().container()
                container.style.cursor = 'default'
            }}
            onMouseDown={(e) => {
                const container = e.target.getStage().container()
                container.style.cursor = 'grabbing'
            }}
            onMouseUp={(e) => {
                const container = e.target.getStage().container()
                container.style.cursor = 'grab'
            }}
            onDragStart={(e) => {
                const container = e.target.getStage().container()
                container.style.cursor = 'grabbing'
            }}
            onDragEnd={(e) => {
                update(id, e.target.x(), e.target.y())
                const container = e.target.getStage().container()
                container.style.cursor = 'grab'
            }}
        >
            <Rect
                x={-width / 2}
                y={-height / 2}
                width={width}
                height={height}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: 0, y: height }}
                fillLinearGradientColorStops={[0, '#6366f1', 1, '#4f46e5']}
                cornerRadius={8}
                stroke="#ffffff"
                strokeWidth={2}
                shadowColor="black"
                shadowBlur={10}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.3}
            />
            <Text
                x={-width / 2}
                y={-height / 2}
                width={width}
                height={height}
                text={label}
                fontSize={16}
                fill="white"
                align="center"
                verticalAlign="middle"
            />
            {hovered && (
                <>
                    {/* Edge handles */}
                    {/* Top */}
                    <Group
                        x={0}
                        y={-height / 2}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'crosshair'
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'grab'
                        }}
                        onMouseDown={(e) => {
                            e.cancelBubble = true
                            const stage = e.target.getStage()
                            const pos = stage.getPointerPosition()!
                            startConnecting(id, pos.x, pos.y)
                        }}
                    >
                        <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
                    </Group>
                    {/* Right */}
                    <Group
                        x={width / 2}
                        y={0}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'crosshair'
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'grab'
                        }}
                        onMouseDown={(e) => {
                            e.cancelBubble = true
                            const stage = e.target.getStage()
                            const pos = stage.getPointerPosition()!
                            startConnecting(id, pos.x, pos.y)
                        }}
                    >
                        <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
                    </Group>
                    {/* Bottom */}
                    <Group
                        x={0}
                        y={height / 2}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'crosshair'
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'grab'
                        }}
                        onMouseDown={(e) => {
                            e.cancelBubble = true
                            const stage = e.target.getStage()
                            const pos = stage.getPointerPosition()!
                            startConnecting(id, pos.x, pos.y)
                        }}
                    >
                        <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
                    </Group>
                    {/* Left */}
                    <Group
                        x={-width / 2}
                        y={0}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'crosshair'
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container()
                            container.style.cursor = 'grab'
                        }}
                        onMouseDown={(e) => {
                            e.cancelBubble = true
                            const stage = e.target.getStage()
                            const pos = stage.getPointerPosition()!
                            startConnecting(id, pos.x, pos.y)
                        }}
                    >
                        <Circle radius={6} fill="white" stroke="black" strokeWidth={1} />
                    </Group>
                </>
            )}
            {/* Edit button */}
            <Group
                x={width / 2 - 12}
                y={-height / 2 + 12}
                onClick={() => {
                    const newLabel = window.prompt('Edit label', label)
                    if (newLabel !== null && newLabel !== label) {
                        updateLabel(id, newLabel)
                    }
                }}
                onMouseDown={(e) => {
                    e.cancelBubble = true
                }}
            >
                <Circle
                    radius={10}
                    fill="white"
                    stroke="#4f46e5"
                    strokeWidth={1}
                />
                <Text
                    text="✎"
                    fontSize={12}
                    fill="#4f46e5"
                    width={20}
                    height={20}
                    align="center"
                    verticalAlign="middle"
                    offsetX={10}
                    offsetY={10}
                />
            </Group>
        </Group>
    )
}
