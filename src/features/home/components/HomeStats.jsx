import { useLocale } from '@/shared/hooks'

export default function HomeStats({ apiCallCount, historyCount, toolCount = 5 }) {
  const { t } = useLocale()
  return (
    <div className="home-stats">
      <div className="home-stat">
        <span className="home-stat-number">{apiCallCount}</span>
        <span className="home-stat-label">{t('homeStatApiCalls')}</span>
      </div>
      <div className="home-stat">
        <span className="home-stat-number">{historyCount}</span>
        <span className="home-stat-label">{t('homeStatHistory')}</span>
      </div>
      <div className="home-stat">
        <span className="home-stat-number">{toolCount}</span>
        <span className="home-stat-label">{t('homeStatTools')}</span>
      </div>
    </div>
  )
}
