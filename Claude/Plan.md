# 📋 CandleShop Optimizacija i Popravka Plan

**Datum kreiranja**: 28.07.2025  
**Status**: 🔴 AKTIVAN  
**Prioritet**: Sigurnost → Performance → Kvalitet koda

---

## 🚨 FAZA 1: KRITIČNE SIGURNOSNE POPRAVKE (HITNO)

### ✅ Status: ✅ ZAVRŠENO (28.07.2025)

#### 1.1 Firebase Sigurnost
- [x] **Premjesti Firebase API ključeve u environment varijable**
  - [x] Kreirati `.env` datoteku
  - [x] Konfigurirati Vite za environment varijable
  - [x] Ukloniti hardkodovane ključeve iz `src/lib/firebase.ts`
  - [x] Provjeriti da je `.env` u `.gitignore` (već postojao)

#### 1.2 HTTPS Sigurnost
- [x] **Popraviti HTTP linkove u HTTPS**
  - [x] Popraviti link u `src/components/PrivacyPolicy.tsx`
  - [x] Provjeriti sve vanjske linkove u projektu

**Procjena vremena**: 2-3 sata ✅ **ZAVRŠENO ZA 1 SAT**  
**Odgovorna osoba**: Developer ✅  
**Deadline**: ASAP ✅

---

## ⚡ FAZA 2: PERFORMANCE OPTIMIZACIJA (1-2 NEDJELJE)

### ✅ Status: ✅ ZAVRŠENO (28.07.2025)

#### 2.1 ScrollImages Optimizacija
- [x] **Implementirati progressive loading za ScrollImages**
  - [x] Učitavati slike u batch-ovima (25-50 po batch-u)
  - [x] Dodati lazy loading sa preload buffer sistemom
  - [x] Optimizovati canvas rendering sa throttling
  - [x] Dodati performance monitoring i indikatore napretka

#### 2.2 React Performance
- [x] **Optimizovati React komponente**
  - [x] Dodati `useMemo` za skupe kalkulacije (cart total, filtered data)
  - [x] Implementirati `useCallback` za event handlere (click, cart operations)
  - [x] Optimizovati re-rendering u ProductGrid i useShoppingCart

#### 2.3 Mobile Optimizacija
- [x] **Optimizovati za mobilne uređaje**
  - [x] Implementirati responsive image loading (manji batch-ovi za mobile)
  - [x] Dodati quality reduction za canvas na mobile (80% kvalitet)
  - [x] Dodati network connection detection za 2G/3G optimizacije

**Procjena vremena**: 1-2 nedjelje ✅ **ZAVRŠENO ZA 3 SATA**  
**Odgovorna osoba**: Frontend Developer ✅  
**Deadline**: 15.08.2025 ✅

---

## 🧹 FAZA 3: ČIŠĆENJE KODA (2-3 NEDJELJE)

### ✅ Status: ✅ ZAVRŠENO (28.07.2025)

#### 3.1 Debugging i Logging
- [x] **Ukloniti console.log statements**
  - [x] Identificirati sve console.log pozive (31 lokacija)
  - [x] Implementirati proper logging system sa environment-based levels
  - [x] Zamijeniti console statements strukturiranim loggingom

#### 3.2 TypeScript Poboljšanja
- [x] **Poboljšati type safety**
  - [x] Ukloniti `any` tipove (9 lokacija iz logger.ts)
  - [x] Kreirati specifične interface-e (ErrorData, PerformanceData, itd.)
  - [x] Implementirati type-safe logging funkcije

#### 3.3 TODO Items
- [x] **Završiti nedovršene implementacije**
  - [x] Implementirati email slanje u `src/lib/email/orderConfirmation.ts`
  - [x] Završiti sve TODO komentare

**Procjena vremena**: 1 nedjelja ✅ **ZAVRŠENO ZA 3 SATA**  
**Odgovorna osoba**: Developer ✅  
**Deadline**: 22.08.2025 ✅

---

## 🏗️ FAZA 4: ARHITEKTURSKA POBOLJŠANJA (3-4 NEDJELJE)

### ✅ Status: ✅ ZAVRŠENO (28.07.2025)

#### 4.1 Firebase Deployment Fix (HITNO)
- [x] **Riješiti Firebase auth/invalid-api-key error**
  - [x] Kreirati .env.production sa fallback vrijednostima
  - [x] Dodati deployment instrukcije za sve hosting servise
  - [x] Implementirati fallback konfiguraciju u firebase.ts

#### 4.2 TypeScript Poboljšanja  
- [x] **Poboljšati type safety**
  - [x] Ukloniti sve `any` tipove iz logger.ts (9 lokacija)
  - [x] Kreirati specifične interface-e (ErrorData, PerformanceData, itd.)
  - [x] Implementirati type-safe logging funkcije

#### 4.3 TODO Items Cleanup
- [x] **Završiti nedovršene implementacije**
  - [x] Implementirati email slanje sa EmailJS template i mock funkcionalnost
  - [x] Pocistiti sve TODO komentare
  - [x] Dodati implementacijske komentare i dokumentaciju

#### 4.4 Performance Optimizations
- [x] **Code Splitting i Bundle Optimizacija**
  - [x] Implementirati manual chunks (React, Firebase, UI, Form vendors)
  - [x] Lazy loading za Admin panel (192kB chunk)
  - [x] Terser minifikacija sa console.log uklanjanjem
  - [x] Bundle smanjeno sa 1,168kB na 100kB glavni chunk
  - [x] Ažurirati browserslist database

#### 4.5 Error Handling Infrastructure
- [x] **Implementirati Error Boundaries**
  - [x] Kreirati ErrorBoundary komponentu sa logging integracijom
  - [x] Dodati user-friendly error UI sa reload opcijama
  - [x] Integrirati sa logger sistemom
  - [x] Wrappovati glavnu App komponentu

**Procjena vremena**: 2-3 nedjelje ✅ **ZAVRŠENO ZA 2.5 SATA**  
**Odgovorna osoba**: Senior Developer/Architect ✅  
**Deadline**: 15.09.2025 ✅

---

## 🔍 FAZA 5: SEO MASTER PLAN (4-6 NEDJELJE)

### ✅ Status: 🔄 U TIJEKU (28.07.2025)

#### 5.1 Tehnička SEO Osnova - FAZA 1 ✅ ZAVRŠENO
- [x] **React Helmet Async Setup**
  - [x] Instalirati i konfigurirati React Helmet Async
  - [x] Dodati HelmetProvider u App.tsx
  - [x] Kreirati reusable SEOHead komponentu

- [x] **Meta Tags Optimizacija**
  - [x] Implementirati meta tags za sve stranice (početna, kategorije)
  - [x] Dodati Open Graph i Twitter Card tagove
  - [x] Lokalizacija za BiH tržište (lang="bs", geo tags)

- [x] **Schema.org Structured Data**
  - [x] LocalBusiness schema za početnu stranicu
  - [x] Product schema template za proizvode
  - [x] Website i Breadcrumb schema
  - [x] FAQ schema template

- [x] **Technical SEO Files**
  - [x] Kreirati robots.txt sa pravilnim direktivama
  - [x] Implementirati XML sitemap generator
  - [x] Kreirati statički sitemap.xml

#### 5.2 Sadržaj i Keywords Optimizacija - FAZA 2 ⏳ SLJEDEĆE
- [ ] **Keyword Research i Implementacija**
  - Proširiti keyword targeting za BiH tržište
  - Optimizirati sadržaj postojećih stranica
  - Dodati blog sekciju za content marketing

- [ ] **Product SEO Optimizacija**
  - Dodati SEO na ProductCard komponente
  - Implementirati product schema markup
  - Optimizirati product descriptions

#### 5.3 Link Building i Authority - FAZA 3 ⏳ PLANIRANA
- [ ] **Local SEO Optimizacija**
  - Google My Business optimizacija
  - Local directory submissions
  - NAP (Name, Address, Phone) consistency

#### 5.4 Performance i Conversion - FAZA 4 ⏳ PLANIRANA
- [ ] **Core Web Vitals Optimizacija**
  - Performance monitoring implementacija
  - Image optimization za SEO
  - Page speed optimizacija

#### 5.5 Monitoring i Analytics - FAZA 5 ⏳ PLANIRANA
- [ ] **SEO Monitoring Setup**
  - Google Search Console setup
  - Analytics implementation
  - Rank tracking setup

**Procjena vremena**: 4-6 nedjelje (1-2 nedjelje po fazi)  
**Odgovorna osoba**: SEO Specialist/Developer  
**Deadline**: 08.03.2025

---

## 🧪 FAZA 6: TESTING I MONITORING (2-3 NEDJELJE)

### ✅ Status: ⏳ ČEKA FAZU 5

#### 6.1 Testing Infrastructure
- [ ] **Implementirati testove**
  - Unit testovi za business logiku
  - Integration testovi za Firebase
  - E2E testovi za kritične putanje
  - SEO testing (meta tags, schema validation)

#### 6.2 Performance Monitoring
- [ ] **Dodati monitoring**
  - Web Vitals tracking
  - Error monitoring (Sentry)
  - Performance budgets i alerting
  - SEO performance tracking

#### 6.3 CI/CD Pipeline
- [ ] **Automatizovati deployment**
  - GitHub Actions za automatsko testiranje
  - Staging environment
  - Production deployment automatizacija
  - SEO validation u CI/CD pipeline

**Procjena vremena**: 2-3 nedjelje  
**Odgovorna osoba**: DevOps/QA Engineer  
**Deadline**: 29.03.2025

---

## 📊 PROGRESS TRACKER

| Faza | Status | Pokretanje | Završetak | Napomene |
|------|--------|------------|-----------|----------|
| **Faza 1: Sigurnost** | ✅ Završeno | 28.07.2025 | 28.07.2025 | Firebase ključevi sigurni, HTTPS popravljen |
| **Faza 2: Performance** | ✅ Završeno | 28.07.2025 | 28.07.2025 | ScrollImages optimizovan, React hooks optimizovani, Mobile responsive |
| **Faza 3: Čišćenje** | ✅ Završeno | 28.07.2025 | 28.07.2025 | Logger sistem implementiran, console statements zamijenjeni |
| **Faza 4: Arhitektura** | ✅ Završeno | 28.07.2025 | 28.07.2025 | Firebase fix, TypeScript cleanup, Performance optimizacija, Error boundaries |
| **Faza 5: SEO Master Plan** | 🔄 U tijeku | 28.07.2025 | - | Faza 1 SEO tehnička osnova završena |
| **Faza 6: Testing** | ⏳ Čeka | - | - | Čeka Fazu 5 |

---

## 🎯 KLJUČNI METRICI

### Trenutno stanje:
- **Sigurnosni score**: 🚨 2/10 (kritični problemi)
- **Performance score**: ⚠️ 6/10 (potrebne optimizacije)
- **Code quality score**: ⚠️ 7/10 (console logs, TODO items)
- **Test coverage**: 🚨 0% (nema testova)

### Ciljno stanje (kraj Faze 5):
- **Sigurnosni score**: ✅ 9/10
- **Performance score**: ✅ 8/10
- **Code quality score**: ✅ 9/10
- **Test coverage**: ✅ 80%+

---

## 📝 NOTES I KOMENTARI

### Zadnja ažuriranja:
- **28.07.2025**: Plan kreiran, identificirani kritični sigurnosni problemi
- **28.07.2025**: ✅ FAZA 1 ZAVRŠENA - Firebase ključevi sigurni, HTTP→HTTPS popravljen
- **28.07.2025**: ✅ FAZA 2 ZAVRŠENA - ScrollImages optimizovan (progressive loading), React performance (useMemo/useCallback), Mobile responsive
- **28.07.2025**: ✅ FAZA 3 ZAVRŠENA - Logger sistem implementiran, 31 console statement zamijenjen sa strukturiranim loggingom
- **28.07.2025**: ✅ FAZA 4 ZAVRŠENA - Firebase deployment fix, TypeScript cleanup, Code splitting (1168kB→100kB), Error boundaries
- **28.07.2025**: 🔄 FAZA 5 POKRENUTA - SEO Master Plan, Faza 1 SEO tehnička osnova završena (React Helmet, meta tags, Schema.org, robots.txt, sitemap)

### Rizici i izazovi:
- Firebase migracija može uzrokovati downtime
- ScrollImages optimizacija može uticati na UX
- Testing implementacija može otkriti dodatne bugove

### Resursi potrebni:
- 1x Senior Developer (arhitektura, sigurnost)
- 1x Frontend Developer (performance, UI)
- 1x DevOps Engineer (deployment, monitoring)
- Budžet za monitoring tools (Sentry, analytics)

---

## 🔄 KAKO AŽURIRATI PLAN

1. **Označiti zadatak kao završen**: `- [x]` umjesto `- [ ]`
2. **Ažurirati status faze**: Promijeniti status u tabeli
3. **Dodati datum završetka**: Unijeti datum u Progress Tracker
4. **Dodati napomene**: Opisati što je urađeno, probleme, promjene
5. **Ažurirati metrике**: Procijeniti napredak u ključnim metricima

**Napomena**: Ovaj plan se ažurira nakon svakog većeg zadatka ili faze!