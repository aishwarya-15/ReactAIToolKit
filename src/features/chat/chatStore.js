import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

export const useChatStore = create(
  devtools(
    persist(
      (set, get) => ({
        messages: [],
        isLoading: false,
        error: null,
        model: 'gemma2-9b-it',

        addMessage: (role, content) => {
          set((state) => ({
            messages: [
              ...state.messages,
              { id: Date.now(), role, content, timestamp: new Date().toISOString() },
            ],
          }))
        },

        updateLastMessage: (content) => {
          set((state) => {
            const msgs = [...state.messages]
            if (msgs.length === 0) return state
            msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content }
            return { messages: msgs }
          })
        },

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        clearChat: () => set({ messages: [], error: null }),

        getLastMessage: () => {
          const messages = get().messages
          return messages[messages.length - 1]
        },
      }),
      {
        name: 'ai-chat-storage',
        partialize: (state) => ({ messages: state.messages }),
      }
    ),
    { name: 'ChatStore' }
  )
)
