import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  Wrench,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { toast } from 'sonner';

export function RepairManagement() {
  const { repairs, customers, addRepair, updateRepair, deleteRepair } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRepair, setEditingRepair] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bikeModel: '',
    customerId: '',
    status: 'Waiting' as const,
    mechanic: '',
    estimatedCompletion: '',
    cost: '',
    notes: '',
  });

  const statuses = ['All', 'Waiting', 'In Progress', 'Ready', 'Completed'];
  const mechanics = ['Mike Johnson', 'Tom Anderson', 'Sarah Chen'];

  // Filter repairs
  const filteredRepairs = repairs.filter(repair => {
    const matchesSearch = repair.bikeModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repair.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repair.mechanic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || repair.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (repairId?: string) => {
    if (repairId) {
      const repair = repairs.find(r => r.id === repairId);
      if (repair) {
        setEditingRepair(repairId);
        setFormData({
          bikeModel: repair.bikeModel,
          customerId: repair.customerId,
          status: repair.status,
          mechanic: repair.mechanic,
          estimatedCompletion: repair.estimatedCompletion,
          cost: repair.cost.toString(),
          notes: repair.notes,
        });
      }
    } else {
      setEditingRepair(null);
      setFormData({
        bikeModel: '',
        customerId: '',
        status: 'Waiting',
        mechanic: '',
        estimatedCompletion: '',
        cost: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }

    if (editingRepair) {
      updateRepair(editingRepair, {
        bikeModel: formData.bikeModel,
        customerId: formData.customerId,
        customerName: customer.name,
        status: formData.status,
        mechanic: formData.mechanic,
        estimatedCompletion: formData.estimatedCompletion,
        cost: parseFloat(formData.cost),
        notes: formData.notes,
      });
      toast.success('Repair updated successfully');
    } else {
      addRepair({
        bikeModel: formData.bikeModel,
        customerId: formData.customerId,
        customerName: customer.name,
        status: formData.status,
        mechanic: formData.mechanic,
        estimatedCompletion: formData.estimatedCompletion,
        cost: parseFloat(formData.cost),
        notes: formData.notes,
      });
      toast.success('Repair added successfully');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string, bikeModel: string) => {
    if (confirm(`Are you sure you want to delete repair for "${bikeModel}"?`)) {
      deleteRepair(id);
      toast.success('Repair deleted');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Ready': return 'default';
      case 'In Progress': return 'secondary';
      case 'Waiting': return 'outline';
      default: return 'outline';
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const overdueRepairs = repairs.filter(r => r.estimatedCompletion < today && r.status !== 'Completed');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Repair Management</h2>
          <p className="text-muted-foreground mt-1">Track and manage bike repairs</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Repair
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'Waiting').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {repairs.filter(r => r.status === 'Ready').length}
            </div>
          </CardContent>
        </Card>

        <Card className={overdueRepairs.length > 0 ? 'border-primary/30 bg-primary/10' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {overdueRepairs.length > 0 && <AlertCircle className="h-4 w-4 text-primary" />}
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueRepairs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search repairs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {statuses.map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bike Model</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mechanic</TableHead>
                <TableHead>Est. Completion</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRepairs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    <Wrench className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    No repairs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRepairs.map((repair) => {
                  const isOverdue = repair.estimatedCompletion < today && repair.status !== 'Completed';
                  return (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">{repair.bikeModel}</TableCell>
                      <TableCell>{repair.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(repair.status)}>
                          {repair.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{repair.mechanic}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isOverdue && <AlertCircle className="h-4 w-4 text-red-500" />}
                          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                            {repair.estimatedCompletion}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>${repair.cost}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(repair.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(repair.id, repair.bikeModel)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingRepair ? 'Edit Repair' : 'Add New Repair'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bikeModel">Bike Model</Label>
                  <Input
                    id="bikeModel"
                    value={formData.bikeModel}
                    onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Waiting">Waiting</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Ready">Ready</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mechanic">Mechanic</Label>
                  <Select
                    value={formData.mechanic}
                    onValueChange={(value) => setFormData({ ...formData, mechanic: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mechanic" />
                    </SelectTrigger>
                    <SelectContent>
                      {mechanics.map(mechanic => (
                        <SelectItem key={mechanic} value={mechanic}>
                          {mechanic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                  <Input
                    id="estimatedCompletion"
                    type="date"
                    value={formData.estimatedCompletion}
                    onChange={(e) => setFormData({ ...formData, estimatedCompletion: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Repair Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Describe the repair work needed..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRepair ? 'Update' : 'Add'} Repair
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}