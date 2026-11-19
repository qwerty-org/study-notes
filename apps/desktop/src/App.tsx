import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
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

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
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
