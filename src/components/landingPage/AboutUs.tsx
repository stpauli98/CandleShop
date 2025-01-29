import { useState, useEffect } from 'react';
import workshop1 from '../../assets/AboutUsPic/workshop1.jpg';
import workshop2 from '../../assets/AboutUsPic/workshop2.jpg';
import workshop3 from '../../assets/AboutUsPic/workshop3.jpg';
import workshop4 from '../../assets/AboutUsPic/workshop4.jpg';

const images = [workshop1, workshop2, workshop3, workshop4];

export default function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent mb-6 text-center lg:text-left">
              O nama
            </h2>
            <p className="text-lg text-gray-700 mb-4 text-center lg:text-left">
              Dobrodošli u našu malu radionicu svijeća, gdje svaka svijeća ima svoju priču.
              Naša strast prema izradi svijeća počela je kao hobi, a prerasla je u predanu
              misiju stvaranja jedinstvenih, ručno rađenih svijeća.
            </p>
            <p className="text-lg text-gray-700 mb-4 text-center lg:text-left">
              Svaka naša svijeća je pažljivo izrađena s ljubavlju i pažnjom prema detaljima.
              Koristimo samo najkvalitetnije materijale, od prirodnog sojinog voska do
              pažljivo odabranih esencijalnih ulja, kako bismo stvorili savršenu atmosferu
              u vašem domu.
            </p>
            <p className="text-lg text-gray-700 text-center lg:text-left">
              Vjerujemo da svijeće mogu transformirati svaki prostor i stvoriti poseban
              ugođaj. Bilo da tražite savršen poklon ili želite unijeti toplinu u svoj
              dom, naše svijeće su izrađene za vas.
            </p>
          </div>
          <div className="relative rounded-lg shadow-lg h-[500px] overflow-hidden">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Radionica za izradu svijeća ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentImageIndex === index ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
