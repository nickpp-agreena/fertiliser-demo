import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LimingApp from './LimingApp.tsx'
import LimingAppV2 from './LimingAppV2.tsx'
import LimingAppV3 from './LimingAppV3.tsx'
import LimingAppV4 from './LimingAppV4.tsx'
import { DemoSelector } from './components/DemoSelector'
import { AgreenaTestPage } from './AgreenaTestPage.tsx'

import { ThemeProvider } from "@/components/theme-provider"
import { VersionProvider } from "@/components/version-provider"

// Check URL parameters to determine which demo to show
const urlParams = new URLSearchParams(window.location.search)
const demoParam = urlParams.get('demo')
const versionParamRaw = urlParams.get('version')
const versionParam = versionParamRaw ? versionParamRaw.toLowerCase().trim() : null

// Determine which app to render
let DemoApp: React.ComponentType

if (demoParam === 'agreena-test') {
  DemoApp = AgreenaTestPage
} else if (demoParam === 'liming') {
  if (versionParam === 'v4') {
    DemoApp = LimingAppV4
  } else if (versionParam === 'v3') {
    DemoApp = LimingAppV3
  } else if (versionParam === 'v2') {
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

// Use Agreena theme for agreena-test demo and liming v4, otherwise use shadcn
const defaultTheme = (demoParam === 'agreena-test' || (demoParam === 'liming' && versionParam === 'v4')) ? 'agreena' : 'shadcn'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme={defaultTheme} storageKey="vite-ui-theme">
      <VersionProvider defaultVersion="classic" storageKey="vite-ui-version">
        <DemoApp />
      </VersionProvider>
    </ThemeProvider>
  </StrictMode>,
)
