import { Link } from 'react-router-dom'
import Button from '../ui/button'
import ScrollImages from '../ui/ScrollImages'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function HeroSection() {
    const [isScrollComplete, setIsScrollComplete] = useState(false);
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
        setIsScrollComplete(true);
    };

    return (
        <div className="relative min-h-[500vh] hero-section">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
                <ScrollImages 
                    onScrollComplete={handleScrollComplete}
                    onImagesLoaded={handleImagesLoaded}
                />
                
                {/* Overlay i sadržaj */}
                <div className="absolute inset-0 z-10">
                    {/* Gradijent overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/70 md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent" />
                    
                    {/* Gornji tekst */}
                    <div className="absolute top-0 w-full pt-20 md:relative md:top-auto md:pt-0 md:h-full md:flex md:items-center">
                        <div className="w-full px-6 md:px-0 md:w-auto md:max-w-xl md:ml-[8%] text-center md:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: -20, x: 0 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                transition={{ duration: 1.5 }}
                                className="space-y-4 md:space-y-6"
                            >
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
                                    Pretvorite svoj dom u oazu mira i magije
                                </h1>
                                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-md mx-auto md:mx-0 mt-11">
                                    Naše ručno izrađene svijeće su više od dekoracije – one unose toplinu, mir i ljubav u svaki trenutak.
                                </p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20, x: 0 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    transition={{ duration: 1.5, delay: 0.3 }}
                                    className="pt-6"
                                >
                                    <Button 
                                        size="lg"
                                        asLink="/proizvodi"
                                        className="w-full md:w-auto hover:scale-105 transition-transform duration-300"
                                    >
                                        Istražite kolekciju
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Donje dugme */}
                    <div className="absolute bottom-0 w-full pb-12 md:pb-16">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 1.5 }}
                            className="container mx-auto px-6 flex flex-col items-center"
                        >
                            {/* Scroll Indicator */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: [0, 1],
                                    y: [0, 10, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: 2
                                }}
                                className="text-white flex flex-col items-center"
                            >
                                <span className="text-sm mb-2">Skrolaj prema dole</span>
                                <svg 
                                    className="w-6 h-6" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                </svg>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}