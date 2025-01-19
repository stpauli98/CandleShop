import ProductDescription from '../../components/shared/ProductDescription'
import ProductGrid from '../../components/shared/ProductGrid'
import { svijeceData } from './svijeceData'
import Footer from '../../components/landingPage/Footer'

export default function Svijece() {
  return (
    <div>
      <ProductDescription {...svijeceData} />
      <div className={svijeceData.bgColor + " w-full"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid 
            category="svijece"
            bgColor={svijeceData.bgColor}
            buttonColor={svijeceData.textColor}
            collectionName="SvijecePage"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}