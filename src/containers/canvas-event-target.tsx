import React, { ReactElement } from 'react'
import { batch } from 'react-redux'
import clamp from 'lodash/clamp'
import { useGesture } from 'react-use-gesture'

import { useAppDispatch, useAppSelector } from '../hooks'
import {
  drag,
  dragStart,
  dragEnd,
  pinch,
  updateOffset,
  updateScale,
  moveCursor,
} from '../reducers/canvas'
import { getCursorFromDirection } from '../utils/node'

import { HighlightNodeOverlay } from './highlight-node-overlay'
import { SelectNodeOverlay } from './select-node-overlay'

export const CanvasEventTarget = (): ReactElement<any> | null => {
  const offset = useAppSelector((state) => state.canvas.offset)
  const scale = useAppSelector((state) => state.canvas.scale)
  const selectedId = useAppSelector((state) => state.canvas.selectedNodeId)
  const direction = useAppSelector((state) => state.canvas.resizingDirection)
  const enableHighlight = useAppSelector(
    (state) =>
      state.canvas.draggingNode === null && state.canvas.resizingNode === null,
  )
  const dispatch = useAppDispatch()

  const bind = useGesture({
    onDragStart: () => {
      dispatch(dragStart())
    },
    onDrag: ({ movement: [mx, my] }) => {
      dispatch(drag({ x: mx, y: my }))
    },
    onDragEnd: () => {
      dispatch(dragEnd())
    },
    onPinch: ({ offset }) => {
      dispatch(pinch({ offset }))
    },
    onWheel: ({ metaKey, delta: [deltaX, deltaY], event }) => {
      if (metaKey && event) {
        const oz = scale
        const nz = clamp(scale + deltaY / 600, 0.2, 10)

        const mouseX = event ? event.clientX : 0
        const mouseY = event ? event.clientY : 0

        // current
        const xs = (mouseX - offset.x) / oz
        const ys = (mouseY - offset.y) / oz

        const originX = mouseX - xs * nz
        const originY = mouseY - ys * nz

        batch(() => {
          dispatch(
            updateOffset({
              x: originX,
              y: originY,
            }),
          )
          dispatch(
            updateScale({
              scale: nz,
            }),
          )
        })
      } else {
        const newX = offset.x - deltaX / scale
        const newY = offset.y - deltaY / scale
        dispatch(
          updateOffset({
            x: newX,
            y: newY,
          }),
        )
      }
    },
    onMove: ({ xy: [x, y] }) => {
      dispatch(moveCursor({ x, y }))
    },
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
      }}
    >
      {enableHighlight && <HighlightNodeOverlay />}
      {selectedId && <SelectNodeOverlay />}
    </div>
  )
}
