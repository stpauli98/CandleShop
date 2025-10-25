# ⚡ BRZA SEO PROVERA - 2 Minuta

## 🎯 Najbrža provera (30 sekundi):

### 1. Otvorite sajt:
https://www.sarenacarolija.com

### 2. Desni klik → **View Page Source** (ili Ctrl+U)

### 3. Pretražite (Ctrl+F) za:
```
"@type": "OnlineStore"
```

**Ako vidite ovo → SEO radi! ✅**

---

## 🔬 Detaljna provera (2 minuta):

### Korak 1: Rich Results Test
1. Idite na: https://search.google.com/test/rich-results
2. Unesite: `https://www.sarenacarolija.com`
3. Kliknite **Test URL**

**✅ Očekivani rezultat:**
```
Valid - OnlineStore detected
- Name: Šarena Čarolija
- Telephone: +387 65 905 254
- Email: sarena.carolija2025@gmail.com
- Address: Gradiška, Republika Srpska, BA
```

**❌ Ako vidite greške:**
- Screenshot greške
- Kontaktirajte Claude

---

## 💻 Provera preko Terminal-a:

```bash
# Pokrenite test skriptu
cd /Users/nmil/Documents/GitHub/CandleShop
./scripts/test-seo.sh
```

**Očekivani output:**
```
═══════════════════════════════════════════════════════
🔍 SEO PROVERA - Šarena Čarolija
═══════════════════════════════════════════════════════

1️⃣  Proveravam OnlineStore schema...
   ✅ OnlineStore schema PRONAĐEN

2️⃣  Proveravam telefon broj...
   ✅ Telefon +387 65 905 254 PRONAĐEN

... (sve provere)
```

---

## 🎨 Provera u Browser-u (Developer Tools):

### 1. Otvorite sajt:
http://localhost:5173 (lokalno) ili https://www.sarenacarolija.com (live)

### 2. Otvorite DevTools:
- **Chrome**: F12 ili Ctrl+Shift+I
- **Mac**: Cmd+Option+I

### 3. Console tab → ukucajte:

```javascript
// Prikaz svih structured data
document.querySelectorAll('script[type="application/ld+json"]').forEach((script, i) => {
  console.log(`\n📋 Schema ${i+1}:`);
  console.log(JSON.parse(script.textContent));
});
```

**Trebali biste videti:**
```javascript
📋 Schema 1:
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Šarena Čarolija",
  "telephone": "+387 65 905 254",
  ...
}

📋 Schema 2:
{
  "@context": "https://schema.org",
  "@type": "Website",
  ...
}
```

---

## 🚨 Šta ako NE RADI?

### Problem: "Schema nije pronađena"

**Rešenje:**
```bash
# 1. Build sajt
npm run build

# 2. Proverite dist/index.html
cat dist/index.html | grep "@type"

# 3. Deploy
firebase deploy

# 4. Testirajte ponovo
```

### Problem: "Invalid structured data"

**Rešenje:**
1. Kopirajte JSON-LD iz page source
2. Idite na: https://jsonlint.com/
3. Paste i validujte
4. Ako ima greške, kontaktirajte Claude

---

## ✅ CHECKLIST

Popunite nakon provere:

- [ ] Page Source prikazuje `"@type": "OnlineStore"`
- [ ] Rich Results Test kaže **"Valid"**
- [ ] Telefon `+387 65 905 254` vidljiv
- [ ] Email `sarena.carolija2025@gmail.com` vidljiv
- [ ] Lokacija "Gradiška" vidljiva
- [ ] Instagram `@sarena_carolijaa_` vidljiv
- [ ] Google Analytics radi
- [ ] Meta title i description postoje

**Ako su svi ✅ → SEO je potpuno funkcionalan! 🎉**

---

## 📞 Potrebna pomoć?

Pokrenite test skriptu i pošaljite output:
```bash
./scripts/test-seo.sh > seo-results.txt
cat seo-results.txt
```

Ako vidite ❌ greške, Claude može pomoći da ih popravimo!
