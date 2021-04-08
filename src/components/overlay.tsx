import React, { ReactNode, ReactElement, CSSProperties } from 'react'

const BORDER_SCALE = 0.01
const BORDER_COLOR = '#567CFC'

type Props = {
  left: number
  top: number
  width: number
  height: number
  pointerEvents?: CSSProperties['pointerEvents']
  onClick?: () => void
  children?: ReactNode | null
}

export const Overlay = ({
  left,
  top,
  width,
  height,
  pointerEvents,
  onClick,
  children,
}: Props): ReactElement<any> | null => {
  const overlayStyle: CSSProperties = {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: `${width}px`,
    height: `${height}px`,
    willChange: 'transform',
    transformOrigin: '0px 0px',
    transform: `translateX(${left}px) translateY(${top}px) rotate(0deg)`,
  }

  if (pointerEvents) {
    overlayStyle['pointerEvents'] = pointerEvents
  }

  return (
    <div style={overlayStyle} onClick={onClick}>
      <div
        style={{
          position: 'fixed',
          width: '100px',
          height: '100px',
          backgroundColor: BORDER_COLOR,
          transformOrigin: '0px 0px',
          opacity: 1,
          willChange: 'transform',
          transform: `translateX(${
            width - 1
          }px) translateY(0px) translateZ(0px) scaleX(${BORDER_SCALE}) scaleY(${
            height * BORDER_SCALE
          })`,
        }}
      />
      <div
        style={{
          position: 'fixed',
          width: '100px',
          height: '100px',
          backgroundColor: BORDER_COLOR,
          transformOrigin: '0px 0px',
          opacity: 1,
          willChange: 'transform',
          transform: `translateX(0px) translateY(0px) translateZ(0px) scaleX(${BORDER_SCALE}) scaleY(${
            height * BORDER_SCALE
          })`,
        }}
      />
      <div
        style={{
          position: 'fixed',
          width: '100px',
          height: '100px',
          backgroundColor: BORDER_COLOR,
          transformOrigin: '0px 0px',
          opacity: 1,
          willChange: 'transform',
          transform: `translateX(0px) translateY(${
            height - 1
          }px) translateZ(0px) scaleX(${
            width * BORDER_SCALE
          }) scaleY(${BORDER_SCALE})`,
        }}
      />
      <div
        style={{
          position: 'fixed',
          width: '100px',
          height: '100px',
          backgroundColor: BORDER_COLOR,
          transformOrigin: '0px 0px',
          opacity: 1,
          willChange: 'transform',
          transform: `translateX(0px) translateY(0px) translateZ(0px) scaleX(${
            width * BORDER_SCALE
          }) scaleY(${BORDER_SCALE})`,
        }}
      />
      {children}
    </div>
  )
}
