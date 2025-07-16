import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'

// Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import TenantRegisterPage from './pages/auth/TenantRegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import InventoryPage from './pages/inventory/InventoryPage'
import SalesPage from './pages/sales/SalesPage'
import POSPage from './pages/pos/POSPage'
import CustomersPage from './pages/customers/CustomersPage'
import SuppliersPage from './pages/suppliers/SuppliersPage'
import ReportsPage from './pages/reports/ReportsPage'
import ConfigurationPage from './pages/configuration/ConfigurationPage'
import ProfilePage from './pages/profile/ProfilePage'

// Hooks
import { useAuthStore } from './store/authStore'

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="pricing" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Precios</h2><p>Página de precios en desarrollo...</p></div>} />
          <Route path="about" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Acerca de</h2><p>Página sobre nosotros en desarrollo...</p></div>} />
          <Route path="contact" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Contacto</h2><p>Página de contacto en desarrollo...</p></div>} />
        </Route>

        {/* Rutas de autenticación */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="tenant-register" element={<TenantRegisterPage />} />
          <Route path="forgot-password" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Recuperar Contraseña</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="reset-password" element={<div style={{ padding: '40px', textAlign: 'center' }}><h2>Restablecer Contraseña</h2><p>Funcionalidad en desarrollo...</p></div>} />
        </Route>

        {/* Rutas protegidas del dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        >
          <Route index element={<DashboardPage />} />
          
          {/* Gestión de productos */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/categories" element={<div style={{ padding: '24px' }}><h2>Categorías</h2><p>Gestión de categorías en desarrollo...</p></div>} />
          
          {/* Inventario */}
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/movements" element={<div style={{ padding: '24px' }}><h2>Movimientos de Inventario</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="inventory/adjustments" element={<div style={{ padding: '24px' }}><h2>Ajustes de Inventario</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Ventas */}
          <Route path="sales" element={<SalesPage />} />
          <Route path="sales/history" element={<div style={{ padding: '24px' }}><h2>Historial de Ventas</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="sales/invoices" element={<div style={{ padding: '24px' }}><h2>Facturas</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Punto de venta */}
          <Route path="pos" element={<POSPage />} />
          
          {/* Clientes */}
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/groups" element={<div style={{ padding: '24px' }}><h2>Grupos de Clientes</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Proveedores */}
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="suppliers/orders" element={<div style={{ padding: '24px' }}><h2>Órdenes de Compra</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Reportes */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/sales" element={<div style={{ padding: '24px' }}><h2>Reportes de Ventas</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="reports/inventory" element={<div style={{ padding: '24px' }}><h2>Reportes de Inventario</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="reports/financial" element={<div style={{ padding: '24px' }}><h2>Reportes Financieros</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Configuración */}
          <Route path="configuration" element={<ConfigurationPage />} />
          <Route path="configuration/users" element={<div style={{ padding: '24px' }}><h2>Gestión de Usuarios</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="configuration/taxes" element={<div style={{ padding: '24px' }}><h2>Configuración de Impuestos</h2><p>Funcionalidad en desarrollo...</p></div>} />
          <Route path="configuration/payment-methods" element={<div style={{ padding: '24px' }}><h2>Métodos de Pago</h2><p>Funcionalidad en desarrollo...</p></div>} />
          
          {/* Perfil de usuario */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Redirección por defecto */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
