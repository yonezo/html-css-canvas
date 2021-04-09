import React from 'react'
import { shallowEqual } from 'react-redux'

import { useAppSelector } from '../hooks'
import { selectHighlightNodeAbsoluteFrame } from '../selectors/nodes'
import { Overlay } from '../components/overlay'

export const HighlightNodeOverlay = React.memo(function HighlightNodeOverlay() {
  const frame = useAppSelector(selectHighlightNodeAbsoluteFrame, shallowEqual)

  if (!frame) return null

  return (
    <Overlay
      left={frame.left}
      top={frame.top}
      width={frame.width}
      height={frame.height}
    />
  )
})
