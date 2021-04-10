import React, { ReactElement, useEffect, useRef } from 'react'
import { batch } from 'react-redux'

import { Container, MainPane, LeftPane } from './components/Pane'
import { Canvas } from './containers/canvas'
import { CanvasEventTarget } from './containers/canvas-event-target'
import { LoadingMessage } from './components/loading-message'
import { useAppDispatch, useAppSelector } from './hooks'
import { addChild, createNode } from './reducers/nodes'
import {
  selectNode,
  initializeNodes,
  resizeCanvas,
  scrollToCenter,
} from './reducers/canvas'
import { useKeyPress } from './hooks/use-key-press'
import { useWindowSize } from './hooks/use-window-size'

const App = (): ReactElement<any> => {
  const dispatch = useAppDispatch()
  const escapeKeyPress = useKeyPress('Escape')
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const isLoading = useAppSelector((state) => state.canvas.isLoading)
  const isEmpty = useAppSelector(
    (state) => Object.keys(state.canvas.nodes).length === 0,
  )
  const cursorCoords = useAppSelector((state) => state.canvas.cursorCoords)
  const scale = useAppSelector((state) => state.canvas.scale)
  const offsetLeft = useAppSelector((state) => state.canvas.offsetLeft)
  const offsetTop = useAppSelector((state) => state.canvas.offsetTop)
  const size = useWindowSize()

  useEffect(() => {
    dispatch(selectNode({ id: null }))
  }, [escapeKeyPress])

  useEffect(() => {
    window.addEventListener('wheel', (e) => e.preventDefault(), {
      passive: false,
    })
  }, [])

  useEffect(() => {
    const rect = mainPaneRef.current?.getBoundingClientRect()
    if (!rect) return
    const { left, top, width, height } = rect
    dispatch(scrollToCenter({ left, top, width, height }))
  }, [mainPaneRef.current])

  useEffect(() => {
    const rect = mainPaneRef.current?.getBoundingClientRect()
    if (!rect) return
    const { left, top, width, height } = rect
    dispatch(resizeCanvas({ left, top, width, height }))
  }, [mainPaneRef.current, size])

  return (
    <Container>
      <LeftPane>
        <p style={{ fontSize: 12 }}>cursor: {JSON.stringify(cursorCoords)}</p>
        <p style={{ fontSize: 12 }}>scale: {JSON.stringify(scale)}</p>
        <p style={{ fontSize: 12 }}>
          scale percent: {JSON.stringify(Math.round(scale * 100))}%
        </p>
        <p style={{ fontSize: 12 }}>offsetLeft: {offsetLeft}</p>
        <p style={{ fontSize: 12 }}>offsetTop: {offsetTop}</p>
        <button onClick={() => dispatch(initializeNodes())}>InitNode</button>
        <button
          onClick={() => {
            batch(() => {
              const id = dispatch(createNode({ parentid: '0' })).payload.nodeid
              dispatch(addChild({ nodeid: '0', childid: id }))
            })
          }}
        >
          AddNode
        </button>
      </LeftPane>
      <MainPane ref={mainPaneRef}>
        {isLoading && <LoadingMessage />}
        {!isLoading && !isEmpty && (
          <>
            <CanvasEventTarget />
            <Canvas />
          </>
        )}
      </MainPane>
    </Container>
  )
}

export default App
