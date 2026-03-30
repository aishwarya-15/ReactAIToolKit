import { Button } from '@/shared/components/ui'
import { t } from '@/shared/i18n'

export default function QuizResults({
  score,
  total,
  answers,
  questions,
  onRestart,
  onChangeTopic,
}) {
  const percentage = Math.round((score / total) * 100)
  const grade =
    percentage >= 80
      ? t('quizResultExcellent')
      : percentage >= 60
        ? t('quizResultGood')
        : t('quizResultKeepLearning')

  return (
    <div className="quiz-results">
      <div className="results-score">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{total}</span>
        </div>
        <div className="score-grade">{grade}</div>
        <div className="score-percent">{t('quizPercentCorrect', { percent: percentage })}</div>
      </div>

      <div className="answer-review">
        <h3 className="review-title">{t('quizAnswerReview')}</h3>
        {answers.map((ans, i) => (
          <div
            key={i}
            className={`review-item ${
              ans.isCorrect ? 'review-item--correct' : 'review-item--wrong'
            }`}
          >
            <span className="review-icon">{ans.isCorrect ? '✓' : '✗'}</span>
            <span className="review-question">
              Q{i + 1}: {questions[ans.questionIndex]?.question}
            </span>
          </div>
        ))}
      </div>

      <div className="results-actions">
        <Button variant="primary" onClick={onRestart}>
          {t('quizNewQuiz')}
        </Button>
        <Button variant="secondary" onClick={onChangeTopic}>
          {t('quizChangeTopic')}
        </Button>
      </div>
    </div>
  )
}
