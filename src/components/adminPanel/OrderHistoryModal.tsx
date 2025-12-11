import React from 'react';
import { Order } from '../../lib/firebase/orders';
import AdminModal from './shared/AdminModal';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: {
    firstName: string;
    lastName: string;
    orders: Order[];
  };
}

const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({ isOpen, onClose, customer }) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Povijest narudžbi - ${customer.firstName} ${customer.lastName}`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {customer.orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Narudžba #{order.orderNumber}</span>
              <span className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('sr-Latn', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Proizvodi:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">
                        {item.naziv} {item.selectedMiris && `(${item.selectedMiris})`}
                        {item.selectedBoja && `- ${item.selectedBoja}`}
                        x{item.kolicina}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Informacije o dostavi:</h3>
                  <div className="text-sm text-gray-700">
                    <p>{order.shippingInfo.street} {order.shippingInfo.houseNumber}</p>
                    <p>{order.shippingInfo.postalCode} {order.shippingInfo.city}</p>
                    {order.shippingInfo.additionalInfo && (
                      <p className="text-gray-600 italic">
                        Napomena: {order.shippingInfo.additionalInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-sm">
                  <span className="text-gray-600">Način plaćanja: </span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Dostava: {order.shippingCost.toFixed(2)} KM
                  </div>
                  <div className="font-semibold">
                    Ukupno: {order.total.toFixed(2)} KM
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminModal>
  );
};

export default OrderHistoryModal;
