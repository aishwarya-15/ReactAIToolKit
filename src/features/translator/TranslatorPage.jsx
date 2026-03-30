import { useState, useEffect } from 'react'
import { useAITool } from '@/shared/hooks'
import { ToolHeader, RunButton } from '@/shared/components/UIComponents'
import ConceptCallout from '@/shared/components/ConceptCallout'
import { Textarea } from '@/shared/components/ui'
import { toast } from '@/shared/components/Toast'
import { t } from '@/shared/i18n'
import LanguageGrid from './components/LanguageGrid'
import TranslationResult from './components/TranslationResult'
import ContextVisualization from './components/ContextVisualization'

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },   { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },{ code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },   { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },   { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },  { code: 'nl', name: 'Dutch' },
  { code: 'tr', name: 'Turkish' },  { code: 'pl', name: 'Polish' },
  { code: 'sv', name: 'Swedish' },  { code: 'ml', name: 'Malayalam' },
]

export default function TranslatorPage() {
  const [inputText, setInputText] = useState('')
  const [sourceLang, setSourceLang] = useState('auto')
  const [targetLang, setTargetLang] = useState('es')

  const langName = LANGUAGES.find((l) => l.code === targetLang)?.name || 'Spanish'

  const systemPrompt = `You are a professional translator. 
Translate the given text to ${langName}. 
Output ONLY the translation — no explanations, no original text, no notes.`

  const { output, isLoading, error, run } = useAITool({
    tool: 'Translator',
    systemPrompt,
  })

  // Show API errors as toast
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  return (
    <div className="page">
      <ToolHeader
        icon="🌐"
        title={t('translatorTitle')}
        description={t('translatorDesc')}
        badge={t('translatorBadge')}
      />

      <ConceptCallout>{t('translatorConceptCallout')}</ConceptCallout>

      <ContextVisualization sourceLang={sourceLang} targetLang={targetLang} />

      <LanguageGrid
        languages={LANGUAGES}
        sourceLang={sourceLang}
        targetLang={targetLang}
        onSourceChange={setSourceLang}
        onTargetChange={setTargetLang}
      />

      <Textarea
        label={t('translatorTextLabel')}
        value={inputText}
        onChange={setInputText}
        placeholder={t('translatorPlaceholder')}
        rows={4}
      />

      <div className="action-row">
        <RunButton
          onClick={() => run(inputText)}
          isLoading={isLoading}
          label={t('translatorRunLabel', { langName })}
          disabled={!inputText.trim()}
        />
      </div>

      <TranslationResult output={output} isLoading={isLoading} langName={langName} />
    </div>
  )
}
