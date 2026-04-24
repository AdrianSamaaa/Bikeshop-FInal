import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  Wrench, 
  AlertTriangle, 
  Users,
  TrendingUp,
  Package
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router';

export function Overview() {
  const { products, repairs, customers, transactions, user } = useData();

  // Calculate today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === today);
  const todaySales = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const todayOrders = todayTransactions.filter(t => t.type === 'Sale').length;

  // Calculate week stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  const weekTransactions = transactions.filter(t => t.date >= weekAgoStr);
  const weekSales = weekTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Calculate month stats (last 30 days)
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthAgoStr = monthAgo.toISOString().split('T')[0];
  const monthTransactions = transactions.filter(t => t.date >= monthAgoStr);
  const monthSales = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Other stats
  const repairsInProgress = repairs.filter(r => r.status === 'In Progress' || r.status === 'Waiting').length;
  const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold);
  const pendingRepairs = repairs.filter(r => r.status === 'Waiting');
  const overdueRepairs = repairs.filter(r => {
    return r.estimatedCompletion < today && r.status !== 'Completed';
  });

  // Best selling products
  const topProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todaySales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Week: ${weekSales.toLocaleString()} | Month: ${monthSales.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total transactions: {todayTransactions.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Repairs</CardTitle>
            <Wrench className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repairsInProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total repairs: {repairs.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || pendingRepairs.length > 0 || overdueRepairs.length > 0) && (
        <Card className="border-accent/30 bg-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStockItems.length > 0 && (
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Low Stock Alert</p>
                  <p className="text-sm text-muted-foreground">
                    {lowStockItems.length} item(s) running low: {lowStockItems.slice(0, 3).map(p => p.name).join(', ')}
                    {lowStockItems.length > 3 && ` +${lowStockItems.length - 3} more`}
                  </p>
                  <Link to="/sales" className="text-sm text-accent underline">View inventory →</Link>
                </div>
              </div>
            )}
            {pendingRepairs.length > 0 && (
              <div className="flex items-start gap-3">
                <Wrench className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Pending Repairs</p>
                  <p className="text-sm text-muted-foreground">
                    {pendingRepairs.length} repair(s) waiting to be started
                  </p>
                  <Link to="/repairs" className="text-sm text-accent underline">View repairs →</Link>
                </div>
              </div>
            )}
            {overdueRepairs.length > 0 && (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Overdue Repairs</p>
                  <p className="text-sm text-muted-foreground">
                    {overdueRepairs.length} repair(s) past estimated completion date
                  </p>
                  <Link to="/repairs" className="text-sm text-primary underline">View repairs →</Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Best Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{product.sales} sold</p>
                    <p className="text-xs text-muted-foreground">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{transaction.customerName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={transaction.type === 'Sale' ? 'default' : 'secondary'} className="text-xs">
                        {transaction.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}