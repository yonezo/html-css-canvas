import tinycolor from 'tinycolor2'

import { TNode } from '../types'

const initailid = '0'

export const initialize = (): { [key: string]: TNode } => {
  const rootWidth = 375
  const rootHeight = 812
  const tree: { [key: string]: TNode } = {
    [initailid]: {
      id: initailid,
      parentid: null,
      type: 'View',
      name: '0',
      top: 0,
      left: 0,
      right: null,
      bottom: null,
      width: rootWidth,
      height: rootHeight,
      background: 'gold',
      children: [],
    },
  }

  for (let i = 1; i < 50; i++) {
    const parentid = String(Math.floor(Math.pow(Math.random(), 2) * i))
    // const parentid = '0'
    const id = i.toString()
    const color = tinycolor.random()
    const left = i * 4
    const top = i * 4 * tree[parentid].children.length
    const width = tree[parentid].width - left * 2
    const height = 20
    tree[id] = {
      id,
      parentid,
      name: id,
      type: 'View',
      top,
      left,
      right: null,
      bottom: null,
      width,
      height,
      background: color.toRgbString(),
      children: [],
    }

    tree[parentid].children.push(id)
  }

  return tree
}
