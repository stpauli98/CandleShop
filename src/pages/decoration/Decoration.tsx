import ProductDescription from "../../components/sharedComponents/ProductDescription.tsx";
import ProductGrid from "../../components/sharedComponents/ProductGrid.tsx";
import { decorationData } from "./decorationData.ts";
import Footer from "../../components/landingPage/Footer.tsx";
import { collections } from '../../lib/controller.ts';
import SEOHead from '../../components/SEO/SEOHead';
import { generateBreadcrumbSchema } from '../../utils/structuredData';

export default function Dekoracija() {
  const breadcrumbs = [
    { name: 'Početna', url: 'https://www.sarenacarolija.com' },
    { name: 'Dekoracija', url: 'https://www.sarenacarolija.com/dekoracija' }
  ];

  return (
    <>
      <SEOHead
        title="Dekoracija - Ručno Izrađene Dekorativne Predmete"
        description="Otkrijte našu kolekciju ručno izrađenih dekorativnih predmeta. Jedinstvene dekoracije za uljepšavanje vašeg doma i stvaranje tople atmosfere."
        keywords="dekoracija, ručno izrađene dekoracije, dekorativni predmeti, ukrasni elementi, dom dekoracija, jedinstvene dekoracije"
        url="https://www.sarenacarolija.com/dekoracija"
        type="website"
        image="https://www.sarenacarolija.com/images/decoration-category.jpg"
        structuredData={generateBreadcrumbSchema(breadcrumbs)}
      />
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
    </>
  )
}