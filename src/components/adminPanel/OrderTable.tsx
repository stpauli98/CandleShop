import { useEffect, useState } from 'react';
import { Order, getOrders } from '../../lib/firebase/orders';
import OrderDetailsModal from './OrderDetailsModal';
import { error as logError } from '../../lib/logger';

const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err) {
        setError('Error fetching orders');
        logError('Error fetching orders', err, 'ORDERS');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (orders.length === 0) return <div className="p-4">No orders found</div>;

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
              <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
              <td className="py-2 px-4 border-b">
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
      />
    </div>
  );
};

export default OrderTable;
