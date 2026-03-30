import { Button, Input, Textarea, Badge } from './ui'
import { t } from '@/shared/i18n'

export function ToolHeader({ icon, title, description, badge }) {
  return (
    <div className="tool-header">
      <div className="tool-header-left">
        <div className="tool-icon">{icon}</div>
        <div>
          <div className="tool-title-row">
            <h1 className="tool-title">{title}</h1>
            {badge && <Badge>{badge}</Badge>}
          </div>
          <p className="tool-description">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner({ text = t("thinking") }) {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-text">{text}</p>
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

// Re-export extracted components for backward compatibility
export { default as OutputBox } from './OutputBox'
export { default as ErrorMessage } from './ErrorBanner'

export function TextInput({ value, onChange, placeholder, rows = 1, label }) {
  if (rows > 1) {
    return <Textarea label={label} value={value} onChange={onChange} placeholder={placeholder} rows={rows} />
  }
  return <Input label={label} value={value} onChange={onChange} placeholder={placeholder} />
}

export function RunButton({ onClick, isLoading, label = 'Run', disabled }) {
  return (
    <Button variant="primary" onClick={onClick} disabled={isLoading || disabled}>
      {isLoading ? (<><span className="btn-spinner"></span> {t("processing")}</>) : label}
    </Button>
  )
}
