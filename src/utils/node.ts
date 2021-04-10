import { TNode, ResizeHandleDirection } from '../types'

// Set left and width or set flip horizontally
export const setLeftOrFlipHorizontally = (
  node: TNode,
  left: number,
  width: number,
): void => {
  if (width > 0) {
    node.left = left
    node.width = width
  } else {
    node.width = Math.abs(width)
  }
}

// Set top and height or set flip vertically
export const setTopOrFlipVertically = (
  node: TNode,
  top: number,
  height: number,
): void => {
  if (height > 0) {
    node.top = top
    node.height = height
  } else {
    node.height = Math.abs(height)
  }
}

// Set width or set flip horizontally
export const setRightOrFlipHorizontally = (
  node: TNode,
  left: number,
  width: number,
): void => {
  if (width > 0) {
    node.width = width
  } else {
    node.left = left - Math.abs(width)
    node.width = Math.abs(width)
  }
}

// Set height or set flip vertically
export const setBottomOrFlipVertically = (
  node: TNode,
  top: number,
  height: number,
): void => {
  if (height > 0) {
    node.height = height
  } else {
    node.top = top - Math.abs(height)
    node.height = Math.abs(height)
  }
}

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
): ResizeHandleDirection | undefined => {
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

/**
 * リサイズ可能なNodeのEdgeと交差したカーソルが示す方向を取得する
 * @param cursor
 * @param frame
 * @returns
 */
const getDirectionOfCursorIntersectedResizableEdge = (
  cursor: { x: number; y: number },
  frame: { left: number; top: number; width: number; height: number },
): ResizeHandleDirection | undefined => {
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
    return 'nw'
  }
  if (cursorOn(topRightCorner)) {
    return 'ne'
  }
  if (cursorOn(bottomLeftCorner)) {
    return 'sw'
  }
  if (cursorOn(bottomRightCorner)) {
    return 'se'
  }
  if (cursorOn(topBorder)) {
    return 'n'
  }
  if (cursorOn(leftBorder)) {
    return 'w'
  }
  if (cursorOn(rightBorder)) {
    return 'e'
  }
  if (cursorOn(bottomBorder)) {
    return 's'
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
  offsetLeft: number,
  offsetTop: number,
  node: TNode,
  getNode: (id: string) => TNode,
): { left: number; top: number } => {
  const ancestorPoint = getAddedAncestorPoint(node, getNode)
  const left =
    ((ancestorPoint?.left ?? 0) + (node.left ?? 0) + offsetLeft) * scale
  const top = ((ancestorPoint?.top ?? 0) + (node.top ?? 0) + offsetTop) * scale
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
 * @param offsetLeft
 * @param offsetTop
 * @param id          node id
 * @param parentNode
 * @returns
 */
export const getAbsoluteFrameOnCanvas = (
  scale: number,
  offsetLeft: number,
  offsetTop: number,
  id: string,
  getNode: (id: string) => TNode,
): { left: number; top: number; width: number; height: number } => {
  const node = getNode(id)
  const { left, top } = getAbsoluteOriginOnCanvas(
    scale,
    offsetLeft,
    offsetTop,
    node,
    getNode,
  )
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

export const getCursorFromDirection = (
  direction: ResizeHandleDirection,
): Cursor => {
  switch (direction) {
    case 'nw':
    case 'se':
      return 'nwse-resize'
    case 'ne':
    case 'sw':
      return 'nesw-resize'
    case 'n':
    case 's':
      return 'ns-resize'
    case 'e':
    case 'w':
      return 'ew-resize'
  }
}
