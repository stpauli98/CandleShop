import React from 'react'
import CandleDescription from '../components/svijece/CandleDescription'
import FeaturedProduct from '../components/landingPage/FeaturedProducts'

export default function Svijece() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CandleDescription />
      <FeaturedProduct />
    </div>
  )
}