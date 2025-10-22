# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React e-commerce application for a candle shop built with TypeScript, Vite, and Firebase. Single-page application with shopping cart, payment processing, and admin panel.

## Core Technologies & Stack

- **Framework**: React 18 with TypeScript (strict mode)
- **Build Tool**: Vite 5 with code splitting optimization
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS with animations
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Email Service**: EmailJS for order confirmations
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion

## Development Commands

### Build & Development
```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (tsc + vite build)
npm run preview      # Preview production build locally
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type checking only
```

**Important**: `npm run build` runs TypeScript checking before Vite build. Build fails on type errors.

## Architecture & Code Organization

### Current Routing Architecture

**Single-Page Layout**: The app currently uses a single landing page with all product categories displayed on one page. Category-specific routes (`/svijece`, `/mirisne-svijece`, `/mirisni-voskovi`, `/dekoracija`) are commented out in [App.tsx:60-64](src/App.tsx#L60-L64).

**Active Routes**:
- `/` - Landing page (all products)
- `/placanje` - Checkout (no navbar)
- `/order-confirmation/:orderId` - Order confirmation (no navbar)
- `/privacy-policy` - Privacy policy
- `/admin-login` - Admin auth (no navbar, lazy loaded)
- `/admin-panel` - Admin dashboard (no navbar, lazy loaded)

**Navbar Exclusions**: Navbar hidden on `/admin-*`, `/placanje`, and `/order-confirmation` routes via conditional rendering in [App.tsx:41-45](src/App.tsx#L41-L45).

### Directory Structure

```
src/
├── components/
│   ├── adminPanel/        # Admin (lazy loaded)
│   ├── cart/              # Shopping cart
│   ├── landingPage/       # Homepage sections
│   ├── payment/           # Checkout & order confirmation
│   ├── sharedComponents/  # ProductGrid (main component)
│   └── ui/                # shadcn/ui base components
├── pages/                 # Category pages (currently unused)
├── hooks/                 # Custom hooks (cart, localStorage)
├── lib/
│   ├── firebase.ts        # Firebase initialization
│   ├── logger.ts          # Custom logger utility
│   └── email/             # EmailJS integration
├── types/                 # TypeScript interfaces
└── utilities/             # Helper functions
```

### Firebase Integration

**Configuration** ([src/lib/firebase.ts](src/lib/firebase.ts)):
```typescript
// Services: Firestore, Auth, Storage
// Environment: Uses Vite env vars (VITE_FIREBASE_*)
// Dev mode: Attempts to connect to Storage emulator (localhost:9199)
```

**Environment Setup**:
1. Copy `.env.example` to `.env.production`
2. Fill in Firebase credentials (apiKey, authDomain, projectId, etc.)
3. Add EmailJS credentials (serviceId, templateIds, publicKey)
4. App throws error if Firebase env vars missing

**Collections Structure** (Croatian names):
- `omiljeniProizvodi` - Featured products (displayed first)
- `svijece` - Regular candles
- `mirisneSvijece` - Scented candles
- `mirisniVoskovi` - Scented waxes
- `dekoracije` - Decorations

### Product Data Architecture

**Dual Interface System**:
- `src/types/product.ts` - Formal Product interface (English, unused in current code)
- Component-level interfaces - Actual implementation uses Croatian field names

**Active Product Schema** (from ProductGrid component):
```typescript
interface Product {
  id: string;
  naziv?: string;        // name
  cijena?: string;       // price
  slika?: string;        // image URL
  opis?: string;         // description
  popust?: number;       // discount percentage (0-100)
  dostupnost?: boolean;  // availability
  kategorija?: string;   // category
  selectedMiris?: string;  // selected scent variant
  selectedBoja?: string;   // selected color variant
}
```

**Cart Item Variants**: Shopping cart supports product variants (miris/scent and boja/color) as separate cart items with same product ID.

### Critical Performance Patterns

**ProductGrid Component** ([src/components/sharedComponents/ProductGrid.tsx](src/components/sharedComponents/ProductGrid.tsx)):
- **Mounted flag cleanup**: Prevents state updates on unmounted components ([ProductGrid.tsx:45-88](src/components/sharedComponents/ProductGrid.tsx#L45-L88))
- **Memoized discount calculation**: `useMemo` for `calculateDiscountedPrice` to prevent re-computation ([ProductGrid.tsx:92-98](src/components/sharedComponents/ProductGrid.tsx#L92-L98))
- **Separate selection state**: Product variants stored separately from product data to prevent re-render cascades
- **Optimized cart handlers**: `useCallback` for add-to-cart operations

**Shopping Cart Hook** ([src/hooks/useShoppingCart.ts](src/hooks/useShoppingCart.ts)):
- **localStorage persistence**: Automatic sync with localStorage
- **Cross-tab synchronization**: Storage event listener for multi-tab support ([useShoppingCart.ts:28-42](src/hooks/useShoppingCart.ts#L28-L42))
- **Variant-aware cart**: Separate cart items for same product with different miris/boja
- **Initial mount guard**: Prevents toast notifications on page load ([useShoppingCart.ts:44-50](src/hooks/useShoppingCart.ts#L44-L50))

### Vite Build Optimization

**Manual Code Splitting** ([vite.config.ts:26-62](vite.config.ts#L26-L62)):
- `react-vendor` chunk: React core libraries
- `firebase` chunk: Firebase SDK (app, firestore, auth, storage)
- `ui-vendor` chunk: Framer Motion, React Hot Toast, Lucide
- `form-vendor` chunk: React Hook Form, Zod
- `admin` chunk: Admin panel components (lazy loaded)

**Production Optimizations**:
- Terser minification with `drop_console: true` (removes console.logs)
- Chunk size warning limit: 1000kB
- Admin components lazy loaded via React.lazy()

### Logger Utility

**Custom Logger** ([src/lib/logger.ts](src/lib/logger.ts)):
- **Environment-aware**: Debug level in dev, error level in production
- **Typed data**: Union type for ErrorData, PerformanceData, UserActionData, FirebaseData
- **Exported functions**: `debug()`, `info()`, `warn()`, `error()`, `performance()`, `firebaseError()`
- **Usage pattern**: `import { error } from '@/lib/logger'` then `error("message", dataObject, 'SOURCE')`

### EmailJS Integration

**Configuration** (`.env.production`):
```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=customer_confirmation_template
VITE_EMAILJS_ADMIN_TEMPLATE_ID=admin_notification_template
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_ADMIN_EMAIL=admin@sarenacarolija.com
```

**Use Cases**:
- Customer order confirmations
- Admin order notifications

### TypeScript & ESLint Configuration

**TypeScript** ([tsconfig.app.json](tsconfig.app.json)):
- Strict mode enabled
- Path alias: `@/*` → `./src/*`
- Unused locals/parameters checks enabled
- No unchecked side effect imports

**ESLint** ([eslint.config.js](eslint.config.js)):
- ESLint 9 flat config
- TypeScript ESLint + React Hooks rules
- Unused vars allowed if prefixed with `_`
- `@typescript-eslint/no-explicit-any` set to warn (not error)

**Vite Plugin Checker**: TypeScript checking enabled during dev/build. ESLint disabled in plugin (ESLint 9 compatibility).

### Error Handling Patterns

**Type-Safe Error Handling**:
```typescript
// Logger requires Record<string, unknown> for data
catch (error) {
  error("Error message", error as Record<string, unknown>, 'SOURCE');
}
```

**User Notifications**: React Hot Toast for success/error messages (Croatian language)

**Error Boundaries**: Wrapped around app in [App.tsx:38](src/App.tsx#L38)

### Development Notes

**Language**: Croatian for all UI text, route names, and database field names (e.g., `naziv`, `cijena`, `svijece`)

**Path Aliases**: `@/` resolves to `src/` directory in imports

**Firebase Storage Emulator**: Dev mode attempts connection to `localhost:9199` (fails gracefully with warning if unavailable)

**Image Handling**: Browser image compression library for product image uploads

**Admin Panel**: Protected by Firebase Auth, lazy loaded for performance

## File Naming Conventions

- Components: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (`useShoppingCart.ts`)
- Utilities: camelCase (`formatCurrency.ts`)
- Types: camelCase (`product.ts`)

## Firebase Deployment

```bash
npm run build        # Build to dist/
firebase deploy      # Deploy to Firebase Hosting
```

**Hosting Config**: SPA routing (all routes redirect to `index.html`)
