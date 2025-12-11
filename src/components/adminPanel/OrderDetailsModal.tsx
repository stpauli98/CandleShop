import React from 'react';
import { Order } from '../../lib/firebase/orders';
import { formatCurrency } from '../../utilities/formatCurrency';
import OrderStatusManager from './OrderStatusManager';
import AdminModal from './shared/AdminModal';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onOrderUpdated }) => {
  if (!order) return null;

  const handleOrderUpdated = (updatedOrder: Order) => {
    if (onOrderUpdated) {
      onOrderUpdated(updatedOrder);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalji narudžbe #${order.orderNumber}`}
      maxWidth="4xl"
    >
      {/* Order Status Management */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <OrderStatusManager
          order={order}
          onStatusUpdated={handleOrderUpdated}
        />
      </div>

      {/* Informacije o kupcu */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Informacije o kupcu</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Ime i prezime:</span> {order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
            <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
            <p><span className="font-medium">Telefon:</span> {order.shippingInfo.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Adresa za dostavu</h3>
          <div className="space-y-2">
            <p>{order.shippingInfo.street} {order.shippingInfo.houseNumber}</p>
            <p>{order.shippingInfo.postalCode} {order.shippingInfo.city}</p>
            {order.shippingInfo.additionalInfo && (
              <p><span className="font-medium">Dodatne informacije:</span> {order.shippingInfo.additionalInfo}</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista proizvoda */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Naručeni proizvodi</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proizvod</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miris</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Boja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Količina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cijena</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ukupno</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.naziv}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.selectedMiris || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.selectedBoja || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.kolicina}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(parseFloat(item.cijena || '0'))}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatCurrency(item.kolicina * parseFloat(item.cijena || '0'))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ukupno i način plaćanja */}
      <div className="border-t pt-6">
        <div className="flex flex-col items-end space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Dostava:</span> {formatCurrency(order.shippingCost)}
          </p>
          <p className="text-xl font-bold">
            <span className="font-medium">Ukupno:</span> {formatCurrency(order.total)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Način plaćanja:</span> {order.paymentMethod}
          </p>
          <p className="text-sm text-gray-500">
            Narudžba kreirana: {order.createdAt.toLocaleString()}
          </p>
        </div>
      </div>
    </AdminModal>
  );
};

export default OrderDetailsModal;
