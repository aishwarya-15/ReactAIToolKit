import { Link } from 'react-router-dom'
import { t } from '@/shared/i18n'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">{t("notFoundTitle")}</h1>
        <p className="not-found-desc">{t("notFoundDescription")}</p>
        <Link to="/" className="run-btn">{t("backHome")}</Link>
      </div>
    </div>
  )
}
