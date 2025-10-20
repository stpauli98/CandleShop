import { useEffect, useState } from 'react';
import OrderHistoryModal from './OrderHistoryModal';
import { CustomerInfo, getCustomerGroups } from '../../lib/firebase/orders';
import { error as logError } from '../../lib/logger';

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
                const errorMessage = 'Error fetching customer groups';
                setError(errorMessage);
                logError(errorMessage, err as Record<string, unknown>, 'CUSTOMERS');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <div className="p-4">Loading customer data...</div>;
    if (error) {
        if (error.includes('ad blocker')) {
            return (
                <div className="p-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    {error}
                                </p>
                                <p className="mt-2 text-sm text-yellow-700">
                                    Molimo isključite ad blocker za ovu stranicu i osvježite stranicu.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return <div className="p-4 text-red-500">{error}</div>;
    }
    if (customers.length === 0) return <div className="p-4">No customer data found</div>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4">Pregled kupaca</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">Ime i prezime</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Telefon</th>
                        <th className="py-2 px-4 border-b">Broj narudžbi</th>
                        <th className="py-2 px-4 border-b">Ukupno potrošeno</th>
                        <th className="py-2 px-4 border-b">Detalji</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={`${customer.customerEmail}_${customer.phone}`} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">
                                {customer.firstName} {customer.lastName}
                            </td>
                            <td className="py-2 px-4 border-b">{customer.customerEmail}</td>
                            <td className="py-2 px-4 border-b">{customer.phone}</td>
                            <td className="py-2 px-4 border-b text-center">{customer.totalOrders}</td>
                            <td className="py-2 px-4 border-b text-right">
                                {customer.totalSpent.toFixed(2)} KM
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Pogledaj sve narudžbe
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
