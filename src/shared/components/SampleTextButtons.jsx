import { Button } from './ui'

export default function SampleTextButtons({ samples, onSelect }) {
  if (!samples?.length) return null
  return (
    <div className="sample-texts">
      <span className="sample-label">Try:</span>
      {samples.map((s, i) => (
        <Button key={i} variant="sample" onClick={() => onSelect(s.text ?? s)}>
          {s.label ?? (typeof s === 'string' ? s.slice(0, 40) : s)}
        </Button>
      ))}
    </div>
  )
}
