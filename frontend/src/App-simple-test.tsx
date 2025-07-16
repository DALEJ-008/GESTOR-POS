import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'

// Solo importar layouts - sin páginas específicas por ahora
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'

// Componentes temporales para probar
const TempLanding = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🏠 Gestor POS - Landing Page</h1>
    <p>Página principal cargada correctamente</p>
  </div>
)

const TempLogin = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🔐 Login</h1>
    <p>Página de login cargada correctamente</p>
  </div>
)

const TempDashboard = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>📊 Dashboard</h1>
    <p>Dashboard cargado correctamente</p>
  </div>
)

const App: React.FC = () => {
  try {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<TempLanding />} />
            <Route path="pricing" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>💰 Precios</h2></div>} />
            <Route path="about" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>ℹ️ Acerca de</h2></div>} />
          </Route>

          {/* Rutas de autenticación */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<TempLogin />} />
            <Route path="register" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📝 Registro</h2></div>} />
          </Route>

          {/* Rutas del dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<TempDashboard />} />
            <Route path="products" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📦 Productos</h2></div>} />
            <Route path="inventory" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📋 Inventario</h2></div>} />
            <Route path="sales" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>💰 Ventas</h2></div>} />
          </Route>

          {/* Redirección */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    )
  } catch (error) {
    console.error('Error en App.tsx:', error)
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#ef4444' }}>❌ Error en App</h1>
        <p>Error: {error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    )
  }
}

export default App
