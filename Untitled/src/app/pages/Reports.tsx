import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import { Button } from '../components/ui/button';

export function Reports() {
  const { products, transactions } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  // Calculate date ranges
  const today = new Date();
  const getDateRange = () => {
    if (timeRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo.toISOString().split('T')[0];
    } else if (timeRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return monthAgo.toISOString().split('T')[0];
    }
    return '2000-01-01'; // All time
  };

  const dateFrom = getDateRange();
  const filteredTransactions = transactions.filter(t => t.date >= dateFrom);

  // Sales data by day (last 7 days for simplicity)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const salesByDay = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date === date);
    const sales = dayTransactions.filter(t => t.type === 'Sale').reduce((sum, t) => sum + t.amount, 0);
    const repairs = dayTransactions.filter(t => t.type === 'Repair').reduce((sum, t) => sum + t.amount, 0);
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales,
      repairs,
      total: sales + repairs
    };
  });

  // Revenue breakdown
  const totalSales = filteredTransactions.filter(t => t.type === 'Sale').reduce((sum, t) => sum + t.amount, 0);
  const totalRepairs = filteredTransactions.filter(t => t.type === 'Repair').reduce((sum, t) => sum + t.amount, 0);

  const revenueData = [
    { name: 'Product Sales', value: totalSales, color: '#3b82f6' },
    { name: 'Repair Services', value: totalRepairs, color: '#f59e0b' }
  ];

  // Top products
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      sales: p.sales,
      revenue: p.sales * p.price
    }));

  // Category breakdown
  const categoryData = Array.from(new Set(products.map(p => p.category))).map(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const revenue = categoryProducts.reduce((sum, p) => sum + (p.sales * p.price), 0);
    return {
      name: category,
      revenue,
      products: categoryProducts.length
    };
  });

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Reports & Analytics</h2>
          <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('week')}
          >
            Last 7 Days
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('month')}
          >
            Last 30 Days
          </Button>
          <Button
            variant={timeRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold">${(totalSales + totalRepairs).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {filteredTransactions.length} transactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Product Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalSales / (totalSales + totalRepairs)) * 100)}% of revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Repair Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold">${totalRepairs.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((totalRepairs / (totalSales + totalRepairs)) * 100)}% of revenue
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  ${filteredTransactions.length > 0 
                    ? Math.round((totalSales + totalRepairs) / filteredTransactions.length) 
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" name="Product Sales" strokeWidth={2} />
              <Line type="monotone" dataKey="repairs" stroke="#f59e0b" name="Repair Services" strokeWidth={2} />
              <Line type="monotone" dataKey="total" stroke="#10b981" name="Total Revenue" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${entry.value.toLocaleString()}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">
                    ${item.value.toLocaleString()} ({Math.round((item.value / (totalSales + totalRepairs)) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{category.name}</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">${category.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">{category.products} products</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Units Sold" />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}