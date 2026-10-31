import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { dueReviews } from '@study-notes/core'
import { useApp } from '../store/AppStore'
import {
  IconBookOpen,
  IconChart,
  IconFlame,
  IconHome,
  IconLibrary,
  IconRepeat,
  IconSliders,
} from './icons'

const NAV = [
  { to: '/', icon: IconHome, label: 'Bosh sahifa', end: true },
  { to: '/kutubxona', icon: IconLibrary, label: 'Kutubxona' },
  { to: '/takrorlash', icon: IconRepeat, label: 'Takrorlash' },
  { to: '/natijalar', icon: IconChart, label: 'Natijalarim' },
  { to: '/sozlamalar', icon: IconSliders, label: 'Sozlamalar' },
]

/** Desktop shell: chap sidebar + keng maydon (Duolingo-professional) */
export default function Layout() {
  const { reviews, profile } = useApp()
  const location = useLocation()
  const due = dueReviews(reviews).length

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="side-brand">
          <span className="mark">
            <IconBookOpen size={18} />
          </span>
          <span className="brand-text">
            <b>Study Notes</b>
            <small>bilimni amalga aylantir</small>
          </span>
        </div>

        <span className="side-label">Menyu</span>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) => `side-item${isActive ? ' active' : ''}`}
            >
              <Icon size={20} />
              <span className="side-txt">{label}</span>
              {to === '/takrorlash' && due > 0 && <span className="side-badge">{due}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="side-foot">
          <div className="side-streak" title="Kunlik streak">
            <IconFlame size={22} />
            <span>
              <b>{profile.streak} kun</b>
              <small>ketma-ket o'qish</small>
            </span>
          </div>
          <div className="side-meta">
            Lokal dastur · v0.1.0
            <br />
            Ma'lumot kompyuterdan chiqmaydi
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="page" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
