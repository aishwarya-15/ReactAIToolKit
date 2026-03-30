import { useSelector, useDispatch } from 'react-redux'
import { selectTheme, toggleTheme } from '@/shared/store/slices/settingsSlice'
import { Button } from '@/shared/components/ui'
import { useLocale } from '@/shared/hooks'

export default function ThemeToggle() {
  const { t } = useLocale()
  const theme = useSelector(selectTheme)
  const dispatch = useDispatch()

  return (
    <Button variant="toggle" onClick={() => dispatch(toggleTheme())}>
      {theme === 'dark' ? t("themeLight") : t("themeDark")}
    </Button>
  )
}
