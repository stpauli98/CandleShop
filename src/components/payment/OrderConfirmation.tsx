import { Check } from "lucide-react"
import Button from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useNavigate, useLocation } from "react-router-dom"
import { formatCurrency } from "../../utilities/formatCurency"
import { useShoppingCart } from "@/hooks/useShoppingCart"
import { useEffect } from "react"

interface Order {
  orderNumber: string
  items: Array<{
    id: string
    naziv?: string
    cijena?: string
    novaCijena?: string
    quantity: number
    selectedMiris?: string
  }>
  total: number
  paymentMethod: string
  shippingAddress: string
  orderDate: string
  orderStatus: string
  customerEmail?: string
}

interface OrderConfirmationProps {
  order: Order
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useShoppingCart()
  
  useEffect(() => {
    // Clear cart only once when component mounts
    clearCart()
  }, []) // Empty dependency array since we only want this to run once

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p>Narudžba nije pronađena.</p>
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
                    {item.naziv} {item.selectedMiris && `(${item.selectedMiris})`} x{item.quantity}
                  </span>
                  <span>{formatCurrency(Number(item.novaCijena || item.cijena) * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold">
              <span>Ukupno:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Način Plaćanja:</h3>
              <p>{order.paymentMethod === 'card' ? 'Kreditna kartica' : 
                  order.paymentMethod === 'cashOnDelivery' ? 'Plaćanje pri preuzimanju' :
                  order.paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Adresa za Dostavu:</h3>
              <p>{order.shippingAddress}</p>
            </div>
            {order.customerEmail && (
              <div>
                <h3 className="font-semibold mb-2">Email:</h3>
                <p>{order.customerEmail}</p>
              </div>
            )}
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
