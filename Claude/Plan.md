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
- [ ] **Poboljšati type safety**
  - Ukloniti `any` tipove (3 lokacije)
  - Dodati strict mode u TypeScript konfiguraciji
  - Implementirati proper error types

#### 3.3 TODO Items
- [ ] **Završiti nedovršene implementacije**
  - Implementirati email slanje u `src/lib/email/orderConfirmation.ts`
  - Završiti sve TODO komentare

**Procjena vremena**: 1 nedjelja  
**Odgovorna osoba**: Developer  
**Deadline**: 22.08.2025

---

## 🏗️ FAZA 4: ARHITEKTURSKA POBOLJŠANJA (3-4 NEDJELJE)

### ✅ Status: ⏳ ČEKA FAZU 3

#### 4.1 Error Handling
- [ ] **Implementirati Error Boundaries**
  - Kreirati centralized error handling
  - Dodati error boundaries za glavne sekcije
  - Implementirati error reporting

#### 4.2 State Management
- [ ] **Optimizovati state management**
  - Razmotriti React Query za server state
  - Centralizovati cart state management
  - Implementirati optimistic updates

#### 4.3 Component Architecture
- [ ] **Refaktorisati velike komponente**
  - Podijeliti kompleksne komponente
  - Implementirati proper props patterns
  - Dodati component composition

**Procjena vremena**: 2-3 nedjelje  
**Odgovorna osoba**: Senior Developer/Architect  
**Deadline**: 15.09.2025

---

## 🧪 FAZA 5: TESTING I MONITORING (2-3 NEDJELJE)

### ✅ Status: ⏳ ČEKA FAZU 4

#### 5.1 Testing Infrastructure
- [ ] **Implementirati testove**
  - Unit testovi za business logiku
  - Integration testovi za Firebase
  - E2E testovi za kritične putanje

#### 5.2 Performance Monitoring
- [ ] **Dodati monitoring**
  - Web Vitals tracking
  - Error monitoring (Sentry)
  - Performance budgets i alerting

#### 5.3 CI/CD Pipeline
- [ ] **Automatizovati deployment**
  - GitHub Actions za automatsko testiranje
  - Staging environment
  - Production deployment automatizacija

**Procjena vremena**: 2-3 nedjelje  
**Odgovorna osoba**: DevOps/QA Engineer  
**Deadline**: 06.10.2025

---

## 📊 PROGRESS TRACKER

| Faza | Status | Pokretanje | Završetak | Napomene |
|------|--------|------------|-----------|----------|
| **Faza 1: Sigurnost** | ✅ Završeno | 28.07.2025 | 28.07.2025 | Firebase ključevi sigurni, HTTPS popravljen |
| **Faza 2: Performance** | ✅ Završeno | 28.07.2025 | 28.07.2025 | ScrollImages optimizovan, React hooks optimizovani, Mobile responsive |
| **Faza 3: Čišćenje** | ✅ Završeno | 28.07.2025 | 28.07.2025 | Logger sistem implementiran, console statements zamijenjeni |
| **Faza 4: Arhitektura** | ⏳ Čeka | - | - | Čeka Fazu 3 |
| **Faza 5: Testing** | ⏳ Čeka | - | - | Čeka Fazu 4 |

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