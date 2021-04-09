import React, { ReactElement } from 'react'
import { shallowEqual } from 'react-redux'

import { useAppSelector } from '../hooks'
import { selectSelectNodeAbsoluteFrame } from '../selectors/nodes'
import { Overlay } from '../components/overlay'
import { Handlers } from '../components/handlers'

export const SelectNodeOverlay = (): ReactElement<any> | null => {
  const frame = useAppSelector(selectSelectNodeAbsoluteFrame, shallowEqual)
  const enableHighlight = useAppSelector(
    (state) =>
      state.canvas.draggingNode === null && state.canvas.resizingNode === null,
  )

  if (!frame) return null

  return (
    <Overlay
      left={frame.left}
      top={frame.top}
      width={frame.width}
      height={frame.height}
      pointerEvents="none"
    >
      {enableHighlight && (
        <Handlers width={frame.width} height={frame.height} />
      )}
    </Overlay>
  )
}
