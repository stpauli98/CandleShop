import { Truck, Heart, Sparkles, Leaf } from 'lucide-react'

const advantages = [
  {
    icon: Truck,
    title: 'Besplatna dostava',
    description: 'Za narudžbe iznad 50 KM'
  },
  {
    icon: Heart,
    title: 'Ručno izrađeno',
    description: 'Svaka svijeća je jedinstvena'
  },
  {
    icon: Sparkles,
    title: 'Premium kvaliteta',
    description: 'Najbolji prirodni materijali'
  },
  {
    icon: Leaf,
    title: 'Eco-friendly',
    description: '100% prirodni sastojci'
  }
]

export default function Advantages() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Zašto odabrati nas?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <advantage.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{advantage.title}</h3>
              <p className="text-gray-600 text-center">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
