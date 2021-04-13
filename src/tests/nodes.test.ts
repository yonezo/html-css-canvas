import { TCavas, TNode } from '../types'
import { selectHighlightNodeAbsoluteFrame } from '../selectors/nodes'

import { createNode, normalize } from './helplers'

const canvasState: TCavas = {
  isLoading: false,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  scale: 1,
  offsetLeft: 0,
  offsetTop: 0,
  selectedNodeId: null,
  selectedNodeIds: {},
  draggingNode: null,
  resizingNode: null,
  resizeHandleDirection: null,
  cursorCoords: { x: 0, y: 0 },
  nodes: {},
}

describe('0 -- { 1 }', () => {
  const ns: TNode[] = [
    createNode({ id: '0', width: 375, height: 812, children: ['1'] }),
    createNode({
      id: '1',
      parentid: '0',
      width: 200,
      height: 200,
      children: ['2'],
    }),
    createNode({
      id: '2',
      parentid: '1',
      left: 75,
      top: 100,
      width: 50,
      height: 200,
      children: [],
    }),
  ]

  it('カーソルがNodeの上にある場合は、ハイライトさせる', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        cursorCoords: { x: 20, y: 20 },
        nodes: normalize(ns),
      },
    })
    expect(receive).toEqual({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
    })
  })

  describe('scale', () => {
    it('カーソルがNodeの上にある場合は、ハイライトさせる', () => {
      const receive = selectHighlightNodeAbsoluteFrame({
        canvas: {
          ...canvasState,
          scale: 1.5,
          cursorCoords: { x: 200, y: 200 },
          nodes: normalize(ns),
        },
      })

      expect(receive).toEqual({
        left: 0,
        top: 0,
        width: 300,
        height: 300,
      })
    })
  })

  describe('offset', () => {
    it('カーソルがNodeの上にある場合は、ハイライトさせる', () => {
      const receive = selectHighlightNodeAbsoluteFrame({
        canvas: {
          ...canvasState,
          offsetLeft: 40,
          offsetTop: 40,
          cursorCoords: { x: 150, y: 200 },
          nodes: normalize(ns),
        },
      })
      expect(receive).toEqual({
        left: 40,
        top: 40,
        width: 200,
        height: 200,
      })
    })
  })

  describe('scale & offset', () => {
    it('他の要素と重なっている場合は上にある要素をハイライトさせる', () => {
      const receive = selectHighlightNodeAbsoluteFrame({
        canvas: {
          ...canvasState,
          nodes: normalize(ns),
          scale: 1.5,
          offsetLeft: 30,
          offsetTop: 30,
          cursorCoords: { x: 120, y: 200 },
        },
      })
      expect(receive).toEqual({
        left: 158,
        top: 195,
        width: 75,
        height: 300,
      })
    })
  })
})

describe('0 -- { 1 -- { 3 }, 2 }', () => {
  const ns: TNode[] = [
    createNode({ id: '0', width: 375, height: 812, children: ['1', '2'] }),
    createNode({
      id: '1',
      parentid: '0',
      width: 200,
      height: 200,
      children: ['3'],
    }),
    createNode({
      id: '2',
      parentid: '0',
      top: 200,
      width: 200,
      height: 200,
      children: [],
    }),
    createNode({
      id: '3',
      parentid: '1',
      left: 75,
      top: 100,
      width: 50,
      height: 100,
      children: [],
    }),
  ]

  it('選択している要素の上にカーソルがある場合は、ハイライトさせない', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: { ...canvasState, selectedNodeId: '1', nodes: normalize(ns) },
    })
    expect(receive).toEqual(undefined)
  })

  it('選択している要素の外にカーソルがある場合は、ハイライトさせる', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        selectedNodeId: '1',
        nodes: normalize(ns),
        cursorCoords: { x: 100, y: 300 },
      },
    })
    expect(receive).toEqual({
      left: 0,
      top: 200,
      width: 200,
      height: 200,
    })
  })

  it('選択している要素の子要素の上にカーソルがある場合は、子要素をハイライトさせる', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        selectedNodeId: '1',
        nodes: normalize(ns),
        cursorCoords: { x: 100, y: 150 },
      },
    })
    expect(receive).toEqual({
      left: 75,
      top: 100,
      width: 50,
      height: 100,
    })
  })

  it('他の要素と重なっている場合は上にある要素をハイライトさせる', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        nodes: normalize(ns),
        cursorCoords: { x: 100, y: 150 },
      },
    })
    expect(receive).toEqual({
      left: 75,
      top: 100,
      width: 50,
      height: 100,
    })
  })

  it('選択状態でリサイズ可能なNodeの下に接しているNodeの上端にカーソルがある場合はハイライトさせない', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        nodes: normalize(ns),
        selectedNodeId: '3',
        cursorCoords: { x: 100, y: 202 },
      },
    })
    expect(receive).toEqual(undefined)
  })
})

describe('0 -- { 1 -- { 2 -- { 3 } }, 4 -- { 5 -- { 6 } } }', () => {
  const ns: TNode[] = [
    createNode({ id: '0', width: 375, height: 812, children: ['1', '4'] }),
    createNode({
      id: '1',
      parentid: '0',
      width: 200,
      height: 200,
      children: ['2'],
      background: '#99EEFF',
    }),
    createNode({
      id: '2',
      parentid: '1',
      left: 10,
      top: 10,
      width: 180,
      height: 180,
      background: '#44CCFF',
      children: ['3'],
    }),
    createNode({
      id: '3',
      parentid: '2',
      left: 10,
      top: 10,
      width: 160,
      height: 160,
      background: '#47E0FF',
      children: [],
    }),
    createNode({
      id: '4',
      parentid: '0',
      left: 0,
      top: 220,
      width: 200,
      height: 200,
      background: '#C15F31',
      children: ['5'],
    }),
    createNode({
      id: '5',
      parentid: '4',
      left: 10,
      top: -200,
      width: 180,
      height: 180,
      background: '#F6D064',
      children: ['6'],
    }),
    createNode({
      id: '6',
      parentid: '5',
      left: 10,
      top: 10,
      width: 160,
      height: 160,
      background: '#E3D74A',
      children: [],
    }),
  ]

  it('子Node以外も選択できる', () => {
    const receive = selectHighlightNodeAbsoluteFrame({
      canvas: {
        ...canvasState,
        nodes: normalize(ns),
        selectedNodeId: '1',
        cursorCoords: { x: 100, y: 100 },
      },
    })

    expect(receive).toEqual({
      left: 20,
      top: 30,
      width: 160,
      height: 160,
    })
  })
})
