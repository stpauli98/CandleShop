import React, { useEffect, useState } from 'react';
import { collections } from '../../lib/controller';
import { getDocs } from 'firebase/firestore';
import ProductGrid from '../sharedComponents/ProductGrid';
import type { Product } from '../../types/product';

const FeaturedProducts: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        // Fetch products from all collections
        const [
          omiljeniSnapshot,
          svijeceSnapshot,
          mirisneSvijeceSnapshot,
          mirisniVoskoviSnapshot,
          dekoracijeSnapshot
        ] = await Promise.all([
          getDocs(collections.omiljeniProizvodi()),
          getDocs(collections.svijece()),
          getDocs(collections.mirisneSvijece()),
          getDocs(collections.mirisniVoskovi()),
          getDocs(collections.dekoracije())
        ]);

        // Combine all products into a single array
        const products: Product[] = [
          ...omiljeniSnapshot.docs.map(doc => {
            const data = doc.data();
            // Map ONLY the fields we need - ignore extra fields like stock, rating, etc.
            return {
              id: doc.id,
              naziv: data.naziv || '',
              cijena: data.cijena || data.price || data.Price || '',
              slika: data.slika || '',
              opis: data.opis || '',
              popust: data.popust ? Number(data.popust) : 0,
              dostupnost: data.dostupnost ?? true,
              kategorija: data.kategorija || '',
            } as Product;
          }),
          ...svijeceSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              naziv: data.naziv || '',
              cijena: data.cijena || data.price || data.Price || '',
              slika: data.slika || '',
              opis: data.opis || '',
              popust: data.popust ? Number(data.popust) : 0,
              dostupnost: data.dostupnost ?? true,
              kategorija: data.kategorija || '',
            } as Product;
          }),
          ...mirisneSvijeceSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              naziv: data.naziv || '',
              cijena: data.cijena || data.price || data.Price || '',
              slika: data.slika || '',
              opis: data.opis || '',
              popust: data.popust ? Number(data.popust) : 0,
              dostupnost: data.dostupnost ?? true,
              kategorija: data.kategorija || '',
            } as Product;
          }),
          ...mirisniVoskoviSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              naziv: data.naziv || '',
              cijena: data.cijena || data.price || data.Price || '',
              slika: data.slika || '',
              opis: data.opis || '',
              popust: data.popust ? Number(data.popust) : 0,
              dostupnost: data.dostupnost ?? true,
              kategorija: data.kategorija || '',
            } as Product;
          }),
          ...dekoracijeSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              naziv: data.naziv || '',
              cijena: data.cijena || data.price || data.Price || '',
              slika: data.slika || '',
              opis: data.opis || '',
              popust: data.popust ? Number(data.popust) : 0,
              dostupnost: data.dostupnost ?? true,
              kategorija: data.kategorija || '',
            } as Product;
          })
        ];

        // Remove duplicates based on product ID
        const uniqueProducts = Array.from(
          new Map(products.map(product => [product.id, product])).values()
        );

        setAllProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <div id="featured-products" className="py-12 bg-gradient-to-b from-purple-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Učitavanje proizvoda...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="featured-products" className="py-12 bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Svi Naši Proizvodi
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Kompletna kolekcija ručno izrađenih svijeća, voskova i dekoracija
          </p>
        </div>

        <div className="mt-10">
          <ProductGrid
            category="all"
            bgColor="bg-white"
            buttonColor="text-purple-600"
            collectionName={collections.omiljeniProizvodi()} // This will be overridden by manualProducts
            manualProducts={allProducts}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
