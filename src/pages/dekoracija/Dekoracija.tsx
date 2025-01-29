import ProductDescription from "../../components/shared/ProductDescription";
import ProductGrid from "../../components/shared/ProductGrid";
import { dekoracijeData } from "./dekoracijaData.ts";
import Footer from "../../components/landingPage/Footer";
import { dekoracije } from '../../lib/controller';

export default function Dekoracija() {
  return (
    <div className="mt-16">
      <ProductDescription {...dekoracijeData} />
      <div className={dekoracijeData.bgColor + " w-full"}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid 
            category="dekoracije"
            bgColor={dekoracijeData.bgColor}
            buttonColor={dekoracijeData.textColor}
            collectionName={dekoracije}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}