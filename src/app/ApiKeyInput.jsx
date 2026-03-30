// ============================================================
// CONCEPT: Runtime API key input
//
// Reads/writes the Groq API key from localStorage via the
// config module's getApiKey/setApiKey. The key is masked by
// default and only revealed on focus. A toast confirms save.
// ============================================================
import { useState, useRef } from 'react'
import { getApiKey, setApiKey, isDemoMode } from '@/shared/lib'
import { toast } from '@/shared/components/Toast'
import { useLocale } from '@/shared/hooks'

export default function ApiKeyInput() {
  const { t } = useLocale()
  const stored = getApiKey()
  const hasKey = stored && stored !== 'demo'

  const [value, setValue] = useState(hasKey ? stored : '')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSave = () => {
    const trimmed = value.trim()
    if (trimmed) {
      setApiKey(trimmed)
      toast.success(t('apiKeySaved'))
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setApiKey('')
    setValue('')
    toast.info(t('apiKeyCleared'))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
  }

  // Mask the key when not focused: gsk_1Cb...9fqJ → gsk_••••••9fqJ
  const masked = hasKey && !focused
    ? `${stored.slice(0, 4)}${'•'.repeat(6)}${stored.slice(-4)}`
    : value

  return (
    <div className="api-key-input">
      <div className="api-key-row">
        <input
          ref={inputRef}
          type={focused ? 'text' : 'password'}
          className="api-key-field"
          value={focused ? value : masked}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => { setFocused(true); setValue(hasKey ? stored : '') }}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={t('apiKeyPlaceholder')}
          spellCheck={false}
          autoComplete="off"
        />
        {focused && value.trim() && (
          <button className="api-key-save" onClick={handleSave} type="button">
            ✓
          </button>
        )}
        {hasKey && !focused && (
          <button className="api-key-clear" onClick={handleClear} type="button" title={t('apiKeyClear')}>
            ✕
          </button>
        )}
      </div>
      <div className="api-key-status">
        {isDemoMode()
          ? <span className="api-key-demo">● {t('apiKeyDemo')}</span>
          : <span className="api-key-live">● {t('apiKeyLive')}</span>
        }
      </div>
    </div>
  )
}
