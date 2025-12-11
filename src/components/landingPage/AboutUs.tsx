import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import workshop1 from '../../assets/AboutUsPic/workshop1.jpg';
import workshop2 from '../../assets/AboutUsPic/workshop2.jpg';
import workshop3 from '../../assets/AboutUsPic/workshop3.jpg';
import workshop4 from '../../assets/AboutUsPic/workshop4.jpg';

const images = [workshop1, workshop2, workshop3, workshop4];

export default function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-charcoal-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Section Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-amber-500" />
              <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
                Naša priča
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ljubav prema{' '}
              <span className="text-gradient-warm">zanatu</span>
            </h2>

            {/* Content */}
            <div className="space-y-5 text-stone-300 leading-relaxed">
              <p>
                Dobrodošli u našu malu radionicu svijeća, gdje svaka svijeća ima svoju priču.
                Naša strast prema izradi svijeća počela je kao hobi, a prerasla je u predanu
                misiju stvaranja jedinstvenih, ručno rađenih svijeća.
              </p>
              <p>
                Svaka naša svijeća je pažljivo izrađena s ljubavlju i pažnjom prema detaljima.
                Koristimo samo najkvalitetnije materijale, od prirodnog sojinog voska do
                pažljivo odabranih esencijalnih ulja.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-8 p-6 bg-charcoal-800/50 rounded-2xl border border-charcoal-700">
              <Quote className="w-8 h-8 text-amber-500/60 mb-3" />
              <p className="font-accent text-lg text-stone-200 italic">
                "Vjerujemo da svijeće mogu transformirati svaki prostor i stvoriti poseban ugođaj."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  ŠČ
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Šarena Čarolija</p>
                  <p className="text-stone-500 text-xs">Osnivač</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { value: '500+', label: 'Zadovoljnih kupaca' },
                { value: '50+', label: 'Vrsta mirisa' },
                { value: '100%', label: 'Prirodni sastojci' }
              ].map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-gradient-warm">
                    {stat.value}
                  </div>
                  <div className="text-stone-500 text-xs mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-warm-xl">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Radionica za izradu svijeća ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
              </div>

              {/* Decorative Frame */}
              <div className="absolute -inset-4 border-2 border-amber-500/20 rounded-3xl -z-10" />

              {/* Floating Accent */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-warm-lg">
                <div className="text-center text-white">
                  <div className="text-xl sm:text-2xl font-bold">3+</div>
                  <div className="text-2xs sm:text-xs opacity-80">godine</div>
                </div>
              </div>

              {/* Image Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? 'w-6 bg-amber-400'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Prikaži sliku ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
