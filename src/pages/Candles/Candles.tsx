import ProductDescription from '../../components/sharedComponents/ProductDescription'
import ProductGrid from '../../components/sharedComponents/ProductGrid'
import { candlesData } from './candlesData'
import Footer from '../../components/landingPage/Footer'
import { collections } from '../../lib/controller'
import SEOHead from '../../components/SEO/SEOHead'
import { generateBreadcrumbSchema } from '../../utils/structuredData'

export default function Candles() {
  const breadcrumbs = [
    { name: 'Početna', url: 'https://www.sarenacarolija.com' },
    { name: 'Svijeće', url: 'https://www.sarenacarolija.com/svijece' }
  ];

  return (
    <>
      <SEOHead
        title="Svijeće - Prirodne i Dekorativne Svijeće"
        description="Pregledajte našu kolekciju prirodnih svijeća izrađenih od kvalitetnih materijala. Idealne za osvjetljavanje i dekoraciju vašeg doma."
        keywords="svijeće, prirodne svijeće, dekorativne svijeće, sojin vosak, svijeće za dom, osvjetljavanje"
        url="https://www.sarenacarolija.com/svijece"
        type="website"
        image="https://www.sarenacarolija.com/images/candles-category.jpg"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />
      <div className="mt-16">
        <ProductDescription {...candlesData} />
        <div className={candlesData.bgColor + " w-full"}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductGrid 
              category="svijece"
              bgColor={candlesData.bgColor}
              buttonColor={candlesData.textColor}
              collectionName={collections.svijece()}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}