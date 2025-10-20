import React from 'react';
import { Order } from '../../lib/firebase/orders';

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        Povijest narudžbi - {customer.firstName} {customer.lastName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
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
            </div>
        </div>
    );
};

export default OrderHistoryModal;
