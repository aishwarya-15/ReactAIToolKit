import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './shared/store/store'
import { setLocale } from './shared/i18n'
import App from './app/App'
import './shared/styles/global.less'

// Hydrate i18n locale from persisted Redux state (if any)
const savedLang = store.getState().settings?.language
if (savedLang) setLocale(savedLang)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
