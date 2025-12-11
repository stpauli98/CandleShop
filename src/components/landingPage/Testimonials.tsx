import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  imageUrl: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Marić",
    role: "Redovni kupac",
    content: "Svijeće su prekrasne i mirisi su nevjerovatni. Svaka koju sam kupila je bila savršena za stvaranje ugodne atmosfere u mom domu.",
    imageUrl: "https://i.imgur.com/WFOtnWN.jpeg",
    rating: 5
  },
  {
    id: 2,
    name: "Miloš Kovač",
    role: "Ljubitelj svijeća",
    content: "Kvaliteta ovih svijeća je izvanredna. Dugo gore i miris se lijepo širi kroz cijelu prostoriju. Definitivno ću opet kupovati.",
    imageUrl: "https://i.imgur.com/ZiYEejB.jpeg",
    rating: 5
  },
  {
    id: 3,
    name: "Sara Novak",
    role: "Interior dizajner",
    content: "Kao dizajner interijera, često preporučujem ove svijeće svojim klijentima. Kvaliteta i dizajn su na najvišem nivou.",
    imageUrl: "https://i.imgur.com/WFOtnWN.jpeg",
    rating: 5
  },
  {
    id: 4,
    name: "Ivana Petrović",
    role: "Poklon entuzijasta",
    content: "Kupila sam svijeće kao poklone za prijatelje i porodicu. Svi su oduševljeni i pitaju me gdje sam ih našla!",
    imageUrl: "https://i.imgur.com/nJN9g28.jpeg",
    rating: 5
  },
  {
    id: 5,
    name: "Luka Matić",
    role: "Ljubitelj prirodnih proizvoda",
    content: "Cijenim što su svijeće napravljene od prirodnih sastojaka. Bez štetnih hemikalija i mirisi su autentični.",
    imageUrl: "https://i.imgur.com/ZiYEejB.jpeg",
    rating: 5
  },
  {
    id: 6,
    name: "Maja Horvat",
    role: "Vlasnica salona",
    content: "Koristim ove svijeće u svom salonu i klijenti ih obožavaju. Pomažu u stvaranju opuštajuće atmosfere.",
    imageUrl: "https://i.imgur.com/nJN9g28.jpeg",
    rating: 5
  }
];

export default function Testimonials() {
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let touchStartX = 0;
    let currentX = 0;

    const touchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      setIsDragging(true);
      setIsHovered(true);
    };

    const touchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - touchStartX;
      setCurrentTranslate(prev => {
        const newTranslate = prev + diff;
        const maxTranslate = 0;
        const minTranslate = -(testimonials.length * 380);
        return Math.max(Math.min(newTranslate, maxTranslate), minTranslate);
      });
      touchStartX = currentX;
    };

    const touchEnd = () => {
      setIsDragging(false);
      setIsHovered(false);
    };

    slider.addEventListener('touchstart', touchStart, { passive: true });
    slider.addEventListener('touchmove', touchMove, { passive: true });
    slider.addEventListener('touchend', touchEnd, { passive: true });

    return () => {
      slider.removeEventListener('touchstart', touchStart);
      slider.removeEventListener('touchmove', touchMove);
      slider.removeEventListener('touchend', touchEnd);
    };
  }, [isDragging]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`}
      />
    ));
  };

  return (
    <section className="py-20 md:py-28 section-warm relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-100/30 rounded-full blur-2xl" />

      <div className="relative px-3 sm:px-6 lg:px-12 xl:px-16 mb-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
            Recenzije
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
            Što kažu naši{' '}
            <span className="text-gradient-warm">kupci</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Pridružite se stotinama zadovoljnih kupaca koji su otkrili magiju naših svijeća
          </p>
        </motion.div>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative overflow-hidden">
        {/* Fade Overlays */}
        <div className="absolute left-0 top-0 h-full w-20 md:w-40 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />

        <div
          ref={sliderRef}
          className="flex gap-6 animate-testimonial-scroll touch-pan-x py-4"
          style={{
            transform: isDragging ? `translateX(${currentTranslate}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* First Set */}
          {testimonials.map((testimonial) => (
            <div
              key={`first-${testimonial.id}`}
              className="flex-shrink-0 w-[340px] md:w-[380px]"
            >
              <div className="bg-white rounded-2xl p-6 shadow-warm border border-stone-100 h-full hover:shadow-warm-lg transition-shadow duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-amber-300 mb-4" />

                {/* Content */}
                <p className="text-stone-600 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100"
                    draggable="false"
                  />
                  <div>
                    <h4 className="font-semibold text-charcoal-800">{testimonial.name}</h4>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Second Set (for infinite scroll) */}
          {testimonials.map((testimonial) => (
            <div
              key={`second-${testimonial.id}`}
              className="flex-shrink-0 w-[340px] md:w-[380px]"
            >
              <div className="bg-white rounded-2xl p-6 shadow-warm border border-stone-100 h-full hover:shadow-warm-lg transition-shadow duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-amber-300 mb-4" />

                {/* Content */}
                <p className="text-stone-600 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-100"
                    draggable="false"
                  />
                  <div>
                    <h4 className="font-semibold text-charcoal-800">{testimonial.name}</h4>
                    <p className="text-sm text-stone-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-warm border border-stone-100">
          <div className="flex -space-x-2">
            {testimonials.slice(0, 4).map((t, i) => (
              <img
                key={i}
                src={t.imageUrl}
                alt=""
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <span className="text-sm text-stone-600 ml-2">
            <span className="font-semibold text-charcoal-800">500+</span> zadovoljnih kupaca
          </span>
        </div>
      </motion.div>
    </section>
  );
}
