import ProductDescription from "../../components/sharedComponents/ProductDescription";
import ProductGrid from "../../components/sharedComponents/ProductGrid";
import { scentedCandlesData } from "./scentedCandlesData";
import Footer from "../../components/landingPage/Footer";
import { collections } from '../../lib/controller';
import SEOHead from '../../components/SEO/SEOHead';
import { generateBreadcrumbSchema } from '../../utils/structuredData';

export default function ScentedCandles() {
  const breadcrumbs = [
    { name: 'Početna', url: 'https://www.sarenacarolija.com' },
    { name: 'Mirisne Svijeće', url: 'https://www.sarenacarolija.com/mirisne-svijece' }
  ];

  return (
    <>
      <SEOHead
        title="Mirisne Svijeće - Aromaterapija za Vaš Dom"
        description="Otkrijte našu ekskluzivnu kolekciju mirisnih svijeća. Prirodni mirisi za opuštanje, aromaterapiju i stvaranje ugodne atmosfere u vašem domu."
        keywords="mirisne svijeće, aromaterapija, prirodni mirisi, svijeće lavanda, svijeće vanila, mirisne svijeće bosna, esencijalna ulja"
        url="https://www.sarenacarolija.com/mirisne-svijece"
        type="website"
        image="https://www.sarenacarolija.com/images/scented-candles-category.jpg"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />
      <div className="mt-16">
        <ProductDescription {...scentedCandlesData} />
        <div className={scentedCandlesData.bgColor + " w-full"}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductGrid 
              category="mirisneSvijece"
              bgColor={scentedCandlesData.bgColor}
              buttonColor={scentedCandlesData.textColor}
              collectionName={collections.mirisneSvijece()}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}