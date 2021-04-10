const MAX_SCALE = 5
const MIN_SCALE = 0.25
const STEP = 0.001

export const getNewScale = (prevScale: number, deltaValue: number): number => {
  const newScale = prevScale + deltaValue * STEP
  return Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE)
}

export const getOffsetWithScale = (
  canvasWidth: number,
  canvasHeight: number,
  canvasOffsetLeft: number,
  canvasOffsetTop: number,
  prevScale: number,
  newScale: number,
): { offsetLeft: number; offsetTop: number } => {
  const width = canvasWidth / prevScale
  const height = canvasHeight / prevScale
  const newWidth = canvasWidth / newScale
  const newHeight = canvasHeight / newScale
  const diffWidth = width - newWidth
  const diffHeight = height - newHeight
  return {
    offsetLeft: canvasOffsetLeft - diffWidth / 2,
    offsetTop: canvasOffsetTop - diffHeight / 2,
  }
}
