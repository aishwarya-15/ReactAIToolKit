export default function Tag({ children, active = false, onClick, className = '', variant = 'default' }) {
  const variantClasses = { default: 'concept-tag', chip: 'lang-chip', concept: 'concept-tag' }
  const base = variantClasses[variant] || 'concept-tag'
  const activeClass = active ? `${base}--active` : ''
  const isClickable = typeof onClick === 'function'

  if (isClickable) {
    return <button className={`${base} ${activeClass} ${className}`.trim()} onClick={onClick}>{children}</button>
  }
  return <span className={`${base} ${activeClass} ${className}`.trim()}>{children}</span>
}
