import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'dark',
  language: 'en',
  apiCallCount: 0,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    incrementApiCallCount: (state) => {
      state.apiCallCount += 1
    },
  },
})

export const { toggleTheme, setLanguage, incrementApiCallCount } = settingsSlice.actions

export const selectTheme = (state) => state.settings.theme
export const selectLanguage = (state) => state.settings.language
export const selectApiCallCount = (state) => state.settings.apiCallCount

export default settingsSlice.reducer
