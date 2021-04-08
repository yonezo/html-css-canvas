import { TCavas, TNode } from '../types'

import { selectHighlightNodeAbsoluteFrame } from './nodes'

const nodes: { [key: string]: TNode } = {
  '0': {
    id: '0',
    parentid: undefined,
    type: 'View',
    name: '0',
    left: 0,
    top: 0,
    right: undefined,
    bottom: undefined,
    width: 375,
    height: 812,
    background: 'white',
    children: ['1', '2'],
  },
  '1': {
    id: '1',
    parentid: '0',
    type: 'View',
    name: '1',
    left: 0,
    top: 0,
    right: undefined,
    bottom: undefined,
    width: 200,
    height: 200,
    background: '#99EEFF',
    children: ['3'],
  },
  '2': {
    id: '2',
    parentid: '0',
    type: 'View',
    name: '2',
    left: 0,
    top: 200,
    right: undefined,
    bottom: undefined,
    width: 200,
    height: 200,
    background: '#44CCFF',
    children: [],
  },
  '3': {
    id: '3',
    parentid: '1',
    type: 'View',
    name: '3',
    left: 75,
    top: 100,
    right: undefined,
    bottom: undefined,
    width: 50,
    height: 200,
    background: '#3995A7',
    children: [],
  },
}

const canvasState: TCavas = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  scale: 1,
  offset: { x: 0, y: 0 },
  selectedNodeId: undefined,
  movingNode: undefined,
  resizingNode: undefined,
  resizingDirection: undefined,
  cursorPoint: { x: 0, y: 0 },
  nodes,
}

it('カーソルがNodeの上にある場合は、ハイライトさせる', () => {
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      scale: 1.5,
      offset: { x: 40, y: 40 },
      cursorPoint: { x: 150, y: 200 },
    },
  })
  expect(receive).toEqual({
    id: '3',
    left: 173,
    top: 210,
    width: 75,
    height: 300,
  })
})

it('選択している要素の上にカーソルがある場合は、ハイライトさせない', () => {
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: { ...canvasState, selectedNodeId: '1' },
  })
  expect(receive).toEqual(undefined)
})

it('選択している要素の外にカーソルがある場合は、ハイライトさせる', () => {
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      selectedNodeId: '2',
      nodes,
      cursorPoint: { x: 20, y: 20 },
    },
  })
  expect(receive).toEqual({
    id: '1',
    left: 0,
    top: 0,
    width: 200,
    height: 200,
  })
})

it('選択している要素の子要素の上にカーソルがある場合は、子要素をハイライトさせる', () => {
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      selectedNodeId: '1',
      nodes,
      cursorPoint: { x: 100, y: 150 },
    },
  })
  expect(receive).toEqual({
    id: '3',
    left: 75,
    top: 100,
    width: 50,
    height: 200,
  })
})

it('他の要素と重なっている場合は上にある要素をハイライトさせる', () => {
  const nodes: { [key: string]: TNode } = {
    '0': {
      id: '0',
      parentid: undefined,
      type: 'View',
      name: '0',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 375,
      height: 812,
      background: 'white',
      children: ['1', '2'],
    },
    '1': {
      id: '1',
      parentid: '0',
      type: 'View',
      name: '1',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#99EEFF',
      children: ['3'],
    },
    '2': {
      id: '2',
      parentid: '0',
      type: 'View',
      name: '2',
      left: 0,
      top: 200,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#44CCFF',
      children: [],
    },
    '3': {
      id: '3',
      parentid: '1',
      type: 'View',
      name: '3',
      left: 75,
      top: 100,
      right: undefined,
      bottom: undefined,
      width: 50,
      height: 100,
      background: '#47E0FF',
      children: [],
    },
  }

  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      nodes,
      cursorPoint: { x: 100, y: 150 },
    },
  })
  expect(receive).toEqual({
    id: '3',
    left: 75,
    top: 100,
    width: 50,
    height: 100,
  })
})

it('他の要素と重なっている場合は上にある要素をハイライトさせる offsetとscaleがある場合', () => {
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      nodes,
      scale: 1.5,
      offset: { x: 30, y: 30 },
      cursorPoint: { x: 120, y: 310 },
    },
  })
  expect(receive).toEqual({
    id: '2',
    left: 45,
    top: 345,
    width: 300,
    height: 300,
  })
})

it('選択状態でリサイズ可能なNodeの下に接しているNodeの上端にカーソルがある場合はハイライトさせない', () => {
  const nodes: { [key: string]: TNode } = {
    '0': {
      id: '0',
      parentid: undefined,
      type: 'View',
      name: '0',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 375,
      height: 812,
      background: 'white',
      children: ['1', '2'],
    },
    '1': {
      id: '1',
      parentid: '0',
      type: 'View',
      name: '1',
      left: 0,
      top: 0,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#99EEFF',
      children: ['3'],
    },
    '2': {
      id: '2',
      parentid: '0',
      type: 'View',
      name: '2',
      left: 0,
      top: 200,
      right: undefined,
      bottom: undefined,
      width: 200,
      height: 200,
      background: '#44CCFF',
      children: [],
    },
    '3': {
      id: '3',
      parentid: '1',
      type: 'View',
      name: '3',
      left: 75,
      top: 100,
      right: undefined,
      bottom: undefined,
      width: 50,
      height: 100,
      background: '#3995A7',
      children: [],
    },
  }
  const receive = selectHighlightNodeAbsoluteFrame({
    canvas: {
      ...canvasState,
      nodes,
      offset: { x: 30, y: 30 },
      selectedNodeId: '3',
      cursorPoint: { x: 100, y: 202 },
    },
  })
  expect(receive).toEqual(undefined)
})