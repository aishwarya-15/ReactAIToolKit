import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectTheme } from '@/shared/store/slices/settingsSlice'
import { useLocale } from '@/shared/hooks'
import { ToastContainer } from '@/shared/components/Toast'
import Sidebar from './Sidebar'

export default function Layout() {
  const theme = useSelector(selectTheme)
  const { locale, t } = useLocale()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen(o => !o), [])
  const closeSidebar  = useCallback(() => setSidebarOpen(false), [])

  /* close sidebar on route change (mobile) */
  useEffect(() => { closeSidebar() }, [location.pathname, closeSidebar])

  return (
    <div className={`app ${theme}`}>
      {/* Hamburger — visible only ≤ 1024px via CSS */}
      <button
        className="hamburger-btn"
        onClick={toggleSidebar}
        aria-label={t('menuToggle')}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay backdrop */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' sidebar-overlay--visible' : ''}`}
        onClick={closeSidebar}
      />

      <Sidebar open={sidebarOpen} />

      <main className="main-content">
        <div className="page-wrapper" key={locale}>
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  )
}
