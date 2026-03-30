import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addToHistory } from '@/shared/store/slices/historySlice'
import { callGroqChatStream } from '@/shared/lib'
import { ToolHeader } from '@/shared/components/UIComponents'
import ConceptCallout from '@/shared/components/ConceptCallout'
import { toast } from '@/shared/components/Toast'
import { t } from '@/shared/i18n'
import { useChatStore } from './chatStore'
import ChatSuggestions from './components/ChatSuggestions'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import ChatInputArea from './components/ChatInputArea'
import ZustandInfo from './components/ZustandInfo'

export default function ChatPage() {
  const [input, setInput] = useState('')

  /* Zustand selectors — only re-render when the selected slice changes */
  const messages = useChatStore((s) => s.messages)
  const isLoading = useChatStore((s) => s.isLoading)
  const error = useChatStore((s) => s.error)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateLastMessage = useChatStore((s) => s.updateLastMessage)
  const setLoading = useChatStore((s) => s.setLoading)
  const setError = useChatStore((s) => s.setError)
  const clearChat = useChatStore((s) => s.clearChat)

  const dispatch = useDispatch()

  const messagesEndRef = useRef(null)
  const isFirstLoad = useRef(true)
  const abortRef = useRef(null)

  // Surface chat errors as toast
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userInput = input.trim()
    setInput('')

    if (abortRef.current) abortRef.current.abort()
    const abortCtrl = new AbortController()
    abortRef.current = abortCtrl

    addMessage('user', userInput)
    setLoading(true)
    setError(null)
    addMessage('assistant', '')

    let accumulated = ''

    try {
      const fullResponse = await callGroqChatStream({
        messages: [...messages, { role: 'user', content: userInput }],
        signal: abortCtrl.signal,
        onChunk: (chunk) => {
          accumulated += chunk
          updateLastMessage(accumulated)
        },
      })

      dispatch(addToHistory({ tool: 'Chat', input: userInput, output: fullResponse }))
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message)
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }

  return (
    <div className="page chat-page">
      <ToolHeader
        icon="💬"
        title={t('chatTitle')}
        description={t('chatDesc')}
        badge={t('chatBadge')}
      />

      <ConceptCallout>{t('chatConceptCallout')}</ConceptCallout>

      <ZustandInfo messageCount={messages.length} onClear={clearChat} />

      <div className="chat-container">
        <div className="messages-list">
          {messages.length === 0 && <ChatSuggestions onSelect={setInput} />}

          {messages.map((msg, idx) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              streaming={
                isLoading && msg.role === 'assistant' && idx === messages.length - 1
              }
            />
          ))}

          {isLoading &&
            (messages.length === 0 ||
              messages[messages.length - 1]?.role !== 'assistant' ||
              !messages[messages.length - 1]?.content) && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        <ChatInputArea
          input={input}
          onInputChange={setInput}
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
