export default function ProgressBar({ value, max = 100, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="quiz-progress-wrapper">
      {label && <span className="progress-label">{label}</span>}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
