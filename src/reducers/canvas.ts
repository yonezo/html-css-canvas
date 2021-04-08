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
  selectedNodeId: undefined,
  movingNode: undefined,
  resizingNode: undefined,
  resizingDirection: undefined,
  cursorPoint: { x: 0, y: 0 },
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
      height: 100,
      background: '#47E0FF',
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
      state.cursorPoint = { x: convertedX, y: convertedY }
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
      if (state.movingNode || state.resizingNode) {
        return
      }
      const cursor = state.cursorPoint
      const scale = state.scale
      const selectedid = state.selectedNodeId
      if (selectedid) {
        const direction = cursorOnResizableNodeEdge(
          cursor,
          scale,
          selectedid,
          (id) => state.nodes[id],
        )
        if (direction) {
          state.resizingNode = state.nodes[selectedid]
          state.resizingDirection = direction
          return
        } else {
          const cursorOnMovable = cursorOnMovableNode(
            cursor,
            scale,
            selectedid,
            (id) => state.nodes[id],
          )
          if (cursorOnMovable) {
            const childid = getChildInNode(
              cursor,
              scale,
              selectedid,
              (id) => state.nodes[id],
            )
            if (childid) {
              state.movingNode = state.nodes[childid]
              state.selectedNodeId = childid
            } else {
              state.movingNode = state.nodes[selectedid]
              state.selectedNodeId = selectedid
            }
            return
          }
        }
      }
      const rootnodeid = '0'
      const id = getChildInNode(
        cursor,
        scale,
        rootnodeid,
        (id) => state.nodes[id],
      )
      if (id) {
        state.movingNode = state.nodes[id]
        state.selectedNodeId = id
      } else {
        state.selectedNodeId = undefined
      }
    },
    drag: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const { x, y } = action.payload
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
      } else if (state.movingNode) {
        const node = state.movingNode
        const scale = state.scale
        const left = Math.round((node.left ?? 0) + x / scale)
        const top = Math.round((node.top ?? 0) + y / scale)
        state.nodes[node.id].left = left
        state.nodes[node.id].top = top
      }
    },
    dragEnd: (state) => {
      state.movingNode = undefined
      state.resizingNode = undefined
      state.resizingDirection = undefined
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
