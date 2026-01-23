# Field Definition Demos

A collection of interactive demos showcasing agricultural field management interfaces, including fertiliser planning and liming management. Built with React, TypeScript, Tailwind CSS, and the Agreena design system.

## Overview

This project contains multiple demo applications demonstrating different approaches to field definition and management:

- **Fertiliser Plans Demo**: Create and assign fertiliser plans to fields
- **Liming Plans Demo** (V1-V4): Multiple versions showcasing liming plan management with progressive design improvements
- **Agreena Test Page**: Design system showcase and component library

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **ShadCN UI** - Component library (Radix UI primitives)
- **Lucide React** - Icons
- **Puppeteer** - Screenshot automation

## Prerequisites

- **Node.js** 18+ and npm
- **Git** (for cloning the repository)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fertiliser_demo
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, Vite, Tailwind CSS, and development tools.

### 3. Verify Installation

```bash
npm run dev
```

The development server should start on `http://localhost:10003`. You should see the demo selector page.

## Running the Application

### Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:10003`.

### Available Demos

Access different demos using URL parameters:

- **Demo Selector**: `http://localhost:10003/`
- **Fertiliser Demo**: `http://localhost:10003/?demo=fertiliser`
- **Liming Demo V1**: `http://localhost:10003/?demo=liming`
- **Liming Demo V2**: `http://localhost:10003/?demo=liming&version=v2`
- **Liming Demo V3**: `http://localhost:10003/?demo=liming&version=v3`
- **Liming Demo V4**: `http://localhost:10003/?demo=liming&version=v4`
- **Agreena Test Page**: `http://localhost:10003/?demo=agreena-test`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Screenshot Automation

The project includes a Puppeteer script for capturing high-quality screenshots of the Liming Demo V4 at 1440px width.

### Prerequisites

Puppeteer is already included in `devDependencies`. If you need to reinstall:

```bash
npm install --save-dev puppeteer
```

### Running the Screenshot Script

1. **Start the development server** (in one terminal):
   ```bash
   npm run dev
   ```

2. **Run the screenshot script** (in another terminal):
   ```bash
   node capture-screenshots.js
   ```

The script will:
- Launch a browser window (you can watch it interact)
- Navigate through all stages of the Liming Demo V4 user journey
- Capture screenshots at 1440px width with 2x device scale factor (2880px resolution)
- Save screenshots to the `screenshots/` directory

### Screenshot Output

Screenshots are saved with descriptive names:
- `liming-v4-stage-1-initial-history-gates-1440px.png`
- `liming-v4-stage-2-year-selection-1440px.png`
- `liming-v4-stage-3-no-confirmation-dialog-1440px.png`
- `liming-v4-stage-4-empty-plan-builder-1440px.png`
- `liming-v4-stage-6-plan-details-open-1440px.png`
- `liming-v4-stage-6b-more-menu-dropdown-1440px.png`
- `liming-v4-stage-6c-accordion-closed-1440px.png`
- `liming-v4-stage-7b-material-type-dropdown-1440px.png`
- `liming-v4-stage-7c-plan-with-limestone-1440px.png`
- `liming-v4-stage-7d-plan-with-dolomite-1440px.png`
- `liming-v4-stage-8-field-selection-table-empty-1440px.png`
- `liming-v4-stage-8b-filter-dropdown-open-1440px.png`
- `liming-v4-stage-8c-search-bar-with-text-1440px.png`
- `liming-v4-stage-8d-select-all-checked-1440px.png`
- `liming-v4-stage-8e-multiple-fields-selected-1440px.png`
- `liming-v4-stage-9-action-buttons-1440px.png`
- `liming-v4-stage-10-success-state-1440px.png`

### Screenshot Quality

Screenshots are captured at:
- **Logical width**: 1440px
- **Device scale factor**: 2x
- **Actual resolution**: 2880px wide (for high-quality, retina-ready images)
- **Format**: PNG (lossless)

To capture at exactly 1440px width, edit `capture-screenshots.js` and change `deviceScaleFactor: 2` to `deviceScaleFactor: 1`.

## Setting Up Ngrok

Ngrok allows you to expose your local development server to the internet, useful for sharing demos or testing on mobile devices.

### Installation

#### Option 1: Using Homebrew (macOS)

```bash
brew install ngrok
```

#### Option 2: Direct Download

1. Visit [ngrok.com](https://ngrok.com/download)
2. Download the appropriate version for your OS
3. Extract and add to your PATH

#### Option 3: Using npm (Global)

```bash
npm install -g ngrok
```

### Getting Started with Ngrok

1. **Sign up for a free account** at [ngrok.com](https://ngrok.com/signup)

2. **Get your authtoken** from the ngrok dashboard

3. **Configure ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

### Running Ngrok

Start ngrok pointing to your development server:

```bash
ngrok http 10003
```

Or use the npm script:

```bash
npm run tunnel:10003
```

Ngrok will provide:
- **HTTP URL**: `http://xxxx-xx-xx-xx-xx.ngrok-free.app`
- **HTTPS URL**: `https://xxxx-xx-xx-xx-xx.ngrok-free.app`

### Using Cloudflare Tunnel (Alternative)

The project also includes Cloudflare Tunnel scripts:

```bash
npm run tunnel:10003
```

This uses Cloudflare's `cloudflared` tool instead of ngrok.

### Sharing Your Demo

Once ngrok is running, share the HTTPS URL with others. They can access your local development server through the tunnel.

**Note**: Free ngrok URLs change each time you restart ngrok. For persistent URLs, consider upgrading to a paid plan.

## Project Structure

```
fertiliser_demo/
├── src/
│   ├── components/
│   │   ├── agreena/          # Agreena design system components
│   │   ├── liming/           # Liming demo components
│   │   ├── ui/               # ShadCN UI components
│   │   └── icons/            # Custom icon components
│   ├── lib/                  # Utilities and type definitions
│   ├── App.tsx               # Fertiliser demo
│   ├── LimingApp.tsx         # Liming demo V1
│   ├── LimingAppV2.tsx       # Liming demo V2
│   ├── LimingAppV3.tsx       # Liming demo V3
│   ├── LimingAppV4.tsx       # Liming demo V4 (Agreena layout)
│   ├── AgreenaTestPage.tsx   # Design system showcase
│   └── main.tsx              # Entry point with routing
├── screenshots/              # Screenshot output directory
├── public/                   # Static assets
├── capture-screenshots.js   # Puppeteer screenshot script
├── LIMING_V4_UX_NOTES.md    # UX documentation
└── package.json
```

## Development

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run build
```

This runs TypeScript compilation and will show any type errors.

## Key Features

### Liming Demo V4

- **Agreena Layout**: Three-panel layout with sidebar, content panel, and full-height map
- **History Gates**: Progressive disclosure for liming history collection
- **Plan Builder**: Create and manage multiple liming plans
- **Field Selection**: Table-based field selection with filtering and search
- **Material Types**: Support for Limestone and Dolomite
- **Year-Based Assignment**: Fields can only be assigned to one plan per year
- **Interactive Map**: Map panel with pin drop animation (easter egg)

### Design System

The project uses the Agreena design system with:
- Consistent color palette (`#4730DB` primary purple)
- Typography system (Overpass font family)
- Component library (buttons, inputs, cards, badges)
- Spacing and layout standards

## Troubleshooting

### Port Already in Use

If port 10003 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual port.

### Puppeteer Installation Issues

If Puppeteer fails to install:

1. **Fix npm cache permissions** (macOS):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Skip browser download** (if you have Chrome installed):
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm install --save-dev puppeteer
   ```

3. **Use system Chrome**:
   ```bash
   export PUPPETEER_EXECUTABLE_PATH=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
   ```

### Screenshot Script Issues

If screenshots aren't capturing correctly:

1. Ensure the dev server is running on port 10003
2. Check browser console for errors
3. Verify viewport dimensions in script output
4. Try increasing wait times in `waitForRender()` function

## Documentation

- **UX Notes**: See `LIMING_V4_UX_NOTES.md` for detailed UX documentation
- **Screenshots**: Check the `screenshots/` directory for visual references

## License

Private project - All rights reserved
