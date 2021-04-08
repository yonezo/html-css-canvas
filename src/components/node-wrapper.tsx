import React, { ReactElement, ReactNode } from 'react'

export const NodeWrapper = ({
  left,
  top,
  width,
  height,
  scale,
  children,
}: {
  left: number
  top: number
  width: number
  height: number
  scale: number
  children?: ReactNode
}): ReactElement<any> => {
  const wrapperStyle: React.CSSProperties = {
    fontSmooth: 'antialiased',
    position: 'fixed',
    display: 'block',
    contain: 'layout style',
    transform: `translateX(${left}px) translateY(${top}px) scale(${1 / scale})`,
    transformOrigin: 'left top',
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    pointerEvents: 'none',
    willChange: 'transform',
  }

  const contentStyle: React.CSSProperties = {
    display: 'block',
    visibility: 'visible',
    transform: `scale(${scale})`,
    transformOrigin: 'left top',
  }

  return (
    <div style={wrapperStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  )
}
