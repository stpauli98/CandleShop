import ProductDescription from "../../components/shared/ProductDescription";
import ProductGrid from "../../components/shared/ProductGrid";
import { MirisniVoskoviData } from "./mirisniVoskoviData";
import Footer from "../../components/landingPage/Footer";
import { mirisniVoskovi } from '../../lib/controller';

export default function MirisniVoskovi() {
    return (
        <div className="mt-16">
            <ProductDescription {...MirisniVoskoviData} />
            <div className={MirisniVoskoviData.bgColor + " w-full"}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <ProductGrid 
                        category="mirisniVoskovi"
                        bgColor={MirisniVoskoviData.bgColor}
                        buttonColor={MirisniVoskoviData.textColor}
                        collectionName= {mirisniVoskovi}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}   