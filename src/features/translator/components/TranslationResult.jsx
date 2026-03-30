import { memo } from 'react'
import { LoadingSpinner } from '@/shared/components/UIComponents'
import { t } from '@/shared/i18n'

const TranslationResult = memo(function TranslationResult({ output, isLoading, langName }) {
  if (isLoading) return <LoadingSpinner text={t('translatorTranslatingTo', { langName })} />
  if (!output) return null

  return (
    <div className="translation-result">
      <div className="translation-header">
        <span className="translation-lang">{langName}</span>
      </div>
      <p className="translation-text">{output}</p>
    </div>
  )
})

export default TranslationResult
