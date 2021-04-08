import React from 'react'
import { shallowEqual } from 'react-redux'

import { useAppDispatch, useAppSelector } from '../hooks'
import { selectNode } from '../reducers/canvas'
import { selectHighlightNodeAbsoluteFrame } from '../selectors/nodes'
import { Overlay } from '../components/overlay'

export const HighlightNodeOverlay = React.memo(function HighlightNodeOverlay() {
  const dispatch = useAppDispatch()
  const frame = useAppSelector(selectHighlightNodeAbsoluteFrame, shallowEqual)

  if (!frame) return null

  return (
    <Overlay
      left={frame.left}
      top={frame.top}
      width={frame.width}
      height={frame.height}
      onClick={() => {
        dispatch(selectNode({ id: frame.id }))
      }}
    />
  )
})
