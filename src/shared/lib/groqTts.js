// Groq Orpheus TTS — text-to-speech API
// Includes retry with exponential backoff + client-side rate limiting

import { GROQ_TTS_URL, getApiKey, isDemoMode } from './config'
import { detectLang } from './detectLang'
import { withRetry } from './retry'
import { withRateLimit, ttsLimiter } from './rateLimiter'

const TTS_CHAR_LIMIT = 200

const TTS_MODELS = {
  en: { model: 'canopylabs/orpheus-v1-english', voice: 'troy' },
  ar: { model: 'canopylabs/orpheus-arabic-saudi', voice: 'fahad' },
}

function chunkText(text, maxLen = TTS_CHAR_LIMIT) {
  const chunks = []
  let remaining = text.trim()

  while (remaining.length > maxLen) {
    let cutAt = -1
    for (const sep of ['. ', '! ', '? ', '; ']) {
      const idx = remaining.lastIndexOf(sep, maxLen)
      if (idx > 0 && idx > cutAt) cutAt = idx + sep.length
    }
    if (cutAt <= 0) {
      const idx = remaining.lastIndexOf(', ', maxLen)
      if (idx > 0) cutAt = idx + 2
    }
    if (cutAt <= 0) {
      const idx = remaining.lastIndexOf(' ', maxLen)
      if (idx > 0) cutAt = idx + 1
    }
    if (cutAt <= 0) cutAt = maxLen
    chunks.push(remaining.slice(0, cutAt).trim())
    remaining = remaining.slice(cutAt).trim()
  }
  if (remaining) chunks.push(remaining)
  return chunks
}

async function ttsChunk(text, voice, model) {
  const response = await fetch(GROQ_TTS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({ model, input: text, voice, response_format: 'wav' }),
  })

  if (!response.ok) {
    let msg = `TTS API Error: ${response.status}`
    let retryAfter = null
    const ra = response.headers.get('Retry-After')
    if (ra) retryAfter = parseFloat(ra)
    try { const err = await response.json(); msg = err.error?.message || msg } catch {}
    const error = new Error(msg)
    error.status = response.status
    if (retryAfter) error.retryAfter = retryAfter
    throw error
  }

  return response.arrayBuffer()
}

// Wrap individual chunk fetching with retry (each chunk is idempotent)
const resilientTtsChunk = withRetry(ttsChunk, { maxRetries: 2 })

function stitchWavBuffers(buffers) {
  if (buffers.length === 1) return new Blob([buffers[0]], { type: 'audio/wav' })

  const HEADER_SIZE = 44
  const pcmParts = buffers.map((buf, i) =>
    i === 0 ? new Uint8Array(buf) : new Uint8Array(buf, HEADER_SIZE)
  )
  const totalLen = pcmParts.reduce((s, p) => s + p.byteLength, 0)
  const out = new Uint8Array(totalLen)
  let offset = 0
  for (const part of pcmParts) {
    out.set(part, offset)
    offset += part.byteLength
  }
  const view = new DataView(out.buffer)
  view.setUint32(4, totalLen - 8, true)
  view.setUint32(HEADER_SIZE - 4, totalLen - HEADER_SIZE, true)
  return new Blob([out], { type: 'audio/wav' })
}

// Raw TTS function — rate-limited below
async function _callGroqTTS(text, { lang, signal } = {}) {
  const detected = lang || detectLang(text)

  if (isDemoMode()) return { url: null, lang: detected }

  const route = TTS_MODELS[detected]
  if (!route) return { url: null, lang: detected }

  const chunks = chunkText(text)
  const buffers = await Promise.all(
    chunks.map(chunk => {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      return resilientTtsChunk(chunk, route.voice, route.model)
    })
  )

  const blob = stitchWavBuffers(buffers)
  return { url: URL.createObjectURL(blob), lang: detected }
}

// ── Public API — wrapped with rate limit ──
export const callGroqTTS = withRateLimit(_callGroqTTS, ttsLimiter)

export { detectLang }
