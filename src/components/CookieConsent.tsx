import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Check, Settings } from 'lucide-react';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0';

interface ConsentState {
  analytics: boolean;
  version: string;
  timestamp: number;
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(CONSENT_KEY);

    if (storedConsent) {
      try {
        const consent: ConsentState = JSON.parse(storedConsent);
        // Check if consent version matches and is not expired (1 year)
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        const isValid = consent.version === CONSENT_VERSION &&
                       (Date.now() - consent.timestamp) < oneYear;

        if (isValid) {
          if (consent.analytics) {
            enableAnalytics();
          }
          return; // Don't show banner if valid consent exists
        }
      } catch {
        // Invalid consent data, show banner
      }
    }

    // Show banner after a small delay for better UX
    const timer = setTimeout(() => setShowBanner(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const enableAnalytics = () => {
    // Initialize GA4 if not already done
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'G-CS3VSD0XT6', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });

      // Load GA script dynamically
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CS3VSD0XT6';
      script.async = true;
      document.head.appendChild(script);
    }
  };

  const saveConsent = (analytics: boolean) => {
    const consent: ConsentState = {
      analytics,
      version: CONSENT_VERSION,
      timestamp: Date.now()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));

    if (analytics) {
      enableAnalytics();
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent(true);
  };

  const rejectAll = () => {
    saveConsent(false);
  };

  const savePreferences = () => {
    saveConsent(analyticsConsent);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
          {!showSettings ? (
            // Main Banner
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-charcoal-800 text-lg mb-2">
                    Koristimo kolačiće
                  </h3>
                  <p className="text-stone-600 text-sm mb-4">
                    Koristimo kolačiće za poboljšanje vašeg iskustva i analitiku.
                    Možete prihvatiti sve ili prilagoditi svoje preference.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      <Check className="w-4 h-4" />
                      Prihvati sve
                    </button>
                    <button
                      onClick={rejectAll}
                      className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Odbij sve
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors text-sm font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Podešavanja
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-charcoal-800 text-lg">
                  Podešavanja kolačića
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Essential Cookies - Always on */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-charcoal-800">Neophodni kolačići</h4>
                    <p className="text-sm text-stone-500">Potrebni za funkcioniranje stranice</p>
                  </div>
                  <div className="w-12 h-6 bg-amber-500 rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-charcoal-800">Analitički kolačići</h4>
                    <p className="text-sm text-stone-500">Pomažu nam razumjeti kako koristite stranicu</p>
                  </div>
                  <button
                    onClick={() => setAnalyticsConsent(!analyticsConsent)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      analyticsConsent ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors text-sm font-medium"
                >
                  Odbij sve
                </button>
                <button
                  onClick={savePreferences}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  Sačuvaj preference
                </button>
              </div>
            </div>
          )}

          {/* Privacy Policy Link */}
          <div className="px-4 md:px-6 py-3 bg-stone-50 border-t border-stone-100">
            <a
              href="/privacy-policy"
              className="text-sm text-amber-600 hover:text-amber-700 hover:underline"
            >
              Pročitajte našu politiku privatnosti
            </a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
