import React, { ReactElement } from 'react'

import { useAppSelector } from '../hooks'

export const Node = ({ id }: { id: string }): ReactElement<any> => {
  const node = useAppSelector((state) => state.canvas.nodes[id])

  const style: React.CSSProperties = {
    position: 'absolute',
    display: 'block',
    flexShrink: 0,
    userSelect: 'none',
    pointerEvents: 'none',
    top: `${node.top}px`,
    left: `${node.left}px`,
    width: `${node.width}px`,
    height: `${node.height}px`,
    background: node.background,
    overflow: id === '0' ? 'hidden' : 'visible',
    transform: 'none',
  }

  return (
    <div id={id} style={style}>
      {node.children.length > 0 &&
        node.children.map((cid) => <Node key={cid} id={cid} />)}
    </div>
  )
}
