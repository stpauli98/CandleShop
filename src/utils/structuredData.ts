// Structured Data generators for SEO
// VAŽNO: Svi podaci u ovom fajlu su TAČNI i verifikovani
// Google kažnjava lažne structured data - NE dodavati lažne informacije!

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
  "@type": "OnlineStore",
  "name": "Šarena Čarolija",
  "description": "Ručno izrađene mirisne svijeće i dekoracije za dom od prirodnih materijala. Specijaliziramo se za sojin vosak, esencijalna ulja i pamučne fitiljeve.",
  "url": "https://www.sarenacarolija.com",
  "logo": "https://www.sarenacarolija.com/images/logo.jpeg",
  "image": "https://www.sarenacarolija.com/images/logo.jpeg",
  "telephone": "+387 65 905 254",
  "email": "sarena.carolija2025@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gradiška",
    "addressRegion": "Republika Srpska",
    "addressCountry": "BA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "45.1464897",
    "longitude": "17.2551953"
  },
  "priceRange": "15-50 KM",
  "paymentAccepted": ["Cash"],
  "currenciesAccepted": "BAM",
  "areaServed": {
    "@type": "Country",
    "name": "Bosnia and Herzegovina"
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
          "category": "Svijeće",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "BAM",
            "lowPrice": "15",
            "highPrice": "50",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Mirisni Voskovi",
          "category": "Voskovi",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "BAM",
            "lowPrice": "15",
            "highPrice": "40",
            "availability": "https://schema.org/InStock"
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Dekoracije",
          "category": "Dekoracija",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "BAM",
            "lowPrice": "20",
            "highPrice": "50",
            "availability": "https://schema.org/InStock"
          }
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
  "image": product.slika || 'https://www.sarenacarolija.com/images/logo.jpeg',
  "brand": {
    "@type": "Brand",
    "name": "Šarena Čarolija",
    "logo": "https://www.sarenacarolija.com/images/logo.jpeg"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Šarena Čarolija",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Gradiška",
      "addressRegion": "Republika Srpska",
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
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "8.00",
        "currency": "BAM"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
          "@type": "QuantitativeValue",
          "minValue": 2,
          "maxValue": 3,
          "unitCode": "DAY"
        },
        "transitTime": {
          "@type": "QuantitativeValue",
          "minValue": 1,
          "maxValue": 2,
          "unitCode": "DAY"
        }
      }
    }
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
      "url": "https://www.sarenacarolija.com/images/logo.jpeg"
    }
  },
  "sameAs": [
    "https://www.instagram.com/sarena_carolijaa_"
  ],
  "hasMap": "https://maps.google.com/?q=Gradiška,Bosnia+and+Herzegovina"
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

// WebPage Schema for individual pages
export const generateWebPageSchema = (options: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${options.url}#webpage`,
  "url": options.url,
  "name": options.name,
  "description": options.description,
  "isPartOf": {
    "@id": "https://www.sarenacarolija.com/#website"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Šarena Čarolija",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.sarenacarolija.com/images/logo.jpeg"
    }
  },
  ...(options.image && {
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": options.image
    }
  }),
  "inLanguage": "bs"
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
