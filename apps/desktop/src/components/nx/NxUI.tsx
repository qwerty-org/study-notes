import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { IconX } from '../icons'

/* ---------- Halqa progress ---------- */
export function Ring({
  value,
  size = 48,
  label,
}: {
  value: number
  size?: number
  label?: string
}) {
  // foundation.css dagi .nx-ring circle stroke-width:8 bilan mos bo'lishi kerak
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const shown = label ?? `${Math.round(pct)}%`
  return (
    <span
      className="nx-ring-wrap"
      style={{ position: 'relative', width: size, height: size, display: 'inline-grid', placeItems: 'center' }}
      role="progressbar"
      aria-label="Jarayon"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={shown}
    >
      <svg className="nx-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle className="track" cx={size / 2} cy={size / 2} r={r} />
        <circle
          className="value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <span className="nx-ring-label" aria-hidden="true">
        {shown}
      </span>
    </span>
  )
}

/* ---------- Chiziqli progress ---------- */
export function Bar({ value, className = '' }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`nx-progress ${className}`}
      role="progressbar"
      aria-label="Jarayon"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}

/* ---------- Bo'sh holat ---------- */
export function Empty({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <div className="nx-empty">
      <div className="nx-empty__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="nx-empty__title">{title}</div>
      <p className="nx-empty__text">{text}</p>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  )
}

/* ---------- Kichik ko'rsatkich ---------- */
export function Stat({
  label,
  value,
  hint,
  icon,
  tone = 'default',
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
  tone?: 'default' | 'accent' | 'success' | 'warn'
}) {
  return (
    <div className={`nx-stat nx-stat--${tone}`}>
      <div className="nx-stat__top">
        <span className="nx-stat__label">{label}</span>
        {icon && (
          <span className="nx-stat__icon" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <div className="nx-stat__value nx-mono-num">{value}</div>
      {hint && <div className="nx-stat__hint">{hint}</div>}
    </div>
  )
}

/* ---------- Bo'lim sarlavhasi ---------- */
export function SectionHead({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="nx-section-head">
      <div>
        <h2 className="nx-h2">{title}</h2>
        {hint && <p className="nx-hint">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Toast ---------- */
export function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  const show = useCallback((message: string) => {
    setToast(message)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const node = toast ? (
    <div className="nx-toast" role="status" aria-live="polite" aria-atomic="true">
      <span className="nx-dot" aria-hidden="true" /> {toast}
    </div>
  ) : null

  return { show, toast: node }
}

/* ---------- Tasdiqlash modali (native confirm o'rniga) ---------- */
export function ConfirmModal({
  title,
  text,
  confirmLabel = 'Tasdiqlash',
  danger = false,
  onConfirm,
  onClose,
}: {
  title: string
  text: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const titleId = useId()
  const descId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  // Render paytida olish kerak: autoFocus mount'da ishlaydi, shundan keyin
  // activeElement allaqachon modal ichidagi tugma bo'lib qoladi.
  const previousFocus = useRef<HTMLElement | null>(null)
  if (previousFocus.current === null && typeof document !== 'undefined') {
    previousFocus.current = document.activeElement as HTMLElement | null
  }
  useEffect(() => () => previousFocus.current?.focus(), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const root = dialogRef.current
      if (!root) return
      const focusable = root.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !root.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="nx-overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="nx-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="nx-modal__close nx-icon-btn" onClick={onClose} aria-label="Yopish">
          <IconX size={16} />
        </button>
        <h2 className="nx-title nx-title--sm" id={titleId}>
          {title}
        </h2>
        <p className="nx-subtitle" id={descId} style={{ marginTop: 12 }}>
          {text}
        </p>
        <div className="nx-row" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
          <button type="button" className="nx-btn nx-btn--ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button
            type="button"
            className={`nx-btn ${danger ? 'nx-btn--danger' : 'nx-btn--primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
