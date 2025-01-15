import { useState, useEffect } from 'react'
import workshop1 from '../../assets/workshop1.jpg'
import workshop2 from '../../assets/workshop2.jpg'
import workshop3 from '../../assets/workshop3.jpg'
import workshop4 from '../../assets/workshop4.jpg'

const images = [workshop1, workshop2, workshop3, workshop4]

export default function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">O nama</h2>
            <p className="text-lg text-gray-600 mb-4 text-center md:text-left">
              Dobrodošli u našu malu radionicu svijeća, gdje svaka svijeća ima svoju priču. 
              Naša strast prema izradi svijeća počela je kao hobi, a prerasla je u predanu 
              misiju stvaranja jedinstvenih, ručno rađenih svijeća.
            </p>
            <p className="text-lg text-gray-600 mb-4 text-center md:text-left">
              Svaka naša svijeća je pažljivo izrađena s ljubavlju i pažnjom prema detaljima. 
              Koristimo samo najkvalitetnije materijale, od prirodnog sojinog voska do 
              pažljivo odabranih esencijalnih ulja, kako bismo stvorili savršenu atmosferu 
              u vašem domu.
            </p>
            <p className="text-lg text-gray-600 text-center md:text-left">
              Vjerujemo da svijeće mogu transformirati svaki prostor i stvoriti poseban 
              ugođaj. Bilo da tražite savršen poklon ili želite unijeti toplinu u svoj 
              dom, naše svijeće su izrađene za vas.
            </p>
          </div>
          <div className="relative rounded-lg shadow-lg h-[500px] overflow-hidden">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Radionica za izradu svijeća ${index + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
