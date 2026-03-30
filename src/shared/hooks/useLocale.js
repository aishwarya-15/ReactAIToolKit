import { useSyncExternalStore } from 'react'
import { getLocale, onLocaleChange, t as rawT } from '@/shared/i18n'

/**
 * React hook that returns a reactive `t` function.
 * Components using this hook re-render when the locale changes.
 *
 * Usage:
 *   const { t, locale } = useLocale()
 *   <p>{t("appTitle")}</p>
 */
export function useLocale() {
  const locale = useSyncExternalStore(onLocaleChange, getLocale)
  return { t: rawT, locale }
}

export default useLocale
