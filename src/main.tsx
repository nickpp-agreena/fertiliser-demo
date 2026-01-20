import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LimingApp from './LimingApp.tsx'

import { ThemeProvider } from "@/components/theme-provider"
import { VersionProvider } from "@/components/version-provider"

// Switch between demos: change this to 'liming' or 'fertiliser'
// Check URL parameter or default to fertiliser
const urlParams = new URLSearchParams(window.location.search)
const demoParam = urlParams.get('demo')
const DEMO_MODE = demoParam === 'liming' ? 'liming' : 'fertiliser'

const DemoApp = DEMO_MODE === 'liming' ? LimingApp : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="shadcn" storageKey="vite-ui-theme">
      <VersionProvider defaultVersion="classic" storageKey="vite-ui-version">
        <DemoApp />
      </VersionProvider>
    </ThemeProvider>
  </StrictMode>,
)
