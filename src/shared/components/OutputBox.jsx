import { Button } from './ui'
import { t } from '@/shared/i18n'
import { toast } from '@/shared/components/Toast'
import { LoadingSpinner } from './UIComponents'
import ErrorBanner from './ErrorBanner'

export default function OutputBox({ output, isLoading, error, onCopy }) {
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorBanner message={error} />
  if (!output) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    toast.success(t('copiedToClipboard'))
    onCopy?.()
  }

  const formatted = output
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .split('\n')
    .map((line) => `<p>${line || '&nbsp;'}</p>`)
    .join('')

  return (
    <div className="output-box">
      <div className="output-header">
        <span className="output-label">{t('result')}</span>
        <Button variant="copy" onClick={copyToClipboard}>
          {t('copy')}
        </Button>
      </div>
      <div
        className="output-content"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    </div>
  )
}
