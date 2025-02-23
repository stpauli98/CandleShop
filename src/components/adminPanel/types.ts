export interface Product {
  id: string
  naziv: string      // Obavezno
  cijena: string     // Obavezno
  slika?: string     // Opcionalno
  opis?: string      // Opcionalno
  popust: number     // Obavezno (default: 0)
  dostupnost: boolean // Obavezno (default: true)
  kategorija: string  // Obavezno
}
  
  