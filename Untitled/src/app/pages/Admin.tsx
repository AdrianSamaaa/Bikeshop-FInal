import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Settings,
  Users,
  Truck,
  Database,
  Plus,
  Edit,
  Trash2
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import { toast } from 'sonner';

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'Active' | 'Inactive';
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  products: string;
}

export function Admin() {
  // Staff management
  const [staff, setStaff] = useState<Staff[]>([
    { id: '1', name: 'Mike Johnson', role: 'Mechanic', email: 'mike@bikeshop.com', status: 'Active' },
    { id: '2', name: 'Tom Anderson', role: 'Mechanic', email: 'tom@bikeshop.com', status: 'Active' },
    { id: '3', name: 'Sarah Chen', role: 'Mechanic', email: 'sarah@bikeshop.com', status: 'Active' },
    { id: '4', name: 'Jessica Brown', role: 'Sales', email: 'jessica@bikeshop.com', status: 'Active' },
  ]);

  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    role: '',
    email: '',
    status: 'Active' as const,
  });

  // Supplier management
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: 'BikeWorks Supply Co.', contact: '555-1001', email: 'orders@bikeworks.com', products: 'Frames, Parts' },
    { id: '2', name: 'Gear & Wheels Inc.', contact: '555-1002', email: 'sales@gearwheels.com', products: 'Gears, Wheels' },
    { id: '3', name: 'Safety First Accessories', contact: '555-1003', email: 'info@safetyfirst.com', products: 'Helmets, Locks' },
  ]);

  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contact: '',
    email: '',
    products: '',
  });

  // Staff operations
  const handleOpenStaffDialog = (staffId?: string) => {
    if (staffId) {
      const member = staff.find(s => s.id === staffId);
      if (member) {
        setEditingStaff(staffId);
        setStaffFormData({
          name: member.name,
          role: member.role,
          email: member.email,
          status: member.status,
        });
      }
    } else {
      setEditingStaff(null);
      setStaffFormData({
        name: '',
        role: '',
        email: '',
        status: 'Active',
      });
    }
    setStaffDialogOpen(true);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff ? { ...s, ...staffFormData } : s));
      toast.success('Staff member updated');
    } else {
      const newStaff = { ...staffFormData, id: Date.now().toString() };
      setStaff([...staff, newStaff]);
      toast.success('Staff member added');
    }
    
    setStaffDialogOpen(false);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setStaff(staff.filter(s => s.id !== id));
      toast.success('Staff member removed');
    }
  };

  // Supplier operations
  const handleOpenSupplierDialog = (supplierId?: string) => {
    if (supplierId) {
      const supplier = suppliers.find(s => s.id === supplierId);
      if (supplier) {
        setEditingSupplier(supplierId);
        setSupplierFormData({
          name: supplier.name,
          contact: supplier.contact,
          email: supplier.email,
          products: supplier.products,
        });
      }
    } else {
      setEditingSupplier(null);
      setSupplierFormData({
        name: '',
        contact: '',
        email: '',
        products: '',
      });
    }
    setSupplierDialogOpen(true);
  };

  const handleSupplierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier ? { ...s, ...supplierFormData } : s));
      toast.success('Supplier updated');
    } else {
      const newSupplier = { ...supplierFormData, id: Date.now().toString() };
      setSuppliers([...suppliers, newSupplier]);
      toast.success('Supplier added');
    }
    
    setSupplierDialogOpen(false);
  };

  const handleDeleteSupplier = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setSuppliers(suppliers.filter(s => s.id !== id));
      toast.success('Supplier removed');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data cleared. Please refresh the page.');
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Admin Settings</h2>
        <p className="text-muted-foreground mt-1">Manage staff, suppliers, and system settings</p>
      </div>

      <Tabs defaultValue="staff" className="space-y-6">
        <TabsList>
          <TabsTrigger value="staff">
            <Users className="h-4 w-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="suppliers">
            <Truck className="h-4 w-4 mr-2" />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* Staff Management */}
        <TabsContent value="staff" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Staff Members</h3>
            <Button onClick={() => handleOpenStaffDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {member.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenStaffDialog(member.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteStaff(member.id, member.name)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplier Management */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Suppliers</h3>
            <Button onClick={() => handleOpenSupplierDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.products}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenSupplierDialog(supplier.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSupplier(supplier.id, supplier.name)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <h3 className="text-lg font-medium">System Settings</h3>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Storage Information</h4>
                <p className="text-sm text-gray-600 mb-4">
                  All data is currently stored in your browser's local storage. This data will persist
                  across sessions but is limited to this browser.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Business Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input defaultValue="Bike Shop Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="555-0100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input defaultValue="info@bikeshop.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input defaultValue="123 Main Street" />
                  </div>
                </div>
                <Button className="mt-4">Save Settings</Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Operating Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opening Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Closing Time</Label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
                <Button className="mt-4">Save Hours</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Staff Dialog */}
      <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStaffSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Name</Label>
                <Input
                  id="staffName"
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={staffFormData.role}
                  onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffEmail">Email</Label>
                <Input
                  id="staffEmail"
                  type="email"
                  value={staffFormData.email}
                  onChange={(e) => setStaffFormData({ ...staffFormData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStaffDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingStaff ? 'Update' : 'Add'} Staff
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSupplierSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Company Name</Label>
                <Input
                  id="supplierName"
                  value={supplierFormData.name}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={supplierFormData.contact}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, contact: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplierEmail">Email</Label>
                <Input
                  id="supplierEmail"
                  type="email"
                  value={supplierFormData.email}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="products">Products Supplied</Label>
                <Input
                  id="products"
                  value={supplierFormData.products}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, products: e.target.value })}
                  placeholder="e.g., Frames, Parts, Accessories"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSupplierDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSupplier ? 'Update' : 'Add'} Supplier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}