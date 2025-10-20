import { Check, Loader2 } from "lucide-react"
import Button from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useNavigate, useParams } from "react-router-dom"
import { formatCurrency } from "../../utilities/formatCurency"
import { useEffect, useState } from "react"
import { getOrderById, Order } from "../../lib/firebase/orders"
import toast from "react-hot-toast"

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("ID narudžbe nije pronađen")
        setLoading(false)
        return
      }

      try {
        const fetchedOrder = await getOrderById(orderId)
        if (!fetchedOrder) {
          setError("Narudžba nije pronađena")
        } else {
          setOrder(fetchedOrder)
        }
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Greška pri učitavanju narudžbe")
        toast.error("Nije moguće učitati podatke o narudžbi")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-amber-600" />
            <p className="text-gray-600">Učitavanje narudžbe...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">{error || "Narudžba nije pronađena."}</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4"
            >
              Nazad na Početnu
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Narudžba Potvrđena</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            Hvala vam na kupovini! Broj vaše narudžbe je <span className="font-semibold">{order.orderNumber}</span>.
          </p>
          <div className="space-y-4">
            <h3 className="font-semibold">Detalji Narudžbe:</h3>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>
                    {item.naziv} {item.selectedMiris && item.selectedBoja ?
                      `(${item.selectedMiris}, ${item.selectedBoja})` :
                      item.selectedMiris ? `(${item.selectedMiris})` :
                      item.selectedBoja ? `(${item.selectedBoja})` : ''} x{item.kolicina}
                  </span>
                  <span>{formatCurrency(Number(item.cijena) * item.kolicina)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Međuzbroj:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Dostava:</span>
                <span>{order.shippingCost === 0 ? 'Besplatno' : formatCurrency(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Ukupno za plaćanje:</span>
                <span>{formatCurrency(order.total + order.shippingCost)}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <h3 className="font-semibold mb-2">Način Plaćanja:</h3>
                <p className="text-gray-700">Plaćanje pouzećem</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Kontakt Informacije:</h3>
                <p className="text-gray-700">Tel: {order.shippingInfo.phone}</p>
                <p className="text-gray-700">Email: {order.customerEmail}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Adresa za Dostavu:</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                  <p className="text-gray-700">{order.shippingInfo.street} {order.shippingInfo.houseNumber}</p>
                  <p className="text-gray-700">{order.shippingInfo.postalCode} {order.shippingInfo.city}</p>
                  {order.shippingInfo.additionalInfo && (
                    <p className="mt-2 text-gray-600 text-sm">
                      Napomena: {order.shippingInfo.additionalInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            Nazad na Početnu
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
