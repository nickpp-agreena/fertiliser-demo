# Field Definition Demos - Technical Documentation

## Project Overview

Field Definition Demos is a React-based prototype application for agricultural field management, featuring multiple demos for fertilizer and liming plan creation and assignment. The application demonstrates complex form management, field assignment workflows, and data validation patterns for agricultural ERP systems.

## Tech Stack

### Core Framework
- **React 19.2.0** - Modern React with latest features
- **TypeScript ~5.9.3** - Type-safe JavaScript
- **Vite 7.2.4** - Fast build tool and dev server

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Radix UI
  - Style: New York variant
  - Base color: Zinc
  - CSS Variables enabled
- **Radix UI** - Headless UI primitives:
  - `@radix-ui/react-accordion` - Collapsible sections
  - `@radix-ui/react-checkbox` - Checkbox inputs
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-label` - Form labels
  - `@radix-ui/react-popover` - Popover components
  - `@radix-ui/react-select` - Select dropdowns
  - `@radix-ui/react-separator` - Visual separators
  - `@radix-ui/react-slot` - Composition utility
  - `@radix-ui/react-switch` - Toggle switches
  - `@radix-ui/react-toggle` - Toggle buttons
  - `@radix-ui/react-toggle-group` - Toggle groups

### Icons & Fonts
- **Lucide React 0.562.0** - Icon library
- **@fontsource/overpass 5.2.8** - Overpass font family

### Utilities
- **class-variance-authority 0.7.1** - Component variant management
- **clsx 2.1.1** - Conditional className utility
- **tailwind-merge 3.4.0** - Merge Tailwind classes intelligently
- **tailwindcss-animate 1.0.7** - Animation utilities

### Performance
- **@tanstack/react-virtual 3.13.18** - Virtual scrolling for large lists

### Development Tools
- **ESLint 9.39.1** - Code linting
  - `@eslint/js` - Modern ESLint configuration
  - `eslint-plugin-react-hooks` - React Hooks linting
  - `eslint-plugin-react-refresh` - Fast Refresh support
  - `typescript-eslint` - TypeScript ESLint integration
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixing

## System Requirements

### Node.js
- **Recommended**: Node.js 18+ or 20+
- **Package Manager**: npm (comes with Node.js)

### Browser Support
- Modern browsers with ES2022 support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Project Structure

```
fertiliser_demo/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI base components
│   │   ├── liming/         # Liming demo components
│   │   └── ...             # Other feature components
│   ├── lib/                # Utility functions and types
│   │   ├── types.ts        # TypeScript type definitions
│   │   ├── utils.ts        # Helper functions
│   │   ├── fieldData.ts    # Field data generation
│   │   └── limingTypes.ts  # Liming-specific types
│   ├── App.tsx             # Fertiliser demo main app
│   ├── LimingApp.tsx       # Liming demo V1
│   ├── LimingAppV2.tsx     # Liming demo V2
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and CSS variables
├── public/                 # Static assets
├── dist/                   # Production build output
├── components.json         # ShadCN UI configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TS config
├── tsconfig.node.json      # Node-specific TS config
├── postcss.config.cjs     # PostCSS configuration
├── eslint.config.js       # ESLint configuration
└── package.json           # Dependencies and scripts
```

## Configuration Details

### TypeScript Configuration
- **Target**: ES2022
- **Module**: ESNext
- **JSX**: react-jsx
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` → `./src/*`

### Vite Configuration
- **Port**: 10003 (configurable, auto-increments if in use)
- **Host**: `true` (allows external connections)
- **Allowed Hosts**: Configured for ngrok tunneling
- **Path Alias**: `@` → `./src`

### Tailwind Configuration
- **Dark Mode**: Class-based
- **Content**: Scans `index.html` and all `src/**/*.{ts,tsx,js,jsx}`
- **Theme**: Extended with custom colors, animations, and spacing
- **CSS Variables**: Used for theming (ShadCN pattern)

### ShadCN UI Configuration
- **Style**: New York
- **Base Color**: Zinc
- **CSS Variables**: Enabled
- **Icon Library**: Lucide
- **Component Path**: `@/components/ui`

## Development Workflow

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
- Starts Vite dev server on port 10003
- Hot Module Replacement (HMR) enabled
- Auto-opens browser (if configured)

### Building for Production
```bash
npm run build
```
- TypeScript type checking
- Vite production build
- Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment

### Linting
```bash
npm run lint
```
- Runs ESLint on all source files
- Checks TypeScript and React best practices

### Tunneling (for sharing)
```bash
# Cloudflare Tunnel (default port)
npm run tunnel

# Specific ports
npm run tunnel:9999
npm run tunnel:10003
```

## Application Architecture

### Demo Routing
The application uses URL parameters to determine which demo to display:
- `/?demo=fertiliser` - Fertiliser Plans demo
- `/?demo=liming` - Liming Plans V1
- `/?demo=liming&version=v2` - Liming Plans V2
- No parameters - Demo selector screen

### State Management
- **React Hooks**: `useState`, `useEffect`, `useContext`
- **Local State**: Component-level state management
- **Context API**: Theme and version providers

### Component Patterns
- **Controlled Components**: Form inputs use controlled state
- **Composition**: ShadCN UI components use Radix UI primitives
- **Custom Hooks**: Theme provider, version provider
- **Virtual Scrolling**: For large field lists (100+ fields)

## Key Features

### Fertiliser Demo
- Multiple fertiliser types per plan (Synthetic, Organic, None)
- Multiple fertilisers per plan
- Field assignment with validation
- Plan duplication and deletion
- Color-coded plan types

### Liming Demo V1
- History gate workflow (5-year and pre-5-year)
- Year-specific liming plans
- Material type selection (Limestone, Dolomite)
- Application rate tracking
- Field assignment with year exclusivity

### Liming Demo V2
- Simplified 20-year history flow
- "Not Limed" field management
- Enhanced filtering and search
- Improved UX patterns
- Read-only fields view

## Theming

### Theme System
- **CSS Variables**: Theme colors defined in `index.css`
- **Theme Provider**: React context for theme switching
- **Available Themes**: ShadCN (default), Agreena
- **Storage**: Theme preference saved to localStorage

### Color System
- Uses HSL color space for theme variables
- Semantic color tokens (primary, secondary, destructive, etc.)
- Material-specific colors for liming (limestone, dolomite)
- Accessible contrast ratios

## Performance Considerations

### Virtual Scrolling
- Uses `@tanstack/react-virtual` for large field lists
- Prevents performance issues with 100+ fields
- Maintains smooth scrolling and interactions

### Code Splitting
- Vite automatically code-splits by route
- Each demo can be loaded independently
- Optimized bundle sizes

### Build Optimization
- Tree-shaking enabled
- Minification in production
- CSS extraction and optimization

## Browser Compatibility

### ES2022 Features Used
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Top-level await (in build tools)
- Private class fields
- Array methods (`.at()`, etc.)

### Polyfills
- No polyfills required for modern browsers
- Consider polyfills for older browsers if needed

## Deployment

### Static Hosting
The application builds to static files and can be deployed to:
- **Vercel** - Zero-config deployment
- **Netlify** - Static site hosting
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Fast global CDN
- **AWS S3 + CloudFront** - Enterprise hosting

### Environment Variables
Currently no environment variables required. Can be added via:
- `.env` files (Vite supports `.env.local`, `.env.production`, etc.)
- `import.meta.env` in code

### Build Output
- **Directory**: `dist/`
- **Entry**: `dist/index.html`
- **Assets**: Automatically hashed for cache busting

## Development Best Practices

### Code Style
- TypeScript strict mode enabled
- ESLint configured for React and TypeScript
- Consistent component structure
- Path aliases for clean imports

### Component Guidelines
- Use ShadCN UI components as base
- Extend with custom styling via Tailwind
- Maintain accessibility (Radix UI handles this)
- Use TypeScript for all components

### State Management
- Prefer local state (`useState`) for component-specific data
- Use context for global state (theme, version)
- Avoid prop drilling with context when appropriate

## Troubleshooting

### Port Already in Use
- Vite will auto-increment the port
- Check terminal output for actual port
- Or manually set in `vite.config.ts`

### Type Errors
- Run `npm run build` to see all TypeScript errors
- Ensure `tsconfig.json` paths are correct
- Check that all dependencies are installed

### Styling Issues
- Ensure Tailwind is processing all component files
- Check `tailwind.config.cjs` content paths
- Verify CSS variables are defined in `index.css`

### Build Failures
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility

## Future Considerations

### Potential Enhancements
- State management library (Zustand, Redux) for complex state
- React Router for proper routing (currently URL params)
- API integration layer
- Unit and integration tests (Vitest, React Testing Library)
- E2E tests (Playwright, Cypress)
- Storybook for component documentation
- Internationalization (i18n) support

### Scalability
- Current architecture supports multiple demos
- Easy to add new demo variants
- Component library can be extended
- Type system supports complex data structures

## License

Private project - See repository for license details.

## Support

For issues or questions, refer to:
- Project documentation
- Component library: [shadcn/ui](https://ui.shadcn.com)
- Vite documentation: [vitejs.dev](https://vitejs.dev)
- React documentation: [react.dev](https://react.dev)
