import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/firebase/orders';
import OrderDetailsModal from './OrderDetailsModal';
import { error as logError } from '../../lib/logger';

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
          setError('Error processing orders');
          logError('Error processing orders', err, 'ORDERS');
          setLoading(false);
        }
      },
      (err) => {
        setError('Error fetching orders');
        logError('Error fetching orders', err, 'ORDERS');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="p-4">No orders found</div>;

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Na čekanju', color: 'bg-yellow-100 text-yellow-800' },
      processing: { label: 'U obradi', color: 'bg-blue-100 text-blue-800' },
      shipped: { label: 'Poslato', color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Dostavljeno', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Otkazano', color: 'bg-red-100 text-red-800' }
    };
    const config = statusConfig[status];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Broj narudžbe</th>
            <th className="py-2 px-4 border-b">Ime i prezime</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Adresa</th>
            <th className="py-2 px-4 border-b">Telefon</th>
            <th className="py-2 px-4 border-b">Ukupno</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Način plaćanja</th>
            <th className="py-2 px-4 border-b">Detalji</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderNumber} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{order.orderNumber}</td>
              <td className="py-2 px-4 border-b">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</td>
              <td className="py-2 px-4 border-b">{order.customerEmail}</td>
              <td className="py-2 px-4 border-b">{order.shippingInfo.street} {order.shippingInfo.houseNumber}, {order.shippingInfo.city} {order.shippingInfo.postalCode}</td>
              <td className="py-2 px-4 border-b">{order.shippingInfo.phone}</td>
              <td className="py-2 px-4 border-b">{order.total.toFixed(2)} KM</td>
              <td className="py-2 px-4 border-b text-center">{getStatusBadge(order.status)}</td>
              <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsModalOpen(true);
                  }}
                >
                  Prikaži
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal za prikaz detalja */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onOrderUpdated={(updatedOrder) => {
          // Update the order in the list
          setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          setSelectedOrder(updatedOrder);
        }}
      />
    </div>
  );
};

export default OrderTable;
