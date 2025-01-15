import React from 'react';
import { FaFacebook, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-4">Šarena Čarolija</h2>
            <p className="text-gray-300 mb-4">Unesite toplinu u svoj dom sa našim ručno rađenim svijećama</p>
            <div className="flex flex-col space-y-2 text-gray-300">
              <div className="flex items-center justify-center md:justify-start">
                <FaMapMarkerAlt className="mr-2" />
                <span>Gradiška, Bosna i Hercegovina</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <FaClock className="mr-2" />
                <span>Pon - Pet: 09:00 - 17:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Brzi Linkovi</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/proizvodi" className="text-gray-300 hover:text-white transition-colors">
                Proizvodi
              </Link>
              <Link to="/o-nama" className="text-gray-300 hover:text-white transition-colors">
                O nama
              </Link>
              <Link to="/kontakt" className="text-gray-300 hover:text-white transition-colors">
                Kontakt
              </Link>
              <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                Česta pitanja
              </Link>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-semibold mb-4">Kontaktirajte nas</h3>
            <div className="flex flex-col space-y-2 mb-6">
              <a href="mailto:sarena.carolija2025@gmail.com" className="flex items-center justify-center md:justify-end text-gray-300 hover:text-white transition-colors">
                <FaEnvelope className="mr-2" />
                sarena.carolija2025@gmail.com
              </a>
              <a href="tel:+38765905254" className="flex items-center justify-center md:justify-end text-gray-300 hover:text-white transition-colors">
                <FaPhone className="mr-2" />
                +387 65 905 254
              </a>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Zapratite nas na društvenim mrežama i podijelite sa nama vaše ideje</p>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="https://www.facebook.com/sarena.carolija" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="https://www.instagram.com/sarena_carolijaa_/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Šarena Čarolija. Sva prava zadržana.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privatnost
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
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
