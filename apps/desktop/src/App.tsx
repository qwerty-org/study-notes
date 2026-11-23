import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef, type ReactNode } from 'react'
import { AppProvider, useApp } from './store/AppStore'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Book from './pages/Book'
import Repeat from './pages/Repeat'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

/** Birinchi ishga tushirishda → onboarding */
function Gate({ children }: { children: ReactNode }) {
  const { onboarding } = useApp()
  if (!onboarding.done) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}

/** Route labelari — navigatsiyadagi nomlar bilan bir xil (sentence case) */
const TITLES: Record<string, string> = {
  '/': 'Bosh sahifa',
  '/onboarding': "Boshlang'ich sozlash",
  '/kutubxona': 'Kutubxona',
  '/takrorlash': 'Takrorlash',
  '/natijalar': 'Natijalarim',
  '/sozlamalar': 'Sozlamalar',
}

function titleForPath(pathname: string): string {
  const path = pathname.replace(/\/$/, '') || '/'
  const label = TITLES[path] ?? (path.startsWith('/kitob/') ? 'Kitob' : null)
  return label ? `${label} — Study Notes` : 'Study Notes'
}

/**
 * Route o'zgarganda hujjat sarlavhasini yangilaydi va fokusni asosiy
 * kontent sarlavhasiga o'tkazadi. `preventScroll` sahifa kirish animatsiyasi
 * (transform/opacity) bilan to'qnashib, sakrashni oldini oladi.
 */
function RouteEffects() {
  const { pathname } = useLocation()
  const previous = useRef(pathname)

  useEffect(() => {
    document.title = titleForPath(pathname)

    // Dastlabki yuklashda fokusni o'g'irlamaymiz — faqat haqiqiy o'tishlarda.
    if (previous.current === pathname) return
    previous.current = pathname

    const target =
      document.querySelector<HTMLElement>(
        'main h1, main h2, main [role="heading"]',
      ) ?? document.querySelector<HTMLElement>('main')
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <RouteEffects />
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route
            path="/"
            element={
              <Gate>
                <Layout />
              </Gate>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="kutubxona" element={<Library />} />
            <Route path="kitob/:slug" element={<Book />} />
            <Route path="takrorlash" element={<Repeat />} />
            <Route path="natijalar" element={<Stats />} />
            <Route path="sozlamalar" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
