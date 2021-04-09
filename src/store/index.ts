import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'

import { canvasReducer } from '../reducers/canvas'

const logger = createLogger({
  predicate: (_, action) => action.type !== 'canvas/moveCursor',
})

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
