import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from './orders';

export interface DashboardStats {
  today: PeriodStats;
  week: PeriodStats;
  month: PeriodStats;
  total: PeriodStats;
}

export interface PeriodStats {
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface ProductStats {
  id: string;
  naziv: string;
  totalSold: number;
  totalRevenue: number;
}

export interface OrderStatusCount {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

/**
 * Get dashboard statistics for different periods
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const ordersRef = collection(db, 'orders');
  const ordersSnapshot = await getDocs(ordersRef);

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const orders = ordersSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
    } as Order;
  });

  const calculateStats = (filterFn: (order: Order) => boolean): PeriodStats => {
    const filteredOrders = orders.filter(filterFn);
    const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = filteredOrders.length;
    const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    return { revenue, orders: orderCount, averageOrderValue };
  };

  return {
    today: calculateStats(order => order.createdAt >= todayStart),
    week: calculateStats(order => order.createdAt >= weekStart),
    month: calculateStats(order => order.createdAt >= monthStart),
    total: calculateStats(() => true)
  };
};

/**
 * Get top selling products
 */
export const getTopProducts = async (limit: number = 5): Promise<ProductStats[]> => {
  const ordersRef = collection(db, 'orders');
  const ordersSnapshot = await getDocs(ordersRef);

  const productMap = new Map<string, { naziv: string; totalSold: number; totalRevenue: number }>();

  ordersSnapshot.docs.forEach(doc => {
    const order = doc.data() as Order;
    order.items.forEach(item => {
      const key = item.id;
      const existing = productMap.get(key) || { naziv: item.naziv || 'Unknown', totalSold: 0, totalRevenue: 0 };

      existing.totalSold += item.kolicina;
      existing.totalRevenue += item.kolicina * parseFloat(item.cijena || '0');

      productMap.set(key, existing);
    });
  });

  return Array.from(productMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, limit);
};

/**
 * Get order status counts
 */
export const getOrderStatusCounts = async (): Promise<OrderStatusCount> => {
  const ordersRef = collection(db, 'orders');
  const ordersSnapshot = await getDocs(ordersRef);

  const counts: OrderStatusCount = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  };

  ordersSnapshot.docs.forEach(doc => {
    const order = doc.data() as Order;
    if (order.status in counts) {
      counts[order.status]++;
    }
  });

  return counts;
};

/**
 * Get revenue trend data for charts
 */
export const getRevenueTrend = async (days: number = 30): Promise<Array<{
  date: string;
  revenue: number;
  orders: number;
}>> => {
  const ordersRef = collection(db, 'orders');
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const ordersSnapshot = await getDocs(
    query(
      ordersRef,
      where('createdAt', '>=', startDate),
      orderBy('createdAt', 'asc')
    )
  );

  const dailyData = new Map<string, { revenue: number; orders: number }>();

  ordersSnapshot.docs.forEach(doc => {
    const order = doc.data() as Order;
    const date = order.createdAt instanceof Timestamp
      ? order.createdAt.toDate()
      : new Date(order.createdAt);

    const dateKey = date.toISOString().split('T')[0];
    const existing = dailyData.get(dateKey) || { revenue: 0, orders: 0 };

    existing.revenue += order.total;
    existing.orders += 1;

    dailyData.set(dateKey, existing);
  });

  return Array.from(dailyData.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
