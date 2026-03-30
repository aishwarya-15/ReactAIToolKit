import { useState, useEffect, useReducer } from 'react'
import { useAITool } from '@/shared/hooks'
import { ToolHeader, RunButton, LoadingSpinner } from '@/shared/components/UIComponents'
import ConceptCallout from '@/shared/components/ConceptCallout'
import ProgressBar from '@/shared/components/ProgressBar'
import { Button, Input } from '@/shared/components/ui'
import { toast } from '@/shared/components/Toast'
import { t } from '@/shared/i18n'
import QuizQuestion from './components/QuizQuestion'
import QuizResults from './components/QuizResults'
import TopicSelector from './components/TopicSelector'
import DifficultySelector from './components/DifficultySelector'

/* ── State machine ──────────────────────────────────────── */

const initialQuizState = {
  phase: 'idle',
  questions: [],
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  answers: [],
  showExplanation: false,
}

function quizReducer(state, action) {
  switch (action.type) {
    case 'START_GENERATING':
      return { ...initialQuizState, phase: 'generating' }

    case 'QUESTIONS_LOADED':
      return { ...state, phase: 'active', questions: action.payload }

    case 'SELECT_ANSWER': {
      if (state.selectedAnswer !== null) return state
      const correctIdx = Number(state.questions[state.currentIndex].answer)
      const isCorrect = action.payload === correctIdx
      return {
        ...state,
        selectedAnswer: action.payload,
        showExplanation: true,
        score: isCorrect ? state.score + 1 : state.score,
        answers: [
          ...state.answers,
          {
            questionIndex: state.currentIndex,
            selected: action.payload,
            correct: correctIdx,
            isCorrect,
          },
        ],
      }
    }

    case 'NEXT_QUESTION': {
      const isLast = state.currentIndex >= state.questions.length - 1
      if (isLast) return { ...state, phase: 'done', showExplanation: false }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        showExplanation: false,
      }
    }

    case 'RESTART':
      return { ...initialQuizState }

    case 'ERROR':
      return { ...state, phase: 'idle' }

    default:
      return state
  }
}

/* ── Constants ──────────────────────────────────────────── */

const TOPICS = [
  'React Hooks', 'JavaScript ES6+', 'CSS Flexbox',
  'Node.js Basics', 'Redux', 'TypeScript', 'Web APIs',
  'Git Commands', 'SQL Basics', 'Python Basics',
]

const SYSTEM_PROMPT = `You are a quiz generator. Given a topic, generate exactly 5 multiple choice questions.

Return ONLY a valid JSON array (no markdown, no backticks, no explanation):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Why this answer is correct."
  }
]

The "answer" field is the zero-based index of the correct option.
Make questions educational and progressively harder.`

/* ── Component ──────────────────────────────────────────── */

export default function QuizPage() {
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [quizState, dispatch] = useReducer(quizReducer, initialQuizState)

  const { phase, questions, currentIndex, selectedAnswer, score, showExplanation } = quizState

  const { run, isLoading, output, error } = useAITool({
    tool: 'QuizGenerator',
    systemPrompt: SYSTEM_PROMPT,
  })

  // Show API errors as toast
  useEffect(() => {
    if (error) toast.error(t('quizErrorBanner', { error }))
  }, [error])

  /* Parse AI output → quiz questions */
  useEffect(() => {
    if (!output) return
    try {
      const cleaned = output.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map((q) => ({
          ...q,
          answer: Number(q.answer),
        }))
        dispatch({ type: 'QUESTIONS_LOADED', payload: normalized })
      } else {
        dispatch({ type: 'ERROR' })
      }
    } catch {
      dispatch({ type: 'ERROR' })
    }
  }, [output])

  /* Dynamic document title */
  useEffect(() => {
    const titles = {
      idle: t('quizDocTitleIdle'),
      generating: t('quizDocTitleGenerating'),
      active: t('quizDocTitleActive', { current: currentIndex + 1, total: questions.length }),
      done: t('quizDocTitleDone', { score, total: questions.length }),
    }
    document.title = titles[phase] || t('appTitle')
  }, [phase, currentIndex, score, questions.length])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    dispatch({ type: 'START_GENERATING' })
    await run(`Generate a ${difficulty} quiz about: ${topic}`)
  }

  const currentQuestion = questions[currentIndex]
  const progress =
    questions.length > 0
      ? ((currentIndex + (selectedAnswer !== null ? 1 : 0)) / questions.length) * 100
      : 0

  /* ── Generating phase ─────────────────────────────────── */
  if (phase === 'generating' || isLoading) {
    return (
      <div className="page">
        <ToolHeader
          icon="❓"
          title={t('quizTitleGenerating')}
          description={t('quizDescGenerating')}
          badge={t('quizBadgeGenerating')}
        />
        <div className="quiz-generating">
          <LoadingSpinner text={t('quizGeneratingSpinner', { difficulty, topic })} />
          <p className="generating-note">{t('quizGeneratingNote')}</p>
        </div>
      </div>
    )
  }

  /* ── Done phase ───────────────────────────────────────── */
  if (phase === 'done') {
    return (
      <div className="page">
        <ToolHeader
          icon="❓"
          title={t('quizTitleDone')}
          description={t('quizDescDone', { topic })}
          badge={t('quizBadgeGenerating')}
        />
        <QuizResults
          score={score}
          total={questions.length}
          answers={quizState.answers}
          questions={questions}
          onRestart={() => dispatch({ type: 'RESTART' })}
          onChangeTopic={() => { dispatch({ type: 'RESTART' }); setTopic('') }}
        />
      </div>
    )
  }

  /* ── Active phase ─────────────────────────────────────── */
  if (phase === 'active' && currentQuestion) {
    return (
      <div className="page">
        <ToolHeader
          icon="❓"
          title={t('quizTitleActive')}
          description={t('quizDescActive', { topic, difficulty })}
          badge={t('quizBadgeActive')}
        />
        <div className="quiz-active">
          <ProgressBar value={progress} />
          <div className="quiz-meta">
            <span>{t('quizQuestionOf', { current: currentIndex + 1, total: questions.length })}</span>
            <span className="quiz-score-live">
              {t('quizScoreLive', {
                score,
                answered: currentIndex + (selectedAnswer !== null ? 1 : 0),
              })}
            </span>
          </div>

          <QuizQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            answer={currentQuestion.answer}
            explanation={currentQuestion.explanation}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            onSelectAnswer={(i) => dispatch({ type: 'SELECT_ANSWER', payload: i })}
          />

          {selectedAnswer !== null && (
            <Button variant="primary" onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
              {currentIndex >= questions.length - 1 ? t('quizSeeResults') : t('quizNextQuestion')}
            </Button>
          )}
        </div>
      </div>
    )
  }

  /* ── Idle phase (default) ─────────────────────────────── */
  return (
    <div className="page">
      <ToolHeader
        icon="❓"
        title={t('quizTitleIdle')}
        description={t('quizDescIdle')}
        badge={t('quizBadgeIdle')}
      />

      <ConceptCallout>{t('quizConceptCallout')}</ConceptCallout>

      <div className="quiz-setup">
        <Input
          label={t('quizTopicLabel')}
          value={topic}
          onChange={setTopic}
          placeholder={t('quizTopicPlaceholder')}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />

        <TopicSelector topics={TOPICS} onSelect={setTopic} />
        <DifficultySelector selected={difficulty} onChange={setDifficulty} />

        <RunButton
          onClick={handleGenerate}
          isLoading={isLoading}
          label={t('quizGenerateLabel')}
          disabled={!topic.trim()}
        />
      </div>
    </div>
  )
}
