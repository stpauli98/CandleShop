import { useEffect, useState } from 'react';
import OrderHistoryModal from './OrderHistoryModal';
import { CustomerInfo, getCustomerGroups } from '../../lib/firebase/orders';
import { error as logError } from '../../lib/logger';
import { Users, AlertCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/button';
import { LoadingSpinner } from './shared/LoadingStates';
import TableEmptyState from './shared/TableEmptyState';

const CustomerGroupsTable = () => {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerGroups = await getCustomerGroups();
        setCustomers(customerGroups);
        setError(null);
      } catch (err) {
        const errorMessage = 'Greška pri učitavanju kupaca';
        setError(errorMessage);
        logError(errorMessage, err as Record<string, unknown>, 'CUSTOMERS');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Učitavanje kupaca..." />;
  }

  if (error) {
    if (error.includes('ad blocker')) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-700 font-medium">{error}</p>
              <p className="mt-2 text-sm text-yellow-600">
                Molimo isključite ad blocker za ovu stranicu i osvježite stranicu.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <TableEmptyState
        icon={Users}
        title="Nema kupaca"
        description="Kada kupci naprave narudžbe, njihovi podaci će se prikazati ovdje."
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Pregled kupaca</h2>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ime i prezime
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Broj narudžbi
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ukupno potrošeno
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr
                key={`${customer.customerEmail}_${customer.phone}`}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{customer.customerEmail}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{customer.phone}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {customer.totalOrders}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <span className="text-sm font-semibold text-green-600">
                    {customer.totalSpent.toFixed(2)} KM
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsModalOpen(true);
                    }}
                  >
                    Narudžbe
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden grid gap-4">
        {customers.map((customer) => (
          <div
            key={`${customer.customerEmail}_${customer.phone}`}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  {customer.firstName} {customer.lastName}
                </h3>
                <p className="text-sm text-gray-500 break-all">{customer.customerEmail}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {customer.totalOrders} narudžbi
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="text-gray-500">Telefon:</span>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">Ukupno potrošeno:</span>
                <p className="font-semibold text-green-600">{customer.totalSpent.toFixed(2)} KM</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedCustomer(customer);
                setIsModalOpen(true);
              }}
            >
              Pogledaj sve narudžbe
            </Button>
          </div>
        ))}
      </div>

      {selectedCustomer && (
        <OrderHistoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default CustomerGroupsTable;
