import ProductDescription from "../../components/sharedComponents/ProductDescription";
import ProductGrid from "../../components/sharedComponents/ProductGrid";
import { scentedWaxesData } from "./ScentedWaxesData";
import Footer from "../../components/landingPage/Footer";
import { collections } from '../../lib/controller';
import SEOHead from '../../components/SEO/SEOHead';
import { generateBreadcrumbSchema } from '../../utils/structuredData';

export default function ScentedWaxes() {
    const breadcrumbs = [
        { name: 'Početna', url: 'https://www.sarenacarolija.com' },
        { name: 'Mirisni Voskovi', url: 'https://www.sarenacarolija.com/mirisni-voskovi' }
    ];

    return (
        <>
            <SEOHead
                title="Mirisni Voskovi - Prirodni Sojin Vosak za Svijeće"
                description="Kvalitetni mirisni voskovi za izradu svijeća. Prirodni sojin vosak sa esencijalnim uljima za DIY projekte i aromaterapiju."
                keywords="mirisni voskovi, sojin vosak, vosak za svijeće, DIY svijeće, prirodni vosak, esencijalna ulja, aromaterapija"
                url="https://www.sarenacarolija.com/mirisni-voskovi"
                type="website"
                image="https://www.sarenacarolija.com/images/scented-waxes-category.jpg"
                structuredData={generateBreadcrumbSchema(breadcrumbs)}
            />
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
        </>
    );
}   