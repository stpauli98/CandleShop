import { Link } from 'react-router-dom'
import Button from '../ui/button'
import landingPic from '../../assets/landing_pic.jpg'

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white">
      <img
        src={landingPic}
        alt="Svijeće u mraku"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
          Otkrijte magiju naših ručno rađenih svijeća
        </h1>
        <p className="mt-6 text-xl">
          Unesite toplinu i miris u svoj dom sa našom kolekcijom pažljivo izrađenih svijeća
        </p>
        <div className="mt-10">
          <Button size="lg" asLink="/proizvodi">
            Istražite kolekciju
          </Button>
        </div>
      </div>
    </section>
  )
}
