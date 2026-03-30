import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectHistoryByTool } from '@/shared/store/slices/historySlice'
import { useAITool } from '@/shared/hooks'
import { ToolHeader, TextInput, RunButton } from '@/shared/components/UIComponents'
import OutputBox from '@/shared/components/OutputBox'
import ErrorBanner from '@/shared/components/ErrorBanner'
import TabBar from '@/shared/components/TabBar'
import ConceptCallout from '@/shared/components/ConceptCallout'
import SampleTextButtons from '@/shared/components/SampleTextButtons'
import HistoryList from '@/shared/components/HistoryList'
import { toast } from '@/shared/components/Toast'
import { t } from '@/shared/i18n'

const SYSTEM_PROMPT = `You are an expert summarizer. When given text, 
produce a structured summary with:
- A 2-3 sentence overview
- 3-5 bullet point key insights
- A one-line takeaway

Format with **bold** for emphasis. Be concise and clear.`

const SAMPLE_TEXTS = [
  'The React documentation introduces hooks as a way to use state and other React features in functional components. Before hooks, you needed class components for stateful logic. useState allows you to add state variables to functional components. useEffect lets you perform side effects like data fetching, subscriptions, or DOM manipulation. The rules of hooks state that you must call hooks at the top level and only inside React function components or custom hooks.',
  'Quantum computing represents a fundamental shift from classical computing. While classical computers use bits (0 or 1), quantum computers use qubits that can exist in superposition - being both 0 and 1 simultaneously. This allows quantum computers to process many possibilities at once. Entanglement allows qubits to be correlated regardless of distance. These properties make quantum computers exceptionally powerful for specific tasks like cryptography and drug discovery.',
]

export default function SummarizerPage() {
  const [inputText, setInputText] = useState('')
  const [charCount, setCharCount] = useState(0)
  const [activeTab, setActiveTab] = useState('tool')

  const { output, isLoading, error, run, reset } = useAITool({
    tool: 'Summarizer',
    systemPrompt: SYSTEM_PROMPT,
  })

  useEffect(() => {
    setCharCount(inputText.length)
  }, [inputText])

  useEffect(() => {
    document.title = t('summarizerDocTitle')
    return () => { document.title = t('appTitle') }
  }, [])

  const summaryHistory = useSelector(selectHistoryByTool('Summarizer'))

  const handleCopy = () => {
    toast.success(t('copiedToClipboard'))
  }

  const handleSampleText = (text) => {
    setInputText(text)
    reset()
  }

  return (
    <div className="page">
      <ToolHeader
        icon="📄"
        title={t('summarizerTitle')}
        description={t('summarizerDesc')}
        badge={t('summarizerBadge')}
      />

      <TabBar
        tabs={[
          { key: 'tool', label: t('summarizerTabTool') },
          { key: 'history', label: t('summarizerTabHistory', { count: summaryHistory.length }) },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'tool' ? (
        <div className="tool-body">
          <ConceptCallout>{t('summarizerConceptCallout')}</ConceptCallout>

          <SampleTextButtons samples={SAMPLE_TEXTS} onSelect={handleSampleText} />

          <TextInput
            label={t('summarizerTextLabel', { count: charCount })}
            value={inputText}
            onChange={setInputText}
            placeholder={t('summarizerPlaceholder')}
            rows={7}
          />

          <div className="action-row">
            <RunButton
              onClick={() => run(inputText)}
              isLoading={isLoading}
              label={t('summarizerRunLabel')}
              disabled={charCount < 20}
            />
            {charCount < 20 && charCount > 0 && (
              <span className="hint">{t('summarizerHintMinChars')}</span>
            )}
          </div>

          <OutputBox output={output} isLoading={isLoading} error={error} onCopy={handleCopy} />
        </div>
      ) : (
        <HistoryList
          items={summaryHistory}
          emptyMessage={t('summarizerHistoryEmpty')}
          onReuse={(item) => {
            setInputText(item.input)
            setActiveTab('tool')
          }}
        />
      )}
    </div>
  )
}
