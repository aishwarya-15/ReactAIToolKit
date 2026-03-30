// Shared API configuration — single source of truth for keys & URLs

export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
export const GROQ_TTS_URL = 'https://api.groq.com/openai/v1/audio/speech'
export const API_KEY = import.meta.env.VITE_GROQ_API_KEY || 'demo'

export const isDemoMode = () => API_KEY === 'demo'

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
