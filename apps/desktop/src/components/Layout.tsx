import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { dueReviews } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import {
  IconBookOpen,
  IconChart,
  IconFlame,
  IconHome,
  IconLibrary,
  IconMaximize,
  IconMinus,
  IconRepeat,
  IconSliders,
  IconX,
} from './icons'
import {
  closeWindow,
  controlsAvailable,
  maximizeWindow,
  minimizeWindow,
} from '../lib/windowControls'

const NAV = [
  { to: '/', icon: IconHome, label: 'Bosh sahifa', end: true },
  { to: '/kutubxona', icon: IconLibrary, label: 'Kutubxona' },
  { to: '/takrorlash', icon: IconRepeat, label: 'Takrorlash' },
  { to: '/natijalar', icon: IconChart, label: 'Natijalarim' },
  { to: '/sozlamalar', icon: IconSliders, label: 'Sozlamalar' },
]

/** Desktop shell: yuqori navbar (markazda menyu) + profil popup + deraza tugmalari */
export default function Layout() {
  const { reviews, profile, updateProfile } = useApp()
  const location = useLocation()
  const due = dueReviews(reviews).length
  const windowControls = controlsAvailable()

  // Ichki sahifalar uchun tegishli nav elementi faol ko'rinadi
  const isActive = (to: string, end?: boolean) => {
    if (to === '/kutubxona') return location.pathname.startsWith('/kitob/') || location.pathname === to
    if (to === '/' && end) return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [skipFocused, setSkipFocused] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const avatarBtnRef = useRef<HTMLButtonElement>(null)

  // Popup yopilganda focus profil tugmasiga qaytadi
  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    avatarBtnRef.current?.focus()
  }, [])

  // Tashqaridan bosish, Escape yoki Tab — menyu yopiladi / focus ichida qoladi
  useEffect(() => {
    if (!menuOpen) return
    const focusables = () =>
      popupRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items || items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey && (activeEl === first || !popupRef.current?.contains(activeEl))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (activeEl === last || !popupRef.current?.contains(activeEl))) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, closeMenu])

  // Menyu ochilganda birinchi bandga focus beriladi
  useEffect(() => {
    if (!menuOpen) return
    popupRef.current
      ?.querySelector<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ?.focus()
  }, [menuOpen])

  // Sahifa almashganda menyu yopiladi
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="app">
      <a
        href="#main-content"
        onFocus={() => setSkipFocused(true)}
        onBlur={() => setSkipFocused(false)}
        style={{
          position: 'fixed',
          top: skipFocused ? 8 : -64,
          left: 8,
          zIndex: 200,
          padding: '12px 16px',
          borderRadius: 8,
          background: 'var(--pm-accent)',
          color: 'var(--pm-on-accent)',
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Asosiy mazmunga o'ting
      </a>

      <header className="topbar" data-tauri-drag-region>
        <Link to="/" className="brand" data-tauri-drag-region aria-label="Bosh sahifa">
          <span className="mark">
            <IconBookOpen size={16} />
          </span>
          <b data-tauri-drag-region>Study Notes</b>
        </Link>

        <nav className="topnav" aria-label="Asosiy navigatsiya">
          {NAV.map(({ to, icon: Icon, label, end }) => {
            const active = isActive(to, end)
            return (
              <Link
                key={to}
                to={to}
                className={`nav-item${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={18} />
                <span className="nav-txt">{label}</span>
                {to === '/takrorlash' && due > 0 && <span className="nav-badge">{due}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="topbar-right">
          <span className="chip chip-amber streak-chip" title="Uzluksiz kunlar">
            <IconFlame size={14} /> {profile.streak} kun
          </span>

          <div className="avatar-wrap" ref={menuRef}>
            <button
              ref={avatarBtnRef}
              className={`avatar-btn${menuOpen ? ' on' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Profil menyusi"
              aria-haspopup="menu"
              aria-controls="profile-menu"
              aria-expanded={menuOpen}
              title="Profil"
            >
              {profile.avatar}
            </button>

            {menuOpen && (
              <div className="popmenu" id="profile-menu" role="menu" ref={popupRef} aria-label="Profil menyusi">
                <div className="popmenu-head">
                  <span className="popmenu-avatar">{profile.avatar}</span>
                  <div style={{ minWidth: 0 }}>
                    <b>{profile.name || "o'quvchi"}</b>
                    <small>
                      {profile.streak} kunlik streak
                    </small>
                  </div>
                </div>

                <div className="popmenu-list">
                  <Link to="/sozlamalar" className="popmenu-item" role="menuitem">
                    <IconSliders size={18} /> Sozlamalar
                  </Link>
                </div>

                <div className="popmenu-theme">
                  <span>Mavzu</span>
                  <div className="mini-seg">
                    <button
                      className={profile.theme === 'light' ? 'on' : ''}
                      role="menuitemradio"
                      aria-checked={profile.theme === 'light'}
                      aria-label="Kunduzi mavzu"
                      onClick={() => updateProfile({ theme: 'light' })}
                    >
                      Kunduzi
                    </button>
                    <button
                      className={profile.theme === 'dark' ? 'on' : ''}
                      role="menuitemradio"
                      aria-checked={profile.theme === 'dark'}
                      aria-label="Tungi mavzu"
                      onClick={() => updateProfile({ theme: 'dark' })}
                    >
                      Tungi
                    </button>
                  </div>
                </div>

                <div className="popmenu-foot">v0.1.0 · ma'lumotlar shu qurilmada</div>
              </div>
            )}
          </div>

          <div className="win-controls" title={windowControls ? undefined : 'Faqat desktop ilovasida ishlaydi'}>
            <button
              className="win-btn"
              title="Kichraytirish"
              aria-label="Derazani kichraytirish"
              disabled={!windowControls}
              onClick={() => void minimizeWindow()}
            >
              <IconMinus size={16} />
            </button>
            <button
              className="win-btn"
              title="Kattalashtirish"
              aria-label="Derazani kattalashtirish"
              disabled={!windowControls}
              onClick={() => void maximizeWindow()}
            >
              <IconMaximize size={16} />
            </button>
            <button
              className="win-btn win-close"
              title="Yopish"
              aria-label="Derazani yopish"
              disabled={!windowControls}
              onClick={() => void closeWindow()}
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="main" id="main-content" tabIndex={-1}>
        <div className="page" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
