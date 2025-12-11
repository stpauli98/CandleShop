import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  const scrollToFAQ = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-charcoal-950 text-stone-300 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-400/5 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              {/* Flame Icon */}
              <div className="text-amber-500">
                <svg
                  className="w-8 h-8 animate-flame"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C10.5 4.5 8 6 8 9c0 2.5 1.5 4 4 4s4-1.5 4-4c0-3-2.5-4.5-4-7zm0 18c-3.5 0-6-2.5-6-6 0-2.5 1.5-5 3-7 0 2 1 4 3 4s3-2 3-4c1.5 2 3 4.5 3 7 0 3.5-2.5 6-6 6z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white">
                  Šarena Čarolija
                </span>
                <span className="text-2xs tracking-[0.15em] uppercase text-amber-500/80">
                  Ručno izrađene svijeće
                </span>
              </div>
            </Link>
            <p className="text-stone-400 mb-6 leading-relaxed">
              Unesite toplinu u svoj dom sa našim ručno rađenim svijećama od prirodnih sastojaka.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/sarena.carolija"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-800 hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5 text-stone-400 group-hover:text-charcoal-900 transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/sarena_carolijaa_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-charcoal-800 hover:bg-amber-500 flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 text-stone-400 group-hover:text-charcoal-900 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-white font-semibold mb-6">
              Brzi linkovi
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                Početna
              </Link>
              <button
                onClick={scrollToFAQ}
                className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2 text-left"
              >
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                Česta pitanja
              </button>
              <Link
                to="/privacy-policy"
                className="text-stone-400 hover:text-amber-400 transition-colors inline-flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                Politika privatnosti
              </Link>
              <Link
                to="/admin-login"
                className="text-charcoal-700 hover:text-charcoal-600 transition-colors inline-flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-charcoal-700" />
                Admin
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-white font-semibold mb-6">
              Kontakt
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:sarena.carolija2025@gmail.com"
                className="flex items-start gap-3 text-stone-400 hover:text-amber-400 transition-colors group"
              >
                <Mail className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">sarena.carolija2025@gmail.com</span>
              </a>
              <a
                href="tel:+38765905254"
                className="flex items-center gap-3 text-stone-400 hover:text-amber-400 transition-colors group"
              >
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-sm">+387 65 905 254</span>
              </a>
              <div className="flex items-start gap-3 text-stone-400">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Gradiška, Bosna i Hercegovina</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-display text-white font-semibold mb-6">
              Radno vrijeme
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-stone-400">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">Pon - Pet</p>
                  <p>09:00 - 17:00</p>
                </div>
              </div>
              <div className="pl-8 text-sm text-stone-500">
                <p>Subota i nedjelja</p>
                <p className="text-stone-400">Zatvoreno</p>
              </div>
            </div>

            {/* Newsletter hint */}
            <div className="mt-8 p-4 bg-charcoal-800/50 rounded-xl border border-charcoal-700">
              <p className="text-xs text-stone-500">
                Zapratite nas na društvenim mrežama za najnovije proizvode i akcije!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-stone-500">
              &copy; {new Date().getFullYear()} Šarena Čarolija. Sva prava zadržana.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy-policy"
                className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                Privatnost
              </Link>
              <Link
                to="/terms"
                className="text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                Uslovi korištenja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
