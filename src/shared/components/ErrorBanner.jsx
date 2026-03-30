import { Button } from './ui'
import { t } from '@/shared/i18n'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-banner">
      <span className="error-icon">{t('errorPrefix')}</span>
      <span className="error-text">{message}</span>
      {onDismiss && (
        <Button variant="dismiss" onClick={onDismiss}>
          {t('dismiss')}
        </Button>
      )}
    </div>
  )
}
