import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectHistoryCount, selectHistory } from '@/shared/store/slices/historySlice'
import { selectApiCallCount } from '@/shared/store/slices/settingsSlice'
import { useLocale } from '@/shared/hooks'
import ToolCard from './components/ToolCard'
import HomeStats from './components/HomeStats'
import RecentActivity from './components/RecentActivity'
import ConceptsOverview from './components/ConceptsOverview'

function useTools(t) {
  return [
    {
      path: '/summarizer',
      icon: '📄',
      title: t('homeToolSummarizerTitle'),
      description: t('homeToolSummarizerDesc'),
      color: 'blue',
      concepts: ['useState', 'useEffect', 'Custom Hooks'],
    },
    {
      path: '/code-explainer',
      icon: '{ }',
      title: t('homeToolCodeTitle'),
      description: t('homeToolCodeDesc'),
      color: 'purple',
      concepts: ['useReducer', 'useCallback', 'useMemo'],
    },
    {
      path: '/chat',
      icon: '💬',
      title: t('homeToolChatTitle'),
      description: t('homeToolChatDesc'),
      color: 'green',
      concepts: ['Zustand', 'useRef', 'List Rendering'],
    },
    {
      path: '/translator',
      icon: '🌐',
      title: t('homeToolTranslatorTitle'),
      description: t('homeToolTranslatorDesc'),
      color: 'orange',
      concepts: ['useContext', 'React.memo', 'Props'],
    },
    {
      path: '/quiz',
      icon: '❓',
      title: t('homeToolQuizTitle'),
      description: t('homeToolQuizDesc'),
      color: 'red',
      concepts: ['Complex State', 'useEffect', 'Conditional Render'],
    },
  ]
}

export default function HomePage() {
  const { t } = useLocale()
  const navigate = useNavigate()
  const historyCount = useSelector(selectHistoryCount)
  const apiCallCount = useSelector(selectApiCallCount)
  const recentHistory = useSelector(selectHistory)
  const tools = useTools(t)

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">{t('homeHeroTitle')}</h1>
        <p className="home-subtitle">{t('homeHeroSubtitle')}</p>
        <HomeStats apiCallCount={apiCallCount} historyCount={historyCount} />
      </div>

      <div className="tools-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.path}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            color={tool.color}
            concepts={tool.concepts}
            onClick={() => navigate(tool.path)}
          />
        ))}
      </div>

      <RecentActivity items={recentHistory} maxItems={3} />
      <ConceptsOverview />
    </div>
  )
}
