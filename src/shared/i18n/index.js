// ============================================================
// i18n — reactive multi-language translation system
//
// Usage:
//   import { t, setLocale, getLocale } from '@/shared/i18n'
//
//   t("appTitle")                          → "AI Toolkit" (en)
//   t("callsStat", { count: 5 })           → "5 calls"
//
//   setLocale("ar")  → switches to Arabic, triggers React re-renders
//   getLocale()      → "ar"
//
// Supported locales are registered in the LOCALES map below.
// To add a new language: create xx.js, import it, add to LOCALES.
// ============================================================

import en from './en'
import ar from './ar'

const LOCALES = { en, ar }

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
]

// ── Reactive locale state ──
let currentLocale = 'en'
let currentDict = LOCALES.en
const listeners = new Set()

/**
 * Subscribe to locale changes. Returns an unsubscribe function.
 * @param {() => void} fn
 */
export function onLocaleChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/**
 * Set the active locale and notify all subscribers.
 * @param {'en'|'ar'} code
 */
export function setLocale(code) {
  if (!LOCALES[code]) {
    console.warn(`[i18n] Unknown locale: "${code}"`)
    return
  }
  currentLocale = code
  currentDict = LOCALES[code]

  // set dir attribute for RTL support
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === code)
  document.documentElement.dir = langMeta?.dir || 'ltr'
  document.documentElement.lang = code

  listeners.forEach((fn) => fn())
}

/** Get the current locale code */
export function getLocale() {
  return currentLocale
}

/**
 * Translate a key, replacing {{placeholder}} tokens with values.
 * Falls back to English if the key is missing in the current locale.
 *
 * @param {string} key   — flat key from the locale file
 * @param {Record<string, string|number>} [params] — interpolation values
 * @returns {string}
 */
export function t(key, params) {
  let str = currentDict[key] ?? LOCALES.en[key]

  if (str === undefined) {
    console.warn(`[i18n] Missing key: "${key}"`)
    return key
  }

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, String(v))
    })
  }

  return str
}


export default t
