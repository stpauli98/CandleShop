import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/firebase/orders';
import OrderDetailsModal from './OrderDetailsModal';
import { error as logError } from '../../lib/logger';
import { getStatusConfig, type OrderStatus } from '@/lib/constants/admin';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { LoadingSpinner } from './shared/LoadingStates';
import TableEmptyState from './shared/TableEmptyState';

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        try {
          const ordersData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
              updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
            } as Order;
          });

          setOrders(ordersData);
          setError(null);
          setLoading(false);
        } catch (err) {
          setError('Greška pri obradi narudžbi');
          logError('Error processing orders', err as Record<string, unknown>, 'ORDERS');
          setLoading(false);
        }
      },
      (err) => {
        setError('Greška pri učitavanju narudžbi');
        logError('Error fetching orders', err as unknown as Record<string, unknown>, 'ORDERS');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: Order['status']) => {
    const config = getStatusConfig(status as OrderStatus);
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Učitavanje narudžbi..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <TableEmptyState
        icon={ShoppingBag}
        title="Nema narudžbi"
        description="Kada kupci naprave narudžbe, prikazat će se ovdje."
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broj narudžbe
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kupac
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ukupno
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plaćanje
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.orderNumber} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-600">{order.orderNumber}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{order.customerEmail}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {order.total.toFixed(2)} KM
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600 capitalize">
                    {order.paymentMethod === 'pouzecem' ? 'Pouzećem' : order.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    Detalji
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid gap-4">
        {orders.map((order) => (
          <div
            key={order.orderNumber}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-gray-500">{order.orderNumber}</span>
                {getStatusBadge(order.status)}
              </div>
              <span className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} KM</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Kupac:</span>
                <p className="font-medium">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium break-all">{order.customerEmail}</p>
              </div>
              <div>
                <span className="text-gray-500">Adresa:</span>
                <p className="font-medium">{order.shippingInfo.street} {order.shippingInfo.houseNumber}, {order.shippingInfo.city} {order.shippingInfo.postalCode}</p>
              </div>
              <div>
                <span className="text-gray-500">Telefon:</span>
                <p className="font-medium">{order.shippingInfo.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">Plaćanje:</span>
                <p className="font-medium capitalize">{order.paymentMethod === 'pouzecem' ? 'Pouzećem' : order.paymentMethod}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsModalOpen(true);
                }}
              >
                Prikaži detalje
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal za prikaz detalja */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onOrderUpdated={(updatedOrder) => {
          setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          setSelectedOrder(updatedOrder);
        }}
      />
    </div>
  );
};

export default OrderTable;
