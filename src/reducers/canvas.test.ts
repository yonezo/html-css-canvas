import { TCavas, TNode } from '../types'

import { canvasReducer, dragStart, moveCursor } from './canvas'

const defaultState: TCavas = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  scale: 1,
  offset: { x: 0, y: 0 },
  selectedNodeId: null,
  selectedNodeIds: {},
  draggingNode: null,
  resizingNode: null,
  resizingDirection: null,
  cursorCoords: { x: 0, y: 0 },
  nodes: {},
}

describe('canvas reducer', () => {
  describe('move cursor action', () => {
    describe('if value of frame has already been set', () => {
      it('should return value of cursor pointer after calculation', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
            },
            moveCursor({ x: 0, y: 0 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          cursorCoords: { x: -200, y: 0 },
        })

        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
            },
            moveCursor({ x: 100, y: 100 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          cursorCoords: { x: -100, y: 100 },
        })
      })
    })

    describe('if value of frame and scale has already been set', () => {
      it('should return value of cursor pointer after calculation', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
              scale: 0.5,
            },
            moveCursor({ x: 0, y: 0 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          cursorCoords: { x: -200, y: 0 },
          scale: 0.5,
        })

        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
              scale: 1.5,
            },
            moveCursor({ x: 0, y: 0 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          cursorCoords: { x: -200, y: 0 },
          scale: 1.5,
        })
      })
    })

    describe('if value of frame and scale and offset has already been set', () => {
      it('should return value of cursor pointer after calculation', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
              offset: { x: 200, y: 200 },
              scale: 0.5,
            },
            moveCursor({ x: 0, y: 0 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          offset: { x: 200, y: 200 },
          cursorCoords: { x: -300, y: -100 },
          scale: 0.5,
        })

        expect(
          canvasReducer(
            {
              ...defaultState,
              frame: { x: 200, y: 0, width: 400, height: 0 },
              offset: { x: 200, y: 200 },
              scale: 1.5,
            },
            moveCursor({ x: 0, y: 0 }),
          ),
        ).toEqual({
          ...defaultState,
          frame: { x: 200, y: 0, width: 400, height: 0 },
          offset: { x: 200, y: 200 },
          cursorCoords: { x: -500, y: -300 },
          scale: 1.5,
        })
      })
    })
  })
  describe('drag start action', () => {
    it('ルートノードは選択できない', () => {
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
          background: '',
          children: [],
        },
      }
      expect(
        canvasReducer(
          {
            ...defaultState,
            nodes,
          },
          dragStart(),
        ),
      ).toEqual({
        ...defaultState,
        nodes,
      })
    })

    describe('nodesがない場合', () => {
      it('Stateに変化がない', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
        })
      })
    })

    describe('要素が一つ', () => {
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
          background: '',
          children: ['1'],
        },
        '1': {
          id: '1',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
      }
      it('Node上にカーソルがある状態でドラッグを開始すると、Nodeが選択状態になり、動かせる要素となる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          draggingNode: nodes['1'],
          selectedNodeId: '1',
        })
      })

      it('Node上にカーソルがない状態でドラッグを開始すると、Nodeは選択状態にならないし、動かせる要素にもならない', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              cursorCoords: { x: 201, y: 200 },
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          cursorCoords: { x: 201, y: 200 },
          nodes,
        })
      })

      it('選択中のNode上にカーソルがある状態でドラッグを開始すると、移動ができる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              cursorCoords: { x: 5, y: 5 },
              selectedNodeId: '1',
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          cursorCoords: { x: 5, y: 5 },
          selectedNodeId: '1',
          draggingNode: nodes['1'],
          nodes,
        })
      })
      it('should return state with resizing node & resizing direction', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              selectedNodeId: '1',
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          selectedNodeId: '1',
          resizingNode: nodes['1'],
          resizingDirection: 'topLeft',
        })
      })
    })
    describe('重なっていないNodeが２つある', () => {
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
          background: '',
          children: ['1', '2'],
        },
        '1': {
          id: '1',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
        '2': {
          id: '2',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 200,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
      }

      it('選択中のNode以外のNode上にカーソルがある状態でドラッグを開始すると、移動ができる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              cursorCoords: { x: 50, y: 250 },
              selectedNodeId: '1',
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          cursorCoords: { x: 50, y: 250 },
          selectedNodeId: '2',
          draggingNode: nodes['2'],
          nodes,
        })
      })

      it('選択中のNode以外のNode上にカーソルがある状態でドラッグを開始すると、移動ができる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              cursorCoords: { x: 50, y: 250 },
              selectedNodeId: '1',
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          cursorCoords: { x: 50, y: 250 },
          selectedNodeId: '2',
          draggingNode: nodes['2'],
          nodes,
        })
      })
    })

    describe('重なっているNodeがある場合', () => {
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
          background: '',
          children: ['1', '2'],
        },
        '1': {
          id: '1',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
        '2': {
          id: '2',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
      }
      it('should return state with moving node & selected node id', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          draggingNode: nodes['2'],
          selectedNodeId: '2',
        })
      })

      it('上に要素が重なっていても、選択している要素のリサイズエリアにカーソルがある場合リサイズできる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              selectedNodeId: '1',
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          selectedNodeId: '1',
          resizingNode: nodes['1'],
          resizingDirection: 'topLeft',
        })
      })
    })

    describe('重なっているNodeと重なっていないNodeがある', () => {
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
      it('選択中のNode内の子Node上にカーソルがある状態でドラッグすると移動ができる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              selectedNodeId: '1',
              cursorCoords: { x: 100, y: 150 },
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          selectedNodeId: '3',
          cursorCoords: { x: 100, y: 150 },
          draggingNode: nodes['3'],
        })
      })
    })

    describe('RootNodeをドラッグした場合', () => {
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
          background: '',
          children: ['1', '2'],
        },
        '1': {
          id: '1',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
        '2': {
          id: '2',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 200,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
      }
      it('選択しているNodeがなくなる', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              selectedNodeId: '1',
              cursorCoords: { x: 300, y: 100 },
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          selectedNodeId: null,
          cursorCoords: { x: 300, y: 100 },
        })
      })
    })

    describe('リサイズ中のNodeや移動中のNodeがある場合', () => {
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
          background: '',
          children: ['1', '2'],
        },
        '1': {
          id: '1',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 0,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
        '2': {
          id: '2',
          parentid: '0',
          type: 'View',
          name: '0',
          left: 0,
          top: 200,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '',
          children: [],
        },
      }
      it('リサイズ中のNodeがある場合、選択できない', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              resizingNode: nodes['1'],
              cursorCoords: { x: 0, y: 0 },
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          resizingNode: nodes['1'],
          cursorCoords: { x: 0, y: 0 },
        })
      })

      it('移動中のNodeがある場合、選択できない', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              draggingNode: nodes['1'],
              cursorCoords: { x: 0, y: 0 },
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          draggingNode: nodes['1'],
          selectedNodeId: null,
          cursorCoords: { x: 0, y: 0 },
        })
      })
    })
    describe('複雑なNodeがある場合', () => {
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
          children: ['1', '4'],
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
          children: ['2'],
        },
        '2': {
          id: '2',
          parentid: '1',
          type: 'View',
          name: '2',
          left: 10,
          top: 10,
          right: undefined,
          bottom: undefined,
          width: 180,
          height: 180,
          background: '#44CCFF',
          children: ['3'],
        },
        '3': {
          id: '3',
          parentid: '2',
          type: 'View',
          name: '3',
          left: 10,
          top: 10,
          right: undefined,
          bottom: undefined,
          width: 160,
          height: 160,
          background: '#47E0FF',
          children: [],
        },
        '4': {
          id: '4',
          parentid: '0',
          type: 'View',
          name: '4',
          left: 0,
          top: 220,
          right: undefined,
          bottom: undefined,
          width: 200,
          height: 200,
          background: '#C15F31',
          children: ['5'],
        },
        '5': {
          id: '5',
          parentid: '4',
          type: 'View',
          name: '5',
          left: 10,
          top: -200,
          right: undefined,
          bottom: undefined,
          width: 180,
          height: 180,
          background: '#F6D064',
          children: ['6'],
        },
        '6': {
          id: '6',
          parentid: '5',
          type: 'View',
          name: '6',
          left: 10,
          top: 10,
          right: undefined,
          bottom: undefined,
          width: 160,
          height: 160,
          background: '#E3D74A',
          children: [],
        },
      }

      it('選択中のNodeの子Nodeが別のNodeにある子Nodeと重なっている場合は、選択できない', () => {
        expect(
          canvasReducer(
            {
              ...defaultState,
              nodes,
              selectedNodeId: '2',
              cursorCoords: { x: 100, y: 100 },
            },
            dragStart(),
          ),
        ).toEqual({
          ...defaultState,
          nodes,
          draggingNode: nodes['6'],
          selectedNodeId: '6',
          cursorCoords: { x: 100, y: 100 },
        })
      })
    })
  })
})
