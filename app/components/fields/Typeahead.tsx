import { useCallback, useEffect, useRef, useState } from 'react'

import { FieldLabel } from '~/components/fields/FieldLabel'

interface Properties {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  allowEmpty?: boolean
  emptyLabel?: string
  getLabel?: (value: string) => string
  className?: string
  disabled?: boolean
  compact?: boolean
}

export const Typeahead = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  allowEmpty = false,
  emptyLabel = '(none)',
  getLabel,
  className,
  disabled = false,
  compact = false,
}: Properties) => {
  const displayValue = useCallback(
    (v: string) => (getLabel ? getLabel(v) : v),
    [getLabel],
  )
  const [query, setQuery] = useState(() => displayValue(value))
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerReference = useRef<HTMLDivElement>(null)
  const listReference = useRef<HTMLUListElement>(null)

  useEffect(() => {
    setQuery(displayValue(value))
  }, [value, displayValue])

  const filtered = query
    ? options.filter((o) =>
        displayValue(o).toLowerCase().includes(query.toLowerCase()),
      )
    : options

  const allItems = allowEmpty ? ['', ...filtered] : filtered

  const handleSelect = useCallback(
    (item: string) => {
      onChange(item)
      setQuery(displayValue(item))
      setOpen(false)
      setHighlightIndex(-1)
    },
    [onChange, displayValue],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setOpen(true)
    setHighlightIndex(-1)
  }

  const handleFocus = () => {
    if (disabled) return
    setOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        setHighlightIndex((index) => Math.min(index + 1, allItems.length - 1))
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        setHighlightIndex((index) => Math.max(index - 1, 0))
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (highlightIndex >= 0 && highlightIndex < allItems.length) {
          handleSelect(allItems[highlightIndex])
        }
        break
      }
      case 'Escape': {
        setOpen(false)
        setHighlightIndex(-1)
        break
      }
    }
  }

  useEffect(() => {
    if (highlightIndex >= 0 && listReference.current) {
      const item = listReference.current.children[highlightIndex] as HTMLElement
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex])

  useEffect(() => {
    if (disabled) return
    const handler = (e: MouseEvent) => {
      if (
        containerReference.current &&
        !containerReference.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setHighlightIndex(-1)
        setQuery(displayValue(value))
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [value, displayValue, disabled])

  return (
    <div
      className={`relative ${compact ? 'mb-1' : 'mb-3'} ${className ?? ''}`}
      ref={containerReference}
    >
      <FieldLabel>{label}</FieldLabel>
      <input
        autoComplete="off"
        className={`border-border bg-surface focus:border-primary focus:ring-primary/20 block w-full rounded border px-2 py-1.5 text-sm font-normal focus:ring-2 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        disabled={disabled}
        placeholder={placeholder}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />
      {open && !disabled && (
        <ul
          className="bg-surface border-border absolute right-0 left-0 z-20 max-h-[200px] list-none overflow-y-auto rounded-b border border-t-0 shadow-md"
          ref={listReference}
        >
          {allItems.length === 0 && (
            <li className="text-text-dim cursor-default px-2 py-1 text-sm italic">
              No matches
            </li>
          )}
          {allItems.map((item, index) => (
            <li
              className={`cursor-pointer px-2 py-1 text-sm ${index === highlightIndex ? 'bg-highlight' : ''} ${item === value ? 'font-semibold' : ''}`}
              key={item || '__empty__'}
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelect(item)
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              {item ? displayValue(item) : emptyLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
