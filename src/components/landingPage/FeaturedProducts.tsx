import React from 'react';
import { collections } from '../../lib/controller';
import ProductGrid from '../sharedComponents/ProductGrid';

const FeaturedProducts: React.FC = () => {
  return (
    <div id="featured-products" className="py-12 bg-gradient-to-b from-purple-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Izdvojeni Proizvodi
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Pogledajte našu posebno odabranu kolekciju svijeća
          </p>
        </div>

        <div className="mt-10">
          <ProductGrid 
            category="featured"
            bgColor="bg-white"
            buttonColor="text-purple-600"
            collectionName={collections.omiljeniProizvodi()}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
