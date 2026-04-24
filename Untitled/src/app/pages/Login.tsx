import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Bike, Lock, Mail, Shield, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function Login() {
  const navigate = useNavigate();
  const { login } = useData();
  const [activeTab, setActiveTab] = useState<'admin' | 'employee'>('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Role-based authentication
    let authenticated = false;
    let userRole: 'Admin' | 'Employee' | null = null;
    let userName = '';

    if (activeTab === 'admin') {
      if (formData.email === 'admin@bikeshop.com' && formData.password === 'admin123') {
        authenticated = true;
        userRole = 'Admin';
        userName = 'Admin User (Owner)';
      }
    } else {
      // Employee credentials
      if (formData.email === 'employee@bikeshop.com' && formData.password === 'employee123') {
        authenticated = true;
        userRole = 'Employee';
        userName = 'Mike Johnson';
      } else if (formData.email === 'mechanic@bikeshop.com' && formData.password === 'mechanic123') {
        authenticated = true;
        userRole = 'Employee';
        userName = 'Tom Anderson';
      }
    }

    if (authenticated && userRole) {
      login({
        id: Date.now().toString(),
        name: userName,
        email: formData.email,
        role: userRole,
      });
      toast.success(`Welcome back, ${userName}!`);
      navigate('/');
    } else {
      toast.error('Invalid credentials for selected role');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <Bike className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Bike Shop Manager</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        {/* Login Card with Role Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your role and enter credentials</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'admin' | 'employee')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin / Owner
                </TabsTrigger>
                <TabsTrigger value="employee" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Employee
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin" className="space-y-4 mt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@bikeshop.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>

                {/* Admin Demo Credentials */}
                <div className="mt-4 p-4 bg-secondary rounded-lg border-2 border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Admin Credentials:</p>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium text-accent">Email:</span> admin@bikeshop.com</p>
                    <p><span className="font-medium text-accent">Password:</span> admin123</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 italic">Full access to all features and data</p>
                </div>
              </TabsContent>

              <TabsContent value="employee" className="space-y-4 mt-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="employee-email"
                        type="email"
                        placeholder="employee@bikeshop.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="employee-password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10"
                        required
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In as Employee'}
                  </Button>
                </form>

                {/* Employee Access Info */}
                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <p className="text-xs font-medium text-foreground mb-2">Employee Access Includes:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>✓ View dashboard overview</li>
                    <li>✓ Manage repairs & appointments</li>
                    <li>✓ View customer information</li>
                    <li>✓ Check inventory levels</li>
                    <li className="text-red-400">✗ Financial reports</li>
                    <li className="text-red-400">✗ Admin settings</li>
                  </ul>
                </div>

                {/* Employee Demo Credentials */}
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-secondary rounded-lg border-2 border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-foreground">Employee Account 1:</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium text-accent">Name:</span> Mike Johnson (Mechanic)</p>
                      <p><span className="font-medium text-accent">Email:</span> employee@bikeshop.com</p>
                      <p><span className="font-medium text-accent">Password:</span> employee123</p>
                    </div>
                  </div>

                  <div className="p-4 bg-secondary rounded-lg border-2 border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-accent" />
                      <p className="text-sm font-medium text-foreground">Employee Account 2:</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><span className="font-medium text-accent">Name:</span> Tom Anderson (Mechanic)</p>
                      <p><span className="font-medium text-accent">Email:</span> mechanic@bikeshop.com</p>
                      <p><span className="font-medium text-accent">Password:</span> mechanic123</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground italic text-center">
                    Limited access - No financial reports or admin settings
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 Bike Shop Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
}