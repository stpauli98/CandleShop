import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  structuredData?: object;
  noindex?: boolean;
}

const SEOHead = ({
  title,
  description,
  keywords = 'mirisne svijeće, ručno izrađene, sojin vosak, prirodne svijeće, BiH, Bosna, online shop',
  image = 'https://www.sarenacarolija.com/images/og-default.jpg',
  url = 'https://www.sarenacarolija.com',
  type = 'website',
  structuredData,
  noindex = false
}: SEOProps) => {
  // Generate full title with brand
  const fullTitle = title.includes('Šarena Čarolija') 
    ? title 
    : `${title} | Šarena Čarolija`;

  return (
    <Helmet prioritizeSeoTags>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Viewport and language */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <html lang="bs" />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Šarena Čarolija" />
      <meta property="og:locale" content="bs_BA" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags for E-commerce */}
      <meta name="author" content="Šarena Čarolija" />
      <meta name="copyright" content="Šarena Čarolija" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Geo Tags for Local SEO */}
      <meta name="geo.region" content="BA" />
      <meta name="geo.country" content="Bosnia and Herzegovina" />
      <meta name="geo.placename" content="Bosna i Hercegovina" />
      
      {/* Business Information */}
      <meta name="contact" content="info@sarenacarolija.com" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;