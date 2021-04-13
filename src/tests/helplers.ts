import { TNode } from '../types'

export const createNode = ({
  id,
  parentid = null,
  left = 0,
  top = 0,
  right = null,
  bottom = null,
  width,
  height,
  background = 'white',
  children = [],
}: {
  id: string
  parentid?: string | null
  left?: number | null
  top?: number | null
  right?: number | null
  bottom?: number | null
  width: number
  height: number
  background?: string
  children?: string[]
}): TNode => ({
  id,
  parentid,
  type: 'View',
  name: id,
  left,
  top,
  right,
  bottom,
  width,
  height,
  background,
  children,
})

export const normalize = (ns: TNode[]): { [key: string]: TNode } =>
  ns.reduce((prev: { [id: string]: TNode }, n) => {
    prev[n.id] = n
    return prev
  }, {})
