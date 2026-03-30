import { useSelector, useDispatch } from 'react-redux'
import { selectLanguage, setLanguage } from '@/shared/store/slices/settingsSlice'
import { setLocale, SUPPORTED_LANGUAGES } from '@/shared/i18n'
import { useLocale } from '@/shared/hooks'

export default function LanguageSwitcher() {
  const { t } = useLocale()
  const language = useSelector(selectLanguage)
  const dispatch = useDispatch()

  const handleChange = (code) => {
    dispatch(setLanguage(code))
    setLocale(code)
  }

  return (
    <div className="lang-switcher">
      <span className="lang-switcher-label">{t('langLabel')}</span>
      <div className="lang-switcher-btns">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            className={`lang-switcher-btn ${language === lang.code ? 'lang-switcher-btn--active' : ''}`}
            onClick={() => handleChange(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  )
}
