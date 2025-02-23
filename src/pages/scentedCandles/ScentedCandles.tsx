import ProductDescription from "../../components/sharedComponents/ProductDescription";
import ProductGrid from "../../components/sharedComponents/ProductGrid";
import { scentedCandlesData } from "./scentedCandlesData";
import Footer from "../../components/landingPage/Footer";
import { collections } from '../../lib/controller';

export default function ScentedCandles() {
  return (
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
  )
}