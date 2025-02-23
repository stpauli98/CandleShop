import ProductDescription from "../../components/sharedComponents/ProductDescription.tsx";
import ProductGrid from "../../components/sharedComponents/ProductGrid.tsx";
import { decorationData } from "./decorationData.ts";
import Footer from "../../components/landingPage/Footer.tsx";
import { collections } from '../../lib/controller.ts';

export default function Dekoracija() {
  return (
    <div className="mt-16">
      <ProductDescription {...decorationData} />
      <div className={decorationData.bgColor + " w-full"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid 
            category="dekoracije"
            bgColor={decorationData.bgColor}
            buttonColor={decorationData.textColor}
            collectionName={collections.dekoracije()}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}