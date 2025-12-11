import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import heroImage from '@/assets/HeroSection.jpg'
import { error } from '../../lib/logger'

export default function HeroSection() {
    // Animation variants
    const containerAnimation = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }), []);

    const itemAnimation = useMemo(() => ({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    }), []);

    const scrollToProducts = () => {
        const productsSection = document.getElementById('featured-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative hero-section h-screen overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-charcoal-900">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    src={heroImage}
                    alt="Ručno izrađene svijeće"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                        error('Hero image failed to load', { imagePath: heroImage }, 'IMAGE');
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 hero-gradient" />

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Subtle warm glow in corner */}
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-2xl" />
            </div>

            {/* Main Content */}
            <div className="relative h-full z-10">
                <div className="h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center">
                    <motion.div
                        variants={containerAnimation}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl"
                    >
                        {/* Accent Label */}
                        <motion.div variants={itemAnimation} className="mb-6">
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
                            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
                        >
                            Pretvorite svoj dom u{' '}
                            <span className="relative">
                                <span className="text-gradient-warm">oazu mira</span>
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M2 8.5C47.5 3.5 95.5 2 198 8.5"
                                        stroke="url(#paint0_linear)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="paint0_linear" x1="2" y1="8" x2="198" y2="8">
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
                            className="text-lg md:text-xl text-stone-300 leading-relaxed mb-10 max-w-lg"
                        >
                            Naše ručno izrađene svijeće su više od dekoracije – one unose toplinu, mir i ljubav u svaki trenutak.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={itemAnimation}
                            className="flex flex-wrap gap-4"
                        >
                            <button
                                onClick={scrollToProducts}
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-charcoal-900 font-semibold rounded-full shadow-warm-lg hover:shadow-glow transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                Pogledaj kolekciju
                                <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                            </button>
                            <a
                                href="mailto:sarena.carolija2025@gmail.com"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300"
                            >
                                Kontaktiraj nas
                            </a>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={itemAnimation}
                            className="mt-12 pt-8 border-t border-white/10"
                        >
                            <div className="flex flex-wrap items-center gap-8 text-stone-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span>100% prirodni sastojci</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>30-50 sati gorenja</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Besplatna dostava 50+ KM</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            >
                <button
                    onClick={scrollToProducts}
                    className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors group"
                >
                    <span className="text-xs tracking-widest uppercase">Skrolaj</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </button>
            </motion.div>
        </section>
    );
}
