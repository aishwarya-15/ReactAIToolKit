import { Button } from '@/shared/components/ui'
import { t } from '@/shared/i18n'

export default function ZustandInfo({ messageCount, onClear }) {
  return (
    <div className="zustand-info">
      <div className="zustand-badge">{t('zustandBadge')}</div>
      <div>
        <strong>{t('zustandStoreLabel')}</strong>{' '}
        {t('zustandMessagesStored', { count: messageCount })}
        <span className="zustand-note">{t('zustandNote')}</span>
      </div>
      <Button variant="ghost" className="clear-chat-btn" onClick={onClear}>
        {t('clear')}
      </Button>
    </div>
  )
}
