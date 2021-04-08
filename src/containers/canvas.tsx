import React, { useEffect, Ref, forwardRef } from 'react'

import { useAppSelector, useAppDispatch } from '../hooks'
import { updateOffset } from '../reducers/canvas'
import { NodeWrapper } from '../components/node-wrapper'

import { Node } from './node'

export const Canvas = forwardRef(function Canvas(_, ref: Ref<HTMLDivElement>) {
  const dispatch = useAppDispatch()
  const offset = useAppSelector((state) => state.canvas.offset)
  const scale = useAppSelector((state) => state.canvas.scale)
  const frame = useAppSelector((state) => state.canvas.frame)
  const root = useAppSelector((state) => state.canvas.nodes['0'])

  const style: React.CSSProperties = {
    position: 'relative',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    // 'will-change': 'transform',
    transform: `scale(${scale}) translateX(${offset.x}px) translateY(${offset.y}px)`,
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

  // useEffect(() => {
  //   const x =
  //     (frame.width / 2 - wrapperFrame.width / 2 - wrapperFrame.left) * scale
  //   const y =
  //     (frame.height / 2 - wrapperFrame.height / 2 - wrapperFrame.top) * scale
  //   dispatch(updateOffset({ x, y }))
  // }, [frame])

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
