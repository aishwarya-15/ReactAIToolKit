// Shared API configuration — single source of truth for keys & URLs

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
export const GROQ_TTS_URL = 'https://api.groq.com/openai/v1/audio/speech'

const ENV_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const STORAGE_KEY = 'groq_api_key'

/** Get the current API key — runtime input > env var > 'demo' */
export function getApiKey() {
  return localStorage.getItem(STORAGE_KEY) || ENV_KEY || 'demo'
}

/** Set the API key at runtime (persisted to localStorage) */
export function setApiKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key.trim())
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/** Clear the stored runtime key */
export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY)
}

export const isDemoMode = () => getApiKey() === 'demo'

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
