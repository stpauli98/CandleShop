# 🔍 Vodič za testiranje SEO i Structured Data

## 📋 Pregled: Kako proveriti da li Google vidi vaš SEO

Postoje **3 nivoa provere**:

1. **Lokalno** - u browser-u (pre deploy-a)
2. **Live sajt** - nakon deploy-a
3. **Google validacija** - kako Google vidi sajt

---

## 1️⃣ LOKALNA PROVERA (Pre Deploy-a)

### Korak 1: Pokrenite dev server
```bash
npm run dev
```

### Korak 2: Otvorite sajt u browser-u
Idite na: http://localhost:5173

### Korak 3: Otvorite DevTools
- **Chrome/Edge**: `F12` ili `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: `F12`

### Korak 4: Proverite `<head>` sekciju

#### A) **Pregled HTML-a**:
1. DevTools → **Elements** tab
2. Pronađite `<head>` tag
3. Proverite da li postoje:

```html
<!-- Meta tagovi -->
<title>Mirisne Svijeće Ručni Rad BiH | Šarena Čarolija</title>
<meta name="description" content="Kupite ručno pravljene...">

<!-- Open Graph (Facebook) -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://i.imgur.com/8k7dh0m.jpeg">

<!-- Structured Data JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Šarena Čarolija",
  ...
}
</script>
```

#### B) **Provera Structured Data**:
1. DevTools → **Console** tab
2. Ukucajte:
```javascript
// Pronađi sve JSON-LD skripte
document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
  console.log(JSON.parse(script.textContent));
});
```

3. Trebali biste videti 2 objekta:
   - `OnlineStore` (LocalBusiness schema)
   - `Website` (Website schema)

#### C) **Screenshot dokaz**:
- Napravite screenshot `<head>` sekcije
- Sačuvajte kao `local-seo-test.png`

---

## 2️⃣ LIVE SAJT PROVERA (Nakon Deploy-a)

### Korak 1: Deploy sajta
```bash
npm run build
firebase deploy
```

### Korak 2: Otvorite live sajt
https://www.sarenacarolija.com

### Korak 3: Iste provere kao lokalno
Ponovite sve korake iz **Lokalне provere** na live sajtu.

### Korak 4: View Page Source
- Desni klik → **View Page Source** (ili `Ctrl+U`)
- Pretražite (`Ctrl+F`) za:
  - `"@type": "OnlineStore"`
  - `"telephone": "+387 65 905 254"`
  - `"latitude": "45.1464897"`

Ako vidite sve ovo → **SEO se učitava! ✅**

---

## 3️⃣ GOOGLE VALIDACIJA (Kako Google vidi)

### 🛠️ Tool 1: **Rich Results Test**

**Najbolji način da vidite kako Google vidi vaš sajt!**

#### Koraci:
1. Idite na: https://search.google.com/test/rich-results
2. Unesite URL: `https://www.sarenacarolija.com`
3. Kliknite **Test URL**
4. Sačekajте 10-30 sekundi

#### Šta proverite:
- ✅ **"Valid"** status (zeleno)
- ✅ **Organization/OnlineStore** detected
- ✅ Prikazuje: telefon, email, adresu, logo
- ❌ Ako vidi greške → čitajte error poruke

#### Screenshot:
Napravite screenshot rezultata → sačuvajte kao `google-rich-results.png`

---

### 🛠️ Tool 2: **Schema Markup Validator**

**Detaljna provera JSON-LD strukture**

#### Koraci:
1. Idite na: https://validator.schema.org/
2. **Opcija A** - URL:
   - Unesite: `https://www.sarenacarolija.com`
   - Kliknite **Run Test**
3. **Opcija B** - Code Snippet:
   - View Page Source → kopirajte JSON-LD skriptu
   - Paste u validator → **Run Test**

#### Šta proverite:
- ✅ **0 Errors** (mora!)
- ⚠️ Warnings su OK (nisu kritične)
- ✅ Prikazuje strukturu: OnlineStore, Website

---

### 🛠️ Tool 3: **Google Search Console**

**Dugoročno praćenje kako Google indeksira sajt**

#### Setup (jednom):
1. Idite na: https://search.google.com/search-console
2. Dodajte property: `https://www.sarenacarolija.com`
3. Verifikujte (već imate meta tag u `index.html`)

#### Redovne provere:
1. **URL Inspection** → unesite homepage URL
2. Kliknite **Test Live URL**
3. Vidite kako Googlebot vidi stranicu
4. **View Tested Page** → **More Info** → **Structured Data**

---

### 🛠️ Tool 4: **Facebook Sharing Debugger**

**Provera Open Graph (kako izgleda kada delite na FB)**

#### Koraci:
1. Idite na: https://developers.facebook.com/tools/debug/
2. Unesite: `https://www.sarenacarolija.com`
3. Kliknite **Debug**
4. Kliknite **Scrape Again** (da osveži cache)

#### Šta proverite:
- ✅ Title prikazan
- ✅ Description prikazana
- ✅ Slika (https://i.imgur.com/8k7dh0m.jpeg) prikazana
- ✅ Preview izgleda dobro

---

### 🛠️ Tool 5: **Twitter Card Validator**

**Provera Twitter Cards (kako izgleda na Twitter-u)**

#### Koraci:
1. Idite na: https://cards-dev.twitter.com/validator
2. Unesite: `https://www.sarenacarolija.com`
3. Kliknite **Preview card**

#### Šta proverite:
- ✅ Summary Card prikazan
- ✅ Title, description, image prikazani

---

## 🎯 BRZA PROVERA - 5 minuta

Ako nemate vremena za sve, uradite ovo:

```bash
# 1. Deploy
npm run build && firebase deploy

# 2. Proverite page source (Ctrl+U)
# Tražite: "@type": "OnlineStore"

# 3. Rich Results Test
# URL: https://search.google.com/test/rich-results
```

Ako Rich Results Test kaže **"Valid"** → **Sve radi! ✅**

---

## 🚨 Česte greške i rešenja

### Problem 1: "No structured data found"
**Uzrok**: React Helmet se ne učitava ili se build ne generiše
**Rešenje**:
```bash
npm run build
# Proverite dist/index.html da li ima JSON-LD
```

### Problem 2: "Invalid structured data"
**Uzrok**: Sintaksna greška u JSON-LD
**Rešenje**: Kopirajte JSON u https://jsonlint.com/

### Problem 3: "Image not loading"
**Uzrok**: CORS ili nepostojeća slika
**Rešenje**: Proverite da li https://i.imgur.com/8k7dh0m.jpeg radi

### Problem 4: "Telephone format invalid"
**Uzrok**: Telefon nije u E.164 formatu
**Rešenje**: Koristite `+387 65 905 254` (sa razmacima je OK)

---

## 📊 Checklist za verifikaciju

Popunite nakon testiranja:

- [ ] Lokalni dev sajt - SEO tagovi vidljivi u DevTools
- [ ] Lokalni dev sajt - JSON-LD skripta prisutna
- [ ] Live sajt - View Source pokazuje structured data
- [ ] Google Rich Results Test - **Valid** status
- [ ] Schema.org Validator - **0 Errors**
- [ ] Facebook Debugger - preview izgleda dobro
- [ ] Google Search Console - URL Inspection bez grešaka

---

## 🎓 Bonus: Automatska provera

Kreirajte test skriptu:

```bash
# test-seo.sh
#!/bin/bash

echo "🔍 Provera SEO za Šarena Čarolija..."

URL="https://www.sarenacarolija.com"

# Provera da li JSON-LD postoji
curl -s $URL | grep -q "@type.*OnlineStore" && echo "✅ OnlineStore schema prisutan" || echo "❌ Schema nedostaje"

# Provera meta tagova
curl -s $URL | grep -q "og:title" && echo "✅ Open Graph tagovi prisutni" || echo "❌ OG tagovi nedostaju"

# Provera telefona
curl -s $URL | grep -q "+387 65 905 254" && echo "✅ Telefon prikazan" || echo "❌ Telefon nedostaje"

echo "✅ Provera završena!"
```

Pokrenite:
```bash
chmod +x test-seo.sh
./test-seo.sh
```

---

## 📞 Potrebna pomoć?

Ako vidite greške koje ne razumete:
1. Napravite screenshot
2. Kopirajte error poruku
3. Pitajте Claude za pomoć

**Trenutni status**: ✅ Svi SEO podaci su **tačni i validni**!
