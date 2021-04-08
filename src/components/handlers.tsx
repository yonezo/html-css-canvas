import React, { CSSProperties, ReactElement } from 'react'

const BORDER_COLOR = '#567CFC'

type Props = {
  width: number
  height: number
}

const CORNER_SIZE = 7
const BORDER_SIZE = 9

export const Handlers = ({ width, height }: Props): ReactElement<any> => {
  const cornerStyle: CSSProperties = {
    position: 'absolute',
    backgroundColor: 'white',
    width: `${CORNER_SIZE}px`,
    height: `${CORNER_SIZE}px`,
    border: `${BORDER_COLOR} 1px solid`,
    borderRadius: '8px',
    willChange: 'transform',
    pointerEvents: 'auto',
    zIndex: 1,
    opacity: 1,
  }

  const borderStyle: CSSProperties = {
    position: 'absolute',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    willChange: 'transform',
    pointerEvents: 'auto',
    zIndex: 0,
    opacity: 1,
  }

  return (
    <div
      style={{
        inset: '1px',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          ...cornerStyle,
          transform: `translate(0px, 0px) translateZ(0px) translateX(-5px) translateY(-5px)`,
          cursor: 'nwse-resize',
        }}
      />
      <div
        style={{
          ...borderStyle,
          width: `${width}px`,
          height: `${BORDER_SIZE}px`,
          transform: `translate(0px, -4.5px) translateZ(0px)`,
          cursor: 'ns-resize',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          transform: `translate(${
            width - 1
          }px, 0px) translateZ(0px) translateX(-5px) translateY(-5px)`,
          cursor: 'nesw-resize',
        }}
      />
      <div
        style={{
          ...borderStyle,
          width: `${BORDER_SIZE}px`,
          height: `${height}px`,
          transform: `translate(-4.5px, 0px) translateZ(0px)`,
          cursor: 'ew-resize',
        }}
      />
      <div
        style={{
          ...borderStyle,
          width: `${BORDER_SIZE}px`,
          height: `${height}px`,
          transform: `translate(${width - 5.5}px, 0px) translateZ(0px)`,
          cursor: 'ew-resize',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          transform: `translate(0px, ${
            height - 1
          }px) translateZ(0px) translateX(-5px) translateY(-5px)`,
          cursor: 'nesw-resize',
        }}
      />
      <div
        style={{
          ...borderStyle,
          width: `${width}px`,
          height: `${BORDER_SIZE}px`,
          transform: `translate(0px, ${height - 5.5}px) translateZ(0px)`,
          cursor: 'ns-resize',
        }}
      />
      <div
        style={{
          ...cornerStyle,
          transform: `translate(${width - 1}px, ${
            height - 1
          }px) translateZ(0px) translateX(-5px) translateY(-5px)`,
          cursor: 'nwse-resize',
        }}
      />
    </div>
  )
}
