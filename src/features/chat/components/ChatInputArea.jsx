import { useCallback } from 'react'
import { Button } from '@/shared/components/ui'
import { useSTT } from '@/shared/hooks'
import { t } from '@/shared/i18n'

export default function ChatInputArea({ input, onInputChange, onSend, isLoading }) {
  const handleSTTResult = useCallback(
    (finalText) => {
      onInputChange((prev) =>
        typeof prev === 'string'
          ? prev ? prev + ' ' + finalText : finalText
          : finalText
      )
    },
    [onInputChange]
  )

  const { start, stop: stopSTT, isListening, supported: sttSupported } = useSTT({
    onResult: handleSTTResult,
  })

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const toggleMic = () => (isListening ? stopSTT() : start())

  return (
    <div className="chat-input-area">
      <div className="chat-input-row">
        {sttSupported && (
          <button
            className={`mic-btn${isListening ? ' mic-btn--active' : ''}`}
            onClick={toggleMic}
            title={isListening ? t('chatMicStop') : t('chatMicStart')}
            aria-label={isListening ? t('chatMicStop') : t('chatMicStart')}
            type="button"
          >
            {isListening ? '⏹' : '🎙️'}
          </button>
        )}
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? t('chatMicListening') : t('chatInputPlaceholder')}
          rows={2}
          disabled={isLoading}
        />
        <Button variant="send" onClick={onSend} disabled={!input.trim() || isLoading}>
          {t('chatSendButton')}
        </Button>
      </div>
    </div>
  )
}
