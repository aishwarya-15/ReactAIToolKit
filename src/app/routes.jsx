import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './Layout'
import { LoadingSpinner } from '@/shared/components/UIComponents'

// CONCEPT: Code-splitting with React.lazy + Suspense
// Each page is loaded on demand — only the code for the
// current route is downloaded. This dramatically improves
// initial load time in production.
const Home = lazy(() => import('@/features/home/HomePage'))
const Summarizer = lazy(() => import('@/features/summarizer/SummarizerPage'))
const CodeExplainer = lazy(() => import('@/features/code-explainer/CodeExplainerPage'))
const AIChat = lazy(() => import('@/features/chat/ChatPage'))
const Translator = lazy(() => import('@/features/translator/TranslatorPage'))
const QuizGenerator = lazy(() => import('@/features/quiz/QuizPage'))
const NotFound = lazy(() => import('@/shared/components/NotFound'))

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="summarizer" element={<Summarizer />} />
          <Route path="code-explainer" element={<CodeExplainer />} />
          <Route path="chat" element={<AIChat />} />
          <Route path="translator" element={<Translator />} />
          <Route path="quiz" element={<QuizGenerator />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
