import { useEffect, useState, useRef } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Marić",
    role: "Redovni kupac",
    content: "Svijeće su prekrasne i mirisi su nevjerovatni. Svaka koju sam kupila je bila savršena za stvaranje ugodne atmosfere u mom domu.",
    imageUrl: "https://i.imgur.com/WFOtnWN.jpeg"
  },
  {
    id: 2,
    name: "Miloš Kovač",
    role: "Ljubitelj svijeća",
    content: "Kvaliteta ovih svijeća je izvanredna. Dugo gore i miris se lijepo širi kroz cijelu prostoriju. Definitivno ću opet kupovati.",
    imageUrl: "https://i.imgur.com/ZiYEejB.jpeg"
  },
  {
    id: 3,
    name: "Sara Novak",
    role: "Interior dizajner",
    content: "Kao dizajner interijera, često preporučujem ove svijeće svojim klijentima. Kvaliteta i dizajn su na najvišem nivou.",
    imageUrl: "https://i.imgur.com/WFOtnWN.jpeg"
  },
  {
    id: 4,
    name: "Ivana Petrović",
    role: "Poklon entuzijasta",
    content: "Kupila sam svijeće kao poklone za prijatelje i porodicu. Svi su oduševljeni i pitaju me gdje sam ih našla!",
    imageUrl: "https://i.imgur.com/nJN9g28.jpeg"
  },
  {
    id: 5,
    name: "Luka Matić",
    role: "Ljubitelj prirodnih proizvoda",
    content: "Cijenim što su svijeće napravljene od prirodnih sastojaka. Bez štetnih hemikalija i mirisi su autentični.",
    imageUrl: "https://i.imgur.com/ZiYEejB.jpeg"
  },
  {
    id: 6,
    name: "Maja Horvat",
    role: "Vlasnica salona",
    content: "Koristim ove svijeće u svom salonu i klijenti ih obožavaju. Pomažu u stvaranju opuštajuće atmosfere.",
    imageUrl: "https://i.imgur.com/nJN9g28.jpeg"
  },
  {
    id: 7,
    name: "Tomislav Vuković",
    role: "Student",
    content: "Ove svijeće su savršene za opuštanje tokom studiranja. Miris lavande mi pomaže da se fokusiram.",
    imageUrl: "https://i.imgur.com/ZiYEejB.jpeg"
  },
  {
    id: 8,
    name: "Jelena Krstić",
    role: "Majka",
    content: "Djeca i ja obožavamo ove svijeće. Posebno su praktične za opuštajuće večeri kod kuće.",
    imageUrl: "https://i.imgur.com/WFOtnWN.jpeg"
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
        const minTranslate = -(testimonials.length * 288);
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

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-orange-50">
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * ${testimonials.length}));
            }
          }

          @media (min-width: 768px) {
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-400px * ${testimonials.length}));
              }
            }
          }

          .testimonials-scroll {
            animation: scroll 30s linear infinite;
          }

          .testimonials-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
        Što kažu naši kupci
      </h2>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 h-full w-[100px] md:w-[200px] bg-gradient-to-r from-purple-50 via-purple-50/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 h-full w-[100px] md:w-[200px] bg-gradient-to-l from-purple-50 via-purple-50/80 to-transparent z-10" />
        </div>

        <div
          ref={sliderRef}
          className={`flex gap-4 md:gap-8 testimonials-scroll touch-pan-x`}
          style={{
            transform: isDragging ? `translateX(${currentTranslate}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Prvi set */}
          {testimonials.map((testimonial) => (
            <div
              key={`first-${testimonial.id}`}
              className="flex-shrink-0 w-[280px] md:w-[400px] bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-3 md:mb-4">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 md:mr-4"
                  draggable="false"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm md:text-base">{testimonial.content}</p>
            </div>
          ))}
          {/* Drugi set */}
          {testimonials.map((testimonial) => (
            <div
              key={`second-${testimonial.id}`}
              className="flex-shrink-0 w-[280px] md:w-[400px] bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-3 md:mb-4">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 md:mr-4"
                  draggable="false"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic text-sm md:text-base">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
