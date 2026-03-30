import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { addToHistory } from '@/shared/store/slices/historySlice'
import { incrementApiCallCount } from '@/shared/store/slices/settingsSlice'
import { callGroqAPI } from '@/shared/lib'

export function useAITool({ tool, systemPrompt }) {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  const run = useCallback(async (userInput) => {
    if (!userInput.trim()) return

    setIsLoading(true)
    setError(null)
    setOutput('')

    try {
      const result = await callGroqAPI({ systemPrompt, userMessage: userInput })
      setOutput(result)
      dispatch(addToHistory({ tool, input: userInput, output: result }))
      dispatch(incrementApiCallCount())
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [systemPrompt, tool, dispatch])

  const reset = useCallback(() => {
    setOutput('')
    setError(null)
  }, [])

  return { output, isLoading, error, run, reset }
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
