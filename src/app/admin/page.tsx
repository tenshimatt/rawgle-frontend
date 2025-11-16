'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/admin/StatsCard';
import {
  DollarSign,
  ShoppingBag,
  FileText,
  TrendingUp,
  Package,
  Plus,
  BarChart3,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  totalProducts: number;
  totalPosts: number;
  ordersChange: number;
  revenueChange: number;
  productsChange: number;
  postsChange: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/v2/api/admin/dashboard');
      const data = await res.json();

      // Set stats or use mock data
      setStats(data.stats || {
        totalOrders: 892,
        revenue: 31200,
        totalProducts: 145,
        totalPosts: 67,
        ordersChange: 24,
        revenueChange: 18,
        productsChange: 8,
        postsChange: 12,
      });

      // Mock recent orders
      setRecentOrders([
        { id: '#1234', customer: 'John Smith', amount: 89.99, status: 'completed', date: '2 min ago' },
        { id: '#1233', customer: 'Sarah Johnson', amount: 124.50, status: 'pending', date: '15 min ago' },
        { id: '#1232', customer: 'Mike Brown', amount: 67.25, status: 'completed', date: '1 hour ago' },
        { id: '#1231', customer: 'Emma Davis', amount: 199.99, status: 'cancelled', date: '2 hours ago' },
        { id: '#1230', customer: 'Tom Wilson', amount: 45.00, status: 'completed', date: '3 hours ago' },
      ]);

      // Mock activities
      setActivities([
        { id: '1', action: 'New user registered', user: 'john@example.com', time: '2 min ago', type: 'success' },
        { id: '2', action: 'Order completed', user: 'Order #1234', time: '15 min ago', type: 'success' },
        { id: '3', action: 'Post reported', user: 'Post by user456', time: '1 hour ago', type: 'warning' },
        { id: '4', action: 'Product added', user: 'Wild Salmon Oil', time: '2 hours ago', type: 'info' },
        { id: '5', action: 'Payment received', user: '$89.99', time: '3 hours ago', type: 'success' },
      ]);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Use default mock data on error
      setStats({
        totalOrders: 892,
        revenue: 31200,
        totalProducts: 145,
        totalPosts: 67,
        ordersChange: 24,
        revenueChange: 18,
        productsChange: 8,
        postsChange: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RecentOrder['status']) => {
    const variants = {
      completed: { variant: 'default' as const, label: 'Completed', className: 'bg-green-100 text-green-700' },
      pending: { variant: 'secondary' as const, label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled', className: 'bg-red-100 text-red-700' },
    };
    const config = variants[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      success: <CheckCircle className="h-4 w-4 text-green-600" />,
      warning: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      error: <XCircle className="h-4 w-4 text-red-600" />,
      info: <Clock className="h-4 w-4 text-blue-600" />,
    };
    return icons[type];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>View Analytics</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          change={stats?.ordersChange}
          changeLabel="from last month"
          icon={ShoppingBag}
          iconColor="purple"
          loading={loading}
        />
        <StatsCard
          title="Revenue"
          value={`$${((stats?.revenue || 0) / 1000).toFixed(1)}k`}
          change={stats?.revenueChange}
          changeLabel="from last month"
          icon={DollarSign}
          iconColor="green"
          loading={loading}
        />
        <StatsCard
          title="Products"
          value={stats?.totalProducts || 0}
          change={stats?.productsChange}
          changeLabel="from last month"
          icon={Package}
          iconColor="blue"
          loading={loading}
        />
        <StatsCard
          title="Blog Posts"
          value={stats?.totalPosts || 0}
          change={stats?.postsChange}
          changeLabel="from last month"
          icon={FileText}
          iconColor="orange"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => window.location.href = '/admin/posts/new'}
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-persian-green hover:bg-persian-green-600"
            >
              <Plus className="h-6 w-6" />
              <span className="font-medium">New Post</span>
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/products/new'}
              className="h-24 flex flex-col items-center justify-center space-y-2 bg-charcoal-600 hover:bg-charcoal-700"
            >
              <Plus className="h-6 w-6" />
              <span className="font-medium">New Product</span>
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/orders'}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
            >
              <Eye className="h-6 w-6" />
              <span className="font-medium">View Orders</span>
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/analytics'}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-persian-green"
                onClick={() => window.location.href = '/admin/orders'}
              >
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="p-2 bg-gray-100 dark:bg-charcoal-700 rounded-full flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {activity.user}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
