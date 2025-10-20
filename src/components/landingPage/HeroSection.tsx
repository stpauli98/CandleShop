import ScrollImages from '../ui/ScrollImages'
import { motion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

// Configuration constants
const HERO_SCROLL_HEIGHT = 500; // vh units
const HERO_TEXT_OFFSET_TOP = 20; // Tailwind spacing units
const HERO_TEXT_OFFSET_LEFT = 8; // Percentage
const SCROLL_INDICATOR_PADDING_BOTTOM = 16; // Tailwind spacing units (mobile)
const SCROLL_INDICATOR_PADDING_BOTTOM_MD = 20; // Tailwind spacing units (desktop)

export default function HeroSection() {
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isImagesLoaded ? 'auto' : 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isImagesLoaded]);

    const handleImagesLoaded = () => {
        setIsImagesLoaded(true);
    };

    const handleScrollComplete = () => {
        // Track scroll completion for analytics
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'hero_scroll_complete', {
                event_category: 'engagement'
            });
        }
    };

    const handleScrollToProducts = () => {
        const element = document.getElementById('featured-products');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Memoized animation variants for performance
    const heroTextAnimation = useMemo(() => ({
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.5 }
    }), []);

    const scrollIndicatorAnimation = useMemo(() => ({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1, delay: 1.5 }
    }), []);

    const scrollIndicatorBounce = useMemo(() => ({
        initial: { opacity: 0 },
        animate: {
            opacity: [0.3, 1],
            y: [0, 15, 0]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }), []);

    return (
        <div className="relative hero-section" style={{ minHeight: `${HERO_SCROLL_HEIGHT}vh` }}>
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
                <ScrollImages
                    onScrollComplete={handleScrollComplete}
                    onImagesLoaded={handleImagesLoaded}
                />

                {/* Overlay i sadržaj */}
                <div className="absolute inset-0 z-10">
                    {/* Gradijent overlay */}
                    <div className="absolute inset-0 hero-gradient" />

                    {/* Gornji tekst */}
                    <div
                        className="absolute top-0 w-full md:relative md:top-auto md:pt-0 md:h-full md:flex md:items-center"
                        style={{ paddingTop: `${HERO_TEXT_OFFSET_TOP * 0.25}rem` }}
                    >
                        <div
                            className="w-full px-6 md:px-0 md:w-auto md:max-w-xl text-center md:text-left"
                            style={{ marginLeft: window.innerWidth >= 768 ? `${HERO_TEXT_OFFSET_LEFT}%` : '0' }}
                        >
                            <motion.div
                                {...heroTextAnimation}
                                className="space-y-4 md:space-y-6"
                            >
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
                                    Pretvorite svoj dom u oazu mira i magije
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-md mx-auto md:mx-0 mt-11">
                                    Naše ručno izrađene svijeće su više od dekoracije – one unose toplinu, mir i ljubav u svaki trenutak.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div
                        className="absolute bottom-0 w-full"
                        style={{
                            paddingBottom: window.innerWidth >= 768
                                ? `${SCROLL_INDICATOR_PADDING_BOTTOM_MD * 0.25}rem`
                                : `${SCROLL_INDICATOR_PADDING_BOTTOM * 0.25}rem`
                        }}
                    >
                        <motion.div
                            {...scrollIndicatorAnimation}
                            className="container mx-auto px-6 flex flex-col items-center"
                        >
                            <motion.button
                                onClick={handleScrollToProducts}
                                {...scrollIndicatorBounce}
                                type="button"
                                aria-label="Skrolaj do omiljenih proizvoda"
                                className="bg-white/10 backdrop-blur-sm rounded-2xl py-6 px-8 flex flex-col items-center shadow-2xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all cursor-pointer group"
                            >
                                <span className="text-2xl font-medium mb-4 text-white tracking-wide group-hover:text-purple-200 transition-colors">
                                    Skrolaj prema dole
                                </span>
                                <svg
                                    className="w-12 h-12 text-white group-hover:text-purple-200 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
