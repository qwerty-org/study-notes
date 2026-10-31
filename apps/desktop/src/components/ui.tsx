import type { CSSProperties, ReactNode } from 'react'

/** Gradient plitka — kitob muqovasi (birinchi harf bilan) */
const GRADIENTS = [
  'linear-gradient(135deg, #6e63f5, #9b7bff)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #10b981, #0ea5e9)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #22c55e)',
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function Cover({
  title,
  variant = 'grid',
}: {
  title: string
  variant?: 'grid' | 'sm' | 'inline'
}) {
  const bg = GRADIENTS[hash(title) % GRADIENTS.length]
  const initial = (title.trim()[0] ?? '?').toUpperCase()
  return (
    <div
      className={variant === 'sm' ? 'cover cover-sm' : variant === 'inline' ? 'cover cover-inline' : 'cover'}
      style={{ background: bg }}
      aria-hidden
    >
      {initial}
    </div>
  )
}

export function ProgressBar({ value, style }: { value: number; style?: CSSProperties }) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="progress" style={style} aria-label={`Progress ${v}%`}>
      <div style={{ width: `${v}%` }} />
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode
  title: string
  text?: string
  action?: ReactNode
}) {
  return (
    <div className="empty">
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <b>{value}</b>
      <span>{label}</span>
    </div>
  )
}

export function PageHead({
  title,
  sub,
  right,
  back,
}: {
  title: string
  sub?: string
  right?: ReactNode
  back?: ReactNode
}) {
  return (
    <div className="page-head">
      <div>
        {back}
        <h1>{title}</h1>
        {sub && <small>{sub}</small>}
      </div>
      {right}
    </div>
  )
}

/** Progress halqasi (Duolingo uslubidagi kunlik maqsad uchun) */
export function Ring({
  value,
  size = 84,
  stroke = 9,
  color,
  label,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  label?: ReactNode
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--primary)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' }}
        />
      </svg>
      <span>{label ?? `${v}%`}</span>
    </div>
  )
}
