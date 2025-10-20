# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React e-commerce application for a candle shop ("CandleShop") built with TypeScript, Vite, and Firebase. The application supports multiple product categories, shopping cart functionality, payment processing, and admin panel for product management.

## Core Technologies & Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **UI Library**: Radix UI components with shadcn/ui
- **Styling**: Tailwind CSS with animations
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Icons**: Lucide React + React Icons
- **Animations**: Framer Motion

## Development Commands

### Build & Development
```bash
# Start development server
npm run dev

# Build for production (includes TypeScript type checking)
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run ESLint on entire codebase
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# TypeScript type checking (without build)
npm run type-check
```

**Important**: The `npm run build` command runs TypeScript type checking (`tsc`) before Vite build. This ensures type safety in production builds.

## Architecture & Code Organization

### Directory Structure

**Core Application**:
- `src/App.tsx` - Main app with routing configuration
- `src/main.tsx` - React app entry point with router setup
- `src/index.css` - Global Tailwind styles

**Component Architecture**:
- `components/` - Feature-specific components organized by domain
  - `adminPanel/` - Admin functionality (login, product management, orders)
  - `cart/` - Shopping cart components
  - `landingPage/` - Marketing/homepage components
  - `navBar/` - Navigation components
  - `payment/` - Payment processing and order confirmation
  - `sharedComponents/` - Reusable UI components
  - `ui/` - Base UI components (shadcn/ui style)

**Pages Structure**:
- `pages/` - Product category pages
  - `Candles/` - Regular candles
  - `scentedCandles/` - Scented candles
  - `scentedWaxes/` - Scented waxes
  - `decoration/` - Decorative items

**Data & State Management**:
- `hooks/` - Custom React hooks (shopping cart, localStorage)
- `lib/` - Utilities and external service integrations
  - `firebase/` - Firebase service modules
  - `email/` - Email functionality
- `types/` - TypeScript type definitions
- `utilities/` - Helper functions

### Firebase Integration

**Configuration**: Firebase config is in `src/lib/firebase.ts` with services for:
- Firestore (database)
- Authentication
- Storage (images)

**Environment Setup**:
- Copy `.env.example` to `.env.production`
- Fill in Firebase credentials from Firebase Console
- The app will throw an error if environment variables are missing
- **Never commit `.env.production`** - it's in `.gitignore`

**Collections Structure**:
- `omiljeniProizvodi` - Featured products
- `svijece` - Regular candles
- `mirisneSvijece` - Scented candles
- `mirisniVoskovi` - Scented waxes
- `dekoracije` - Decorations

**Admin Authentication**: Uses Firebase Auth for admin panel access

### Product Data Architecture

**Product Interface** (`src/types/product.ts`):
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'mirisne' | 'dekorativne' | 'poklon';
  scent?: string;
  size?: string;
  color?: string;
  featured: boolean;
  discount: number;
  stock: number;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Cart Item Management**: Shopping cart supports product variants (scent, color) and persists to localStorage with cross-tab synchronization.

### State Management Patterns

**ProductGrid Component** (`src/components/sharedComponents/ProductGrid.tsx`):
- Uses separate `selections` state for miris/boja selection (prevents unnecessary re-renders)
- Memoized discount calculation function to avoid duplication
- Cleanup pattern with `mounted` flag in useEffect for async operations
- All discount logic centralized in `calculateDiscountedPrice` memoized function

**Shopping Cart** (`src/hooks/useShoppingCart.ts`):
- Custom hook with localStorage persistence
- Handles product variants (selectedMiris, selectedBoja)
- Automatic price calculation with discounts

### Routing Configuration

**Public Routes**:
- `/` - Landing page
- `/svijece` - Candles
- `/mirisne-svijece` - Scented candles
- `/mirisni-voskovi` - Scented waxes
- `/dekoracija` - Decorations
- `/privacy-policy` - Privacy policy
- `/placanje` - Payment
- `/order-confirmation` - Order confirmation

**Admin Routes** (no navbar):
- `/admin-login` - Admin authentication
- `/admin-panel` - Product and order management

### Key Development Patterns

**Component Styling**: Uses Tailwind CSS with utility classes and shadcn/ui component patterns

**State Management**:
- Local state with React hooks
- Shopping cart via custom hook with localStorage persistence
- Firebase for server state
- Separate selection state for form inputs (prevents re-render cascades)

**Performance Optimizations**:
- `useCallback` for event handlers to prevent re-renders
- `useMemo` for expensive calculations (discount pricing, loading components)
- Cleanup patterns with mounted flags in async effects
- Centralized calculation functions to avoid duplication

**Form Handling**: React Hook Form with Zod validation for type-safe forms

**Error Handling**:
- React Hot Toast for user notifications
- Custom logger (`src/lib/logger.ts`) for development/production logging
- Error boundaries for graceful failure handling

**Type Safety**:
- Type assertions for error handling (`as Record<string, unknown>` for LogData compatibility)
- Proper TypeScript interfaces for Firebase data structures
- Zod schemas for runtime validation

**Image Optimization**: Browser image compression for uploads

**Path Aliases**: `@/` alias configured for `src/` directory

## Firebase Deployment

The application is configured for Firebase hosting with:
- Build output: `dist/` directory
- SPA routing: All routes redirect to `index.html`
- Firestore rules: Custom security rules for data access

## Development Notes

- **Language**: Croatian language for UI text and route names
- **Currency**: Local currency formatting utilities
- **Admin Panel**: Protected routes with Firebase authentication
- **Product Variants**: Support for scent and color selection (stored in separate state)
- **Image Handling**: Upload and compression for product images
- **CORS**: Development CORS configuration for Firebase Storage

## Code Quality

**ESLint Configuration**: ESLint 9 with flat config (`eslint.config.js`)
- TypeScript ESLint rules enabled
- React hooks rules enforced
- React refresh warnings for component exports
- All errors and warnings must be fixed before committing

**TypeScript**: Strict type checking enabled
- Build fails if type errors exist
- Use proper type assertions for error handling
- Never use `any` - use `unknown` or specific types

**Vite Plugin Checker**:
- TypeScript checking during dev and build
- ESLint disabled in vite-plugin-checker (ESLint 9 compatibility issue)
- Run `npm run lint` separately for ESLint checks

## File Naming Conventions

- React components: PascalCase (e.g., `ProductCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useShoppingCart.ts`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- Data files: camelCase with descriptive suffix (e.g., `candlesData.ts`)

When working with this codebase, prioritize maintaining the existing Firebase integration, Croatian language consistency, and the component-based architecture patterns.