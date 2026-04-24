import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  Calendar as CalendarIcon,
  Plus, 
  Edit, 
  Trash2,
  Clock,
  User
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
import { toast } from 'sonner';
import { format, parseISO, startOfWeek, addDays } from 'date-fns';

export function Appointments() {
  const { appointments, customers, addAppointment, updateAppointment, deleteAppointment } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    date: '',
    time: '',
    service: '',
    mechanic: '',
    status: 'Scheduled' as const,
  });

  const mechanics = ['Mike Johnson', 'Tom Anderson', 'Sarah Chen'];
  const services = [
    'Full Service',
    'Brake Adjustment',
    'Tire Replacement',
    'Chain Replacement',
    'Gear Tune',
    'Safety Check',
    'Custom Build'
  ];

  // Get current week dates
  const weekStart = startOfWeek(parseISO(selectedDate), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter appointments for selected date
  const dayAppointments = appointments.filter(apt => apt.date === selectedDate);

  // Group appointments by mechanic for the week view
  const weekAppointments = weekDays.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      date: dateStr,
      dayName: format(day, 'EEE'),
      dayNum: format(day, 'd'),
      appointments: appointments.filter(apt => apt.date === dateStr)
    };
  });

  const handleOpenDialog = (appointmentId?: string) => {
    if (appointmentId) {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        setEditingAppointment(appointmentId);
        setFormData({
          customerId: appointment.customerId,
          date: appointment.date,
          time: appointment.time,
          service: appointment.service,
          mechanic: appointment.mechanic,
          status: appointment.status,
        });
      }
    } else {
      setEditingAppointment(null);
      setFormData({
        customerId: '',
        date: selectedDate,
        time: '',
        service: '',
        mechanic: '',
        status: 'Scheduled',
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

    if (editingAppointment) {
      updateAppointment(editingAppointment, {
        customerId: formData.customerId,
        customerName: customer.name,
        date: formData.date,
        time: formData.time,
        service: formData.service,
        mechanic: formData.mechanic,
        status: formData.status,
      });
      toast.success('Appointment updated successfully');
    } else {
      addAppointment({
        customerId: formData.customerId,
        customerName: customer.name,
        date: formData.date,
        time: formData.time,
        service: formData.service,
        mechanic: formData.mechanic,
        status: formData.status,
      });
      toast.success('Appointment scheduled successfully');
    }
    
    setDialogOpen(false);
  };

  const handleDelete = (id: string, customerName: string) => {
    if (confirm(`Are you sure you want to delete appointment for ${customerName}?`)) {
      deleteAppointment(id);
      toast.success('Appointment deleted');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Scheduled': return 'secondary';
      case 'Cancelled': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Appointments</h2>
          <p className="text-muted-foreground mt-1">Manage repair schedules and bookings</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => {
                const aptDate = parseISO(a.date);
                return aptDate >= weekStart && aptDate <= addDays(weekStart, 6);
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'Scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {appointments.filter(a => a.status === 'Completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = addDays(parseISO(selectedDate), -7);
                  setSelectedDate(format(newDate, 'yyyy-MM-dd'));
                }}
              >
                Previous Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = addDays(parseISO(selectedDate), 7);
                  setSelectedDate(format(newDate, 'yyyy-MM-dd'));
                }}
              >
                Next Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekAppointments.map((day) => (
              <div
                key={day.date}
                className={`p-3 rounded-lg border ${
                  day.date === selectedDate
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <button
                  onClick={() => setSelectedDate(day.date)}
                  className="w-full text-left"
                >
                  <div className="font-medium text-sm">{day.dayName}</div>
                  <div className="text-2xl font-bold mb-2">{day.dayNum}</div>
                  <div className="space-y-1">
                    {day.appointments.slice(0, 3).map(apt => (
                      <div
                        key={apt.id}
                        className="text-xs p-1 bg-blue-100 rounded truncate"
                        title={`${apt.time} - ${apt.customerName}`}
                      >
                        {apt.time} {apt.customerName}
                      </div>
                    ))}
                    {day.appointments.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{day.appointments.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Schedule for {format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}
            </CardTitle>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </CardHeader>
        <CardContent>
          {dayAppointments.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No appointments scheduled for this day</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg">
                        <div className="text-center">
                          <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs font-medium text-blue-900">{appointment.time}</div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{appointment.customerName}</h3>
                          <Badge variant={getStatusBadgeVariant(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{appointment.service}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {appointment.mechanic}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(appointment.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(appointment.id, appointment.customerName)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
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
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAppointment ? 'Update' : 'Schedule'} Appointment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}