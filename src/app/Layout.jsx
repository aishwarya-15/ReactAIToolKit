import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTheme } from '@/shared/store/slices/settingsSlice'
import { useLocale } from '@/shared/hooks'
import { ToastContainer } from '@/shared/components/Toast'
import Sidebar from './Sidebar'

export default function Layout() {
  const theme = useSelector(selectTheme)
  const { locale } = useLocale()

  return (
    <div className={`app ${theme}`}>
      <Sidebar />
      <main className="main-content">
        <div className="page-wrapper" key={locale}>
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  )
}
