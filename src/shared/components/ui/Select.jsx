export default function Select({ value, onChange, options = [], label, className = '', ...props }) {
  return (
    <div className="control-group">
      {label && <label className="control-label">{label}</label>}
      <select
        className={`select ${className}`.trim()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      >
        {options.map(opt => {
          const optValue = typeof opt === 'string' ? opt : opt.value
          const optLabel = typeof opt === 'string' ? opt : opt.label
          return <option key={optValue} value={optValue}>{optLabel}</option>
        })}
      </select>
    </div>
  )
}
