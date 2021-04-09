import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { TCavas, TNode } from '../types'
import {
  cursorOnResizableNodeEdge,
  cursorOnMovableNode,
  getChildInNode,
} from '../utils/node'

import { initialize } from './initializeState'
import { isNodeAction } from './actions/nodes'
import { nodeReducer } from './nodes'

const initialState: TCavas = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  scale: 1,
  offset: { x: 0, y: 0 },
  selectedNodeId: null,
  selectedNodeIds: {},
  draggingNode: null,
  resizingNode: null,
  resizingDirection: null,
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
      children: ['1', '4'],
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
      children: ['2'],
    },
    '2': {
      id: '2',
      parentid: '1',
      type: 'View',
      name: '2',
      left: 10,
      top: 10,
      right: undefined,
      bottom: undefined,
      width: 180,
      height: 180,
      background: '#44CCFF',
      children: ['3'],
    },
    '3': {
      id: '3',
      parentid: '2',
      type: 'View',
      name: '3',
      left: 10,
      top: 10,
      right: undefined,
      bottom: undefined,
      width: 160,
      height: 160,
      background: '#47E0FF',
      children: [],
    },
    '4': {
      id: '4',
      parentid: '0',
      type: 'View',
      name: '4',
      left: 0,
      top: 220,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#C15F31',
      children: ['5'],
    },
    '5': {
      id: '5',
      parentid: '4',
      type: 'View',
      name: '5',
      left: 10,
      top: -200,
      right: undefined,
      bottom: undefined,
      width: 180,
      height: 180,
      background: '#F6D064',
      children: ['6'],
    },
    '6': {
      id: '6',
      parentid: '5',
      type: 'View',
      name: '6',
      left: 10,
      top: 10,
      right: undefined,
      bottom: undefined,
      width: 160,
      height: 160,
      background: '#E3D74A',
      children: [],
    },
  },
}

const STEP = 0.1
const MAX_SCALE = 5
const MIN_SCALE = 0.25

const convertLeft = (node: TNode, left: number, width: number) => {
  if (width > 0) {
    node.left = left
    node.width = width
  } else {
    node.width = Math.abs(width)
  }
}

const convertTop = (node: TNode, top: number, height: number) => {
  if (height > 0) {
    node.top = top
    node.height = height
  } else {
    node.height = Math.abs(height)
  }
}

const convertRight = (node: TNode, left: number, width: number) => {
  if (width > 0) {
    node.width = width
  } else {
    node.left = left - Math.abs(width)
    node.width = Math.abs(width)
  }
}

const convertBottom = (node: TNode, top: number, height: number) => {
  if (height > 0) {
    node.height = height
  } else {
    node.top = top - Math.abs(height)
    node.height = Math.abs(height)
  }
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
      state.selectedNodeId = action.payload.id
    },
    moveCursor: (
      state,
      action: PayloadAction<{
        x: number
        y: number
      }>,
    ) => {
      const { x, y } = action.payload
      const originX = x - state.frame.x
      const originY = y - state.frame.y
      const convertedX = originX - state.offset.x * state.scale
      const convertedY = originY - state.offset.y * state.scale
      state.cursorCoords = { x: convertedX, y: convertedY }
    },
    updateFrame: (
      state,
      action: PayloadAction<{
        x: number
        y: number
        width: number
        height: number
      }>,
    ) => {
      state.frame = action.payload
    },
    updateScale: (state, action: PayloadAction<{ scale: number }>) => {
      const { scale } = action.payload
      state.scale = scale
    },
    updateOffset: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.offset = action.payload
    },
    pinch: (
      state,
      action: PayloadAction<{
        offset: [number, number]
      }>,
    ) => {
      const [d] = action.payload.offset
      const newScale = 1 + (d / 50) * STEP

      if (MAX_SCALE <= newScale || MIN_SCALE >= newScale) return
      const frame = state.frame
      const scale = state.scale
      const offset = state.offset

      const width = frame.width / scale
      const height = frame.height / scale

      const newWidth = frame.width / newScale
      const newHeight = frame.height / newScale

      const diffWidth = width - newWidth
      const diffHeight = height - newHeight

      state.offset = {
        x: offset.x - diffWidth / 2,
        y: offset.y - diffHeight / 2,
      }
      state.scale = newScale
    },
    dragStart: (state) => {
      if (!isDragStartEnabled(state)) return

      const cursorCoords = state.cursorCoords
      const scale = state.scale
      const selectedid = state.selectedNodeId
      const getNode = (id: string) => state.nodes[id]
      if (selectedid) {
        const direction = cursorOnResizableNodeEdge(
          cursorCoords,
          scale,
          selectedid,
          getNode,
        )
        if (direction) {
          state.resizingNode = state.nodes[selectedid]
          state.resizingDirection = direction
          return
        }
      }

      const rootid = '0'
      const id = getChildInNode(cursorCoords, scale, rootid, getNode)
      if (id) {
        state.draggingNode = state.nodes[id]
        state.selectedNodeId = id
      } else {
        state.selectedNodeId = null
      }
    },
    drag: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload

      if (x === 0 && y === 0) {
        // cursorが移動していない場合
        return
      }

      if (state.resizingNode && state.resizingDirection) {
        const direction = state.resizingDirection
        const rNode = state.resizingNode
        const node = state.nodes[rNode.id]
        const scale = state.scale
        const left = Math.round((rNode.left ?? 0) + x / scale)
        const top = Math.round((rNode.top ?? 0) + y / scale)
        const width =
          direction === 'left' ||
          direction === 'topLeft' ||
          direction === 'bottomLeft'
            ? Math.round(rNode.width - x / scale)
            : Math.round(rNode.width + x / scale)
        const height =
          direction === 'top' ||
          direction === 'topLeft' ||
          direction === 'topRight'
            ? Math.round(rNode.height - y / scale)
            : Math.round(rNode.height + y / scale)
        switch (direction) {
          case 'left':
            convertLeft(node, left, width)
            break
          case 'top':
            convertTop(node, top, height)
            break
          case 'right':
            convertRight(node, rNode.left ?? 0, width)
            break
          case 'bottom':
            convertBottom(node, rNode.top ?? 0, height)
            break
          case 'topLeft':
            convertLeft(node, left, width)
            convertTop(node, top, height)
            break
          case 'topRight':
            convertTop(node, top, height)
            convertRight(node, rNode.left ?? 0, width)
            break
          case 'bottomRight':
            convertRight(node, rNode.left ?? 0, width)
            convertBottom(node, rNode.top ?? 0, height)
            break
          case 'bottomLeft':
            convertLeft(node, left, width)
            convertBottom(node, rNode.top ?? 0, height)
            break
        }
      } else if (state.draggingNode) {
        const node = state.draggingNode
        const scale = state.scale
        const left = Math.round((node.left ?? 0) + x / scale)
        const top = Math.round((node.top ?? 0) + y / scale)
        state.nodes[node.id].left = left
        state.nodes[node.id].top = top
      }
    },
    dragEnd: (state) => {
      state.draggingNode = null
      state.resizingNode = null
      state.resizingDirection = null
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
  updateFrame,
  updateScale,
  updateOffset,
  drag,
  dragStart,
  dragEnd,
  pinch,
} = canvasSlice.actions
