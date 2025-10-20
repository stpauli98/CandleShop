import { useEffect, useState } from 'react';
import { Package, ShoppingCart, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import DashboardCard from './shared/DashboardCard';
import { getDashboardStats, getTopProducts, getOrderStatusCounts, type DashboardStats, type ProductStats, type OrderStatusCount } from '../../lib/firebase/analytics';
import { error as logError } from '../../lib/logger';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<ProductStats[]>([]);
  const [statusCounts, setStatusCounts] = useState<OrderStatusCount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [statsData, productsData, statusData] = await Promise.all([
          getDashboardStats(),
          getTopProducts(5),
          getOrderStatusCounts()
        ]);

        setStats(statsData);
        setTopProducts(productsData);
        setStatusCounts(statusData);
      } catch (err) {
        logError('Error loading dashboard data', err as Record<string, unknown>, 'ADMIN');
        toast.error('Greška pri učitavanju dashboard podataka');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!stats || !statusCounts) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Greška pri učitavanju podataka</p>
      </div>
    );
  }

  const todayTrend = stats.total.orders > 0
    ? ((stats.today.orders / stats.total.orders) * 100)
    : 0;

  const weekTrend = stats.total.orders > 0
    ? ((stats.week.orders / stats.total.orders) * 100)
    : 0;

  const urgentActions = statusCounts.pending + statusCounts.processing;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Pregled poslovanja i ključnih metrika</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Današnji prihod"
          value={`${stats.today.revenue.toFixed(2)} KM`}
          subtitle={`${stats.today.orders} narudžbi`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: todayTrend, isPositive: todayTrend > 0 }}
          color="green"
        />

        <DashboardCard
          title="Sedmični prihod"
          value={`${stats.week.revenue.toFixed(2)} KM`}
          subtitle={`${stats.week.orders} narudžbi`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend={{ value: weekTrend, isPositive: weekTrend > 0 }}
          color="blue"
        />

        <DashboardCard
          title="Mjesečni prihod"
          value={`${stats.month.revenue.toFixed(2)} KM`}
          subtitle={`${stats.month.orders} narudžbi`}
          icon={<ShoppingCart className="w-5 h-5" />}
          color="purple"
        />

        <DashboardCard
          title="Ukupan prihod"
          value={`${stats.total.revenue.toFixed(2)} KM`}
          subtitle={`${stats.total.orders} narudžbi`}
          icon={<Package className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Urgent Actions Section */}
      {urgentActions > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold text-amber-900">
              <span className="hidden sm:inline">Akcije koje zahtijevaju pažnju</span>
              <span className="sm:hidden">Hitne akcije</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statusCounts.pending > 0 && (
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-gray-600">Narudžbe na čekanju</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
              </div>
            )}
            {statusCounts.processing > 0 && (
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-gray-600">Narudžbe u obradi</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.processing}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Top proizvodi</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nema podataka o prodaji</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proizvod
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prodato
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prihod
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{product.naziv}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className="text-sm text-gray-600">{product.totalSold}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className="text-sm font-medium text-green-600">
                            {product.totalRevenue.toFixed(2)} KM
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-lg font-bold text-green-600">
                        {product.totalRevenue.toFixed(2)} KM
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{product.naziv}</h3>
                    <p className="text-xs text-gray-600">Prodato: {product.totalSold} kom</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Order Status Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Status narudžbi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Na čekanju</p>
            <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">U obradi</p>
            <p className="text-2xl font-bold text-blue-600">{statusCounts.processing}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Poslato</p>
            <p className="text-2xl font-bold text-purple-600">{statusCounts.shipped}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Dostavljeno</p>
            <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Otkazano</p>
            <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
