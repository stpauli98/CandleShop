import HeroSection from './HeroSection'
import FeaturedProducts from './FeaturedProducts'
import AboutUs from './AboutUs'
import Testimonials from './Testimonials'
import Advantages from './Advantages'
import Footer from './Footer'
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions'
import SEOHead from '../SEO/SEOHead'
import { generateLocalBusinessSchema, generateWebsiteSchema } from '../../utils/structuredData'

export default function LandingPage() {
  const structuredData = [
    generateLocalBusinessSchema(),
    generateWebsiteSchema()
  ];

  return (
    <>
      <SEOHead
        title="Ručno Izrađene Mirisne Svijeće | Šarena Čarolija"
        description="Otkrijte naše ručno izrađene mirisne svijeće od prirodnog sojin voska. Najbolje mirisne svijeće u Bosni i Hercegovini. Besplatna dostava za narudžbe preko 50 KM."
        keywords="mirisne svijeće bosna, ručno izrađene svijeće, sojin vosak, prirodne svijeće, mirisne svijeće online, svijeće bih, aromaterapija, dekorativne svijeće"
        url="https://www.sarenacarolija.com"
        type="website"
        image="https://www.sarenacarolija.com/images/homepage-hero.jpg"
        structuredData={structuredData}
      />
      <main style={{ position: 'relative' }}>
        <HeroSection />
        <FeaturedProducts />
        <Advantages />
        <AboutUs />
        <FrequentlyAskedQuestions path="/faq" />
        <Testimonials />
        {/* <CallToAction /> */}
        <Footer />
      </main>
    </>
  )
}
