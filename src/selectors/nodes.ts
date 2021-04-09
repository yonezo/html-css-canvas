import { RootState } from '../store'
import {
  getChildInNode,
  getAbsoluteFrameOnCanvas,
  cursorOnResizableNodeEdge,
} from '../utils/node'

export const selectHighlightNodeAbsoluteFrame = (
  state: RootState,
):
  | { id: string; left: number; top: number; width: number; height: number }
  | undefined => {
  if (Object.keys(state.canvas.nodes).length === 0) return

  const selectedid = state.canvas.selectedNodeId
  const scale = state.canvas.scale
  const cursorCoords = state.canvas.cursorCoords
  const offset = state.canvas.offset
  const getNode = (id: string) => state.canvas.nodes[id]
  const rootid = '0'
  if (selectedid) {
    const cursorOnEdge =
      cursorOnResizableNodeEdge(
        cursorCoords,
        scale,
        selectedid,
        (id) => state.canvas.nodes[id],
      ) !== undefined

    if (cursorOnEdge) {
      return
    }
  }

  const id = getChildInNode(cursorCoords, scale, rootid, getNode)
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
