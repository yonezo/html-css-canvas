import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TCavas } from '../types'
import {
  cursorOnResizableNodeEdge,
  getChildInNode,
  setLeftOrFlipHorizontally,
  setTopOrFlipVertically,
  setRightOrFlipHorizontally,
  setBottomOrFlipVertically,
} from '../utils/node'
import { getNewScale, getOffsetWithScale } from '../utils/canvas'

import { initialize } from './initializeState'
import { isNodeAction } from './actions/nodes'
import { nodeReducer } from './nodes'

const initialState: TCavas = {
  isLoading: false,
  width: 0,
  height: 0,
  left: 0,
  top: 0,
  scale: 1,
  offsetLeft: 0,
  offsetTop: 0,
  selectedNodeId: null,
  selectedNodeIds: {},
  draggingNode: null,
  resizingNode: null,
  resizeHandleDirection: null,
  cursorCoords: { x: 0, y: 0 },
  nodes: {
    '0': {
      id: '0',
      parentid: undefined,
      type: 'View',
      name: '0',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 375,
      height: 812,
      background: 'white',
      children: ['1', '2'],
    },
    '1': {
      id: '1',
      parentid: '0',
      type: 'View',
      name: '1',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#99EEFF',
      children: ['3'],
    },
    '2': {
      id: '2',
      parentid: '0',
      type: 'View',
      name: '2',
      left: 0,
      top: 200,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#44CCFF',
      children: [],
    },
    '3': {
      id: '3',
      parentid: '1',
      type: 'View',
      name: '3',
      left: 75,
      top: 100,
      right: undefined,
      bottom: undefined,
      width: 50,
      height: 200,
      background: '#47E0FF',
      children: [],
    },
  },
}

const hasNodes = (state: TCavas) => Object.keys(state.nodes).length > 0

const hasDraggingNode = (state: TCavas) =>
  state.draggingNode || state.resizingNode

const isDragStartEnabled = (state: TCavas) =>
  hasNodes(state) && !hasDraggingNode(state)

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    initializeNodes: (state) => {
      state.nodes = initialize()
    },
    selectNode: (
      state,
      action: PayloadAction<{
        id: string | null
      }>,
    ) => {
      const { id } = action.payload
      state.selectedNodeId = id
    },
    moveCursor: (
      state,
      action: PayloadAction<{
        x: number
        y: number
      }>,
    ) => {
      const { x, y } = action.payload
      const left = x - state.left
      const top = y - state.top
      const convertedX = left - state.offsetLeft * state.scale
      const convertedY = top - state.offsetTop * state.scale
      state.cursorCoords = { x: convertedX, y: convertedY }
    },
    scrollToCenter: (
      state,
      action: PayloadAction<{
        left: number
        top: number
        width: number
        height: number
      }>,
    ) => {
      const { width, height, left, top } = action.payload
      const { scale, nodes } = state
      const root = nodes['0']
      const offsetLeft = root
        ? width / 2 - (root.width / 2 - (root.left ?? 0)) * scale
        : state.offsetLeft
      const offsetTop = root
        ? height / 2 - (root.height / 2 - (root.top ?? 0)) * scale
        : state.offsetTop
      return { ...state, width, height, left, top, offsetLeft, offsetTop }
    },
    resizeCanvas: (
      state,
      action: PayloadAction<{
        left: number
        top: number
        width: number
        height: number
      }>,
    ) => {
      const { width, height, left, top } = action.payload
      const ratioX = width / state.width
      const ratioY = height / state.height
      const offsetLeft = state.offsetLeft * ratioX
      const offsetTop = state.offsetTop * ratioY
      return { ...state, width, height, left, top, offsetLeft, offsetTop }
    },
    pinch: (
      state,
      action: PayloadAction<{
        delta: [number, number]
      }>,
    ) => {
      const {
        delta: [d],
      } = action.payload
      const newScale = getNewScale(1, d)
      const { offsetLeft, offsetTop } = getOffsetWithScale(
        state.width,
        state.height,
        state.offsetLeft,
        state.offsetTop,
        state.scale,
        newScale,
      )
      return { ...state, offsetLeft, offsetTop, scale: newScale }
    },
    wheel: (
      state,
      action: PayloadAction<{
        delta: [number, number]
        metaKey: boolean
        ctrlKey: boolean
      }>,
    ) => {
      const {
        delta: [deltaX, deltaY],
        metaKey,
        ctrlKey,
      } = action.payload
      if (metaKey || ctrlKey) {
        const newScale = getNewScale(state.scale, deltaY)
        const { offsetLeft, offsetTop } = getOffsetWithScale(
          state.width,
          state.height,
          state.offsetLeft,
          state.offsetTop,
          state.scale,
          newScale,
        )
        return { ...state, offsetLeft, offsetTop, scale: newScale }
      } else {
        const offsetLeft = state.offsetLeft - deltaX / state.scale
        const offsetTop = state.offsetTop - deltaY / state.scale
        return { ...state, offsetLeft, offsetTop }
      }
    },
    dragStart: (state) => {
      if (!isDragStartEnabled(state)) {
        return
      }
      const { cursorCoords, scale } = state
      const getNode = (id: string) => state.nodes[id]
      if (state.selectedNodeId) {
        const resizeHandleDirection = cursorOnResizableNodeEdge(
          state.cursorCoords,
          state.scale,
          state.selectedNodeId,
          getNode,
        )
        if (resizeHandleDirection) {
          return {
            ...state,
            resizingNode: state.nodes[state.selectedNodeId],
            resizeHandleDirection,
          }
        }
      }

      const rootid = '0'
      const id = getChildInNode(cursorCoords, scale, rootid, getNode)
      if (id) {
        return {
          ...state,
          draggingNode: state.nodes[id],
          selectedNodeId: id,
        }
      } else {
        return {
          ...state,
          selectedNodeId: null,
        }
      }
    },
    drag: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload

      if (x === 0 && y === 0) {
        // cursorが移動していない場合
        return
      }

      if (state.resizingNode && state.resizeHandleDirection) {
        const prevWidth = state.resizingNode.width,
          prevHeight = state.resizingNode.height,
          prevLeft = state.resizingNode.left ?? 0,
          prevTop = state.resizingNode.top ?? 0
        const node = state.nodes[state.resizingNode.id]
        const newLeft = Math.round(prevLeft + x / state.scale)
        const newTop = Math.round(prevTop + y / state.scale)
        const newWidth = state.resizeHandleDirection.includes('w')
          ? Math.round(prevWidth - x / state.scale)
          : Math.round(prevWidth + x / state.scale)
        const newHeight = state.resizeHandleDirection.includes('n')
          ? Math.round(prevHeight - y / state.scale)
          : Math.round(prevHeight + y / state.scale)
        if (state.resizeHandleDirection.includes('w')) {
          setLeftOrFlipHorizontally(node, newLeft, newWidth)
        }
        if (state.resizeHandleDirection.includes('n')) {
          setTopOrFlipVertically(node, newTop, newHeight)
        }
        if (state.resizeHandleDirection.includes('e')) {
          setRightOrFlipHorizontally(node, prevLeft, newWidth)
        }
        if (state.resizeHandleDirection.includes('s')) {
          setBottomOrFlipVertically(node, prevTop, newHeight)
        }
      } else if (state.draggingNode) {
        const prevLeft = state.draggingNode.left ?? 0,
          prevTop = state.draggingNode.top ?? 0
        const newLeft = Math.round(prevLeft + x / state.scale)
        const newTop = Math.round(prevTop + y / state.scale)
        const node = state.nodes[state.draggingNode.id]
        node.left = newLeft
        node.top = newTop
      }
    },
    dragEnd: (state) => {
      return {
        ...state,
        draggingNode: null,
        resizingNode: null,
        resizeHandleDirection: null,
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isNodeAction, (state, action) => {
      const { nodeid } = action.payload
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [nodeid]: nodeReducer(state.nodes[nodeid], action),
        },
      }
    })
  },
})

export const canvasReducer = canvasSlice.reducer

export const {
  initializeNodes,
  selectNode,
  moveCursor,
  scrollToCenter,
  resizeCanvas,
  drag,
  dragStart,
  dragEnd,
  wheel,
  pinch,
} = canvasSlice.actions
