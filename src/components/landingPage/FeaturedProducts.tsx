import { onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { candleCollection } from '../../lib/controller'
import { useEffect, useState } from 'react'

interface Product {
  id ?: string
  cijena ?: string
  naziv ?: string
  novaCijena ?: string
  slika ?: string
  opis ?: string            
}



export default function FeaturedProducts() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => onSnapshot(candleCollection, 
        (snapshot: QuerySnapshot<DocumentData>) => {
            const allProducts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Svi", allProducts);
            setProducts(allProducts);
        }), []);
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Istaknuti proizvodi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map((product) => (
    <Link to={`/proizvod/${product.id}`} key={product.id} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
        <img
          src={product.slika}
          alt={product.naziv}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{product.naziv}</h3>
          <p className="mt-2 text-gray-600">{product.cijena} KM</p>
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>
    </section>
  )
}