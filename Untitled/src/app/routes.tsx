import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { Login } from "./pages/Login";
import { Overview } from "./pages/Overview";
import { SalesInventory } from "./pages/SalesInventory";
import { RepairManagement } from "./pages/RepairManagement";
import { Customers } from "./pages/Customers";
import { Appointments } from "./pages/Appointments";
import { Reports } from "./pages/Reports";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Overview },
      { path: "sales", Component: SalesInventory },
      { path: "repairs", Component: RepairManagement },
      { path: "customers", Component: Customers },
      { path: "appointments", Component: Appointments },
      { 
        path: "reports", 
        element: (
          <AdminRoute>
            <Reports />
          </AdminRoute>
        )
      },
      { 
        path: "admin", 
        element: (
          <AdminRoute>
            <Admin />
          </AdminRoute>
        )
      },
    ],
  },
]);