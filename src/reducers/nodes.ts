import { createReducer } from '@reduxjs/toolkit'
import tinycolor from 'tinycolor2'

import { TNode } from '../types'

import {
  isChildNodeAction,
  createNode,
  updateNode,
  addChild,
  resizeNode,
} from './actions/nodes'

export const nodeReducer = createReducer({} as TNode, (builder) => {
  builder.addCase(createNode, (state, action) => {
    const { nodeid, parentid } = action.payload
    return {
      id: nodeid,
      parentid: parentid,
      type: 'View',
      name: `node.${nodeid}`,
      top: 0,
      left: 0,
      right: null,
      bottom: null,
      width: 200,
      height: 100,
      background: tinycolor.random().toRgbString(),
      children: [],
    }
  })
  builder.addCase(updateNode, (state, action) => {
    const { node } = action.payload
    return {
      ...state,
      ...node,
    }
  })
  builder.addCase(resizeNode, (state, action) => {
    const { left, top, width, height } = action.payload
    return {
      ...state,
      left,
      top,
      width,
      height,
    }
  })
  builder.addMatcher(isChildNodeAction, (state, action) => {
    return {
      ...state,
      children: childrenReducer(state.children, action),
    }
  })
})

const childrenReducer = createReducer([] as string[], (builder) => {
  builder.addCase(addChild, (state, action) => {
    const { childid } = action.payload
    return [...state, childid]
  })
})

export { createNode, updateNode, addChild }
