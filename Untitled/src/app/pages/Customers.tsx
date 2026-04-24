import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  Mail,
  Phone,
  ShoppingBag,
  Wrench
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner';

export function Customers() {
  const { customers, repairs, transactions, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           customer.phone.includes(searchQuery);
  });

  const handleOpenDialog = (customerId?: string) => {
    if (customerId) {
      const customer = customers.find(c => c.id === customerId);
      if (customer) {
        setEditingCustomer(customerId);
        setFormData({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        });
      }
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      updateCustomer(editingCustomer, formData);
      toast.success('Customer updated successfully');
    } else {
      addCustomer(formData);
      toast.success('Customer added successfully');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer "${name}"?`)) {
      deleteCustomer(id);
      toast.success('Customer deleted');
    }
  };

  const handleViewDetails = (customerId: string) => {
    setSelectedCustomer(customerId);
    setDetailsDialogOpen(true);
  };

  const getCustomerDetails = (customerId: string) => {
    const customerRepairs = repairs.filter(r => r.customerId === customerId);
    const customerTransactions = transactions.filter(t => t.customerId === customerId);
    return { repairs: customerRepairs, transactions: customerTransactions };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Customers</h2>
          <p className="text-muted-foreground mt-1">Manage customer information and history</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${customers.reduce((sum, c) => sum + c.totalPurchases, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Repairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.reduce((sum, c) => sum + c.totalRepairs, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total Purchases</TableHead>
                <TableHead>Repairs</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleViewDetails(customer.id)}
                        className="text-blue-600 hover:underline"
                      >
                        {customer.name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${customer.totalPurchases.toLocaleString()}</TableCell>
                    <TableCell>{customer.totalRepairs}</TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(customer.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(customer.id, customer.name)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCustomer ? 'Update' : 'Add'} Customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (() => {
            const customer = customers.find(c => c.id === selectedCustomer);
            const { repairs: customerRepairs, transactions: customerTransactions } = getCustomerDetails(selectedCustomer);
            
            if (!customer) return null;

            return (
              <div className="space-y-6 py-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p className="font-medium">{customer.lastVisit}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Purchases</p>
                          <p className="text-xl font-bold">${customer.totalPurchases.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Wrench className="h-8 w-8 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Repairs</p>
                          <p className="text-xl font-bold">{customer.totalRepairs}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Repairs */}
                <div>
                  <h3 className="font-medium mb-3">Recent Repairs</h3>
                  <div className="space-y-2">
                    {customerRepairs.length === 0 ? (
                      <p className="text-sm text-gray-500">No repairs found</p>
                    ) : (
                      customerRepairs.slice(0, 5).map(repair => (
                        <div key={repair.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{repair.bikeModel}</p>
                            <p className="text-xs text-gray-600">{repair.notes}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={repair.status === 'Completed' ? 'default' : 'secondary'}>
                              {repair.status}
                            </Badge>
                            <p className="text-xs text-gray-600 mt-1">${repair.cost}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h3 className="font-medium mb-3">Recent Transactions</h3>
                  <div className="space-y-2">
                    {customerTransactions.length === 0 ? (
                      <p className="text-sm text-gray-500">No transactions found</p>
                    ) : (
                      customerTransactions.slice(0, 5).map(transaction => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={transaction.type === 'Sale' ? 'default' : 'secondary'}>
                                {transaction.type}
                              </Badge>
                              <p className="text-xs text-gray-600">{transaction.date}</p>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {transaction.items?.join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${transaction.amount}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}