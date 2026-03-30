// Groq LLM API — text generation & chat
// Includes retry with exponential backoff + client-side rate limiting

import { GROQ_API_URL, getApiKey, isDemoMode, sleep } from './config'
import { withRetry } from './retry'
import { withRateLimit, apiLimiter } from './rateLimiter'
import { t } from '@/shared/i18n'

// ── Resilient error factory — preserves Retry-After ──
async function throwApiError(response) {
  let msg = `API Error: ${response.status}`
  let retryAfter = null

  // Parse Retry-After header (Groq sends this on 429)
  const ra = response.headers.get('Retry-After')
  if (ra) retryAfter = parseFloat(ra)

  try {
    const body = await response.json()
    msg = body.error?.message || msg
  } catch { /* response may not be JSON */ }

  const err = new Error(msg)
  err.status = response.status
  if (retryAfter) err.retryAfter = retryAfter
  throw err
}

// ── Single-turn completion (raw — wrapped below) ──
async function _callGroqAPI({ systemPrompt, userMessage, model = 'llama-3.1-8b-instant', maxTokens = 1024 }) {
  if (isDemoMode()) {
    await sleep(1200)
    return getDemoResponse(systemPrompt, userMessage)
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  })

  if (!response.ok) await throwApiError(response)

  const data = await response.json()
  return data.choices[0].message.content
}

// ── Multi-turn chat — non-streaming (raw — wrapped below) ──
async function _callGroqChat({ messages, model = 'llama-3.1-8b-instant' }) {
  if (isDemoMode()) {
    await sleep(1000)
    return getDemoChatResponse(messages)
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: t("apiChatSystemPrompt") },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!response.ok) await throwApiError(response)

  const data = await response.json()
  return data.choices[0].message.content
}

// ── SSE streaming chat (raw — wrapped below) ──
// NOTE: Streaming is NOT retried because partial output is already sent to UI.
// Rate limiting is still applied.
async function _callGroqChatStream({ messages, model = 'llama-3.1-8b-instant', onChunk, signal }) {
  if (isDemoMode()) {
    const full = getDemoChatResponse(messages)
    const words = full.split(' ')
    for (const word of words) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
      await sleep(40 + Math.random() * 60)
      onChunk(word + ' ')
    }
    return full
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    signal,
    body: JSON.stringify({
      model,
      stream: true,
      messages: [
        { role: 'system', content: t("apiChatSystemPrompt") },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  })

  if (!response.ok) await throwApiError(response)

  const frame = () => new Promise(resolve => requestAnimationFrame(resolve))
  const tick = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    const deltas = []
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue
      const payload = trimmed.slice(6)
      if (payload === '[DONE]') break

      try {
        const json = JSON.parse(payload)
        const delta = json.choices?.[0]?.delta?.content
        if (delta) deltas.push(delta)
      } catch { /* skip malformed chunks */ }
    }

    for (const delta of deltas) {
      if (signal?.aborted) break
      fullText += delta
      onChunk(delta)
      await frame()
      await tick(15)
    }
  }

  return fullText
}

// ── Demo helpers ──
function getDemoResponse(systemPrompt, userMessage) {
  if (systemPrompt.includes('summarize'))
    return t("apiDemoSummary", { preview: userMessage.slice(0, 40) })
  if (systemPrompt.includes('code'))
    return t("apiDemoCode")
  if (systemPrompt.includes('translat'))
    return t("apiDemoTranslation", { preview: userMessage.slice(0, 50) })
  if (systemPrompt.includes('quiz'))
    return JSON.stringify([
      { question: "What is React?", options: ["A JS library for UI", "A database", "A CSS framework", "A build tool"], answer: 0, explanation: "React is a JavaScript library for building user interfaces, developed by Facebook." },
      { question: "What hook manages state?", options: ["useEffect", "useRef", "useState", "useContext"], answer: 2, explanation: "useState is the primary hook for managing local component state in React." },
      { question: "What is JSX?", options: ["A JSON format", "JS + XML syntax", "A database query language", "A CSS preprocessor"], answer: 1, explanation: "JSX is a syntax extension that lets you write HTML-like markup inside JavaScript." },
    ])
  return t("apiDemoDefault", { preview: userMessage.slice(0, 50) })
}

function getDemoChatResponse(messages) {
  const responses = [
    t("apiDemoChatResponse1"),
    t("apiDemoChatResponse2"),
    t("apiDemoChatResponse3"),
    t("apiDemoChatResponse4"),
    t("apiDemoChatResponse5"),
  ]
  const index = messages.length % responses.length
  return `${responses[index]}${t("apiDemoChatSuffix")}`
}

// ── Public API — wrapped with retry + rate-limit ──
// Single-turn & multi-turn get retry (idempotent reads).
// Streaming gets rate-limit only (can't retry partial output).

export const callGroqAPI = withRateLimit(
  withRetry(_callGroqAPI, { maxRetries: 3 }),
  apiLimiter
)

export const callGroqChat = withRateLimit(
  withRetry(_callGroqChat, { maxRetries: 3 }),
  apiLimiter
)

export const callGroqChatStream = withRateLimit(
  _callGroqChatStream,    // no retry — streaming is not idempotent
  apiLimiter
)
