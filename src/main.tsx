import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LimingApp from './LimingApp.tsx'
import LimingAppV2 from './LimingAppV2.tsx'
import { DemoSelector } from './components/DemoSelector'

import { ThemeProvider } from "@/components/theme-provider"
import { VersionProvider } from "@/components/version-provider"

// Check URL parameters to determine which demo to show
const urlParams = new URLSearchParams(window.location.search)
const demoParam = urlParams.get('demo')
const versionParam = urlParams.get('version')

// Determine which app to render
let DemoApp: React.ComponentType

if (demoParam === 'liming') {
  if (versionParam === 'v2') {
    DemoApp = LimingAppV2
  } else {
    DemoApp = LimingApp // V1
  }
} else if (demoParam === 'fertiliser') {
  DemoApp = App
} else {
  // No demo parameter - show selector screen
  DemoApp = DemoSelector
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
