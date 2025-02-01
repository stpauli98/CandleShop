import React from 'react';
import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
}

interface ProductDescriptionProps {
  title: string;
  description: string;
  features: Feature[];
  bgColor?: string;
  textColor?: string;
}

export default function ProductDescription({
  title,
  description,
  features,
  bgColor = "bg-gradient-to-b from-purple-50 to-orange-50",
  textColor = "text-purple-800"
}: ProductDescriptionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`${bgColor} w-full`}
    >
      <div className="max-w-7xl mx-auto p-8">
        <h2 className={`text-3xl font-bold mb-6 ${textColor} text-center bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent`}>
          {title}
        </h2>
        <div className="space-y-6 text-gray-700 text-center">
          <p className="text-lg">{description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className={`font-semibold text-lg ${textColor} mb-3 text-center`}>{feature.title}</h3>
                <p className="text-sm text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
