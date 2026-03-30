import ConceptTag from '@/shared/components/ConceptTag'

export default function ToolCard({ icon, title, description, color, concepts, onClick }) {
  return (
    <div className={`tool-card tool-card--${color}`} onClick={onClick}>
      <div className="tool-card-icon">{icon}</div>
      <h3 className="tool-card-title">{title}</h3>
      <p className="tool-card-desc">{description}</p>
      <div className="tool-card-concepts">
        {concepts.map((c) => (
          <ConceptTag key={c} label={c} />
        ))}
      </div>
    </div>
  )
}
