// ============================================================
// CONCEPT: Lightweight toast notification store
//
// Uses useSyncExternalStore pattern (same as our i18n locale
// system) for framework-agnostic reactivity. No Redux or
// Zustand needed — toasts are ephemeral UI, not app state.
//
// CONCEPT: Pub/Sub with external store
// Any module can call toast.success('msg') without needing
// a React context provider — the store notifies subscribers
// (the ToastContainer) via useSyncExternalStore.
// ============================================================

let toasts = []
let nextId = 0
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

/** Subscribe for useSyncExternalStore */
export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Snapshot for useSyncExternalStore */
export function getSnapshot() {
  return toasts
}

/** Remove a single toast by id */
export function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id)
  emit()
}

/** Add a toast — returns its id */
function addToast(type, message, duration = 4000) {
  const id = ++nextId
  toasts = [...toasts, { id, type, message, createdAt: Date.now() }]
  emit()

  if (duration > 0) {
    setTimeout(() => dismissToast(id), duration)
  }

  return id
}

// ── Public API (importable from anywhere) ──
const toast = {
  success: (msg, duration) => addToast('success', msg, duration),
  error:   (msg, duration) => addToast('error',   msg, duration ?? 6000),
  info:    (msg, duration) => addToast('info',    msg, duration),
  warn:    (msg, duration) => addToast('warn',    msg, duration),
  dismiss: dismissToast,
}

export default toast
