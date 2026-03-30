import { t } from '@/shared/i18n'

export default function CodeEditor({
  code,
  onChange,
  language = 'javascript',
  fontSize = 14,
  showLineNumbers = true,
  rows = 12,
}) {
  const lines = code.split('\n')

  return (
    <div className="code-editor-wrapper">
      {showLineNumbers && (
        <div className="line-numbers" style={{ fontSize }}>
          {lines.map((_, i) => (
            <div key={i} className="line-number">{i + 1}</div>
          ))}
        </div>
      )}
      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('codeExplainerPlaceholder', { language })}
        style={{ fontSize }}
        rows={rows}
        spellCheck={false}
      />
    </div>
  )
}
