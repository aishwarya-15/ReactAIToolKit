import { NavLink } from 'react-router-dom'
import { useLocale } from '@/shared/hooks'

const NAV_ITEMS = [
  { path: '/', labelKey: 'navHome', icon: '⌂', exact: true },
  { path: '/summarizer', labelKey: 'navSummarizer', icon: '📄' },
  { path: '/code-explainer', labelKey: 'navCode', icon: '{ }' },
  { path: '/chat', labelKey: 'navChat', icon: '💬' },
  { path: '/translator', labelKey: 'navTranslator', icon: '🌐' },
  { path: '/quiz', labelKey: 'navQuiz', icon: '❓' },
]

export default function NavBar() {
  const { t } = useLocale()

  return (
    <nav className="nav">
      {NAV_ITEMS.map(({ path, labelKey, icon, exact }) => (
        <NavLink
          key={path}
          to={path}
          end={exact}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
