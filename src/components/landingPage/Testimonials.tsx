interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  imageUrl: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ana Marić",
    role: "Redovni kupac",
    content: "Svijeće su prekrasne i mirisi su nevjerovatni. Svaka koju sam kupila je bila savršena za stvaranje ugodne atmosfere u mom domu.",
    imageUrl: "/testimonials/ana.jpg"
  },
  {
    id: 2,
    name: "Marko Kovač",
    role: "Ljubitelj svijeća",
    content: "Kvaliteta ovih svijeća je izvanredna. Dugo gore i miris se lijepo širi kroz cijelu prostoriju. Definitivno ću opet kupovati.",
    imageUrl: "/testimonials/marko.jpg"
  },
  {
    id: 3,
    name: "Sara Novak",
    role: "Interior dizajner",
    content: "Kao dizajner interijera, često preporučujem ove svijeće svojim klijentima. Kvaliteta i dizajn su na najvišem nivou.",
    imageUrl: "/testimonials/sara.jpg"
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Što kažu naši kupci</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}