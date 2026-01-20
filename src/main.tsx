import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { ThemeProvider } from "@/components/theme-provider"
import { VersionProvider } from "@/components/version-provider"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="shadcn" storageKey="vite-ui-theme">
      <VersionProvider defaultVersion="classic" storageKey="vite-ui-version">
        <App />
      </VersionProvider>
    </ThemeProvider>
  </StrictMode>,
)
