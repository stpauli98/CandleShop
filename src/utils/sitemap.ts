// XML Sitemap generator for Šarena Čarolija
// Optimizirano za SEO i bolje indeksiranje od strane pretraživača

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Statičke stranice sajta
export const staticPages: SitemapUrl[] = [
  {
    loc: 'https://www.sarenacarolija.com',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    loc: 'https://www.sarenacarolija.com/svijece',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://www.sarenacarolija.com/mirisne-svijece',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.9
  },
  {
    loc: 'https://www.sarenacarolija.com/mirisni-voskovi',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://www.sarenacarolija.com/dekoracija',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    loc: 'https://www.sarenacarolija.com/privacy-policy',
    lastmod: '2025-01-01',
    changefreq: 'yearly',
    priority: 0.3
  }
];

// Generiraj URLs za produkte (dinamički se mogu dodati iz baze podataka)
export const generateProductUrls = (products: Array<{id: string, category: string, lastModified?: string}>): SitemapUrl[] => {
  return products.map(product => ({
    loc: `https://www.sarenacarolija.com/${product.category}/${product.id}`,
    lastmod: product.lastModified || new Date().toISOString().split('T')[0],
    changefreq: 'monthly' as const,
    priority: 0.7
  }));
};

// XML Sitemap generator
export const generateSitemap = (urls: SitemapUrl[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlElements = urls.map(url => {
    let urlElement = `  <url>\n    <loc>${url.loc}</loc>`;
    
    if (url.lastmod) {
      urlElement += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      urlElement += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      urlElement += `\n    <priority>${url.priority.toFixed(1)}</priority>`;
    }
    
    urlElement += '\n  </url>';
    return urlElement;
  }).join('\n');

  return `${xmlHeader}\n${urlsetOpen}\n${urlElements}\n${urlsetClose}`;
};

// Funkcija za generiranje kompletnog sitemap-a
export const generateCompleteSitemap = async (): Promise<string> => {
  // Ovdje možete dodati logiku za dohvaćanje proizvoda iz Firebase
  // const products = await fetchProductsFromFirebase();
  // const productUrls = generateProductUrls(products);
  
  // Za sada koristimo samo statičke stranice
  const allUrls = [...staticPages];
  
  return generateSitemap(allUrls);
};

// Export funkcija za korištenje u build procesu
export const saveSitemap = async (filePath: string): Promise<void> => {
  const sitemapContent = await generateCompleteSitemap();
  
  // U production environment-u, ovo će biti zapisano u public folder
  if (typeof window === 'undefined') {
    // Node.js environment (build time)
    const fs = await import('fs');
    fs.writeFileSync(filePath, sitemapContent, 'utf8');
    console.log('✅ Sitemap generated successfully:', filePath);
  }
};

// Hook za client-side generiranje (za development)
export const useSitemapGenerator = () => {
  const downloadSitemap = async () => {
    const sitemapContent = await generateCompleteSitemap();
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return { downloadSitemap, generateCompleteSitemap };
};