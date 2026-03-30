// ============================================================
// i18n — English locale
//
// Single flat key-value dictionary. Every user-facing string
// in the app lives here.
//
// Dynamic values use {{placeholder}} syntax:
//   "greeting": "Hello, {{name}}!"
//   t("greeting", { name: "World" })  →  "Hello, World!"
//
// To add a new language: copy this file, translate values,
// and swap the import in index.js.
// ============================================================

const en = {
  // ── App / Layout ──
  "appTitle": "AI Toolkit",
  "logoPrefix": "AI",
  "logoAccent": "Toolkit",
  "getApiKeyLink": "Get Free API Key →",

  // ── API Key Input ──
  "apiKeyPlaceholder": "Paste Groq API key…",
  "apiKeySaved": "API key saved!",
  "apiKeyCleared": "API key removed — demo mode",
  "apiKeyClear": "Remove API key",
  "apiKeyDemo": "Demo mode",
  "apiKeyLive": "API key active",

  // ── Sidebar ──
  "callsStat": "{{count}} calls",
  "savedStat": "{{count}} saved",

  // ── Nav ──
  "navHome": "Home",
  "navSummarizer": "Summarizer",
  "navCode": "Code",
  "navChat": "Chat",
  "navTranslator": "Translator",
  "navQuiz": "Quiz",

  // ── Theme toggle ──
  "themeLight": "☀ Light",
  "themeDark": "☾ Dark",

  // ── Shared / UI Components ──
  "thinking": "Thinking...",
  "processing": "Processing...",
  "result": "Result",
  "copy": "Copy",
  "run": "Run",
  "reset": "Reset",
  "reuse": "Reuse",
  "clear": "Clear",
  "conceptsHere": "Concepts here:",
  "noHistory": "No history yet.",
  "trySample": "Try a sample:",
  "sampleN": "Sample {{n}}",
  "copiedToClipboard": "✓ Copied to clipboard!",
  "errorPrefix": "⚠",
  "dismiss": "✕",

  // ── Home page ──
  "homeHeroTitle": "Learn React by building AI tools",
  "homeHeroSubtitle": "Every page teaches different React, Redux, Zustand & Router concepts through a real working AI application.",
  "homeStatApiCalls": "API Calls Made",
  "homeStatHistory": "Saved to History",
  "homeStatTools": "AI Tools",
  "homeRecentActivity": "Recent Activity",
  "homeConceptsOverviewTitle": "What you'll learn",
  "homeToolSummarizerTitle": "Text Summarizer",
  "homeToolSummarizerDesc": "Condense long articles into key points",
  "homeToolCodeTitle": "Code Explainer",
  "homeToolCodeDesc": "Understand any code snippet instantly",
  "homeToolChatTitle": "AI Chat",
  "homeToolChatDesc": "Multi-turn conversation with context",
  "homeToolTranslatorTitle": "Translator",
  "homeToolTranslatorDesc": "Translate text between 20+ languages",
  "homeToolQuizTitle": "Quiz Generator",
  "homeToolQuizDesc": "Generate quizzes from any topic",

  // ── Concept categories ──
  "conceptCatReactCore": "React Core",
  "conceptCatRedux": "Redux Toolkit",
  "conceptCatZustand": "Zustand",
  "conceptCatRouter": "React Router",

  // ── Summarizer page ──
  "summarizerTitle": "Text Summarizer",
  "summarizerDesc": "Paste any text and get a structured summary powered by AI",
  "summarizerBadge": "useState · useEffect · Custom Hooks",
  "summarizerTabTool": "Tool",
  "summarizerTabHistory": "History ({{count}})",
  "summarizerConceptCallout": "useState (inputText, charCount, copied, activeTab), useEffect (char counter, document title with cleanup), custom hook (useAITool), useSelector with factory selector",
  "summarizerTextLabel": "Your text ({{count}} characters)",
  "summarizerPlaceholder": "Paste any article, paragraph, or document here...",
  "summarizerRunLabel": "Summarize →",
  "summarizerHintMinChars": "Enter at least 20 characters",
  "summarizerHistoryEmpty": "No summaries yet. Try the tool!",
  "summarizerDocTitle": "Summarizer | AI Toolkit",

  // ── Code Explainer page ──
  "codeExplainerTitle": "Code Explainer",
  "codeExplainerDesc": "Paste any code and get a clear explanation tailored to your level",
  "codeExplainerBadge": "useReducer · useMemo · useCallback",
  "codeExplainerConceptCallout": "useReducer (all state in one reducer with action types), useMemo (memoized stats + system prompt), useCallback (memoized handler)",
  "codeExplainerLanguageLabel": "Language",
  "codeExplainerExplainForLabel": "Explain for",
  "codeExplainerFontLabel": "Font",
  "codeExplainerFontDecrease": "A-",
  "codeExplainerFontIncrease": "A+",
  "codeExplainerFontSize": "{{size}}px",
  "codeExplainerLoadSample": "Load Sample",
  "codeExplainerRunLabel": "Explain Code →",
  "codeExplainerStatsLines": "{{count}} lines",
  "codeExplainerStatsChars": "{{count}} chars",
  "codeExplainerStatsTokens": "{{count}} tokens",
  "codeExplainerPlaceholder": "Paste your {{language}} code here...",
  "codeExplainerModeBeginner": "Beginner",
  "codeExplainerModeAdvanced": "Advanced",
  "codeExplainerModeLineByLine": "Line by Line",

  // ── AI Chat page ──
  "chatTitle": "AI Chat",
  "chatDesc": "Multi-turn conversation — context is maintained across messages",
  "chatBadge": "Zustand · useRef · List Rendering",
  "chatConceptCallout": "Zustand store (no Provider needed, selector pattern), useRef for DOM scroll + persistent value, list rendering with role-based styling, multi-turn API (full history sent each request)",
  "chatGreeting": "👋 Ask me anything about React, JavaScript, or programming!",
  "chatInputPlaceholder": "Type a message... (Enter to send, Shift+Enter for newline)",
  "chatSendButton": "→",
  "chatMicStart": "Start voice input",
  "chatMicStop": "Stop voice input",
  "chatMicListening": "Listening… speak now",
  "chatRoleUser": "You",
  "chatRoleAI": "AI",
  "chatUserAvatar": "👤",
  "chatAiAvatar": "⚡",
  "chatSuggestion1": "Explain useState vs useReducer",
  "chatSuggestion2": "When should I use Zustand vs Redux?",
  "chatSuggestion3": "What are React custom hooks?",
  "chatSuggestion4": "How does React Router v6 work?",
  "chatSpeak": "Speak",
  "chatSpeakLoading": "Generating audio…",
  "chatStopSpeaking": "Stop",

  // ── Zustand info bar ──
  "zustandBadge": "Z",
  "zustandStoreLabel": "Zustand Store:",
  "zustandMessagesStored": "{{count}} messages stored",
  "zustandNote": " · persisted to localStorage · accessible without Provider",

  // ── Translator page ──
  "translatorTitle": "Translator",
  "translatorDesc": "Translate text between 15+ languages using AI",
  "translatorBadge": "useContext · React.memo · createContext",
  "translatorConceptCallout": "createContext + Provider pattern, useContext in child components (no prop drilling!), React.memo to prevent unnecessary re-renders, custom context hook",
  "translatorFromLabel": "From",
  "translatorToLabel": "To",
  "translatorAutoDetect": "Auto Detect",
  "translatorEnglish": "English",
  "translatorTextLabel": "Text to translate",
  "translatorPlaceholder": "Enter text to translate...",
  "translatorRunLabel": "Translate to {{langName}} →",
  "translatorTranslatingTo": "Translating to {{langName}}...",
  "translatorContextProvider": "TranslatorContext.Provider",
  "translatorContextArrow1": "↓ LanguageGrid reads targetLang/sourceLang via useContext",
  "translatorContextArrow2": "↓ TranslationResult reads targetLang via useContext",

  // ── Quiz Generator page ──
  "quizTitleIdle": "Quiz Generator",
  "quizTitleGenerating": "Quiz Generator",
  "quizTitleActive": "Quiz",
  "quizTitleDone": "Quiz Complete!",
  "quizDescIdle": "Generate a custom quiz on any programming topic",
  "quizDescGenerating": "Creating your personalized quiz...",
  "quizDescActive": "Topic: {{topic}} · {{difficulty}}",
  "quizDescDone": "Topic: {{topic}}",
  "quizBadgeIdle": "useReducer · useEffect · State Machine",
  "quizBadgeGenerating": "useReducer · useEffect",
  "quizBadgeActive": "useReducer · useEffect",
  "quizConceptCallout": "useReducer as a state machine (phase transitions), useEffect watching async output, complex nested state, conditional rendering by phase (idle/generating/active/done)",
  "quizTopicLabel": "Topic",
  "quizTopicPlaceholder": "e.g. React Hooks, CSS Grid, Python...",
  "quizDifficultyLabel": "Difficulty",
  "quizGenerateLabel": "Generate Quiz →",
  "quizGeneratingSpinner": "Building a {{difficulty}} quiz about {{topic}}...",
  "quizGeneratingNote": "AI is crafting 5 questions just for you",
  "quizQuestionOf": "Question {{current}} of {{total}}",
  "quizScoreLive": "Score: {{score}}/{{answered}}",
  "quizNextQuestion": "Next Question →",
  "quizSeeResults": "See Results →",
  "quizErrorBanner": "⚠ {{error}} — Try again",
  "quizCorrect": "✓ Correct!",
  "quizIncorrect": "✗ Incorrect",
  "quizResultExcellent": "🏆 Excellent!",
  "quizResultGood": "✓ Good job!",
  "quizResultKeepLearning": "📚 Keep learning!",
  "quizPercentCorrect": "{{percent}}% correct",
  "quizAnswerReview": "Answer Review",
  "quizNewQuiz": "New Quiz",
  "quizChangeTopic": "Change Topic",
  "quizDocTitleIdle": "Quiz Generator | AI Toolkit",
  "quizDocTitleGenerating": "Generating Quiz...",
  "quizDocTitleActive": "Question {{current}}/{{total}}",
  "quizDocTitleDone": "Score: {{score}}/{{total}}",

  // ── 404 page ──
  "notFoundCode": "404",
  "notFoundTitle": "Page not found",
  "notFoundDescPrefix": "The path",
  "notFoundDescSuffix": "doesn't exist.",
  "notFoundGoHome": "Go Home",

  // ── API / demo responses ──
  "apiChatSystemPrompt": "You are a helpful, knowledgeable AI assistant. Be concise and clear.",
  "apiDemoSummary": "**Summary:**\n\nThis text discusses the key themes of {{preview}}...\n\n**Key Points:**\n• The main idea revolves around the core subject matter\n• Several supporting arguments are presented\n• The conclusion reinforces the central thesis\n\n*Note: Add your free Groq API key in .env to get real AI responses!*",
  "apiDemoCode": "**Code Analysis:**\n\nThis code snippet demonstrates programming concepts including variable declarations, control flow, and function definitions.\n\n**What it does:** The code processes data and returns a result based on the input conditions.\n\n**Complexity:** O(n) time, O(1) space\n\n*Note: Add your free Groq API key in .env for real analysis!*",
  "apiDemoTranslation": "Translation: \"{{preview}}...\" has been translated.\n\n*Note: Add your free Groq API key in .env for real translations!*",
  "apiDemoDefault": "Demo response for: \"{{preview}}...\"\n\n*Add your free Groq API key in .env to get real AI responses!*",
  "apiDemoChatResponse1": "That's a great question! In React, components are the building blocks of your UI. Each component is a JavaScript function that returns JSX.",
  "apiDemoChatResponse2": "Redux Toolkit simplifies Redux by providing utilities like createSlice and createAsyncThunk. It eliminates boilerplate code!",
  "apiDemoChatResponse3": "Zustand is a lightweight state management solution. Unlike Redux, it doesn't need a Provider — you just call the hook anywhere.",
  "apiDemoChatResponse4": "React Router v6 uses nested routes with <Outlet> for layouts. It's much cleaner than the old v5 Switch/Route pattern.",
  "apiDemoChatResponse5": "Custom hooks let you extract and reuse stateful logic. Any function starting with 'use' that calls other hooks is a custom hook!",
  "apiDemoChatSuffix": "\n\n*(Demo mode — add VITE_GROQ_API_KEY to .env for real responses)*",

  // ── Language switcher ──
  "langLabel": "Language",

  // ── 404 aliases ──
  "notFoundDescription": "The page you're looking for doesn't exist.",
  "backHome": "Go Home",
}

export default en
