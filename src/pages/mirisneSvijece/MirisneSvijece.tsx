import ProductDescription from "../../components/shared/ProductDescription";
import ProductGrid from "../../components/shared/ProductGrid";
import { mirisneSvijeceData } from "./mirisneSvijeceData";
import Footer from "../../components/landingPage/Footer";

export default function MirisneSvijece() {
    return (
        <div>
            <ProductDescription {...mirisneSvijeceData} />
            <div className={mirisneSvijeceData.bgColor + " w-full"}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductGrid 
                        category="mirisne svijece"
                        bgColor={mirisneSvijeceData.bgColor}
                        buttonColor={mirisneSvijeceData.textColor}
                        collectionName="mirisneSvijece"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}   