import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Package, Package2, TestTube } from "lucide-react"

export function DemoSelector() {
  // Navigate to demo using URL parameters
  const navigateToDemo = (demo: string, version?: string) => {
    const params = new URLSearchParams()
    if (demo !== 'fertiliser') {
      params.set('demo', demo)
      if (version) {
        params.set('version', version)
      }
    } else {
      params.set('demo', 'fertiliser')
    }
    const url = params.toString() ? `/?${params.toString()}` : '/?demo=fertiliser'
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-muted/10 font-sans flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Field Definition Demos</h1>
          <p className="text-muted-foreground text-lg">Choose a demo to explore field definition and planning features</p>
        </div>

        {/* Row 1: Fertiliser */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Fertiliser</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col" onClick={() => navigateToDemo('fertiliser')}>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#86EFAC20', color: '#22C55E' }}>
                  <Sprout className="h-6 w-6" />
                </div>
                <CardTitle>Fertiliser Plans</CardTitle>
                <CardDescription>
                  Create and manage fertiliser plans with multiple fertiliser types, assign to fields, and track assignments.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('fertiliser') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 2: Liming */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Liming</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Liming V1 Demo */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col" onClick={() => navigateToDemo('liming')}>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#D9CBA320', color: '#D9CBA3' }}>
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle>Liming Plans V1</CardTitle>
                <CardDescription>
                  Historical liming data collection with 5-year and pre-5-year history gates. Year-specific liming plans.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('liming') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>

            {/* Liming V2 Demo */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col" onClick={() => navigateToDemo('liming', 'v2')}>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#6B7A6B20', color: '#6B7A6B' }}>
                  <Package2 className="h-6 w-6" />
                </div>
                <CardTitle>Liming Plans V2</CardTitle>
                <CardDescription>
                  Enhanced liming demo with 20-year history, "not limed" field management, and improved UX patterns.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('liming', 'v2') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>

            {/* Liming V3 Demo */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col" onClick={() => navigateToDemo('liming', 'v3')}>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#14B8A620', color: '#14B8A6' }}>
                  <Package2 className="h-6 w-6" />
                </div>
                <CardTitle>Liming Plans V3</CardTitle>
                <CardDescription>
                  Latest liming demo with enhanced guidance messaging and improved user experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('liming', 'v3') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>

            {/* Liming V4 Demo */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col relative" onClick={() => navigateToDemo('liming', 'v4')}>
              <div className="absolute top-4 right-4 w-8 h-8 z-10">
                <svg fill="#4730DB" viewBox="0 0 612.003 612.003" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M608.067,333.255l-44.973-71.364c-3.563-5.658-4.764-12.49-3.352-19.022l17.854-82.442
                    c2.784-12.848-4.649-25.708-17.164-29.724l-80.323-25.759c-6.366-2.043-11.679-6.5-14.795-12.413l-39.315-74.627
                    c-6.124-11.634-20.082-16.711-32.253-11.743l-78.094,31.902c-6.188,2.522-13.122,2.522-19.31,0L218.261,6.167
                    c-12.171-4.968-26.129,0.109-32.259,11.743l-39.315,74.62c-3.116,5.913-8.429,10.37-14.795,12.413l-80.322,25.759
                    c-12.522,4.016-19.948,16.877-17.164,29.724l17.847,82.442c1.418,6.532,0.211,13.365-3.352,19.022L3.934,333.255
                    c-7.011,11.123-4.425,25.746,5.964,33.805l66.664,51.677c5.287,4.099,8.754,10.102,9.661,16.73l11.424,83.573
                    c1.775,13.026,13.16,22.573,26.289,22.062l84.288-3.263c6.679-0.262,13.192,2.114,18.154,6.602l62.462,56.677
                    c9.738,8.831,24.597,8.831,34.328,0l62.469-56.677c4.949-4.495,11.468-6.864,18.154-6.602l84.281,3.263
                    c13.141,0.511,24.514-9.042,26.295-22.062l11.424-83.573c0.907-6.628,4.374-12.63,9.655-16.73l66.664-51.677
                    C612.498,359.001,615.078,344.378,608.067,333.255z M235.234,407.92l-74.435-51.99l30.593,70.904l-20.389,8.799l-46.92-108.719
                    l21.353-9.221l75.84,53.401l-31.34-72.602l20.389-8.806l46.933,108.725L235.234,407.92z M280.468,388.393l-46.92-108.719
                    l80.616-34.801l7.931,18.396l-58.669,25.318l10.402,24.099l54.589-23.562l7.905,18.32l-54.589,23.556l12.771,29.59l60.738-26.212
                    l7.905,18.32L280.468,388.393z M464.248,309.08l-56.735-71.945l13.492,90.597L397.2,338.006l-72.871-97.512l22.464-9.706
                    l48.625,67.609l-12.356-83.253l26.116-11.27l51.831,67.718l-16.091-83.145l22.1-9.54l20.516,120.123L464.248,309.08z"/>
                </svg>
              </div>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#4730DB20', color: '#4730DB' }}>
                  <Package2 className="h-6 w-6" />
                </div>
                <CardTitle>Liming Plans V4</CardTitle>
                <CardDescription>
                  Agreena layout with left sidebar, left panel, and full-height map panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('liming', 'v4') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 3: Testing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Testing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agreena Test Page */}
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 flex flex-col" onClick={() => navigateToDemo('agreena-test')}>
              <CardHeader className="flex-1">
                <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#4730DB20', color: '#4730DB' }}>
                  <TestTube className="h-6 w-6" />
                </div>
                <CardTitle>Agreena Test Page</CardTitle>
                <CardDescription>
                  Design system test page with fertiliser form, checkboxes, segmented controls, and map panel.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <Button className="w-full" onClick={(e) => { e.stopPropagation(); navigateToDemo('agreena-test') }}>
                  Open Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>You can also access demos directly via URL parameters:</p>
          <p className="font-mono text-xs mt-2 space-y-1">
            <span className="block">/?demo=fertiliser (Fertiliser)</span>
            <span className="block">/?demo=liming (Liming V1)</span>
            <span className="block">/?demo=liming&version=v2 (Liming V2)</span>
            <span className="block">/?demo=liming&version=v3 (Liming V3)</span>
            <span className="block">/?demo=liming&version=v4 (Liming V4)</span>
            <span className="block">/?demo=agreena-test (Agreena Test Page)</span>
          </p>
          <p className="mt-4 text-[10px] text-muted-foreground/50">Nick PP 2026</p>
        </div>
      </div>
    </div>
  )
}
