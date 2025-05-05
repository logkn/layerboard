import { NodeReference } from './Node'
import { EdgeReference } from './Edge'

export interface CanvasViewport {
    zoom: number
    offset: {
        x: number
        y: number
    }
}

export interface Canvas {
    id: string
    name: string
    nodes: NodeReference[]
    edges: EdgeReference[]
    parentNodeId?: string | null
    viewport: CanvasViewport
}
