import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EducationApp from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EducationApp />
  </StrictMode>,
)
