import ProductDescription from '../../components/sharedComponents/ProductDescription'
import ProductGrid from '../../components/sharedComponents/ProductGrid'
import { candlesData } from './candlesData'
import Footer from '../../components/landingPage/Footer'
import { collections } from '../../lib/controller'

export default function Candles() {
  return (
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
  )
}