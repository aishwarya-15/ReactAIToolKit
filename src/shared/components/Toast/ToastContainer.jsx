// ============================================================
// CONCEPT: Portal-rendered toast container
//
// Uses ReactDOM.createPortal to render the toast stack outside
// the component tree, directly into document.body. This avoids
// overflow:hidden clipping and z-index stacking issues.
//
// Each toast auto-dismisses and can be manually closed.
// Uses CSS animations for slide-in / slide-out.
// ============================================================
import { createPortal } from 'react-dom'
import { useToast } from './useToast'
import { dismissToast } from './toastStore'

const ICONS = {
  success: '✓',
  error: '✕',
  warn: '⚠',
  info: 'ℹ',
}

export default function ToastContainer() {
  const { toasts } = useToast()

  if (toasts.length === 0) return null

  return createPortal(
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="alert">
          <span className="toast-icon">{ICONS[t.type] || 'ℹ'}</span>
          <span className="toast-message">{t.message}</span>
          <button
            className="toast-close"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body
  )
}
