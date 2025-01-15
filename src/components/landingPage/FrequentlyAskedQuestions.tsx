import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../../components/ui/accordion"

const faqs = [
  {
    question: "Koliko dugo gore vaše svijeće?",
    answer: "Naše svijeće su dizajnirane da gore dugo i ravnomjerno. Ovisno o veličini, mogu gorjeti između 30-50 sati. Za najbolje rezultate, preporučujemo da prvi put pustite svijeću da gori dok se vosak ne rastopi do rubova (obično 2-3 sata)."
  },
  {
    question: "Koji su sastojci u vašim svijećama?",
    answer: "Koristimo samo najkvalitetnije prirodne sastojke. Naše svijeće su izrađene od 100% sojinog voska, pamučnih fitiljeva i premium esencijalnih ulja. Ne koristimo parafin ili sintetičke mirise, što ih čini sigurnijim i zdravijim za vaš dom."
  },
  {
    question: "Kako mogu produžiti trajanje svijeće?",
    answer: "Za najbolje rezultate, preporučujemo: 1) Prije svakog paljenja skratite fitilj na 6mm, 2) Prvi put pustite svijeću da gori najmanje 2-3 sata, 3) Izbjegavajte propuh koji može uzrokovati neravnomjerno gorenje, 4) Uvijek ugasite svijeću ako plamen postane previsok."
  },
  {
    question: "Nudite li personalizirane svijeće za posebne prilike?",
    answer: "Da! Nudimo uslugu personalizacije svijeća za vjenčanja, godišnjice, rođendane i druge posebne prilike. Možete odabrati miris, boju i dodati personaliziranu poruku ili ime. Kontaktirajte nas za više detalja o ovoj usluzi."
  }
]

const FrequentlyAskedQuestions: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="w-[80%] max-w-[1920px] mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Često postavljena pitanja</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Pronađite odgovore na najčešća pitanja o našim svijećama, njihovoj izradi i održavanju
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <AccordionTrigger className="text-left px-6 hover:no-underline hover:bg-gray-50/50">
                  <span className="text-lg font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Još uvijek imate pitanja?</p>
            <a 
              href="mailto:sarena.carolija2025@gmail.com" 
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors duration-300"
            >
              Kontaktirajte nas
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FrequentlyAskedQuestions
