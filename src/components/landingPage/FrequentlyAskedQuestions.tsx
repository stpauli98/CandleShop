import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';

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

const FrequentlyAskedQuestions: React.FC<FAQProps> = ({ ...props }: FAQProps) => {
  return (
    <section id={props.path?.replace('/', '')} className="bg-gradient-to-b from-purple-50 to-orange-50 py-16">
      <div className="w-[90%] max-w-[1200px] mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
            Često postavljena pitanja
          </h2>
          <p className="text-lg text-gray-700 mb-10">
            Pronađite odgovore na najčešća pitanja o našim svijećama, njihovoj izradi i održavanju.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-lg font-medium transition-colors text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Još uvijek imate pitanja?</p>
          <a
            href="mailto:sarena.carolija2025@gmail.com"
            className="inline-block bg-gradient-to-r from-purple-600 to-orange-400 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-orange-500 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Kontaktirajte nas
          </a>
        </div>
      </div>
    </section>
  );
};

export default FrequentlyAskedQuestions;
