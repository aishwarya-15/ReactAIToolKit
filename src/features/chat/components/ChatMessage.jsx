import { t } from '@/shared/i18n'
import { useTTS } from '@/shared/hooks'

export default function ChatMessage({ id, role, content, timestamp, streaming }) {
  const { speak, stop, isSpeaking, isLoading } = useTTS()

  const btnLabel = isLoading
    ? t('chatSpeakLoading')
    : isSpeaking
      ? t('chatStopSpeaking')
      : t('chatSpeak')

  const btnIcon = isLoading ? '⏳' : isSpeaking ? '⏹' : '🔊'
  const btnClass = `message-tts-btn${
    isLoading ? ' message-tts-btn--loading' : isSpeaking ? ' message-tts-btn--active' : ''
  }`

  return (
    <div className={`message message--${role}`}>
      <div className="message-avatar">
        {role === 'user' ? t('chatUserAvatar') : t('chatAiAvatar')}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-role">
            {role === 'user' ? t('chatRoleUser') : t('chatRoleAI')}
          </span>
          <span className="message-time">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="message-text">
          {content}
          {streaming && <span className="streaming-cursor" />}
        </p>
        {!streaming && (
          <button
            className={btnClass}
            onClick={() => (isSpeaking || isLoading ? stop() : speak(content))}
            title={btnLabel}
            aria-label={btnLabel}
          >
            {btnIcon}
          </button>
        )}
      </div>
    </div>
  )
}
