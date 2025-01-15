import React from 'react'
import { motion } from 'framer-motion'

export default function CandleDescription() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-purple-800 text-center">O Našim Svijećama</h2>
      <div className="space-y-4 text-gray-600 text-center">
        <p>
          Naše ručno izrađene svijeće su rezultat pažljivog odabira najkvalitetnijih materijala i predanog rada. 
          Svaka svijeća je jedinstveno umjetničko djelo, izrađeno s ljubavlju i pažnjom prema detaljima.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Prirodni Materijali</h3>
            <p className="text-sm">
              Koristimo 100% prirodni sojin vosak i pamučne fitilje, što osigurava čisto i dugotrajno gorenje.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Ručna Izrada</h3>
            <p className="text-sm">
              Svaka svijeća je ručno izlivena i dekorirana, što garantira jedinstveni izgled i kvalitetu.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">Dugotrajnost</h3>
            <p className="text-sm">
              Naše svijeće gore duže i ravnomjernije, pružajući do 50 sati ugodnog ambijenta.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
