import React, { ReactElement, useEffect, useRef } from 'react'
import { batch, shallowEqual } from 'react-redux'

import { Container, MainPane, LeftPane } from './components/Pane'
import { Canvas } from './containers/canvas'
import { CanvasEventTarget } from './containers/canvas-event-target'
import { useAppDispatch, useAppSelector } from './hooks'
import { addChild, createNode } from './reducers/nodes'
import { updateFrame, selectNode, initializeNodes } from './reducers/canvas'
import { useKeyPress } from './hooks/use-key-press'
import { selectHighlightNodeAbsoluteFrame } from './selectors/nodes'

const App = (): ReactElement<any> => {
  const dispatch = useAppDispatch()
  const escapeKeyPress = useKeyPress('Escape')
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const isEmpty = useAppSelector(
    (state) => Object.keys(state.canvas.nodes).length === 0,
  )
  const cursorCoords = useAppSelector((state) => state.canvas.cursorCoords)
  const scale = useAppSelector((state) => state.canvas.scale)
  const offset = useAppSelector((state) => state.canvas.offset)
  const frame = useAppSelector(selectHighlightNodeAbsoluteFrame, shallowEqual)

  useEffect(() => {
    dispatch(selectNode({ id: null }))
  }, [escapeKeyPress])

  useEffect(() => {
    window.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault()
      },
      { passive: false },
    )
  }, [])

  useEffect(() => {
    const rect = mainPaneRef.current?.getBoundingClientRect()
    if (!rect) return
    dispatch(
      updateFrame({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }),
    )
  }, [mainPaneRef.current])

  return (
    <Container>
      <LeftPane>
        <p style={{ fontSize: 12 }}>cursor: {JSON.stringify(cursorCoords)}</p>
        <p style={{ fontSize: 12 }}>scale: {JSON.stringify(scale)}</p>
        <p style={{ fontSize: 12 }}>offset: {JSON.stringify(offset)}</p>
        <p style={{ fontSize: 12 }}>hilightId: {JSON.stringify(frame?.id)}</p>
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
        {!isEmpty && (
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
