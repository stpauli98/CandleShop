import React, { useState } from 'react';
import { Order, updateOrderStatus } from '../../lib/firebase/orders';
import { toast } from 'react-hot-toast';
import { error as logError } from '../../lib/logger';
import { ORDER_STATUSES_ARRAY } from '@/lib/constants/admin';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface OrderStatusManagerProps {
  order: Order;
  onStatusUpdated: (updatedOrder: Order) => void;
}

const OrderStatusManager: React.FC<OrderStatusManagerProps> = ({ order, onStatusUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);

  const currentStatus = ORDER_STATUSES_ARRAY.find(s => s.value === order.status);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (newStatus === order.status) return;

    setIsUpdating(true);
    const loadingToast = toast.loading(`Ažuriranje statusa na "${ORDER_STATUSES_ARRAY.find(s => s.value === newStatus)?.label}"...`);

    try {
      const updatedOrder = await updateOrderStatus(order.id!, newStatus, sendEmail);

      toast.success(
        sendEmail
          ? `Status ažuriran i email poslat kupcu!`
          : `Status uspješno ažuriran!`,
        { id: loadingToast }
      );

      onStatusUpdated(updatedOrder);
    } catch (err) {
      logError('Error updating order status', err as Record<string, unknown>, 'ORDERS');
      toast.error('Greška prilikom ažuriranja statusa', { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Trenutni status</h3>
          <div className="mt-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus?.color}`}>
              {currentStatus?.label}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="sendEmail"
            checked={sendEmail}
            onCheckedChange={setSendEmail}
          />
          <Label htmlFor="sendEmail" className="text-sm text-gray-700 cursor-pointer">
            Pošalji email obavještenje
          </Label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Promijeni status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {ORDER_STATUSES_ARRAY.map((status) => (
            <button
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={isUpdating || status.value === order.status}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${status.value === order.status
                  ? 'ring-2 ring-offset-2 ring-purple-500 opacity-50 cursor-not-allowed'
                  : 'hover:ring-2 hover:ring-offset-2 hover:ring-gray-300'
                }
                ${status.color}
                ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {isUpdating && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-sm text-gray-600">Ažuriranje...</span>
        </div>
      )}
    </div>
  );
};

export default OrderStatusManager;
