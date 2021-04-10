import { RootState } from '../store'
import {
  getChildInNode,
  getAbsoluteFrameOnCanvas,
  cursorOnResizableNodeEdge,
} from '../utils/node'

export const selectHighlightNodeAbsoluteFrame = ({
  canvas,
}: RootState):
  | { left: number; top: number; width: number; height: number }
  | undefined => {
  const getNode = (id: string) => canvas.nodes[id]
  const rootid = '0'
  if (canvas.selectedNodeId) {
    const cursorOnEdge =
      cursorOnResizableNodeEdge(
        canvas.cursorCoords,
        canvas.scale,
        canvas.selectedNodeId,
        getNode,
      ) !== undefined

    if (cursorOnEdge) {
      return
    }
  }

  const id = getChildInNode(canvas.cursorCoords, canvas.scale, rootid, getNode)
  if (id) {
    const frame = getAbsoluteFrameOnCanvas(
      canvas.scale,
      canvas.offsetLeft,
      canvas.offsetTop,
      id,
      getNode,
    )
    return frame
  }
}

export const selectSelectNodeAbsoluteFrame = ({
  canvas,
}: RootState):
  | {
      left: number
      top: number
      width: number
      height: number
    }
  | undefined => {
  if (canvas.selectedNodeId) {
    const frame = getAbsoluteFrameOnCanvas(
      canvas.scale,
      canvas.offsetLeft,
      canvas.offsetTop,
      canvas.selectedNodeId,
      (id) => canvas.nodes[id],
    )
    return frame
  }
}
