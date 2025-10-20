import Button from '../ui/button'

export default function CallToAction() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Spremni da unesete toplinu u svoj dom?
        </h2>
        <p className="mt-4 text-xl">
          Pridružite se našoj mailing listi i dobijte 10% popusta na prvu narudžbu!
        </p>
        <form className="mt-8 sm:flex justify-center">
          <input
            type="email"
            required
            className="w-full px-5 py-3 text-base text-gray-900 placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent sm:max-w-xs"
            placeholder="Unesite vašu email adresu"
          />
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
            <Button type="submit" size="lg">
              Pretplatite se
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
