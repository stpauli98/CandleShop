import HeroSection from './landingPage/HeroSection'
import FeaturedProducts from './landingPage/FeaturedProducts'
import AboutUs from './landingPage/AboutUs'
import Testimonials from './landingPage/Testimonials'
import CallToAction from './landingPage/CallToAction'
import Advantages from './landingPage/Advantages'
import Footer from './landingPage/Footer'
import FrequentlyAskedQuestions from './landingPage/FrequentlyAskedQuestions'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <Advantages />
      <AboutUs />
      <FrequentlyAskedQuestions />
      <Testimonials />
      {/* <CallToAction /> */}
      <Footer />
    </main>
  )
}
