import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useFramePreloader } from './hooks/useFramePreloader';
import { useScrollFrame } from './hooks/useScrollFrame';

// Fallback image for reduced motion or errors
import heroImage from '@/assets/HeroSection.jpg';

// Helper to get initial mobile state (SSR-safe)
const getInitialMobileState = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMobile, setIsMobile] = useState(getInitialMobileState);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Setup resize listener
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Frame counts for different devices
  const frameCount = isMobile ? 153 : 192;

  // Preload frames based on device type
  const { images, progress, isReady, error } = useFramePreloader(isMobile);

  // Scroll-to-frame mapping with device-specific frame count
  const { containerRef, scrollYProgress, renderFrame } = useScrollFrame(
    setCurrentFrame,
    frameCount
  );

  // Canvas setup and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady || images.length === 0 || prefersReducedMotion)
      return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with devicePixelRatio for sharp rendering
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Render current frame after resize
      renderFrame(ctx, images, currentFrame, rect.width, rect.height);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [isReady, images, currentFrame, renderFrame, prefersReducedMotion]);

  // Update canvas on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady || images.length === 0 || prefersReducedMotion)
      return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameIndex = Math.round(latest * (images.length - 1));
    const rect = canvas.getBoundingClientRect();

    // Only render if we have the image loaded
    if (images[frameIndex]) {
      renderFrame(ctx, images, frameIndex, rect.width, rect.height);
    }
  });

  // Animation variants
  const containerAnimation = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: isMobile ? 0.1 : 0.15,
          delayChildren: isMobile ? 0.1 : 0.2,
        },
      },
    }),
    [isMobile]
  );

  const itemAnimation = useMemo(
    () => ({
      hidden: { opacity: 0, y: isMobile ? 15 : 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: isMobile ? 0.5 : 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    }),
    [isMobile]
  );

  const scrollToProducts = useCallback(() => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Render fallback for reduced motion or errors
  const shouldShowFallback = prefersReducedMotion || error;

  // Fade out text overlay as user scrolls (0% scroll = full opacity, 50% scroll = invisible)
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Desktop split layout - fullscreen canvas with split text
  if (!isMobile) {
    return (
      <div ref={containerRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <section className="relative h-full">
            {/* Fullscreen Background - Canvas or Fallback */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6d3] via-[#f0ddd0] to-[#e8d4c4]">
              {shouldShowFallback ? (
                <motion.img
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  src={heroImage}
                  alt="Ručno izrađene svijeće"
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover"
                    style={{ display: isReady ? 'block' : 'none' }}
                  />
                  {/* Loading state */}
                  {!isReady && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4 mx-auto" />
                        <p className="text-stone-500 text-sm">
                          Učitavanje... {progress.percentage}%
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Text Overlay with Backdrop - Fades on scroll */}
            <motion.div
              className="relative z-10 h-full flex items-center"
              style={{ opacity: textOpacity }}
            >
              {/* Main Content Area - Left Aligned */}
              <div className="w-full max-w-7xl mx-auto px-8 lg:px-16">
                <motion.div
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                  className="max-w-xl bg-white/70 backdrop-blur-md rounded-3xl p-8 lg:p-10 shadow-lg"
                >
                  <motion.h1
                    variants={itemAnimation}
                    className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal-900 leading-[1.1] mb-6"
                  >
                    Pretvorite svoj dom u{' '}
                    <span className="relative inline-block">
                      <span className="text-gradient-warm">oazu mira</span>
                      <svg
                        className="absolute -bottom-1 left-0 w-full"
                        viewBox="0 0 200 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 8.5C47.5 3.5 95.5 2 198 8.5"
                          stroke="url(#paint0_linear_desktop)"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_desktop"
                            x1="2"
                            y1="8"
                            x2="198"
                            y2="8"
                          >
                            <stop stopColor="#F59E0B" />
                            <stop offset="1" stopColor="#D97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </motion.h1>

                  <motion.p
                    variants={itemAnimation}
                    className="text-lg lg:text-xl text-stone-600 leading-relaxed mb-8"
                  >
                    Naše ručno izrađene svijeće unose toplinu, mir i ljubav u svaki trenutak.
                  </motion.p>

                  {/* CTA Buttons - Inside card */}
                  <motion.div
                    variants={itemAnimation}
                    className="flex flex-row gap-3"
                  >
                    <button
                      onClick={scrollToProducts}
                      className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-charcoal-900 font-semibold rounded-full transition-all duration-300"
                    >
                      Pogledaj kolekciju
                      <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                    <a
                      href="tel:+38765905254"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 hover:bg-charcoal-900/5 text-charcoal-900 font-semibold rounded-full border border-charcoal-900/20 transition-all duration-300"
                    >
                      Kontaktiraj nas
                    </a>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

          </section>
        </div>
      </div>
    );
  }

  // Mobile layout - fullscreen animation with overlay
  return (
    <div ref={containerRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <section className="relative hero-section h-full overflow-hidden">
          {/* Background - Canvas or Fallback Image */}
          <div className="absolute inset-0 bg-charcoal-900">
            {shouldShowFallback ? (
              <motion.img
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                src={heroImage}
                alt="Ručno izrađene svijeće"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <>
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                  style={{ display: isReady ? 'block' : 'none' }}
                />
                {!isReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-3 mx-auto" />
                      <p className="text-stone-400 text-xs">
                        Učitavanje... {progress.percentage}%
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/50 to-charcoal-900/30" />

          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute top-1/4 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-xl" />
          </div>

          {/* Main Content - Fades on scroll */}
          <motion.div
            className="relative h-full z-10"
            style={{ opacity: textOpacity }}
          >
            <div className="h-full max-w-7xl mx-auto px-5 sm:px-6 flex flex-col justify-center pt-20 sm:pt-24">
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
                className="max-w-2xl"
              >
                {/* Accent Label */}
                <motion.div variants={itemAnimation} className="mb-4">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-200 text-sm font-medium tracking-wide">
                      Ručna izrada
                    </span>
                  </span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                  variants={itemAnimation}
                  className="font-display text-[2.5rem] leading-[1.1] sm:text-5xl font-bold text-white mb-4"
                >
                  Pretvorite svoj dom u{' '}
                  <span className="relative inline-block">
                    <span className="text-gradient-warm">oazu mira</span>
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      viewBox="0 0 200 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 8.5C47.5 3.5 95.5 2 198 8.5"
                        stroke="url(#paint0_linear_mobile)"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_mobile"
                          x1="2"
                          y1="8"
                          x2="198"
                          y2="8"
                        >
                          <stop stopColor="#F59E0B" />
                          <stop offset="1" stopColor="#D97706" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={itemAnimation}
                  className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-md"
                >
                  Naše ručno izrađene svijeće unose toplinu, mir i ljubav u svaki trenutak.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  variants={itemAnimation}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={scrollToProducts}
                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-charcoal-900 font-semibold rounded-full shadow-warm-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5 text-base"
                  >
                    Pogledaj kolekciju
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  </button>
                  <a
                    href="tel:+38765905254"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300 text-base"
                  >
                    Kontaktiraj nas
                  </a>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  variants={itemAnimation}
                  className="mt-8 pt-6 border-t border-white/10"
                >
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-stone-300 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-amber-400 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>100% prirodno</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>30-50h gorenja</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-amber-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Besplatna dostava</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          {isReady && !shouldShowFallback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60"
            >
              <span className="text-[10px] uppercase tracking-widest">
                Skrolaj
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
