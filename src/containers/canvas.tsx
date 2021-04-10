import React, { Ref, forwardRef } from 'react'

import { useAppSelector } from '../hooks'
import { NodeWrapper } from '../components/node-wrapper'

import { Node } from './node'

export const Canvas = forwardRef(function Canvas(_, ref: Ref<HTMLDivElement>) {
  const offsetLeft = useAppSelector((state) => state.canvas.offsetLeft)
  const offsetTop = useAppSelector((state) => state.canvas.offsetTop)
  const scale = useAppSelector((state) => state.canvas.scale)
  const root = useAppSelector((state) => state.canvas.nodes['0'])

  const style: React.CSSProperties = {
    position: 'relative',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    // 'will-change': 'transform',
    transform: `scale(${scale}) translateX(${offsetLeft}px) translateY(${offsetTop}px)`,
    // transformOrigin: 'center',
    isolation: 'isolate',
    zIndex: -1,
  }

  const wrapperFrame = {
    left: root.left ?? 0,
    top: root.top ?? 0,
    width: root.width,
    height: root.height,
  }

  return (
    <div className="Canvas" style={style} ref={ref}>
      <NodeWrapper
        left={wrapperFrame.left}
        top={wrapperFrame.top}
        width={wrapperFrame.width}
        height={wrapperFrame.height}
        scale={scale}
      >
        <Node key={root.id} id={root.id} />
      </NodeWrapper>
    </div>
  )
})
