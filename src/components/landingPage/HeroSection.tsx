import { motion } from 'framer-motion'
import { useMemo } from 'react'
import heroImage from '@/assets/heroSection.jpg'

// Configuration constants
const HERO_TEXT_OFFSET_TOP = 20; // Tailwind spacing units
const HERO_TEXT_OFFSET_LEFT = 8; // Percentage

export default function HeroSection() {

    // Memoized animation variants for performance
    const heroTextAnimation = useMemo(() => ({
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 1.5 }
    }), []);

    return (
        <div className="relative hero-section h-screen overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-purple-900">
                <img
                    src={heroImage}
                    alt="Ručno izrađene svijeće"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                        console.error('Hero image failed to load:', heroImage);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

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
            </div>
        </div>
    );
}
