import { RootState } from '../store'
import {
  getChildInNode,
  getAbsoluteOriginOnCanvas,
  getSizeOnCanvas,
  cursorOnResizableNode,
} from '../utils/node'

const getAbsoluteFrame = (state: RootState, id: string) => {
  const node = state.canvas.nodes[id]
  const offset = state.canvas.offset
  const scale = state.canvas.scale
  const { left, top } = getAbsoluteOriginOnCanvas(
    scale,
    offset,
    node,
    (id) => state.canvas.nodes[id],
  )
  const { width, height } = getSizeOnCanvas(scale, node)
  return {
    node,
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  }
}

export const selectHighlightNodeAbsoluteFrame = (
  state: RootState,
):
  | { id: string; left: number; top: number; width: number; height: number }
  | undefined => {
  if (Object.keys(state.canvas.nodes).length === 0) return

  const selectedId = state.canvas.selectedNodeId
  const scale = state.canvas.scale
  const cursor = state.canvas.cursorPoint
  if (selectedId) {
    const cursorOnSelectedNode = cursorOnResizableNode(
      cursor,
      scale,
      selectedId,
      (id) => state.canvas.nodes[id],
    )

    if (cursorOnSelectedNode) {
      // 選択しているNode内にcursorがある
      const childid = getChildInNode(
        cursor,
        scale,
        selectedId,
        (id) => state.canvas.nodes[id],
      )

      if (childid) {
        // 選択しているNode内の子要素上にcursorがある場合はハイライトさせる
        const value = getAbsoluteFrame(state, childid)
        const { node: _, ...rest } = value
        return { id: childid, ...rest }
      }
      return
    }
  }

  const rootid = '0'
  const id = getChildInNode(
    cursor,
    scale,
    rootid,
    (id) => state.canvas.nodes[id],
  )
  if (id) {
    const value = getAbsoluteFrame(state, id)
    const { node: _, ...rest } = value
    return { id, ...rest }
  }
}

export const selectSelectNodeAbsoluteFrame = (
  state: RootState,
):
  | {
      id: string
      left: number
      top: number
      width: number
      height: number
      relativeLeft: number
      relativeTop: number
      relativeWidth: number
      relativeHeight: number
    }
  | undefined => {
  const id = state.canvas.selectedNodeId
  if (id) {
    const value = getAbsoluteFrame(state, id)
    const { node, ...rest } = value
    return {
      id,
      ...rest,
      relativeLeft: node.left ?? 0,
      relativeTop: node.top ?? 0,
      relativeWidth: node.width,
      relativeHeight: node.height,
    }
  }
}
