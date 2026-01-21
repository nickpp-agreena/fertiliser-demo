import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LimingApp from './LimingApp.tsx'
import LimingAppV2 from './LimingAppV2.tsx'

import { ThemeProvider } from "@/components/theme-provider"
import { VersionProvider } from "@/components/version-provider"

// Switch between demos: change this to 'liming' or 'fertiliser'
// Check URL parameter or default to fertiliser
const urlParams = new URLSearchParams(window.location.search)
const demoParam = urlParams.get('demo')
const versionParam = urlParams.get('version')
const DEMO_MODE = demoParam === 'liming' ? 'liming' : 'fertiliser'

// Determine which app to render
let DemoApp = App // Default to fertiliser demo
if (DEMO_MODE === 'liming') {
  if (versionParam === 'v2') {
    DemoApp = LimingAppV2
  } else {
    DemoApp = LimingApp // V1 (current)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="shadcn" storageKey="vite-ui-theme">
      <VersionProvider defaultVersion="classic" storageKey="vite-ui-version">
        <DemoApp />
      </VersionProvider>
    </ThemeProvider>
  </StrictMode>,
)
