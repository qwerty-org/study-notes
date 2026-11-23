import type { CSSProperties, ReactNode } from 'react'

/** Gradient plitka — kitob muqovasi (birinchi harf bilan) */
const GRADIENTS = [
  'linear-gradient(135deg, var(--pm-accent), var(--pm-accent-hover))',
  'linear-gradient(135deg, var(--pm-accent-soft), var(--pm-accent))',
  'linear-gradient(135deg, var(--pm-ink-3), var(--pm-accent))',
  'linear-gradient(135deg, var(--pm-ink-2), var(--pm-ink))',
  'linear-gradient(135deg, var(--pm-line-strong), var(--pm-ink-3))',
  'linear-gradient(135deg, var(--pm-sage), var(--pm-surface-3))',
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
  variant?: 'grid' | 'sm' | 'inline' | 'lg'
}) {
  const bg = GRADIENTS[hash(title) % GRADIENTS.length]
  const initial = (title.trim()[0] ?? '?').toUpperCase()
  const cls =
    variant === 'sm'
      ? 'cover cover-sm'
      : variant === 'inline'
        ? 'cover cover-inline'
        : variant === 'lg'
          ? 'cover cover-lg'
          : 'cover'
  return (
    <div className={cls} style={{ background: bg }} aria-hidden>
      {initial}
    </div>
  )
}

export function ProgressBar({ value, style }: { value: number; style?: CSSProperties }) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      className="progress"
      style={style}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={`Progress ${v}%`}
    >
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
      <span className="icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

export function Stat({
  value,
  label,
  icon,
}: {
  value: ReactNode
  label: string
  icon?: ReactNode
}) {
  return (
    <div className="stat">
      {icon && <span className="stat-head">{icon}</span>}
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
  stroke = 8,
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
    <div
      className="ring"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={typeof label === 'string' ? label : `${v}%`}
    >
      <svg width={size} height={size} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--pm-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color ?? 'var(--pm-accent)'}
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
