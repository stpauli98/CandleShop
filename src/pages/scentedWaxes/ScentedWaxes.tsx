import ProductDescription from "../../components/sharedComponents/ProductDescription";
import ProductGrid from "../../components/sharedComponents/ProductGrid";
import { scentedWaxesData } from "./ScentedWaxesData";
import Footer from "../../components/landingPage/Footer";
import { collections } from '../../lib/controller';

export default function ScentedWaxes() {
    return (
        <div className="mt-16">
            <ProductDescription {...scentedWaxesData} />
            <div className={scentedWaxesData.bgColor + " w-full"}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductGrid 
                        category="mirisniVoskovi"
                        bgColor={scentedWaxesData.bgColor}
                        buttonColor={scentedWaxesData.textColor}
                        collectionName={collections.mirisniVoskovi()}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}   