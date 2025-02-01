import ProductDescription from '../../components/sharedComponents/ProductDescription'
import ProductGrid from '../../components/sharedComponents/ProductGrid'
import { svijeceData } from './svijeceData'
import Footer from '../../components/landingPage/Footer'
import { svijece } from '../../lib/controller'

export default function Svijece() {
  return (
    <div className="mt-16">
      <ProductDescription {...svijeceData} />
      <div className={svijeceData.bgColor + " w-full"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid 
            category="svijece"
            bgColor={svijeceData.bgColor}
            buttonColor={svijeceData.textColor}
            collectionName={svijece}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}