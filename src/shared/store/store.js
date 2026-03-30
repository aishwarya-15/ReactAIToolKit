import { configureStore } from '@reduxjs/toolkit'
import historyReducer from './slices/historySlice'
import settingsReducer from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    history: historyReducer,
    settings: settingsReducer,
  },
})

export default store
