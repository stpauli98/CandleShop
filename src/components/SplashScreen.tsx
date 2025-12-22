import { motion } from 'framer-motion';

interface SplashScreenProps {
  progress: number;
}

export default function SplashScreen({ progress }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#fefcf3] via-[#f5e6d3] to-[#e8d4c4]"
    >
      {/* Animated Candle */}
      <div className="relative mb-8">
        {/* Candle body */}
        <div className="relative">
          {/* Flame container */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2">
            {/* Outer glow */}
            <div className="absolute inset-0 blur-xl">
              <div className="w-8 h-12 bg-amber-400/40 rounded-full animate-pulse" />
            </div>

            {/* Main flame */}
            <svg
              width="32"
              height="48"
              viewBox="0 0 32 48"
              className="relative z-10 animate-flicker"
            >
              <defs>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#fef3c7" />
                </linearGradient>
                <filter id="flameGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M16 2 C16 2 8 16 8 28 C8 36 12 44 16 46 C20 44 24 36 24 28 C24 16 16 2 16 2 Z"
                fill="url(#flameGradient)"
                filter="url(#flameGlow)"
              />
              {/* Inner flame (brighter core) */}
              <path
                d="M16 12 C16 12 12 22 12 30 C12 34 14 38 16 40 C18 38 20 34 20 30 C20 22 16 12 16 12 Z"
                fill="#fef3c7"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Wick */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-charcoal-800 rounded-full" />

          {/* Candle body */}
          <div className="w-16 h-24 bg-gradient-to-b from-cream-100 to-cream-200 rounded-t-lg rounded-b-xl shadow-lg border border-stone-200/50">
            {/* Candle texture lines */}
            <div className="absolute inset-x-2 top-4 h-px bg-stone-200/30" />
            <div className="absolute inset-x-2 top-8 h-px bg-stone-200/30" />
            <div className="absolute inset-x-2 top-12 h-px bg-stone-200/30" />
          </div>
        </div>
      </div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-display text-3xl md:text-4xl font-bold text-charcoal-800 mb-8"
      >
        Šarena Čarolija
      </motion.h1>

      {/* Progress bar container */}
      <div className="w-48 md:w-64">
        {/* Progress bar background */}
        <div className="h-1.5 bg-stone-300/50 rounded-full overflow-hidden">
          {/* Progress bar fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Progress text */}
        <p className="text-center text-stone-500 text-sm mt-3 font-body">
          Učitavanje... {progress}%
        </p>
      </div>
    </motion.div>
  );
}
