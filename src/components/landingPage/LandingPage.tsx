import HeroSection from './HeroSection'
import FeaturedProducts from './FeaturedProducts'
import AboutUs from './AboutUs'
import Testimonials from './Testimonials'
import CallToAction from './CallToAction'
import Advantages from './Advantages'
import Footer from './Footer'
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions'

export default function LandingPage() {
  return (
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
  )
}
