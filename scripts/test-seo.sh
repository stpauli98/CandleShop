#!/bin/bash

# 🔍 SEO Test Script za Šarena Čarolija
# Provera SEO podataka na live sajtu

echo "═══════════════════════════════════════════════════════"
echo "🔍 SEO PROVERA - Šarena Čarolija"
echo "═══════════════════════════════════════════════════════"
echo ""

URL="https://www.sarenacarolija.com"

echo "📍 Testiram sajt: $URL"
echo ""

# Provera 1: OnlineStore Schema
echo "1️⃣  Proveravam OnlineStore schema..."
if curl -s $URL | grep -q '"@type".*"OnlineStore"'; then
    echo "   ✅ OnlineStore schema PRONAĐEN"
else
    echo "   ❌ OnlineStore schema NEDOSTAJE"
fi

# Provera 2: Telefon
echo "2️⃣  Proveravam telefon broj..."
if curl -s $URL | grep -q "+387 65 905 254"; then
    echo "   ✅ Telefon +387 65 905 254 PRONAĐEN"
else
    echo "   ❌ Telefon NEDOSTAJE"
fi

# Provera 3: Email
echo "3️⃣  Proveravam email..."
if curl -s $URL | grep -q "sarena.carolija2025@gmail.com"; then
    echo "   ✅ Email sarena.carolija2025@gmail.com PRONAĐEN"
else
    echo "   ❌ Email NEDOSTAJE"
fi

# Provera 4: Lokacija (Gradiška)
echo "4️⃣  Proveravam lokaciju..."
if curl -s $URL | grep -q "Gradiška"; then
    echo "   ✅ Lokacija Gradiška PRONAĐENA"
else
    echo "   ❌ Lokacija NEDOSTAJE"
fi

# Provera 5: Geo koordinate
echo "5️⃣  Proveravam geo koordinate..."
if curl -s $URL | grep -q "45.1464897"; then
    echo "   ✅ Latitude 45.1464897 PRONAĐEN"
else
    echo "   ❌ Geo koordinate NEDOSTAJU"
fi

# Provera 6: Instagram
echo "6️⃣  Proveravam Instagram link..."
if curl -s $URL | grep -q "sarena_carolijaa_"; then
    echo "   ✅ Instagram @sarena_carolijaa_ PRONAĐEN"
else
    echo "   ❌ Instagram NEDOSTAJE"
fi

# Provera 7: Meta title
echo "7️⃣  Proveravam meta title..."
if curl -s $URL | grep -q "<title>.*Šarena Čarolija.*</title>"; then
    echo "   ✅ Meta title PRONAĐEN"
else
    echo "   ❌ Meta title NEDOSTAJE"
fi

# Provera 8: Meta description
echo "8️⃣  Proveravam meta description..."
if curl -s $URL | grep -q 'name="description"'; then
    echo "   ✅ Meta description PRONAĐEN"
else
    echo "   ❌ Meta description NEDOSTAJE"
fi

# Provera 9: Open Graph
echo "9️⃣  Proveravam Open Graph tagove..."
if curl -s $URL | grep -q 'property="og:title"'; then
    echo "   ✅ Open Graph tagovi PRONAĐENI"
else
    echo "   ❌ Open Graph tagovi NEDOSTAJU"
fi

# Provera 10: Google Analytics
echo "🔟 Proveravam Google Analytics..."
if curl -s $URL | grep -q "gtag.js"; then
    echo "   ✅ Google Analytics AKTIVAN"
else
    echo "   ❌ Google Analytics NEAKTIVAN"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 REZIME"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "🔗 Sledeći koraci:"
echo ""
echo "1. Rich Results Test:"
echo "   https://search.google.com/test/rich-results"
echo ""
echo "2. Schema Validator:"
echo "   https://validator.schema.org/"
echo ""
echo "3. Facebook Debugger:"
echo "   https://developers.facebook.com/tools/debug/"
echo ""
echo "4. Google Search Console:"
echo "   https://search.google.com/search-console"
echo ""
echo "═══════════════════════════════════════════════════════"
