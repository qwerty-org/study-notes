import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { IconX } from '../icons'

/* ---------- Halqa progress ---------- */
export function Ring({
  value,
  size = 46,
  label,
}: {
  value: number
  size?: number
  label?: string
}) {
  const r = (size - 6) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  return (
    <span
      className="nx-ring-wrap"
      style={{ position: 'relative', width: size, height: size, display: 'inline-grid', placeItems: 'center' }}
    >
      <svg className="nx-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
      <span className="nx-ring-label">{label ?? `${Math.round(pct)}%`}</span>
    </span>
  )
}

/* ---------- Chiziqli progress ---------- */
export function Bar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`nx-progress ${className}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
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
      <div className="nx-empty__icon">{icon}</div>
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
        {icon && <span className="nx-stat__icon">{icon}</span>}
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
    <div className="nx-toast" role="status">
      <span className="nx-dot" /> {toast}
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
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="nx-overlay" onMouseDown={onClose}>
      <div
        className="nx-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="nx-confirm-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="nx-modal__close nx-icon-btn" onClick={onClose} aria-label="Yopish">
          <IconX size={16} />
        </button>
        <h2 className="nx-title nx-title--sm" id="nx-confirm-title">
          {title}
        </h2>
        <p className="nx-subtitle" style={{ marginTop: 10 }}>
          {text}
        </p>
        <div className="nx-row" style={{ justifyContent: 'flex-end', marginTop: 24 }}>
          <button className="nx-btn nx-btn--ghost" onClick={onClose}>
            Bekor qilish
          </button>
          <button
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
