// Structured Data generators for SEO

export interface Product {
  id: string;
  naziv?: string;
  cijena?: string;
  slika?: string;
  opis?: string;
  kategorija?: string;
}

// Local Business Schema for Homepage
export const generateLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Šarena Čarolija",
  "description": "Ručno izrađene mirisne svijeće i dekoracije za dom od prirodnih materijala. Specijaliziramo se za sojin vosak, esencijalna ulja i pamučne fitiljeve.",
  "url": "https://www.sarenacarolija.com",
  "logo": "https://www.sarenacarolija.com/images/logo.png",
  "image": "https://www.sarenacarolija.com/images/workshop-main.jpg",
  "telephone": "+387-XX-XXX-XXX", // TODO: Add real phone number
  "email": "info@sarenacarolija.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "BA",
    "addressRegion": "Federacija BiH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "43.8486",
    "longitude": "18.3564"
  },
  "openingHours": [
    "Mo-Fr 09:00-17:00",
    "Sa 10:00-14:00"
  ],
  "priceRange": "15-100 KM",
  "paymentAccepted": ["Cash", "Bank Transfer"],
  "currenciesAccepted": "BAM",
  "areaServed": {
    "@type": "Country",
    "name": "Bosnia and Herzegovina"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "43.8486",
      "longitude": "18.3564"
    },
    "geoRadius": "100000"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Mirisne Svijeće Katalog",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Mirisne Svijeće",
          "category": "Svijeće"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Product",
          "name": "Mirisni Voskovi",
          "category": "Voskovi"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product", 
          "name": "Dekoracije",
          "category": "Dekoracija"
        }
      }
    ]
  }
});

// Product Schema for product pages
export const generateProductSchema = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.naziv || 'Ručno Izrađena Svijeća',
  "description": product.opis || 'Ručno izrađena mirisna svijeća od prirodnog sojin voska sa esencijalnim uljima.',
  "image": product.slika || 'https://www.sarenacarolija.com/images/default-product.jpg',
  "brand": {
    "@type": "Brand",
    "name": "Šarena Čarolija",
    "logo": "https://www.sarenacarolija.com/images/logo.png"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Šarena Čarolija",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BA"
    }
  },
  "category": product.kategorija || 'Mirisne Svijeće',
  "offers": {
    "@type": "Offer",
    "price": product.cijena?.replace(/[^\d.,]/g, '') || "25.00",
    "priceCurrency": "BAM",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": "2025-12-31",
    "seller": {
      "@type": "Organization",
      "name": "Šarena Čarolija"
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 14
    },
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "5.00",
        "currency": "BAM"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue", 
          "minValue": 2,
          "maxValue": 5,
          "unitCode": "DAY"
        }
      }
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "32",
    "bestRating": "5",
    "worstRating": "1"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Materijal",
      "value": "Sojin vosak"
    },
    {
      "@type": "PropertyValue",
      "name": "Fitilj",
      "value": "Pamučni"
    },
    {
      "@type": "PropertyValue",
      "name": "Vrijeme gorenja",
      "value": "20-60 sati"
    }
  ]
});

// Website/Organization Schema
export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Website",
  "name": "Šarena Čarolija",
  "description": "Online shop za ručno izrađene mirisne svijeće i dekoracije",
  "url": "https://www.sarenacarolija.com",
  "publisher": {
    "@type": "Organization",
    "name": "Šarena Čarolija",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.sarenacarolija.com/images/logo.png",
      "width": 300,
      "height": 100
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.sarenacarolija.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://www.facebook.com/sarenacarolija",
    "https://www.instagram.com/sarenacarolija"
  ]
});

// Breadcrumb Schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

// FAQ Schema for FAQ pages
export const generateFAQSchema = (faqs: Array<{question: string, answer: string}>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});