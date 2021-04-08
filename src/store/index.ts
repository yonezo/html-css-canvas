import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

import { canvasReducer } from '../reducers/canvas'

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
