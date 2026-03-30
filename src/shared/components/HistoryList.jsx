import { t } from '@/shared/i18n'

export default function HistoryList({ items, onSelect, onClear, emptyMessage, onReuse }) {
  if (!items?.length) {
    return emptyMessage ? <div className="empty-state">{emptyMessage}</div> : null
  }

  return (
    <div className="history-tab">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="history-item">
          <div className="history-meta">
            <span className="history-time">
              {item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString()
                : ''}
            </span>
            {(onReuse || onSelect) && (
              <button
                className="reuse-btn"
                onClick={() => (onReuse || onSelect)?.(item)}
              >
                {t('reuse') ?? 'Reuse'}
              </button>
            )}
          </div>
          <div className="history-input">
            {typeof item === 'string'
              ? item.slice(0, 80)
              : (item.input || item.text || '').slice(0, 80)}
          </div>
        </div>
      ))}
      {onClear && (
        <button className="secondary-btn" onClick={onClear}>
          {t('clearHistory')}
        </button>
      )}
    </div>
  )
}
