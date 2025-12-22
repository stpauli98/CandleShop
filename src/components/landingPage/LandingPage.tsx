import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeroSection from './HeroSection'
import FeaturedProducts from './FeaturedProducts'
import AboutUs from './AboutUs'
import Testimonials from './Testimonials'
import Advantages from './Advantages'
import Footer from './Footer'
import FrequentlyAskedQuestions from './FrequentlyAskedQuestions'
import SEOHead from '../SEO/SEOHead'
import SplashScreen from '../SplashScreen'
import { useFramePreloader } from './hooks/useFramePreloader'
import { generateLocalBusinessSchema, generateWebsiteSchema } from '../../utils/structuredData'

// Helper to get initial mobile state (SSR-safe)
const getInitialMobileState = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(getInitialMobileState);
  const [showSplash, setShowSplash] = useState(true);

  // Setup resize listener for mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload frames at LandingPage level
  const { images, progress, isReady } = useFramePreloader(isMobile);

  // Hide splash when ready (with minimum display time)
  useEffect(() => {
    if (isReady) {
      // Minimum splash time of 1.5s for branding
      const minDisplayTime = 1500;
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  const structuredData = [
    generateLocalBusinessSchema(),
    generateWebsiteSchema()
  ];

  return (
    <>
      <SEOHead
        title="Mirisne Svijeće Ručni Rad BiH | Šarena Čarolija"
        description="Kupite ručno pravljene mirisne svijeće od prirodnog sojin voska. Esencijalna ulja, pamučni fitilj, ekološke svijeće. Besplatna dostava 50+ KM. Proizvod BiH!"
        keywords="mirisne svijeće bosna, ručno izrađene svijeće, sojin vosak svijeće, prirodne svijeće bih, svijeće online shop, ekološke svijeće, aromaterapija svijeće, dekorativne svijeće, mirisni voskovi, wax melts bih, svijeće sarajevo, domaće svijeće"
        url="https://www.sarenacarolija.com"
        type="website"
        image="https://www.sarenacarolija.com/images/logo.jpeg"
        structuredData={structuredData}
      />

      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen progress={progress.percentage} />}
      </AnimatePresence>

      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        Preskoči na sadržaj
      </a>

      <main id="main-content" style={{ position: 'relative' }}>
        <HeroSection images={images} isReady={isReady} isMobile={isMobile} />
        <FeaturedProducts />
        <Advantages />
        <AboutUs />
        <FrequentlyAskedQuestions path="/faq" />
        <Testimonials />
        <Footer />
      </main>
    </>
  )
}
