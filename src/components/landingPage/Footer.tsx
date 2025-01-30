import React from 'react';
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFAQ = () => {
    // If we're not on the home page, first navigate there
    if (window.location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const faqSection = document.getElementById('faq');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on the home page, just scroll
      const faqSection = document.getElementById('faq');
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-purple-50 to-orange-50 text-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent mb-4">
              Šarena Čarolija
            </h2>
            <p className="text-gray-700 mb-4">
              Unesite toplinu u svoj dom sa našim ručno rađenim svijećama
            </p>
            <div className="flex flex-col space-y-2 text-gray-700">
              <div className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2 text-purple-500" />
                <span>Gradiška, Bosna i Hercegovina</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <FaClock className="mr-2 text-purple-500" />
                <span>Pon - Pet: 09:00 - 17:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Brzi Linkovi
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about-us" className="text-gray-700 hover:text-purple-600 transition-colors">
                O nama
              </Link>
              <button 
                onClick={scrollToFAQ}
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Česta pitanja
              </button>
              <Link to="/admin-login" className="text-gray-200 hover:text-purple-200 transition-colors">
                Admin panel
              </Link>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Kontaktirajte nas
            </h3>
            <div className="flex flex-col space-y-2 mb-6">
              <a
                href="mailto:sarena.carolija2025@gmail.com"
                className="flex items-center justify-center md:justify-end text-gray-700 hover:text-purple-600 transition-colors"
              >
                <FaEnvelope className="mr-2 text-purple-500" />
                sarena.carolija2025@gmail.com
              </a>
              <a
                href="tel:+38765905254"
                className="flex items-center justify-center md:justify-end text-gray-700 hover:text-purple-600 transition-colors"
              >
                <FaPhone className="mr-2 text-purple-500" />
                +387 65 905 254
              </a>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Zapratite nas na društvenim mrežama i podijelite sa nama vaše ideje
              </p>
              <div className="flex justify-center md:justify-end space-x-4">
                <a
                  href="https://www.facebook.com/sarena.carolija"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-100 p-2 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <FaFacebook size={20} className="text-purple-600" />
                </a>
                <a
                  href="https://www.instagram.com/sarena_carolijaa_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-100 p-2 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <FaInstagram size={20} className="text-purple-600" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Šarena Čarolija. Sva prava zadržana.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy-policy"
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
              >
                Privatnost
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
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
