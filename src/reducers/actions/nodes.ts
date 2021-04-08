import { Action, AnyAction, createAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

interface NodeAction extends Action {
  payload: { nodeid: string }
}

const CANVAS = 'canvas'
const NODES = 'nodes'
const NODE = 'node'
const CHILD = 'child'

export function isNodeAction(action: AnyAction): action is NodeAction {
  return action.type.startsWith(`${CANVAS}/${NODES}/${NODE}/`)
}

// node
export const createNode = createAction(
  `${CANVAS}/${NODES}/create`,
  function prepare(payload: { parentid: string }) {
    const { parentid } = payload
    return {
      payload: {
        nodeid: nanoid(),
        parentid,
      },
    }
  },
)

export const updateNode = createAction<{ nodeid: string; node: Partial<Node> }>(
  `${CANVAS}/${NODES}/${NODE}/update`,
)

export const resizeNode = createAction<{
  nodeid: string
  left: number
  top: number
  width: number
  height: number
}>(`${CANVAS}/${NODES}/${NODE}/resize`)

// child
interface ChildNodeAction extends Action {
  payload: { nodeid: string; childid: string }
}

export function isChildNodeAction(
  action: AnyAction,
): action is ChildNodeAction {
  return action.type.startsWith(`${CANVAS}/${NODES}/${NODE}/${CHILD}`)
}

// children
export const addChild = createAction<{ nodeid: string; childid: string }>(
  `${CANVAS}/${NODES}/${NODE}/${CHILD}/add`,
)
