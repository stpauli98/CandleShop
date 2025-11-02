# SEO Deployment Guide - Šarena Čarolija

## ✅ Završene Optimizacije

### 1. **Vercel Configuration** (`vercel.json`)
- ✅ Optimal caching headers za SEO
- ✅ Security headers (X-Frame-Options, X-XSS-Protection)
- ✅ X-Robots-Tag za indexing
- ✅ Asset caching (1 year immutable)

### 2. **Sitemap Updates** (`public/sitemap.xml`)
- ✅ Datumi ažurirani na 2025-11-01
- ✅ 4 URL-a uključena (homepage, privacy, featured-products, faq)

### 3. **SEO Enhancements**
- ✅ `prioritizeSeoTags` omogućen u Helmet komponenti
- ✅ Noscript fallback content dodan
- ✅ Strukturni podaci (LocalBusiness + Website schema)

### 4. **Meta Tags** (Već postojeći - izvrsno)
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Geo tags za local SEO
- ✅ Google Site Verification

---

## 🚀 Deployment Koraci

### **Korak 1: Deploy na Vercel**

```bash
# Iz root direktorijuma projekta
vercel --prod
```

Ili korištenjem Vercel Dashboard:
1. Push changes to GitHub
2. Vercel će automatski deploy-ati

### **Korak 2: Verifikuj Deployment**

Nakon deploy-a, provjerite:

1. **Sitemap dostupnost:**
   ```
   https://www.sarenacarolija.com/sitemap.xml
   ```

2. **Robots.txt dostupnost:**
   ```
   https://www.sarenacarolija.com/robots.txt
   ```

3. **HTML struktura (DevTools):**
   - Provjeri da li se meta tagovi prikazuju
   - Provjeri noscript fallback

---

## 📊 Google Search Console Setup

### **Korak 1: Submit Sitemap**

1. Idi na https://search.google.com/search-console
2. Odaberi property: `https://www.sarenacarolija.com`
3. Klikni na "Sitemaps" u lijevom meniju
4. Unesi: `https://www.sarenacarolija.com/sitemap.xml`
5. Klikni "Submit"

### **Korak 2: Request Indexing**

1. U Search Console, klikni "URL Inspection"
2. Unesi: `https://www.sarenacarolija.com`
3. Klikni "Request Indexing"

### **Korak 3: Monitor Coverage**

1. Provjeri "Coverage" report nakon 24-48h
2. Provjeri za greške ili upozorenja
3. Provjeri "Enhancements" za rich results

---

## ⏱️ Očekivana Vremenska Linija

| Faza | Vrijeme | Status Check |
|------|---------|-------------|
| **Deploy** | 5-10min | Vercel Dashboard |
| **Google Crawl** | 1-7 dana | Search Console Coverage |
| **Indexing Start** | 3-14 dana | Google Search: `site:sarenacarolija.com` |
| **Full Visibility** | 2-6 sedmica | Google Analytics traffic |

---

## 🎯 Dodatne Preporuke (Opcionalno)

### **1. Google My Business**
- Kreiraj Google My Business profil za "Šarena Čarolija"
- Dodaj lokaciju, radno vrijeme, fotografije
- Benefit: Local SEO + Google Maps visibility

### **2. Product Structured Data**
Za pojedinačne proizvode (ako budu imali dedicirane stranice):

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Mirisna Svijeća - Lavanda",
  "image": "URL_do_slike",
  "description": "Ručno izrađena mirisna svijeća...",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "BAM",
    "price": "25",
    "availability": "https://schema.org/InStock"
  }
}
```

### **3. Content Marketing**
- Blog sekcija sa člancima o svijećama
- SEO-optimizovani tekstovi za keywords:
  - "mirisne svijeće bosna"
  - "ručno izrađene svijeće bih"
  - "sojin vosak svijeće"
  - "prirodne svijeće online"

### **4. Social Media Integration**
- Facebook Shop integration
- Instagram Shopping posts
- Pinterest boards sa proizvodima

---

## 🔍 Monitoring Tools

### **Recommended Tools:**

1. **Google Search Console** (Obavezno)
   - Coverage monitoring
   - Search queries
   - Indexing status

2. **Google Analytics** (Već instalirano)
   - Traffic sources
   - User behavior
   - Conversion tracking

3. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Core Web Vitals check
   - Performance optimization

4. **Rich Results Test**
   - https://search.google.com/test/rich-results
   - Structured data validation

---

## ⚠️ Trenutna Ograničenja

### **React SPA bez SSR**

**Problem:**
Google crawler vidi prazan `<div id="root"></div>` dok se JavaScript ne učita.

**Kratkoročno rješenje (implementirano):**
- ✅ Optimalni meta tagovi u `<head>`
- ✅ Noscript fallback content
- ✅ Strukturni podaci
- ✅ Vercel caching headers

**Dugoročno rješenje (preporuka za budućnost):**
- Migriraj na Next.js sa SSR/SSG
- Ili implementiraj prerendering sa Prerender.io
- Ili koristi Vercel Edge Functions za SSR

**Impact:**
- 🟡 Google **može** indexirati JS content, ali sporije
- 🟡 Bolje rangiranje sa SSR, ali nije kritično
- ✅ Trenutna implementacija je **dobra** za početak

---

## 📞 Support

Ako imate pitanja ili problema:
1. Provjeri Google Search Console Coverage report
2. Koristi `site:sarenacarolija.com` u Google-u
3. Provjeri Vercel deployment logs

---

**Status:** ✅ Ready for Deployment
**Posljednji update:** 2025-11-02
**Next review:** Nakon 7 dana (2025-11-09)
