import { motion } from 'framer-motion';
import { Truck, Heart, Sparkles, Leaf } from 'lucide-react';

const advantages = [
  {
    icon: Truck,
    title: 'Besplatna dostava',
    description: 'Za narudžbe iznad 50 KM',
    accent: 'from-amber-400 to-amber-500'
  },
  {
    icon: Heart,
    title: 'Ručno izrađeno',
    description: 'Svaka svijeća je jedinstvena',
    accent: 'from-rose-400 to-rose-500'
  },
  {
    icon: Sparkles,
    title: 'Premium kvaliteta',
    description: 'Najbolji prirodni materijali',
    accent: 'from-amber-500 to-orange-500'
  },
  {
    icon: Leaf,
    title: 'Eco-friendly',
    description: '100% prirodni sastojci',
    accent: 'from-emerald-400 to-emerald-500'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export default function Advantages() {
  return (
    <section className="py-20 md:py-28 section-warm relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
            Naše prednosti
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
            Zašto odabrati{' '}
            <span className="text-gradient-warm">nas?</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Posvećenost kvaliteti i ljubav prema zanatu čine svaku našu svijeću posebnom
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-warm border border-stone-100 hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300">
                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${advantage.accent} flex items-center justify-center mb-6 shadow-warm group-hover:scale-110 transition-transform duration-300`}>
                  <advantage.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-charcoal-800 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {advantage.description}
                </p>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-amber-300">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-charcoal-800 text-cream-50 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium">Više od 500+ zadovoljnih kupaca</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
