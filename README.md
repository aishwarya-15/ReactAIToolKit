<div align="center">

# ⚡ AI Toolkit — React Learning Platform

A production-grade, AI-powered learning platform with 5 interactive tools — built with modern React patterns, real-time streaming, and full mobile responsiveness.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-GitHub_Pages-blue?style=for-the-badge)](https://aishwarya-15.github.io/ReactAIToolKit/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=flat-square)](https://zustand-demo.pmnd.rs)
[![LESS](https://img.shields.io/badge/LESS-4-1D365D?style=flat-square&logo=less&logoColor=white)](https://lesscss.org)
[![Deploy](https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)](https://github.com/aishwarya-15/ReactAIToolKit/actions)

</div>

---

## 📸 Screenshots

| Dark Mode | Light Mode |
|-----------|------------|
| ![Dark](https://via.placeholder.com/400x250/0d0d0f/4f8fff?text=Dark+Theme) | ![Light](https://via.placeholder.com/400x250/f5f5f8/4f8fff?text=Light+Theme) |

> 💡 **Replace** the placeholder images above with actual screenshots of your app.

---

## 🚀 Live Demo

👉 **[https://aishwarya-15.github.io/ReactAIToolKit/](https://aishwarya-15.github.io/ReactAIToolKit/)**

---

## ✨ Features

### 🛠️ 5 AI-Powered Tools

| Tool | Description | AI Model |
|------|-------------|----------|
| **📝 Summarizer** | Paste any text and get an AI-generated summary | Groq Llama 3.1 8B |
| **💻 Code Explainer** | Syntax-highlighted code editor with AI explanations | Groq Llama 3.1 8B |
| **💬 AI Chat** | Real-time streaming chat with SSE + typing indicators | Groq Llama 3.1 8B |
| **🌐 Translator** | Multi-language translation with context visualization | Groq Llama 3.1 8B |
| **🧠 Quiz Generator** | AI-generated quizzes with scoring and answer review | Groq Llama 3.1 8B |

### 🎨 UI / UX

- 🌗 **Dark / Light theme** toggle with CSS custom properties
- 📱 **Fully responsive** — mobile drawer sidebar, 3 breakpoints (1024 / 768 / 480px)
- 🌍 **Multi-language i18n** — English + Arabic with full **RTL** support
- 🔔 **Toast notifications** — success, error, warning, info (portal-rendered)
- 🔍 **Searchable dropdown** — with keyboard navigation and ARIA accessibility
- 🎯 **Custom UI component library** — Button, Input, Textarea, Select, Tag, Badge, etc.

### ⚡ Real-Time Features

- 📡 **SSE streaming** — AI responses stream in real-time with frame-gap rendering
- 🔊 **Text-to-Speech** — Groq Orpheus TTS models for AI responses
- 🎤 **Speech-to-Text** — Browser Web Speech API for voice input
- ⌨️ **Typing indicators** — Animated dots during AI response generation

### 🏗️ Architecture

- 📁 **Feature-based folder structure** — production-grade, scalable organization
- 🧩 **Code-splitting** — `React.lazy` + `Suspense` for route-level lazy loading
- 🔄 **Dual state management** — Redux Toolkit (global) + Zustand (chat) side by side
- 🎨 **LESS preprocessor** — design tokens, 16 reusable mixins, shared variables
- 🔑 **Runtime API key** — paste your key at runtime (stored in localStorage, never committed)
- 🚀 **CI/CD** — GitHub Actions auto-deploys to GitHub Pages on push

---

## 🏛️ Project Structure

```
src/
├── app/                          # App shell
│   ├── App.jsx                   # BrowserRouter + AppRoutes
│   ├── routes.jsx                # Lazy-loaded route definitions
│   ├── Layout.jsx                # App layout + hamburger + sidebar toggle
│   ├── Sidebar.jsx               # Navigation sidebar (drawer on mobile)
│   ├── NavBar.jsx                # Navigation links
│   ├── ThemeToggle.jsx           # Dark/Light toggle
│   ├── LanguageSwitcher.jsx      # EN/AR locale switch
│   └── ApiKeyInput.jsx           # Runtime API key input
│
├── features/                     # Feature modules
│   ├── home/                     # Home page + ToolCard, HomeStats, RecentActivity
│   ├── summarizer/               # Text summarizer tool
│   ├── code-explainer/           # Code editor + AI explainer
│   ├── chat/                     # AI chat + Zustand store + streaming
│   ├── translator/               # Multi-language translator
│   └── quiz/                     # Quiz generator + scoring
│
├── shared/                       # Shared across features
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Primitives: Button, Input, Select, SearchableDropdown, etc.
│   │   ├── Toast/                # Toast system (store + container + hook)
│   │   ├── OutputBox.jsx         # Formatted AI output with copy
│   │   ├── ErrorBanner.jsx       # Error display
│   │   └── ...                   # TabBar, HistoryList, ProgressBar, etc.
│   ├── hooks/                    # Custom hooks (useAITool, useTTS, useSTT, useLocale)
│   ├── lib/                      # API clients (Groq REST + SSE + TTS), config
│   ├── store/                    # Redux store + slices (history, settings)
│   ├── i18n/                     # Locale files (en.js, ar.js) + reactive locale system
│   └── styles/                   # LESS stylesheets
│       ├── variables.less        # Design tokens, colors, spacing, breakpoints
│       ├── mixins.less           # 16 reusable mixins
│       ├── base.less             # Reset, theming, app shell
│       ├── sidebar.less          # Sidebar, nav, footer
│       ├── components.less       # Shared UI component styles
│       ├── responsive.less       # Mobile responsive (3 breakpoints)
│       ├── pages/                # Page-specific styles
│       └── global.less           # Master entry point
│
└── main.jsx                      # App entry point
```

> **88 source files** · **~6,200 lines** of hand-written code

---

## 🧰 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Global State** | Redux Toolkit 2 |
| **Local State** | Zustand 5 (chat persistence) |
| **HTTP Client** | Axios |
| **AI Backend** | Groq API (Llama 3.1 8B Instant) |
| **TTS** | Groq Orpheus Models |
| **STT** | Web Speech API (browser-native) |
| **CSS** | LESS 4 with design tokens & mixins |
| **CI/CD** | GitHub Actions → GitHub Pages |
| **Linting** | ESLint 9 |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.19 (required by Vite 8)
- **npm** ≥ 9
- A **Groq API key** — get one free at [console.groq.com/keys](https://console.groq.com/keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/aishwarya-15/ReactAIToolKit.git
cd ReactAIToolKit

# Install dependencies
npm install

# (Optional) Add your API key to .env
cp .env.example .env
# Edit .env and add your VITE_GROQ_API_KEY

# Start dev server
npm run dev
```

### Using the App

1. Open [http://localhost:5173](http://localhost:5173)
2. Paste your **Groq API key** in the sidebar input (or set it in `.env`)
3. Start using any of the 5 AI tools!

> 💡 You can also paste your API key at runtime via the sidebar — no `.env` file needed.

---

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Automatic Deployment

Every push to `main` triggers the GitHub Actions workflow that:

1. Installs dependencies (`npm ci`)
2. Builds the project (`vite build`)
3. Deploys to GitHub Pages

---

## 🎓 React Concepts Demonstrated

This project was built as a **learning platform** that demonstrates core React concepts in practice:

| Concept | Where It's Used |
|---------|----------------|
| **Functional Components** | Every component in the app |
| **Hooks** (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`) | Throughout all features |
| **Custom Hooks** | `useAITool`, `useTTS`, `useSTT`, `useLocale` |
| **Context / External Stores** | `useSyncExternalStore` for i18n + toast |
| **Redux Toolkit** | Global settings, history, API call counter |
| **Zustand** | Chat messages with persistence middleware |
| **React Router v7** | Nested routes, lazy loading, `useNavigate`, `useLocation` |
| **Code Splitting** | `React.lazy` + `Suspense` on every route |
| **Portals** | Toast notifications rendered via `createPortal` |
| **Controlled Components** | All form inputs |
| **Prop Drilling vs State Management** | Intentional comparison across features |
| **CSS Custom Properties** | Runtime theming (dark/light) |
| **Responsive Design** | Media queries, mobile-first layout |
| **i18n / RTL** | Multi-locale with directional layout support |

---

## 🌍 Internationalization

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| English | `en` | LTR | ✅ Complete (237 keys) |
| Arabic | `ar` | RTL | ✅ Complete (237 keys) |

Adding a new language:
1. Create `src/shared/i18n/<code>.js` with all translation keys
2. Register it in `src/shared/i18n/index.js` → `LOCALES` map
3. Add a button in `LanguageSwitcher.jsx`

---

## 🔑 API Key Security

- API keys are **never committed** to the repository
- Keys can be set via `.env` file **or** pasted at runtime in the sidebar
- Runtime keys are stored in **localStorage** (browser-only, never sent to any server except Groq)
- The app works in **demo mode** with limited functionality when no key is provided

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using React 19 + Vite 8 + Groq AI**

⭐ Star this repo if you found it useful!

</div>
