import { Link } from 'react-router-dom'
import Button from '../ui/button'
import landingPic from '../../assets/landing_pic.jpg'
import { motion } from 'framer-motion'

export default function HeroSection() {
    return (
      <section className="relative h-screen flex items-center justify-center text-center text-white">
        <img
          src={landingPic}
          alt="Svijeće u mraku"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl"
          >
            Pretvorite svoj dom u oazu mira i magije
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="mt-6 text-xl"
          >
            Naše ručno izrađene svijeće su više od dekoracije – one unose toplinu, mir i ljubav u svaki trenutak.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="mt-10 flex gap-4 justify-center"
          >
            <Button size="lg" asLink="/proizvodi">
              Istražite kolekciju
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }