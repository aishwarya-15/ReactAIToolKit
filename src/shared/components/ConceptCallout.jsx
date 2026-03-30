import { t } from '@/shared/i18n'

export default function ConceptCallout({ concept, description, icon = '💡', children }) {
  return (
    <div className="concept-callout">
      {children ?? (
        <>
          <span className="concept-icon">{icon}</span>
          <div className="concept-body">
            <strong className="concept-name">{concept}</strong>
            <p className="concept-desc">{description}</p>
          </div>
        </>
      )}
    </div>
  )
}
