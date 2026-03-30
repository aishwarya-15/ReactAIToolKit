import { Button } from '@/shared/components/ui'
import { t } from '@/shared/i18n'

export default function QuizQuestion({
  question,
  options,
  answer: rawAnswer,
  explanation,
  selectedAnswer,
  showExplanation,
  onSelectAnswer,
}) {
  const answer = Number(rawAnswer)

  return (
    <div className="question-card">
      <p className="question-text">{question}</p>

      <div className="options-list">
        {options.map((option, i) => {
          let extraClass = ''
          if (selectedAnswer !== null) {
            if (i === answer) extraClass = 'option-btn--correct'
            else if (i === selectedAnswer && i !== answer) extraClass = 'option-btn--selected-wrong'
          }
          return (
            <Button
              key={i}
              variant="option"
              className={extraClass}
              onClick={() => onSelectAnswer(i)}
              disabled={selectedAnswer !== null}
            >
              <span className="option-letter">{['A', 'B', 'C', 'D'][i]}</span>
              <span className="option-text">{option}</span>
              {selectedAnswer !== null && i === answer && (
                <span className="option-check">✓</span>
              )}
            </Button>
          )
        })}
      </div>

      {showExplanation && (
        <div
          className={`explanation ${
            selectedAnswer === answer ? 'explanation--correct' : 'explanation--wrong'
          }`}
        >
          <strong>{selectedAnswer === answer ? t('quizCorrect') : t('quizIncorrect')}</strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  )
}
