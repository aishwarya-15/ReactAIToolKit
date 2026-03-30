import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalCount: 0,
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addToHistory: (state, action) => {
      const entry = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      }
      state.items.unshift(entry)
      state.totalCount += 1
      if (state.items.length > 50) state.items.pop()
    },
    removeFromHistory: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearHistory: (state) => {
      state.items = []
      state.totalCount = 0
    },
  },
})

export const { addToHistory, removeFromHistory, clearHistory } = historySlice.actions

export const selectHistory = (state) => state.history.items
export const selectHistoryCount = (state) => state.history.totalCount
export const selectHistoryByTool = (tool) => (state) =>
  state.history.items.filter(item => item.tool === tool)

export default historySlice.reducer
