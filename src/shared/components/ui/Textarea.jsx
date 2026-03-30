export default function Textarea({ value, onChange, placeholder, label, rows = 4, className = '', ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea
        className={`textarea ${className}`.trim()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        {...props}
      />
    </div>
  )
}
