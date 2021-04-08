import { RootState } from '../store'
import {
  getChildInNode,
  getAbsoluteFrameOnCanvas,
  cursorOnResizableNode,
} from '../utils/node'

export const selectHighlightNodeAbsoluteFrame = (
  state: RootState,
):
  | { id: string; left: number; top: number; width: number; height: number }
  | undefined => {
  if (Object.keys(state.canvas.nodes).length === 0) return

  const selectedid = state.canvas.selectedNodeId
  const scale = state.canvas.scale
  const cursor = state.canvas.cursorPoint
  const offset = state.canvas.offset
  const getNode = (id: string) => state.canvas.nodes[id]
  if (selectedid) {
    const cursorOnSelectedNode = cursorOnResizableNode(
      cursor,
      scale,
      selectedid,
      (id) => state.canvas.nodes[id],
    )

    if (cursorOnSelectedNode) {
      // 選択しているNode内にcursorがある
      const childid = getChildInNode(cursor, scale, selectedid, getNode)

      if (childid) {
        // 選択しているNode内の子要素上にcursorがある場合はハイライトさせる
        const frame = getAbsoluteFrameOnCanvas(scale, offset, childid, getNode)
        return { id: childid, ...frame }
      }
      return
    }
  }

  const rootid = '0'
  const id = getChildInNode(cursor, scale, rootid, getNode)
  if (id) {
    const frame = getAbsoluteFrameOnCanvas(scale, offset, id, getNode)
    return { id, ...frame }
  }
}

export const selectSelectNodeAbsoluteFrame = (
  state: RootState,
):
  | {
      left: number
      top: number
      width: number
      height: number
    }
  | undefined => {
  const scale = state.canvas.scale
  const offset = state.canvas.offset
  const id = state.canvas.selectedNodeId
  if (id) {
    const frame = getAbsoluteFrameOnCanvas(
      scale,
      offset,
      id,
      (id) => state.canvas.nodes[id],
    )
    return frame
  }
}
