import ProductDescription from "../../components/shared/ProductDescription";
import ProductGrid from "../../components/shared/ProductGrid";
import { mirisneSvijeceData } from "./mirisneSvijeceData";
import Footer from "../../components/landingPage/Footer";
import { mirisneSvijece } from '../../lib/controller';

export default function MirisneSvijece() {
  return (
    <div className="mt-16">
      <ProductDescription {...mirisneSvijeceData} />
      <div className={mirisneSvijeceData.bgColor + " w-full"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid 
            category="mirisneSvijece"
            bgColor={mirisneSvijeceData.bgColor}
            buttonColor={mirisneSvijeceData.textColor}
            collectionName={mirisneSvijece}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}