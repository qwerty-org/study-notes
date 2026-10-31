import { NavLink, Outlet } from 'react-router-dom'
import { dueReviews } from '@study-notes/core'
import { useApp } from '../store/AppStore'

const LINKS = [
  { to: '/', icon: '🏠', label: 'Bosh', end: true },
  { to: '/kutubxona', icon: '📚', label: 'Kutubxona' },
  { to: '/takrorlash', icon: '🔁', label: 'Takrorlash' },
  { to: '/natijalar', icon: '📊', label: 'Natijalar' },
  { to: '/sozlamalar', icon: '⚙️', label: 'Sozlamalar' },
]

export default function Layout() {
  const { reviews, profile, library } = useApp()
  const due = dueReviews(reviews).length

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">📚</div>
          <div>
            Study Notes
            <small>o'rgan va qo'lla</small>
          </div>
        </div>

        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{l.icon}</span>
            <span>{l.label}</span>
            {l.to === '/takrorlash' && due > 0 && <span className="nav-badge">{due}</span>}
          </NavLink>
        ))}

        <div className="sidebar-footer">
          🔥 {profile.streak} kun ketma-ket
          <br />
          📚 {library.length} ta kitob
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
