import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
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
import { closeWindow, maximizeWindow, minimizeWindow } from '../lib/windowControls'

const NAV = [
  { to: '/', icon: IconHome, label: 'Bosh sahifa', end: true },
  { to: '/kutubxona', icon: IconLibrary, label: 'Kutubxona' },
  { to: '/takrorlash', icon: IconRepeat, label: 'Takrorlash' },
  { to: '/natijalar', icon: IconChart, label: 'Natijalarim' },
]

/** Desktop shell: yuqori navbar (markazda menyu) + profil popup + deraza tugmalari */
export default function Layout() {
  const { reviews, profile, updateProfile } = useApp()
  const location = useLocation()
  const due = dueReviews(reviews).length

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Tashqaridan bosish yoki Escape — menyu yopiladi
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Sahifa almashganda menyu yopiladi
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="app">
      <header className="topbar" data-tauri-drag-region>
        <div className="brand" data-tauri-drag-region>
          <span className="mark">
            <IconBookOpen size={16} />
          </span>
          <b data-tauri-drag-region>Study Notes</b>
        </div>

        <nav className="topnav">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={19} />
              <span className="nav-txt">{label}</span>
              {to === '/takrorlash' && due > 0 && <span className="nav-badge">{due}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="topbar-right">
          <span className="chip chip-amber streak-chip" title="Kunlik streak">
            <IconFlame size={14} /> {profile.streak} kun
          </span>

          <div className="avatar-wrap" ref={menuRef}>
            <button
              className={`avatar-btn${menuOpen ? ' on' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Profil menyusi"
              aria-expanded={menuOpen}
              title="Profil"
            >
              {profile.avatar}
            </button>

            {menuOpen && (
              <div className="popmenu" role="menu">
                <div className="popmenu-head">
                  <span className="popmenu-avatar">{profile.avatar}</span>
                  <div style={{ minWidth: 0 }}>
                    <b>{profile.name || "o'quvchi"}</b>
                    <small>
                      <IconFlame size={12} /> {profile.streak} kunlik streak
                    </small>
                  </div>
                </div>

                <div className="popmenu-list">
                  <Link to="/sozlamalar" className="popmenu-item" role="menuitem">
                    <IconSliders size={17} /> Sozlamalar
                  </Link>
                </div>

                <div className="popmenu-theme">
                  <span>Mavzu</span>
                  <div className="mini-seg">
                    <button
                      className={profile.theme === 'light' ? 'on' : ''}
                      onClick={() => updateProfile({ theme: 'light' })}
                    >
                      Kunduzi
                    </button>
                    <button
                      className={profile.theme === 'dark' ? 'on' : ''}
                      onClick={() => updateProfile({ theme: 'dark' })}
                    >
                      Tungi
                    </button>
                  </div>
                </div>

                <div className="popmenu-foot">v0.1.0 · ma'lumot shu qurilmada</div>
              </div>
            )}
          </div>

          <div className="win-controls">
            <button
              className="win-btn"
              title="Kichraytirish"
              aria-label="Derazani kichraytirish"
              onClick={() => void minimizeWindow()}
            >
              <IconMinus size={17} />
            </button>
            <button
              className="win-btn"
              title="Kattalashtirish"
              aria-label="Derazani kattalashtirish"
              onClick={() => void maximizeWindow()}
            >
              <IconMaximize size={15} />
            </button>
            <button
              className="win-btn win-close"
              title="Yopish"
              aria-label="Derazani yopish"
              onClick={() => void closeWindow()}
            >
              <IconX size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="page" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
