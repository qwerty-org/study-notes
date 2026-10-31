import type { ReactNode } from 'react'

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className="progress" aria-label={`Progress ${v}%`}>
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
  icon: string
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

export function Stat({ icon, value, label }: { icon: string; value: ReactNode; label: string }) {
  return (
    <div className="stat">
      <b>
        {icon} {value}
      </b>
      <span>{label}</span>
    </div>
  )
}

export function PageHead({
  title,
  sub,
  right,
}: {
  title: string
  sub?: string
  right?: ReactNode
}) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <small>{sub}</small>}
      </div>
      {right}
    </div>
  )
}
