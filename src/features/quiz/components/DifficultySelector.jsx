import { Button } from '@/shared/components/ui'
import { t } from '@/shared/i18n'

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced']

export default function DifficultySelector({ selected, onChange }) {
  return (
    <div className="input-group">
      <label className="input-label">{t('quizDifficultyLabel')}</label>
      <div className="difficulty-buttons">
        {DIFFICULTIES.map((d) => (
          <Button
            key={d}
            variant="difficulty"
            className={selected === d ? 'difficulty-btn--active' : ''}
            onClick={() => onChange(d)}
          >
            {d}
          </Button>
        ))}
      </div>
    </div>
  )
}
