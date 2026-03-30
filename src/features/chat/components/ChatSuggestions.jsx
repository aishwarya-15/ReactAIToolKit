import { Button } from '@/shared/components/ui'
import { useLocale } from '@/shared/hooks'

export default function ChatSuggestions({ onSelect }) {
  const { t } = useLocale()

  const suggestions = [
    t('chatSuggestion1'),
    t('chatSuggestion2'),
    t('chatSuggestion3'),
    t('chatSuggestion4'),
  ]

  return (
    <div className="chat-empty">
      <p>{t('chatGreeting')}</p>
      <div className="chat-suggestions">
        {suggestions.map((s) => (
          <Button key={s} variant="chip" onClick={() => onSelect(s)}>
            {s}
          </Button>
        ))}
      </div>
    </div>
  )
}
