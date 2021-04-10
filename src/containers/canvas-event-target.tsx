import React, { ReactElement } from 'react'
import { useGesture } from 'react-use-gesture'

import { useAppDispatch, useAppSelector } from '../hooks'
import {
  drag,
  dragStart,
  dragEnd,
  wheel,
  pinch,
  moveCursor,
} from '../reducers/canvas'
import { getCursorFromDirection } from '../utils/node'

import { HighlightNodeOverlay } from './highlight-node-overlay'
import { SelectNodeOverlay } from './select-node-overlay'

export const CanvasEventTarget = (): ReactElement<any> | null => {
  const selectedId = useAppSelector((state) => state.canvas.selectedNodeId)
  const direction = useAppSelector(
    (state) => state.canvas.resizeHandleDirection,
  )
  const enableHighlight = useAppSelector(
    (state) =>
      state.canvas.draggingNode === null && state.canvas.resizingNode === null,
  )
  const dispatch = useAppDispatch()

  const bind = useGesture({
    onDragStart: () => dispatch(dragStart()),
    onDrag: ({ movement: [mx, my] }) => dispatch(drag({ x: mx, y: my })),
    onDragEnd: () => dispatch(dragEnd()),
    onPinch: ({ offset }) => dispatch(pinch({ delta: offset })),
    onWheel: ({ metaKey, ctrlKey, delta }) =>
      dispatch(wheel({ delta, ctrlKey, metaKey })),
    onMove: ({ xy: [x, y] }) => dispatch(moveCursor({ x, y })),
  })

  return (
    <div
      {...bind()}
      style={{
        position: 'absolute',
        inset: '0px',
        background: 'transparent',
        overflow: 'hidden',
        touchAction: 'none',
        cursor: direction ? getCursorFromDirection(direction) : 'default',
        zIndex: 1,
      }}
    >
      {enableHighlight && <HighlightNodeOverlay />}
      {selectedId && <SelectNodeOverlay />}
    </div>
  )
}
