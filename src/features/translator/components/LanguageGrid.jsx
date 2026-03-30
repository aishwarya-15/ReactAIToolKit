import { memo, useMemo } from 'react'
import { Tag, SearchableDropdown } from '@/shared/components/ui'
import { t } from '@/shared/i18n'

const LanguageGrid = memo(function LanguageGrid({
  languages,
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
}) {
  // Convert languages array to { value, label } for the dropdown
  const langOptions = useMemo(
    () => languages.map((l) => ({ value: l.code, label: l.name })),
    [languages]
  )

  return (
    <div className="lang-grid">
      <div className="lang-section">
        <label className="control-label">{t('translatorFromLabel')}</label>
        <div className="lang-chips">
          <Tag variant="chip" active={sourceLang === 'auto'} onClick={() => onSourceChange('auto')}>
            {t('translatorAutoDetect')}
          </Tag>
          <Tag variant="chip" active={sourceLang === 'en'} onClick={() => onSourceChange('en')}>
            {t('translatorEnglish')}
          </Tag>
        </div>
      </div>
      <div className="lang-section">
        <SearchableDropdown
          label={t('translatorToLabel')}
          value={targetLang}
          onChange={onTargetChange}
          options={langOptions}
          placeholder={t('translatorToLabel')}
        />
      </div>
    </div>
  )
})

export default LanguageGrid
