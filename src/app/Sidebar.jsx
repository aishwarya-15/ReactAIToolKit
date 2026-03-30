import NavBar from './NavBar'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import ApiKeyInput from './ApiKeyInput'
import { useSelector } from 'react-redux'
import { selectApiCallCount } from '@/shared/store/slices/settingsSlice'
import { selectHistoryCount } from '@/shared/store/slices/historySlice'
import { useLocale } from '@/shared/hooks'

export default function Sidebar({ open }) {
  const { t } = useLocale()
  const apiCallCount = useSelector(selectApiCallCount)
  const historyCount = useSelector(selectHistoryCount)

  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            {t("logoPrefix")}
            <span className="accent">{t("logoAccent")}</span>
          </span>
        </div>
        <div className="stats">
          <span className="stat">{t("callsStat", { count: apiCallCount })}</span>
          <span className="stat">{t("savedStat", { count: historyCount })}</span>
        </div>
      </div>

      <NavBar />

      <div className="sidebar-footer">
        <ApiKeyInput />
        <LanguageSwitcher />
        <ThemeToggle />
        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="api-key-link"
        >
          {t("getApiKeyLink")}
        </a>
      </div>
    </aside>
  )
}
