import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  sales: number;
}

export interface Repair {
  id: string;
  bikeModel: string;
  customerId: string;
  customerName: string;
  status: 'Waiting' | 'In Progress' | 'Ready' | 'Completed';
  mechanic: string;
  estimatedCompletion: string;
  cost: number;
  notes: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalRepairs: number;
  lastVisit: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  time: string;
  service: string;
  mechanic: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface Transaction {
  id: string;
  type: 'Sale' | 'Repair';
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  items?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DataContextType {
  products: Product[];
  repairs: Repair[];
  customers: Customer[];
  appointments: Appointment[];
  transactions: Transaction[];
  user: User | null;
  isAuthenticated: boolean;
  addProduct: (product: Omit<Product, 'id' | 'sales'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addRepair: (repair: Omit<Repair, 'id' | 'createdAt'>) => void;
  updateRepair: (id: string, repair: Partial<Repair>) => void;
  deleteRepair: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalPurchases' | 'totalRepairs' | 'lastVisit'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  login: (user: User) => void;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialProducts: Product[] = [
  { id: '1', name: 'Mountain Bike X200', category: 'Bikes', price: 1299, stock: 5, lowStockThreshold: 3, sales: 45 },
  { id: '2', name: 'Road Bike R500', category: 'Bikes', price: 1899, stock: 3, lowStockThreshold: 3, sales: 32 },
  { id: '3', name: 'City Cruiser C100', category: 'Bikes', price: 699, stock: 8, lowStockThreshold: 5, sales: 67 },
  { id: '4', name: 'Bike Helmet Pro', category: 'Accessories', price: 89, stock: 25, lowStockThreshold: 10, sales: 120 },
  { id: '5', name: 'Bike Lock Ultra', category: 'Accessories', price: 49, stock: 15, lowStockThreshold: 10, sales: 98 },
  { id: '6', name: 'Water Bottle Holder', category: 'Accessories', price: 19, stock: 2, lowStockThreshold: 5, sales: 156 },
  { id: '7', name: 'Bike Pump Deluxe', category: 'Tools', price: 35, stock: 12, lowStockThreshold: 8, sales: 74 },
  { id: '8', name: 'Repair Kit Premium', category: 'Tools', price: 45, stock: 18, lowStockThreshold: 10, sales: 89 },
];

const initialRepairs: Repair[] = [
  {
    id: '1',
    bikeModel: 'Mountain Bike X200',
    customerId: '1',
    customerName: 'John Smith',
    status: 'In Progress',
    mechanic: 'Mike Johnson',
    estimatedCompletion: '2026-03-21',
    cost: 150,
    notes: 'Replace brake pads and tune gears',
    createdAt: '2026-03-18'
  },
  {
    id: '2',
    bikeModel: 'Road Bike R500',
    customerId: '2',
    customerName: 'Sarah Williams',
    status: 'Waiting',
    mechanic: 'Tom Anderson',
    estimatedCompletion: '2026-03-22',
    cost: 200,
    notes: 'Full service and wheel alignment',
    createdAt: '2026-03-19'
  },
  {
    id: '3',
    bikeModel: 'City Cruiser C100',
    customerId: '3',
    customerName: 'Emily Davis',
    status: 'Ready',
    mechanic: 'Mike Johnson',
    estimatedCompletion: '2026-03-20',
    cost: 85,
    notes: 'Chain replacement',
    createdAt: '2026-03-17'
  },
  {
    id: '4',
    bikeModel: 'Custom Build',
    customerId: '4',
    customerName: 'Robert Brown',
    status: 'In Progress',
    mechanic: 'Tom Anderson',
    estimatedCompletion: '2026-03-25',
    cost: 350,
    notes: 'Custom wheel build and suspension upgrade',
    createdAt: '2026-03-15'
  },
];

const initialCustomers: Customer[] = [
  { id: '1', name: 'John Smith', email: 'john@email.com', phone: '555-0101', totalPurchases: 2450, totalRepairs: 3, lastVisit: '2026-03-18' },
  { id: '2', name: 'Sarah Williams', email: 'sarah@email.com', phone: '555-0102', totalPurchases: 3200, totalRepairs: 5, lastVisit: '2026-03-19' },
  { id: '3', name: 'Emily Davis', email: 'emily@email.com', phone: '555-0103', totalPurchases: 890, totalRepairs: 2, lastVisit: '2026-03-17' },
  { id: '4', name: 'Robert Brown', email: 'robert@email.com', phone: '555-0104', totalPurchases: 5600, totalRepairs: 8, lastVisit: '2026-03-15' },
  { id: '5', name: 'Lisa Martinez', email: 'lisa@email.com', phone: '555-0105', totalPurchases: 1200, totalRepairs: 1, lastVisit: '2026-03-10' },
];

const initialAppointments: Appointment[] = [
  { id: '1', customerId: '1', customerName: 'John Smith', date: '2026-03-20', time: '10:00', service: 'Brake Adjustment', mechanic: 'Mike Johnson', status: 'Scheduled' },
  { id: '2', customerId: '2', customerName: 'Sarah Williams', date: '2026-03-20', time: '14:00', service: 'Full Service', mechanic: 'Tom Anderson', status: 'Scheduled' },
  { id: '3', customerId: '5', customerName: 'Lisa Martinez', date: '2026-03-21', time: '11:00', service: 'Tire Replacement', mechanic: 'Mike Johnson', status: 'Scheduled' },
  { id: '4', customerId: '3', customerName: 'Emily Davis', date: '2026-03-22', time: '09:00', service: 'Safety Check', mechanic: 'Tom Anderson', status: 'Scheduled' },
];

const initialTransactions: Transaction[] = [
  { id: '1', type: 'Sale', customerId: '1', customerName: 'John Smith', amount: 1299, date: '2026-03-19', items: ['Mountain Bike X200'] },
  { id: '2', type: 'Repair', customerId: '2', customerName: 'Sarah Williams', amount: 150, date: '2026-03-19', items: ['Brake Service'] },
  { id: '3', type: 'Sale', customerId: '3', customerName: 'Emily Davis', amount: 89, date: '2026-03-18', items: ['Bike Helmet Pro'] },
  { id: '4', type: 'Sale', customerId: '4', customerName: 'Robert Brown', amount: 1899, date: '2026-03-18', items: ['Road Bike R500', 'Bike Lock Ultra'] },
  { id: '5', type: 'Repair', customerId: '1', customerName: 'John Smith', amount: 85, date: '2026-03-17', items: ['Chain Replacement'] },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Authentication state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bikeShopUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bikeShopAuth');
    return saved === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bikeShopProducts');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [repairs, setRepairs] = useState<Repair[]>(() => {
    const saved = localStorage.getItem('bikeShopRepairs');
    return saved ? JSON.parse(saved) : initialRepairs;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bikeShopCustomers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('bikeShopAppointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('bikeShopTransactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('bikeShopProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bikeShopRepairs', JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    localStorage.setItem('bikeShopCustomers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('bikeShopAppointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('bikeShopTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bikeShopUser', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bikeShopAuth', isAuthenticated.toString());
  }, [isAuthenticated]);

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'sales'>) => {
    const newProduct = { ...product, id: Date.now().toString(), sales: 0 };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Repair operations
  const addRepair = (repair: Omit<Repair, 'id' | 'createdAt'>) => {
    const newRepair = { 
      ...repair, 
      id: Date.now().toString(), 
      createdAt: new Date().toISOString().split('T')[0] 
    };
    setRepairs([...repairs, newRepair]);
  };

  const updateRepair = (id: string, updates: Partial<Repair>) => {
    setRepairs(repairs.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRepair = (id: string) => {
    setRepairs(repairs.filter(r => r.id !== id));
  };

  // Customer operations
  const addCustomer = (customer: Omit<Customer, 'id' | 'totalPurchases' | 'totalRepairs' | 'lastVisit'>) => {
    const newCustomer = { 
      ...customer, 
      id: Date.now().toString(), 
      totalPurchases: 0, 
      totalRepairs: 0,
      lastVisit: new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  // Appointment operations
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: Date.now().toString() };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  // Transaction operations
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions([...transactions, newTransaction]);
  };

  // Authentication operations
  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <DataContext.Provider
      value={{
        products,
        repairs,
        customers,
        appointments,
        transactions,
        user,
        isAuthenticated,
        addProduct,
        updateProduct,
        deleteProduct,
        addRepair,
        updateRepair,
        deleteRepair,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addTransaction,
        login,
        logout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}