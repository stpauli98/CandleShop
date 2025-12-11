import { motion } from 'framer-motion';
import { Mail, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface FAQProps {
  path?: string;
}

const faqs = [
  {
    question: 'Koliko dugo gore vaše svijeće?',
    answer:
      'Naše svijeće su dizajnirane da gore dugo i ravnomjerno. Ovisno o veličini, mogu gorjeti između 30-50 sati. Za najbolje rezultate, preporučujemo da prvi put pustite svijeću da gori dok se vosak ne rastopi do rubova (obično 2-3 sata).',
  },
  {
    question: 'Koji su sastojci u vašim svijećama?',
    answer:
      'Koristimo samo najkvalitetnije prirodne sastojke. Naše svijeće su izrađene od 100% sojinog voska, pamučnih fitiljeva i premium esencijalnih ulja. Ne koristimo parafin ili sintetičke mirise, što ih čini sigurnijim i zdravijim za vaš dom.',
  },
  {
    question: 'Kako mogu produžiti trajanje svijeće?',
    answer:
      'Za najbolje rezultate, preporučujemo: 1) Prije svakog paljenja skratite fitilj na 6mm, 2) Prvi put pustite svijeću da gori najmanje 2-3 sata, 3) Izbjegavajte propuh koji može uzrokovati neravnomjerno gorenje, 4) Uvijek ugasite svijeću ako plamen postane previsok.',
  },
  {
    question: 'Nudite li personalizirane svijeće za posebne prilike?',
    answer:
      'Da! Nudimo uslugu personalizacije svijeća za vjenčanja, godišnjice, rođendane i druge posebne prilike. Možete odabrati miris, boju i dodati personaliziranu poruku ili ime. Kontaktirajte nas za više detalja o ovoj usluzi.',
  },
];

const FrequentlyAskedQuestions = ({ path }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={path?.replace('/', '') || 'faq'} className="py-20 md:py-28 bg-charcoal-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber-500" />
            <span className="text-amber-400 text-sm font-medium tracking-wider uppercase">
              FAQ
            </span>
            <div className="w-12 h-px bg-amber-500" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Često postavljena{' '}
            <span className="text-gradient-warm">pitanja</span>
          </h2>
          <p className="text-lg text-stone-400 max-w-2xl mx-auto">
            Pronađite odgovore na najčešća pitanja o našim svijećama, njihovoj izradi i održavanju
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div
                className={`bg-charcoal-800/50 border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'border-amber-500/50 shadow-glow-sm'
                    : 'border-charcoal-700 hover:border-charcoal-600'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-display text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-amber-500 text-charcoal-900'
                      : 'bg-charcoal-700 text-stone-400'
                  }`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-0">
                    <div className="h-px bg-charcoal-700 mb-4" />
                    <p className="text-stone-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-charcoal-800/50 rounded-2xl border border-charcoal-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-white font-medium mb-1">Još uvijek imate pitanja?</p>
              <p className="text-stone-500 text-sm">Slobodno nas kontaktirajte, rado ćemo vam pomoći!</p>
            </div>
            <a
              href="mailto:sarena.carolija2025@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-charcoal-900 font-semibold rounded-full shadow-warm transition-all duration-300 hover:-translate-y-0.5"
            >
              Kontaktirajte nas
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
