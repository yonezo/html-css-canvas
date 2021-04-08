import { TNode, Direction } from '../types'

/**
 * カーソルがリサイズ可能なエリア上に存在する場合、Directionを返す
 *
 * @param cursor
 * @param scale
 * @param resizableNodeId リサイズ可能なNodeId
 * @param getNode
 * @returns
 */
export const cursorOnResizableNodeEdge = (
  cursor: { x: number; y: number },
  scale: number,
  resizableNodeId: string,
  getNode: (id: string) => TNode,
): Direction | undefined => {
  const node = getNode(resizableNodeId)
  const { left, top } = getAbsoluteOriginOnRoot(scale, node, getNode)
  const { width, height } = getSize(scale, node)
  return getDirectionOfCursorIntersectedResizableEdge(cursor, {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  })
}

/**
 * カーソルが移動可能なエリア上に存在しているか
 *
 * @param cursor
 * @param scale
 * @param resizableNodeId リサイズ可能なNodeId
 * @param getNode
 * @returns
 */
export const cursorOnMovableNode = (
  cursor: { x: number; y: number },
  scale: number,
  movableNodeId: string,
  getNode: (id: string) => TNode,
): boolean => {
  const node = getNode(movableNodeId)
  const { left, top } = getAbsoluteOriginOnRoot(scale, node, getNode)
  const { width, height } = getSize(scale, node)
  return cursorIntersectedFrameWithoutResizableEdge(cursor, {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  })
}

/**
 * カーソルがリサイズ可能なNodeIdの上に存在しているか
 *
 * @param cursor
 * @param scale
 * @param resizableNodeId リサイズ可能なNodeId
 * @param getNode
 * @returns
 */
export const cursorOnResizableNode = (
  cursor: { x: number; y: number },
  scale: number,
  resizableNodeId: string,
  getNode: (id: string) => TNode,
): boolean => {
  const node = getNode(resizableNodeId)
  const { left, top } = getAbsoluteOriginOnRoot(scale, node, getNode)
  const { width, height } = getSize(scale, node)
  return cursorIntersectedFrameWithResizableEdge(cursor, {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  })
}

/**
 * カーソルがNodeIdの上に存在しているか
 *
 * @param cursor
 * @param scale
 * @param nodeId
 * @param getNode
 * @returns
 */
export const cursorOnNode = (
  cursor: { x: number; y: number },
  scale: number,
  nodeId: string,
  getNode: (id: string) => TNode,
): boolean => {
  const node = getNode(nodeId)
  const { left, top } = getAbsoluteOriginOnRoot(scale, node, getNode)
  const { width, height } = getSize(scale, node)
  return cursorIntersectedFrame(cursor, {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  })
}

/**
 * カーソルがNode内にある子要素上にある場合、子要素のIdを返す
 *
 * @param cursor
 * @param scale
 * @param nodeId
 * @param getNode
 * @returns
 */
export const getChildInNode = (
  cursor: { x: number; y: number },
  scale: number,
  nodeId: string,
  getNode: (id: string) => TNode,
): string | undefined => {
  const ids: string[] = []
  // Post-order traversal
  const find = (children: string[]) => {
    if (children.length > 0) {
      const reversed = [...children].reverse()
      reversed.forEach((childid) => {
        find(getNode(childid).children)

        if (cursorOnNode(cursor, scale, childid, getNode)) {
          ids.push(childid)
        }
      })
    }
  }

  const node = getNode(nodeId)
  find(node.children)
  return ids.length > 0 ? ids[0] : undefined
}

const cursorIntersectedFrame = (
  cursor: { x: number; y: number },
  frame: { left: number; top: number; width: number; height: number },
) => {
  const { x, y } = cursor
  const { left, top, width, height } = frame
  return left <= x && x <= left + width && top <= y && y <= top + height
}

const cursorIntersectedFrameWithResizableEdge = (
  cursor: { x: number; y: number },
  frame: { left: number; top: number; width: number; height: number },
): boolean => {
  return cursorIntersectedFrame(cursor, {
    left: frame.left - RESIZE_AREA_SIZE,
    top: frame.top - RESIZE_AREA_SIZE,
    width: frame.width + RESIZE_BORDER_SIZE,
    height: frame.height + RESIZE_BORDER_SIZE,
  })
}

const cursorIntersectedFrameWithoutResizableEdge = (
  cursor: { x: number; y: number },
  frame: { left: number; top: number; width: number; height: number },
): boolean => {
  return cursorIntersectedFrame(cursor, {
    left: frame.left + RESIZE_AREA_SIZE,
    top: frame.top + RESIZE_AREA_SIZE,
    width: frame.width - RESIZE_BORDER_SIZE,
    height: frame.height - RESIZE_BORDER_SIZE,
  })
}

/**
 * リサイズ可能なNodeのEdgeと交差したカーソルが示す方向を取得する
 * @param cursor
 * @param frame
 * @returns
 */
const getDirectionOfCursorIntersectedResizableEdge = (
  cursor: { x: number; y: number },
  frame: { left: number; top: number; width: number; height: number },
): Direction | undefined => {
  const { left, top, width, height } = frame
  const right = left + width
  const bottom = top + height
  const topLeftCorner: ResizeEdge = {
    left: left - RESIZE_AREA_SIZE,
    top: top - RESIZE_AREA_SIZE,
    right: left + RESIZE_AREA_SIZE,
    bottom: top + RESIZE_AREA_SIZE,
  }
  const topRightCorner: ResizeEdge = {
    left: right - RESIZE_AREA_SIZE,
    right: right + RESIZE_AREA_SIZE,
    top: top - RESIZE_AREA_SIZE,
    bottom: top + RESIZE_AREA_SIZE,
  }
  const bottomLeftCorner: ResizeEdge = {
    left: left - RESIZE_AREA_SIZE,
    right: left + RESIZE_AREA_SIZE,
    top: bottom - RESIZE_AREA_SIZE,
    bottom: bottom + RESIZE_AREA_SIZE,
  }
  const bottomRightCorner: ResizeEdge = {
    left: right - RESIZE_AREA_SIZE,
    right: right + RESIZE_AREA_SIZE,
    top: bottom - RESIZE_AREA_SIZE,
    bottom: bottom + RESIZE_AREA_SIZE,
  }
  const topBorder: ResizeEdge = {
    left: left + RESIZE_AREA_SIZE,
    top: top - RESIZE_AREA_SIZE,
    right: right - RESIZE_AREA_SIZE,
    bottom: top + RESIZE_AREA_SIZE,
  }
  const leftBorder: ResizeEdge = {
    left: left - RESIZE_AREA_SIZE,
    top: top + RESIZE_AREA_SIZE,
    right: left + RESIZE_AREA_SIZE,
    bottom: bottom - RESIZE_AREA_SIZE,
  }
  const rightBorder: ResizeEdge = {
    left: right - RESIZE_AREA_SIZE,
    top: top + RESIZE_AREA_SIZE,
    right: right + RESIZE_AREA_SIZE,
    bottom: bottom - RESIZE_AREA_SIZE,
  }
  const bottomBorder: ResizeEdge = {
    left: left + RESIZE_AREA_SIZE,
    top: bottom - RESIZE_AREA_SIZE,
    right: right - RESIZE_AREA_SIZE,
    bottom: bottom + RESIZE_AREA_SIZE,
  }

  const cursorOn = (edge: ResizeEdge): boolean => {
    if (
      edge.left <= cursor.x &&
      cursor.x <= edge.right &&
      edge.top <= cursor.y &&
      cursor.y <= edge.bottom
    ) {
      return true
    }
    return false
  }

  if (cursorOn(topLeftCorner)) {
    return 'topLeft'
  }
  if (cursorOn(topRightCorner)) {
    return 'topRight'
  }
  if (cursorOn(bottomLeftCorner)) {
    return 'bottomLeft'
  }
  if (cursorOn(bottomRightCorner)) {
    return 'bottomRight'
  }
  if (cursorOn(topBorder)) {
    return 'top'
  }
  if (cursorOn(leftBorder)) {
    return 'left'
  }
  if (cursorOn(rightBorder)) {
    return 'right'
  }
  if (cursorOn(bottomBorder)) {
    return 'bottom'
  }
}

const getAddedAncestorPoint = (
  node: TNode,
  getNode: (id: string) => TNode,
): { left: number; top: number } | undefined => {
  const parentid = node.parentid
  const parent = parentid ? getNode(parentid) : undefined
  if (parent) {
    const parentLeft = parent.left ?? 0
    const parentTop = parent.top ?? 0
    const addedPoint = getAddedAncestorPoint(parent, getNode)
    if (addedPoint) {
      return {
        left: parentLeft + addedPoint.left,
        top: parentTop + addedPoint.top,
      }
    } else {
      return {
        left: parentLeft,
        top: parentTop,
      }
    }
  }
}

/**
 * RootNodeからの絶対値を返す
 *
 * @param scale
 * @param node
 * @param parentNode
 * @returns
 */
const getAbsoluteOriginOnRoot = (
  scale: number,
  node: TNode,
  parentNode: (parentid: string) => TNode,
): { left: number; top: number } => {
  const ancestorPoint = getAddedAncestorPoint(node, parentNode)
  const left = ((ancestorPoint?.left ?? 0) + (node.left ?? 0)) * scale
  const top = ((ancestorPoint?.top ?? 0) + (node.top ?? 0)) * scale
  return { left, top }
}

/**
 * Canvasでの絶対座標を返す
 *
 * @param scale
 * @param node
 * @param parentNode
 * @returns
 */
const getAbsoluteOriginOnCanvas = (
  scale: number,
  offset: { x: number; y: number },
  node: TNode,
  getNode: (id: string) => TNode,
): { left: number; top: number } => {
  const ancestorPoint = getAddedAncestorPoint(node, getNode)
  const left =
    ((ancestorPoint?.left ?? 0) + (node.left ?? 0) + offset.x) * scale
  const top = ((ancestorPoint?.top ?? 0) + (node.top ?? 0) + offset.y) * scale
  return { left, top }
}

/**
 * 拡大率もとにしたサイズを返す
 *
 * @param scale
 * @param node
 * @param parentNode
 * @returns
 */
const getSize = (
  scale: number,
  node: TNode,
): { width: number; height: number } => {
  const width = node.width * scale
  const height = node.height * scale
  return { width, height }
}

/**
 * Canvasでの絶対座標とサイズを返す
 *
 * @param scale
 * @param node
 * @param parentNode
 * @returns
 */
export const getAbsoluteFrameOnCanvas = (
  scale: number,
  offset: { x: number; y: number },
  id: string,
  getNode: (id: string) => TNode,
): { left: number; top: number; width: number; height: number } => {
  const node = getNode(id)
  const { left, top } = getAbsoluteOriginOnCanvas(scale, offset, node, getNode)
  const { width, height } = getSize(scale, node)
  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  }
}

const RESIZE_BORDER_SIZE = 7
const RESIZE_AREA_SIZE = RESIZE_BORDER_SIZE / 2

type ResizeEdge = {
  left: number
  top: number
  right: number
  bottom: number
}

type Cursor = 'nwse-resize' | 'ns-resize' | 'nesw-resize' | 'ew-resize'

export const getCursorFromDirection = (direction: Direction): Cursor => {
  switch (direction) {
    case 'topLeft':
    case 'bottomRight':
      return 'nwse-resize'
    case 'topRight':
    case 'bottomLeft':
      return 'nesw-resize'
    case 'top':
    case 'bottom':
      return 'ns-resize'
    case 'left':
    case 'right':
      return 'ew-resize'
  }
}
