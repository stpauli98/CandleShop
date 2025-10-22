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
        title="Mirisne Svijeće Ručni Rad BiH | Šarena Čarolija"
        description="Kupite ručno pravljene mirisne svijeće od prirodnog sojin voska. Esencijalna ulja, pamučni fitilj, ekološke svijeće. Besplatna dostava 50+ KM. Proizvod BiH! 🕯️"
        keywords="mirisne svijeće bosna, ručno izrađene svijeće, sojin vosak svijeće, prirodne svijeće bih, svijeće online shop, ekološke svijeće, aromaterapija svijeće, dekorativne svijeće, mirisni voskovi, wax melts bih, svijeće sarajevo, domaće svijeće"
        url="https://www.sarenacarolija.com"
        type="website"
        image="https://i.imgur.com/8k7dh0m.jpeg"
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
