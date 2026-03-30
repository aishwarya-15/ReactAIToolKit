import { useLocale } from '@/shared/hooks'

export default function RecentActivity({ items = [], maxItems = 3 }) {
  const { t } = useLocale()
  if (items.length === 0) return null

  return (
    <div className="recent-section">
      <h2 className="section-title">{t('homeRecentActivity')}</h2>
      <div className="recent-list">
        {items.slice(0, maxItems).map((item) => (
          <div key={item.id} className="recent-item">
            <span className="recent-tool">{item.tool}</span>
            <span className="recent-input">{item.input.slice(0, 60)}...</span>
            <span className="recent-time">
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
