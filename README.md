# 🕯️ CandleShop

Modern e-commerce web application for a candle shop, built with React, TypeScript, and Firebase.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.1-orange)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff)](https://vitejs.dev/)

## ✨ Features

- 🛍️ **Product Catalog**: Multiple categories (candles, scented candles, waxes, decorations)
- 🎨 **Product Variants**: Scent and color selection for each product
- 🛒 **Shopping Cart**: Persistent cart with localStorage synchronization
- 💳 **Payment Processing**: Cash on delivery with order confirmation
- 👤 **Admin Panel**: Product and order management
- 🔥 **Firebase Backend**: Real-time database, authentication, and storage
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🌐 **Croatian Language**: Full localization for Croatian market

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore, Auth, and Storage enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/stpauli98/CandleShop.git
cd CandleShop
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.production
```

Edit `.env.production` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ENV=production
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (includes type checking) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on codebase |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | Run TypeScript type checking |

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Router 7** - Client-side routing
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Component library

### Backend & Services
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - Admin authentication
- **Firebase Storage** - Image storage
- **Firebase Hosting** - Deployment

### Form & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### State Management
- **React Hooks** - Local state
- **Custom Hooks** - Shopping cart with localStorage

## 📁 Project Structure

```
src/
├── components/
│   ├── adminPanel/      # Admin dashboard and management
│   ├── cart/            # Shopping cart components
│   ├── landingPage/     # Homepage sections
│   ├── payment/         # Checkout and order confirmation
│   ├── sharedComponents/# Reusable components (ProductGrid)
│   └── ui/              # Base UI components (shadcn/ui)
├── pages/               # Product category pages
├── hooks/               # Custom React hooks
├── lib/
│   ├── firebase/        # Firebase service modules
│   └── logger.ts        # Custom logging utility
├── types/               # TypeScript type definitions
└── utilities/           # Helper functions
```

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ Firebase security rules for data access
- ✅ Admin authentication with Firebase Auth
- ✅ `.gitignore` configured to prevent credential leaks
- ✅ TypeScript strict mode enabled
- ✅ ESLint security rules enforced

## 🎨 Code Quality

- **ESLint 9** with TypeScript configuration
- **TypeScript** strict type checking
- **0 errors, 0 warnings** policy
- **Type-safe** error handling
- **Performance optimized** with React hooks memoization

## 🌐 Firebase Collections

| Collection | Description |
|------------|-------------|
| `omiljeniProizvodi` | Featured products |
| `svijece` | Regular candles |
| `mirisneSvijece` | Scented candles |
| `mirisniVoskovi` | Scented waxes |
| `dekoracije` | Decorations |

## 🛣️ Routes

### Public Routes
- `/` - Landing page
- `/svijece` - Candles catalog
- `/mirisne-svijece` - Scented candles
- `/mirisni-voskovi` - Scented waxes
- `/dekoracija` - Decorations
- `/placanje` - Checkout
- `/order-confirmation` - Order confirmation
- `/privacy-policy` - Privacy policy

### Admin Routes
- `/admin-login` - Admin authentication
- `/admin-panel` - Product and order management

## 🚢 Deployment

### Firebase Hosting

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Firebase**
```bash
firebase deploy
```

The build output (`dist/`) is configured for Firebase Hosting with SPA routing.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `security:` - Security fixes

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.ai/code)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)

---

Made with ❤️ for Croatian candle enthusiasts
