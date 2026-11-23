import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
}

/**
 * Ilovaning bir qismi ishlamay qolsa, xom xatolik matni o'rniga
 * tinch va tushunarli holat ko'rsatadi. Foydalanuvchi uchun yagona
 * harakat — sahifani qayta yuklash.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Faqat ishlab chiquvchilar uchun: xatolik foydalanuvchiga ko'rsatilmaydi.
    console.error('Ilovada kutilmagan xatolik:', error, errorInfo)
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private focusReloadButton = (node: HTMLButtonElement | null): void => {
    node?.focus()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: '24px',
          background: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: 'var(--font)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '40px clamp(24px, 6vw, 32px)',
            textAlign: 'center',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 20px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--r-pill)',
              background: 'var(--pm-accent-soft)',
              color: 'var(--pm-accent)',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 600,
              lineHeight: 1.25,
              marginBottom: '12px',
            }}
          >
            Bir narsa noto'g'ri ketdi
          </h1>

          <p
            style={{
              color: 'var(--pm-ink-2)',
              fontSize: '14.5px',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            Kechirasiz, sahifani yuklashda kutilmagan xatolik yuz berdi. Ma'lumotlaringiz saqlanib
            qolgan — qayta urinib ko'ring.
          </p>

          <button
            ref={this.focusReloadButton}
            type="button"
            className="btn btn-primary"
            onClick={this.handleReload}
            style={{ minWidth: '180px', minHeight: '48px' }}
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    )
  }
}
