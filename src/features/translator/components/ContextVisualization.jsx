import { t } from '@/shared/i18n'

export default function ContextVisualization({ sourceLang, targetLang }) {
  return (
    <div className="context-visualization">
      <div className="context-provider-box">
        <span className="context-label">{t('translatorContextProvider')}</span>
        <div className="context-value">
          value: {`{ sourceLang: "${sourceLang}", targetLang: "${targetLang}" }`}
        </div>
      </div>
      <div className="context-arrows">
        <span>{t('translatorContextArrow1')}</span>
        <span>{t('translatorContextArrow2')}</span>
      </div>
    </div>
  )
}
