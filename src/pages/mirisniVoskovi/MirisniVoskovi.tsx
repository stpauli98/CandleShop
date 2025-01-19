import ProductDescription from "../../components/shared/ProductDescription";
import ProductGrid from "../../components/shared/ProductGrid";
import { MirisniVoskoviData } from "./mirisniVoskoviData";
import Footer from "../../components/landingPage/Footer";

export default function MirisneSvijece() {
    return (
        <div>
            <ProductDescription {...MirisniVoskoviData} />
            <div className={MirisniVoskoviData.bgColor + " w-full"}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductGrid 
                        category="mirisni voskovi"
                        bgColor={MirisniVoskoviData.bgColor}
                        buttonColor={MirisniVoskoviData.textColor}
                        collectionName="mirisniVoskovi"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}   