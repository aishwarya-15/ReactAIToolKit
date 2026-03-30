const VARIANT_CLASS = {
  primary: 'run-btn',
  secondary: 'secondary-btn',
  icon: 'icon-btn',
  sample: 'sample-btn',
  send: 'send-btn',
  ghost: 'ghost-btn',
  chip: 'suggestion-chip',
  tab: 'tab',
  copy: 'copy-btn',
  dismiss: 'error-dismiss',
  toggle: 'theme-toggle',
  option: 'option-btn',
  difficulty: 'difficulty-btn',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const base = VARIANT_CLASS[variant] || variant
  return (
    <button className={`${base} ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}
