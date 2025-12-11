import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal-800 mb-4">
            Uslovi Korištenja
          </h1>
          <p className="text-stone-500">
            Posljednje ažuriranje: {new Date().toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-warm p-6 sm:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">1. Opći uslovi</h2>
            <p className="text-stone-600 leading-relaxed">
              Dobrodošli na web stranicu Šarena Čarolija (u daljem tekstu: "mi", "nas" ili "naš").
              Ovi Uslovi korištenja reguliraju vaš pristup i korištenje naše web stranice
              www.sarena-carolija.com te kupovinu proizvoda putem iste.
            </p>
            <p className="text-stone-600 leading-relaxed mt-3">
              Korištenjem naše web stranice ili kupovinom naših proizvoda, potvrđujete da ste
              pročitali, razumjeli i prihvatili ove Uslove korištenja. Ako se ne slažete s bilo
              kojim dijelom ovih uslova, molimo vas da ne koristite našu web stranicu.
            </p>
          </section>

          {/* Products */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">2. Proizvodi</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Šarena Čarolija nudi ručno izrađene svijeće i srodne dekorativne proizvode.
              Svi proizvodi su ručno rađeni, što znači da mogu postojati minimalne varijacije
              u boji, obliku ili veličini između pojedinih primjeraka.
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Slike proizvoda su ilustrativne i mogu se neznatno razlikovati od stvarnog proizvoda</li>
              <li>Nastojimo što preciznije prikazati boje, ali prikaz može varirati ovisno o vašem ekranu</li>
              <li>Zadržavamo pravo izmjene ponude proizvoda bez prethodne najave</li>
            </ul>
          </section>

          {/* Ordering */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">3. Naručivanje</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Narudžba se smatra prihvaćenom nakon što primite potvrdu narudžbe na vašu email adresu.
              Zadržavamo pravo odbiti ili otkazati narudžbu iz sljedećih razloga:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Proizvod nije dostupan</li>
              <li>Nepotpuni ili netačni podaci za dostavu</li>
              <li>Sumnja na zloupotrebu</li>
              <li>Greška u cijeni proizvoda</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              Za uspješnu narudžbu potrebno je unijeti tačne podatke: ime i prezime, adresu za
              dostavu, broj telefona i email adresu.
            </p>
          </section>

          {/* Prices */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">4. Cijene</h2>
            <p className="text-stone-600 leading-relaxed">
              Sve cijene na našoj web stranici iskazane su u konvertibilnim markama (KM) i
              uključuju PDV gdje je primjenjivo. Cijena dostave nije uključena u cijenu
              proizvoda i prikazuje se zasebno prilikom finalizacije narudžbe.
            </p>
            <p className="text-stone-600 leading-relaxed mt-3">
              Zadržavamo pravo izmjene cijena bez prethodne najave. Cijena koja vrijedi za
              vašu narudžbu je ona koja je bila prikazana u trenutku naručivanja.
            </p>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">5. Plaćanje</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Trenutno nudimo sljedeći način plaćanja:
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-stone-700 font-medium">
                Plaćanje pouzećem (gotovina prilikom preuzimanja)
              </p>
              <p className="text-stone-600 text-sm mt-2">
                Plaćate kuriru prilikom dostave vaše narudžbe. Molimo pripremite tačan iznos.
              </p>
            </div>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">6. Dostava</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Dostavu vršimo na području Bosne i Hercegovine putem kurirske službe.
            </p>
            <div className="bg-cream-50 rounded-xl p-5 mb-4">
              <p className="text-stone-600">
                <strong>Cijena dostave:</strong> Prikazuje se prilikom narudžbe ovisno o lokaciji<br />
                <strong>Besplatna dostava:</strong> Za narudžbe iznad određenog iznosa (prikazano na stranici)<br />
                <strong>Rok dostave:</strong> 2-5 radnih dana
              </p>
            </div>
            <p className="text-stone-600 leading-relaxed">
              Rokovi dostave su okvirni i mogu varirati ovisno o dostupnosti proizvoda i
              lokaciji dostave. Nismo odgovorni za kašnjenja uzrokovana kurirskom službom
              ili višom silom.
            </p>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">7. Reklamacije i povrat</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Vaše zadovoljstvo nam je važno. Ako niste zadovoljni primljenim proizvodom,
              molimo vas da nas kontaktirate u roku od 14 dana od prijema.
            </p>
            <p className="text-stone-600 leading-relaxed mb-3">
              <strong>Pravo na reklamaciju imate u sljedećim slučajevima:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Proizvod je oštećen prilikom dostave</li>
              <li>Isporučen je pogrešan proizvod</li>
              <li>Proizvod značajno odstupa od opisa na web stranici</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              <strong>Napomena:</strong> S obzirom na prirodu proizvoda (svijeće i dekoracije),
              ne prihvaćamo povrat proizvoda koji su korišteni ili oštećeni od strane kupca.
              Minimalne razlike u ručno rađenim proizvodima ne predstavljaju osnov za reklamaciju.
            </p>
            <p className="text-stone-600 leading-relaxed mt-3">
              Za sve reklamacije kontaktirajte nas na:{' '}
              <a href="mailto:sarena.carolija2025@gmail.com" className="text-amber-600 hover:text-amber-700">
                sarena.carolija2025@gmail.com
              </a>
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">8. Autorska prava</h2>
            <p className="text-stone-600 leading-relaxed">
              Sav sadržaj na ovoj web stranici, uključujući ali ne ograničavajući se na tekst,
              slike, grafiku, logotipe i dizajn, vlasništvo je Šarena Čarolija ili se koristi
              uz dozvolu vlasnika. Zabranjeno je kopiranje, reprodukcija, distribucija ili
              bilo kakvo korištenje sadržaja bez prethodne pisane dozvole.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">9. Ograničenje odgovornosti</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Šarena Čarolija nije odgovorna za:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Štetu nastalu nepravilnim korištenjem proizvoda</li>
              <li>Indirektnu ili posljedičnu štetu</li>
              <li>Kašnjenja ili nemogućnost dostave uzrokovanu višom silom</li>
              <li>Sadržaj vanjskih web stranica na koje vodimo linkovi</li>
            </ul>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mt-4">
              <p className="text-rose-800 font-medium text-sm">
                ⚠️ Upozorenje o sigurnosti: Svijeće uvijek palite na sigurnoj, vatrostalnoj
                podlozi. Nikada ne ostavljajte upaljenu svijeću bez nadzora. Držite dalje od
                djece, kućnih ljubimaca i zapaljivih materijala.
              </p>
            </div>
          </section>

          {/* Disputes */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">10. Rješavanje sporova</h2>
            <p className="text-stone-600 leading-relaxed">
              U slučaju spora, obje strane će nastojati riješiti spor sporazumno. Ako sporazumno
              rješenje nije moguće, nadležan je sud u Bosni i Hercegovini prema sjedištu prodavca.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">11. Izmjene uslova</h2>
            <p className="text-stone-600 leading-relaxed">
              Zadržavamo pravo izmjene ovih Uslova korištenja u bilo kojem trenutku.
              Izmjene stupaju na snagu odmah po objavi na ovoj stranici. Nastavak korištenja
              naše web stranice nakon objave izmjena znači da prihvatate nove uslove.
            </p>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">12. Mjerodavno pravo</h2>
            <p className="text-stone-600 leading-relaxed">
              Ovi Uslovi korištenja regulirani su i tumače se u skladu sa zakonima Bosne i
              Hercegovine. Korištenjem naše web stranice pristajete na nadležnost sudova
              Bosne i Hercegovine.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">13. Kontakt</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Za sva pitanja u vezi s ovim Uslovima korištenja ili našim uslugama,
              slobodno nas kontaktirajte:
            </p>
            <div className="bg-cream-50 rounded-xl p-5">
              <p className="text-stone-600 leading-relaxed">
                <strong>Šarena Čarolija</strong><br />
                Gradiška, Bosna i Hercegovina<br /><br />
                <strong>Email:</strong>{' '}
                <a href="mailto:sarena.carolija2025@gmail.com" className="text-amber-600 hover:text-amber-700">
                  sarena.carolija2025@gmail.com
                </a><br />
                <strong>Telefon:</strong>{' '}
                <a href="tel:+38765905254" className="text-amber-600 hover:text-amber-700">
                  +387 65 905 254
                </a><br />
                <strong>Web:</strong>{' '}
                <a href="https://www.sarena-carolija.com" className="text-amber-600 hover:text-amber-700">
                  www.sarena-carolija.com
                </a>
              </p>
            </div>
          </section>

          {/* Back Link */}
          <div className="pt-8 border-t border-stone-200">
            <Link
              to="/"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Nazad na početnu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
