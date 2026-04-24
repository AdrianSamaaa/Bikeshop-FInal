import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Bell,
  Menu,
  LogOut,
  User
} from 'lucide-react';
import { Button } from './ui/button';
import { useData } from '../context/DataContext';
import { Badge } from './ui/badge';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, repairs, user, logout } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate alerts
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const pendingRepairs = repairs.filter(r => r.status === 'Waiting').length;
  const overdueRepairs = repairs.filter(r => {
    const today = new Date().toISOString().split('T')[0];
    return r.estimatedCompletion < today && r.status !== 'Completed';
  }).length;

  const totalAlerts = lowStockCount + pendingRepairs + overdueRepairs;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Sales & Inventory', href: '/sales', icon: Package },
    { name: 'Repairs', href: '/repairs', icon: Wrench },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: BarChart3, adminOnly: true },
    { name: 'Admin', href: '/admin', icon: Settings, adminOnly: true },
  ];

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && user?.role !== 'Admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Bike Shop Manager</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {totalAlerts > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                      {totalAlerts}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge 
                        variant={user?.role === 'Admin' ? 'default' : 'secondary'} 
                        className={`mt-1 w-fit ${user?.role === 'Admin' ? 'bg-primary' : 'bg-accent'}`}
                      >
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 mt-16 lg:mt-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden mt-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}