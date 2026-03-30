import { useReducer, useMemo, useCallback } from 'react'
import { useAITool } from '@/shared/hooks'
import { ToolHeader, RunButton } from '@/shared/components/UIComponents'
import OutputBox from '@/shared/components/OutputBox'
import ConceptCallout from '@/shared/components/ConceptCallout'
import { Button, SearchableDropdown } from '@/shared/components/ui'
import { t } from '@/shared/i18n'
import CodeEditor from './components/CodeEditor'
import CodeStats from './components/CodeStats'

/* ── State machine ──────────────────────────────────────── */

const initialState = {
  code: '',
  language: 'javascript',
  explainMode: 'beginner',
  fontSize: 14,
  showLineNumbers: true,
}

function codeReducer(state, action) {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload, code: '' }
    case 'SET_EXPLAIN_MODE':
      return { ...state, explainMode: action.payload }
    case 'INCREASE_FONT':
      return { ...state, fontSize: Math.min(state.fontSize + 2, 20) }
    case 'DECREASE_FONT':
      return { ...state, fontSize: Math.max(state.fontSize - 2, 10) }
    case 'TOGGLE_LINE_NUMBERS':
      return { ...state, showLineNumbers: !state.showLineNumbers }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

/* ── Language samples ───────────────────────────────────── */

const LANGUAGE_SAMPLES = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,
  python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  css: `.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}`,
}

/* ── Component ──────────────────────────────────────────── */

export default function CodeExplainerPage() {
  const [state, dispatch] = useReducer(codeReducer, initialState)
  const { code, language, explainMode, fontSize, showLineNumbers } = state

  const codeStats = useMemo(() => ({
    lines: code.split('\n').length,
    chars: code.length,
    words: code.split(/\s+/).filter(Boolean).length,
  }), [code])

  const systemPrompt = useMemo(() => {
    const modes = {
      beginner: 'Explain this code in simple terms for a beginner. Use analogies and avoid jargon.',
      advanced: 'Analyze this code for an experienced developer. Discuss time/space complexity, patterns, and potential improvements.',
      'line-by-line': 'Explain this code line by line. Number each explanation to match the line number.',
    }
    return `You are a code educator. Language: ${language}. ${modes[explainMode]}`
  }, [language, explainMode])

  const { output, isLoading, error, run } = useAITool({
    tool: 'CodeExplainer',
    systemPrompt,
  })

  const handleLoadSample = useCallback(() => {
    dispatch({ type: 'SET_CODE', payload: LANGUAGE_SAMPLES[language] || '' })
  }, [language])

  return (
    <div className="page">
      <ToolHeader
        icon="{ }"
        title={t('codeExplainerTitle')}
        description={t('codeExplainerDesc')}
        badge={t('codeExplainerBadge')}
      />

      <ConceptCallout>{t('codeExplainerConceptCallout')}</ConceptCallout>

      <div className="code-controls">
        <SearchableDropdown
          label={t('codeExplainerLanguageLabel')}
          value={language}
          onChange={(val) => dispatch({ type: 'SET_LANGUAGE', payload: val })}
          options={['javascript', 'python', 'css', 'java', 'typescript', 'rust', 'go', 'sql']}
          placeholder={t('codeExplainerLanguageLabel')}
        />

        <SearchableDropdown
          label={t('codeExplainerExplainForLabel')}
          value={explainMode}
          onChange={(val) => dispatch({ type: 'SET_EXPLAIN_MODE', payload: val })}
          options={[
            { value: 'beginner', label: t('codeExplainerModeBeginner') },
            { value: 'advanced', label: t('codeExplainerModeAdvanced') },
            { value: 'line-by-line', label: t('codeExplainerModeLineByLine') },
          ]}
          placeholder={t('codeExplainerExplainForLabel')}
        />

        <div className="control-group">
          <label className="control-label">{t('codeExplainerFontLabel')}</label>
          <div className="font-controls">
            <Button variant="icon" onClick={() => dispatch({ type: 'DECREASE_FONT' })}>
              {t('codeExplainerFontDecrease')}
            </Button>
            <span className="font-size-display">
              {t('codeExplainerFontSize', { size: fontSize })}
            </span>
            <Button variant="icon" onClick={() => dispatch({ type: 'INCREASE_FONT' })}>
              {t('codeExplainerFontIncrease')}
            </Button>
          </div>
        </div>

        <Button variant="sample" onClick={handleLoadSample}>
          {t('codeExplainerLoadSample')}
        </Button>
      </div>

      <CodeEditor
        code={code}
        onChange={(val) => dispatch({ type: 'SET_CODE', payload: val })}
        language={language}
        fontSize={fontSize}
        showLineNumbers={showLineNumbers}
        rows={12}
      />

      {code && (
        <CodeStats lines={codeStats.lines} chars={codeStats.chars} words={codeStats.words} />
      )}

      <div className="action-row">
        <RunButton
          onClick={() => run(code)}
          isLoading={isLoading}
          label={t('codeExplainerRunLabel')}
          disabled={!code.trim()}
        />
        <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>
          {t('reset')}
        </Button>
      </div>

      <OutputBox output={output} isLoading={isLoading} error={error} />
    </div>
  )
}
