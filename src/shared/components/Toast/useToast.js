// ============================================================
// CONCEPT: Custom hook wrapping useSyncExternalStore
//
// Returns { toasts, toast } where:
//   - toasts: reactive array of active toasts
//   - toast:  the imperative API (toast.success(), etc.)
//
// Components that just need to fire toasts can import `toast`
// directly from toastStore. This hook is for the ToastContainer
// that needs to *react* to toast changes.
// ============================================================
import { useSyncExternalStore } from 'react'
import toast, { subscribe, getSnapshot } from './toastStore'

export function useToast() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot)
  return { toasts, toast }
}
