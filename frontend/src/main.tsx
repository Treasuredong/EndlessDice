import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { GameProvider } from './context/GameContext.tsx'
import './i18n/index.ts' // Import i18n configuration

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </AuthProvider>
  </StrictMode>,
)
