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

export type Direction =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft'

type PointerCoords = { x: number; y: number }

export type TCavas = {
  frame: { x: number; y: number; width: number; height: number }
  scale: number
  offset: { x: number; y: number }
  cursorCoords: PointerCoords
  resizingNode: TNode | null
  draggingNode: TNode | null
  resizingDirection: Direction | null
  selectedNodeId: string | null
  selectedNodeIds: { [id: string]: boolean }
  nodes: { [id: string]: TNode }
}
