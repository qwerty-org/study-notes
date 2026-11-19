import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource-variable/fraunces/wght.css'
import App from './App'
/* Eski tuzilma (Dashboard uchun) — ustiga yangi dizayn tizimi yoziladi */
import './styles/global.css'
import './styles/theme.css'
import './styles/nx/foundation.css'
import './styles/nx/library.css'
import './styles/nx/book.css'
import './styles/nx/repeat.css'
import './styles/nx/stats.css'
import './styles/nx/settings.css'
import './styles/nx/onboarding.css'
import './styles/nx/quiz.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
