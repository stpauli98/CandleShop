# 🚀 Deployment instrukcije za CandleShop

## Firebase Deployment Error Fix

### Problem
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

### Uzrok
Hosting servisi ne čitaju `.env` datoteke iz sigurnosnih razloga.

### Rješenje

#### 1. Za Firebase Hosting:
```bash
# Postavi environment varijable
firebase functions:config:set firebase.api_key="AIzaSyD7gHxyj7AW1pAv159ksET5DSq9VJkQxXA"
firebase functions:config:set firebase.auth_domain="candleshop-865e9.firebaseapp.com"
firebase functions:config:set firebase.project_id="candleshop-865e9"
firebase functions:config:set firebase.storage_bucket="candleshop-865e9.firebasestorage.app"
firebase functions:config:set firebase.messaging_sender_id="278123606394"
firebase functions:config:set firebase.app_id="1:278123606394:web:fc665a664b9a881ae4e6c3"
```

#### 2. Za Vercel:
```bash
# Dodaj u Vercel dashboard ili preko CLI
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production
```

#### 3. Za Netlify:
```bash
# Dodaj u Netlify dashboard ili preko CLI
netlify env:set VITE_FIREBASE_API_KEY "AIzaSyD7gHxyj7AW1pAv159ksET5DSq9VJkQxXA"
netlify env:set VITE_FIREBASE_AUTH_DOMAIN "candleshop-865e9.firebaseapp.com"
netlify env:set VITE_FIREBASE_PROJECT_ID "candleshop-865e9"
netlify env:set VITE_FIREBASE_STORAGE_BUCKET "candleshop-865e9.firebasestorage.app"
netlify env:set VITE_FIREBASE_MESSAGING_SENDER_ID "278123606394"
netlify env:set VITE_FIREBASE_APP_ID "1:278123606394:web:fc665a664b9a881ae4e6c3"
```

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Za local test
```

### Deployment Test
```bash
# Test da li su env varijable dostupne
npm run build && node -e "console.log(process.env)"
```

## Napomene
- `.env` i `.env.production` su u `.gitignore`
- Environment varijable se postavljaju direktno na hosting servisu
- Firebase API ključevi su javni (client-side), ali Firebase Security Rules štite podatke