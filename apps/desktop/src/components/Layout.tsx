import { NavLink, Outlet, useLocation } from 'react-router-dom'
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
  { to: '/sozlamalar', icon: IconSliders, label: 'Sozlamalar' },
]

/** Desktop shell: yuqori navbar + deraza boshqaruvi (minimize/maximize/close) */
export default function Layout() {
  const { reviews, profile } = useApp()
  const location = useLocation()
  const due = dueReviews(reviews).length

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
