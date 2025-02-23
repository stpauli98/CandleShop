import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import imageCompression from 'browser-image-compression'

export async function uploadImage(file: File): Promise<string> {
  // Provjeri da li je korisnik prijavljen
  if (!auth.currentUser) {
    throw new Error('Morate biti prijavljeni da bi uploadali slike')
  }

  try {
    // Provjeri tip fajla
    if (!file.type.startsWith('image/')) {
      throw new Error('Možete uploadati samo slike')
    }

    // Kompresiraj sliku
    const options = {
      maxSizeMB: 0.5, // max 500KB
      maxWidthOrHeight: 1024,
      useWebWorker: true
    }

    console.log('Compressing image...')
    const compressedFile = await imageCompression(file, options)
    console.log(`Compressed from ${file.size} to ${compressedFile.size} bytes`)

    // Konvertuj kompresovanu sliku u Base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        resolve(base64)
      }
      reader.onerror = () => reject(new Error('Greška pri čitanju fajla'))
      reader.readAsDataURL(compressedFile)
    })

    // Provjeri veličinu Base64 stringa (max 900KB za Firestore limit)
    if (base64.length > 900 * 1024) {
      throw new Error('Slika je i dalje prevelika nakon kompresije')
    }

    // Kreiraj dokument u Firestore
    const imageDoc = await addDoc(collection(db, 'images'), {
      name: file.name,
      type: compressedFile.type,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      uploadedBy: auth.currentUser.email,
      uploadedAt: new Date().toISOString(),
      data: base64
    })

    // Vrati Base64 string
    return base64
  } catch (error) {
    console.error('Error in uploadImage:', error)
    throw new Error('Greška pri uploadu slike')
  }
}
