import { Truck, Heart, Sparkles, Leaf } from 'lucide-react';

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
];

export default function Advantages() {
  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
          Zašto odabrati nas?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-4 bg-gradient-to-r from-purple-200 to-orange-200 rounded-full mb-4">
                <advantage.icon className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {advantage.title}
              </h3>
              <p className="text-gray-600 text-center text-sm">
                {advantage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
