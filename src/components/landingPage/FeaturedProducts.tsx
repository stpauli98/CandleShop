import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collections } from '../../lib/controller';
import { getDocs } from 'firebase/firestore';
import ProductGrid from '../sharedComponents/ProductGrid';
import type { Product } from '../../types/product';
import { error } from '../../lib/logger';

const FeaturedProducts = () => {
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
      } catch (err) {
        error('Error fetching products', err as Record<string, unknown>, 'PRODUCTS');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <section id="featured-products" className="py-20 md:py-28 section-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-amber-200"></div>
              <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="text-stone-500">Učitavanje proizvoda...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-20 md:py-28 section-warm relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
            Naša kolekcija
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-800 mb-4">
            Svi naši{' '}
            <span className="text-gradient-warm">proizvodi</span>
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Kompletna kolekcija ručno izrađenih svijeća, voskova i dekoracija za vaš dom
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ProductGrid
            category="all"
            collectionName={collections.omiljeniProizvodi()}
            manualProducts={allProducts}
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-2xl shadow-warm border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-charcoal-700 font-medium">Svi proizvodi su na stanju</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-stone-200" />
            <a
              href="mailto:sarena.carolija2025@gmail.com"
              className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              Posebna narudžba? Kontaktirajte nas
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
