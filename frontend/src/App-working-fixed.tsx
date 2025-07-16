import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'

// Layouts - solo los que funcionan confirmados
import AuthLayout from './layouts/AuthLayout'
import PublicLayout from './layouts/PublicLayout'
// import DashboardLayout from './layouts/DashboardLayout' // COMENTADO - puede ser el problema

// Páginas temporales para reemplazar las problemáticas
const TempLandingPage = () => (
  <div style={{ padding: '3rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
    <h1 style={{ fontSize: '3rem', color: '#3b82f6', marginBottom: '1rem' }}>
      🚀 Gestor POS
    </h1>
    <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
      Sistema Completo de Gestión Empresarial
    </p>
    <div style={{ 
      display: 'flex', 
      gap: '1rem', 
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '2rem'
    }}>
      <a 
        href="/auth/login"
        style={{
          background: '#3b82f6',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Iniciar Sesión
      </a>
      <a 
        href="/auth/register"
        style={{
          background: '#059669',
          color: 'white',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Registrarse
      </a>
    </div>
  </div>
)

const TempLoginPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
    <h1 style={{ color: '#3b82f6', marginBottom: '2rem' }}>🔐 Iniciar Sesión</h1>
    <div style={{ 
      background: '#f9fafb', 
      padding: '2rem', 
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <p>Formulario de login en desarrollo...</p>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Esta es una versión temporal mientras restauramos la página original
      </p>
    </div>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const TempRegisterPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
    <h1 style={{ color: '#059669', marginBottom: '2rem' }}>📝 Registro</h1>
    <div style={{ 
      background: '#f9fafb', 
      padding: '2rem', 
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <p>Formulario de registro en desarrollo...</p>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Esta es una versión temporal mientras restauramos la página original
      </p>
    </div>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const TempDashboardPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#7c3aed', marginBottom: '2rem' }}>📊 Dashboard</h1>
    <div style={{ 
      background: '#f9fafb', 
      padding: '2rem', 
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <p>Dashboard en desarrollo...</p>
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
        Esta es una versión temporal mientras restauramos las páginas originales
      </p>
    </div>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<TempLandingPage />} />
          <Route path="pricing" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>💰 Precios</h2><p>Página en desarrollo...</p></div>} />
          <Route path="about" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>ℹ️ Acerca de</h2><p>Página en desarrollo...</p></div>} />
          <Route path="contact" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📞 Contacto</h2><p>Página en desarrollo...</p></div>} />
        </Route>

        {/* Rutas de autenticación */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<TempLoginPage />} />
          <Route path="register" element={<TempRegisterPage />} />
          <Route path="tenant-register" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>🏢 Registro de Empresa</h2><p>Página en desarrollo...</p></div>} />
          <Route path="forgot-password" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>🔑 Recuperar Contraseña</h2><p>Página en desarrollo...</p></div>} />
          <Route path="reset-password" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>🔄 Restablecer Contraseña</h2><p>Página en desarrollo...</p></div>} />
        </Route>

        {/* Rutas del dashboard - SIN DashboardLayout por ahora */}
        <Route path="/dashboard/*" element={
          <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Layout.Header style={{ background: '#001529', color: 'white', textAlign: 'center' }}>
              <h2 style={{ color: 'white', margin: 0 }}>📊 Gestor POS Dashboard (Temporal)</h2>
            </Layout.Header>
            <Layout.Content style={{ padding: '2rem' }}>
              <TempDashboardPage />
            </Layout.Content>
          </Layout>
        } />
        
        <Route path="/dashboard/products" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📦 Productos</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/inventory" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📋 Inventario</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/sales" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>💰 Ventas</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/pos" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>🏪 POS</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/customers" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>👥 Clientes</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/suppliers" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>🚚 Proveedores</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/reports" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>📊 Reportes</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/configuration" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>⚙️ Configuración</h2><p>Página en desarrollo...</p></div>} />
        <Route path="/dashboard/profile" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>👤 Perfil</h2><p>Página en desarrollo...</p></div>} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
