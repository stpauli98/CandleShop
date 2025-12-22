import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEO/SEOHead';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Politika Privatnosti"
        description="Politika privatnosti Šarena Čarolija. Saznajte kako prikupljamo, koristimo i štitimo vaše osobne podatke."
        keywords="politika privatnosti, zaštita podataka, GDPR, Šarena Čarolija"
        url="https://www.sarenacarolija.com/privacy-policy"
      />
      <div className="min-h-screen bg-cream-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal-800 mb-4">
            Politika Privatnosti
          </h1>
          <p className="text-stone-500">
            Posljednje ažuriranje: {new Date().toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-warm p-6 sm:p-10 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">1. Uvod</h2>
            <p className="text-stone-600 leading-relaxed">
              Dobrodošli na web stranicu Šarena Čarolija. Vaša privatnost nam je izuzetno važna.
              Ova Politika privatnosti objašnjava kako prikupljamo, koristimo, obrađujemo i štitimo
              vaše osobne podatke kada koristite našu web stranicu i usluge.
            </p>
            <p className="text-stone-600 leading-relaxed mt-3">
              Korištenjem naše web stranice i usluga, slažete se sa prikupljanjem i korištenjem
              informacija u skladu sa ovom Politikom privatnosti.
            </p>
          </section>

          {/* Company Info */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">2. Ko smo mi</h2>
            <div className="bg-cream-50 rounded-xl p-5">
              <p className="text-stone-600 leading-relaxed">
                <strong>Šarena Čarolija</strong><br />
                Gradiška, Bosna i Hercegovina<br />
                Email: sarena.carolija2025@gmail.com<br />
                Telefon: +387 65 905 254<br />
                Web: <a href="https://www.sarena-carolija.com" className="text-amber-600 hover:text-amber-700">www.sarena-carolija.com</a>
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">3. Koje podatke prikupljamo</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Prikupljamo sljedeće osobne podatke kada izvršite narudžbu ili komunicirate s nama:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Ime i prezime</li>
              <li>Email adresa</li>
              <li>Broj telefona</li>
              <li>Adresa za dostavu (ulica, broj, poštanski broj, grad)</li>
              <li>Podaci o narudžbi (proizvodi, količine, cijene)</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              <strong>Automatski prikupljeni podaci:</strong> Kada posjećujete našu web stranicu,
              automatski prikupljamo određene informacije o vašem uređaju, uključujući IP adresu,
              tip preglednika, vrijeme pristupa i stranice koje ste posjetili.
            </p>
          </section>

          {/* Purpose */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">4. Zašto prikupljamo vaše podatke</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Vaše osobne podatke koristimo u sljedeće svrhe:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li>Obrada i isporuka vaših narudžbi</li>
              <li>Komunikacija u vezi s narudžbama (potvrde, ažuriranja o dostavi)</li>
              <li>Pružanje korisničke podrške</li>
              <li>Poboljšanje naše web stranice i usluga</li>
              <li>Slanje promotivnih materijala (samo uz vašu saglasnost)</li>
              <li>Ispunjavanje zakonskih obaveza</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">5. Kolačići (Cookies)</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Naša web stranica koristi kolačiće za poboljšanje vašeg korisničkog iskustva.
              Kolačići su male tekstualne datoteke koje se pohranjuju na vašem uređaju.
            </p>
            <p className="text-stone-600 leading-relaxed mb-3">
              <strong>Koristimo sljedeće vrste kolačića:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li><strong>Neophodni kolačići:</strong> Potrebni za funkcioniranje web stranice (npr. korpa za kupovinu)</li>
              <li><strong>Analitički kolačići:</strong> Pomažu nam razumjeti kako posjetitelji koriste stranicu</li>
              <li><strong>Funkcionalni kolačići:</strong> Pamte vaše preferencije za bolje korisničko iskustvo</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              Možete podesiti svoj preglednik da odbije kolačiće, ali to može utjecati na
              funkcionalnost određenih dijelova naše web stranice.
            </p>
          </section>

          {/* Third Parties */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">6. Dijeljenje podataka s trećim stranama</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Vaše podatke dijelimo samo kada je to neophodno za pružanje naših usluga:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li><strong>Kurirske službe:</strong> Za isporuku vaših narudžbi (ime, adresa, telefon)</li>
              <li><strong>Pravne obaveze:</strong> Ako to zahtijeva zakon ili pravni postupak</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              Ne prodajemo, ne iznajmljujemo niti na drugi način ne dijelimo vaše osobne podatke
              s trećim stranama u marketinške svrhe.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">7. Sigurnost podataka</h2>
            <p className="text-stone-600 leading-relaxed">
              Preduzimamo odgovarajuće tehničke i organizacijske mjere za zaštitu vaših osobnih
              podataka od neovlaštenog pristupa, gubitka, uništenja ili izmjene. Međutim, nijedan
              način prijenosa putem interneta ili elektronskog pohranjivanja nije 100% siguran,
              pa ne možemo garantovati apsolutnu sigurnost.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">8. Čuvanje podataka</h2>
            <p className="text-stone-600 leading-relaxed">
              Vaše osobne podatke čuvamo onoliko dugo koliko je potrebno za ispunjenje svrha
              opisanih u ovoj Politici privatnosti, osim ako duže čuvanje nije zahtijevano ili
              dozvoljeno zakonom (npr. za porezne i računovodstvene svrhe).
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">9. Vaša prava</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Imate sljedeća prava u vezi s vašim osobnim podacima:
            </p>
            <ul className="list-disc list-inside space-y-2 text-stone-600 ml-4">
              <li><strong>Pravo pristupa:</strong> Možete zatražiti kopiju podataka koje imamo o vama</li>
              <li><strong>Pravo na ispravak:</strong> Možete zatražiti ispravak netačnih podataka</li>
              <li><strong>Pravo na brisanje:</strong> Možete zatražiti brisanje vaših podataka</li>
              <li><strong>Pravo na prigovor:</strong> Možete se usprotiviti obradi vaših podataka</li>
              <li><strong>Pravo na prenosivost:</strong> Možete zatražiti prijenos vaših podataka</li>
            </ul>
            <p className="text-stone-600 leading-relaxed mt-4">
              Za ostvarivanje bilo kojeg od ovih prava, kontaktirajte nas putem emaila:
              <a href="mailto:sarena.carolija2025@gmail.com" className="text-amber-600 hover:text-amber-700 ml-1">
                sarena.carolija2025@gmail.com
              </a>
            </p>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">10. Privatnost djece</h2>
            <p className="text-stone-600 leading-relaxed">
              Naša web stranica nije namijenjena djeci mlađoj od 16 godina. Svjesno ne prikupljamo
              osobne podatke od djece. Ako ste roditelj ili staratelj i vjerujete da nam je vaše
              dijete pružilo osobne podatke, molimo kontaktirajte nas kako bismo mogli poduzeti
              odgovarajuće mjere.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">11. Izmjene Politike privatnosti</h2>
            <p className="text-stone-600 leading-relaxed">
              Zadržavamo pravo izmjene ove Politike privatnosti u bilo kojem trenutku. Sve izmjene
              bit će objavljene na ovoj stranici s ažuriranim datumom. Preporučujemo da povremeno
              provjerite ovu stranicu za eventualne izmjene.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-charcoal-800 mb-4">12. Kontakt</h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              Ako imate bilo kakvih pitanja o ovoj Politici privatnosti ili načinu na koji
              obrađujemo vaše podatke, slobodno nas kontaktirajte:
            </p>
            <div className="bg-cream-50 rounded-xl p-5">
              <p className="text-stone-600">
                <strong>Email:</strong>{' '}
                <a href="mailto:sarena.carolija2025@gmail.com" className="text-amber-600 hover:text-amber-700">
                  sarena.carolija2025@gmail.com
                </a>
              </p>
              <p className="text-stone-600 mt-2">
                <strong>Telefon:</strong>{' '}
                <a href="tel:+38765905254" className="text-amber-600 hover:text-amber-700">
                  +387 65 905 254
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
    </>
  );
};

export default PrivacyPolicy;
