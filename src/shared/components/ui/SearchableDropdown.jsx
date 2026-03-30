// ============================================================
// CONCEPT: Custom Dropdown with search filtering
//
// A searchable dropdown that replaces native <select>. Features:
// - Type-ahead search to filter options
// - Keyboard navigation (Arrow keys, Enter, Escape)
// - Click-outside to close
// - Accessible: role="listbox", aria-expanded, aria-activedescendant
// - Supports string options or { value, label } objects
//
// CONCEPT: useRef + useEffect for outside-click detection
// We attach a mousedown listener to `document` and check if
// the click target is inside our dropdown ref.
//
// CONCEPT: Controlled component pattern
// Value flows in via `value`, changes flow out via `onChange`.
// ============================================================
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

export default function SearchableDropdown({
  value,
  onChange,
  options = [],
  label,
  placeholder = 'Search…',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // ── Normalize options to { value, label } ──
  const normalizedOptions = useMemo(
    () =>
      options.map((opt) =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
      ),
    [options]
  )

  // ── Filtered options based on search ──
  const filtered = useMemo(() => {
    if (!search.trim()) return normalizedOptions
    const q = search.toLowerCase()
    return normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(q))
  }, [search, normalizedOptions])

  // ── Current display label ──
  const displayLabel = useMemo(() => {
    const match = normalizedOptions.find((o) => o.value === value)
    return match ? match.label : value || ''
  }, [value, normalizedOptions])

  // ── Open dropdown ──
  const open = useCallback(() => {
    setIsOpen(true)
    setSearch('')
    setHighlightIndex(-1)
    // Focus input after state flush
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  // ── Close dropdown ──
  const close = useCallback(() => {
    setIsOpen(false)
    setSearch('')
    setHighlightIndex(-1)
  }, [])

  // ── Select an option ──
  const selectOption = useCallback(
    (opt) => {
      onChange(opt.value)
      close()
    },
    [onChange, close]
  )

  // ── Click outside to close ──
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, close])

  // ── Scroll highlighted option into view ──
  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return
    const el = listRef.current.children[highlightIndex]
    el?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex])

  // ── Keyboard handling ──
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightIndex >= 0 && filtered[highlightIndex]) {
            selectOption(filtered[highlightIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          close()
          break
        default:
          break
      }
    },
    [filtered, highlightIndex, selectOption, close]
  )

  const highlightedId =
    highlightIndex >= 0 && filtered[highlightIndex]
      ? `sd-option-${filtered[highlightIndex].value}`
      : undefined

  return (
    <div className={`control-group ${className}`.trim()}>
      {label && <label className="control-label">{label}</label>}

      <div className="sd" ref={containerRef}>
        {/* ── Trigger button ── */}
        <button
          type="button"
          className="sd-trigger"
          onClick={isOpen ? close : open}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="sd-trigger-label">{displayLabel}</span>
          <span className={`sd-chevron ${isOpen ? 'sd-chevron--open' : ''}`}>▾</span>
        </button>

        {/* ── Dropdown panel ── */}
        {isOpen && (
          <div className="sd-panel">
            <div className="sd-search-wrap">
              <input
                ref={inputRef}
                type="text"
                className="sd-search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setHighlightIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label="Search options"
                aria-activedescendant={highlightedId}
                aria-controls="sd-listbox"
              />
            </div>

            <ul
              id="sd-listbox"
              ref={listRef}
              className="sd-options"
              role="listbox"
            >
              {filtered.length === 0 && (
                <li className="sd-no-results">No matches</li>
              )}
              {filtered.map((opt, i) => {
                const isSelected = opt.value === value
                const isHighlighted = i === highlightIndex

                return (
                  <li
                    key={opt.value}
                    id={`sd-option-${opt.value}`}
                    className={[
                      'sd-option',
                      isSelected && 'sd-option--selected',
                      isHighlighted && 'sd-option--highlighted',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => selectOption(opt)}
                    onMouseEnter={() => setHighlightIndex(i)}
                  >
                    <span className="sd-option-label">{opt.label}</span>
                    {isSelected && <span className="sd-option-check">✓</span>}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
