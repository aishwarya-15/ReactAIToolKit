export default function TypingIndicator() {
  return (
    <div className="message message--assistant">
      <div className="message-avatar">⚡</div>
      <div className="message-content">
        <div className="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  )
}
