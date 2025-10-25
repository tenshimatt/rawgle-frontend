'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  ShoppingBag,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  Package,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  totalPosts: number;
  totalProducts: number;
  pendingReports: number;
  growthRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const userGrowthData = [
    { month: 'Jan', users: 450 },
    { month: 'Feb', users: 580 },
    { month: 'Mar', users: 720 },
    { month: 'Apr', users: 890 },
    { month: 'May', users: 1100 },
    { month: 'Jun', users: 1340 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12400 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 18900 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 26700 },
    { month: 'Jun', revenue: 31200 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.totalUsers || 1340}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{stats?.growthRate || 12}% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ${((stats?.revenue || 31200) / 1000).toFixed(1)}k
              </p>
              <p className="text-sm text-green-600 mt-1">
                +18% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.totalOrders || 892}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +24% from last month
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stats?.pendingReports || 7}
              </p>
              <p className="text-sm text-orange-600 mt-1">
                Requires attention
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#0d9488" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => window.location.href = '/admin/users'}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
          <Button
            onClick={() => window.location.href = '/admin/moderation'}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Content Moderation
          </Button>
          <Button
            onClick={() => window.location.href = '/admin/products'}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Package className="h-4 w-4 mr-2" />
            Manage Products
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New user registered', user: 'john@example.com', time: '2 minutes ago' },
            { action: 'Order completed', user: 'Order #1234', time: '15 minutes ago' },
            { action: 'Post reported', user: 'Post by user456', time: '1 hour ago' },
            { action: 'Product added', user: 'Wild Salmon Oil', time: '2 hours ago' },
            { action: 'Payment received', user: '$89.99', time: '3 hours ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Activity className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
