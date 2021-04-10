export type Nullish = null | undefined

export const isNullish = (val: unknown): val is Nullish => val == null

export type TNode = {
  id: string
  parentid: string | Nullish
  type: 'View'
  name: string
  top: number | Nullish
  right: number | Nullish
  bottom: number | Nullish
  left: number | Nullish
  width: number
  height: number
  background: string
  children: string[]
}

export type ResizeHandleDirection =
  | 'n'
  | 's'
  | 'w'
  | 'e'
  | 'nw'
  | 'ne'
  | 'sw'
  | 'se'

export type CursorCoords = { x: number; y: number }

export type TCavas = {
  isLoading: boolean
  width: number
  height: number
  left: number
  top: number
  scale: number
  offsetLeft: number
  offsetTop: number
  cursorCoords: CursorCoords
  resizingNode: TNode | null
  draggingNode: TNode | null
  resizeHandleDirection: ResizeHandleDirection | null
  selectedNodeId: string | null
  selectedNodeIds: { [id: string]: boolean }
  nodes: { [id: string]: TNode }
}

export type NormalizedZoomValue = number & { _brand: 'normalizedZoom' }
