// Groq LLM API — text generation & chat

import { GROQ_API_URL, API_KEY, isDemoMode, sleep } from './config'
import { t } from '@/shared/i18n'

// ── Single-turn completion ──
export async function callGroqAPI({ systemPrompt, userMessage, model = 'llama-3.1-8b-instant', maxTokens = 1024 }) {
  if (isDemoMode()) {
    await sleep(1200)
    return getDemoResponse(systemPrompt, userMessage)
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
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

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || `API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// ── Multi-turn chat (non-streaming) ──
export async function callGroqChat({ messages, model = 'llama-3.1-8b-instant' }) {
  if (isDemoMode()) {
    await sleep(1000)
    return getDemoChatResponse(messages)
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
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

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || `API Error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// ── SSE streaming chat ──
export async function callGroqChatStream({ messages, model = 'llama-3.1-8b-instant', onChunk, signal }) {
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
      Authorization: `Bearer ${API_KEY}`,
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

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || `API Error: ${response.status}`)
  }

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
