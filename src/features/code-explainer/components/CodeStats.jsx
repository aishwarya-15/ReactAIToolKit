import { t } from '@/shared/i18n'

export default function CodeStats({ lines, chars, words }) {
  return (
    <div className="code-stats">
      <span>{t('codeExplainerStatsLines', { count: lines })}</span>
      <span>{t('codeExplainerStatsChars', { count: chars })}</span>
      <span>{t('codeExplainerStatsTokens', { count: words })}</span>
    </div>
  )
}
