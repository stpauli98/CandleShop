import HeroSection from './landingPage/HeroSection'
import FeaturedProducts from './landingPage/FeaturedProducts'
import AboutUs from './landingPage/AboutUs'
import Testimonials from './landingPage/Testimonials'
import CallToAction from './landingPage/CallToAction'
import Advantages from './landingPage/Advantages'

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <AboutUs />
      <Advantages />
      <Testimonials />
      {/* <CallToAction /> */}
    </main>
  )
}
