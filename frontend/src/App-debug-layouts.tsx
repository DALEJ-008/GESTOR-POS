import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'

// Primero voy a probar con PublicLayout y AuthLayout
import PublicLayout from './layouts/PublicLayout'
import AuthLayout from './layouts/AuthLayout'

// Hook de autenticación con manejo de errores
const useAuthStoreSafe = () => {
  try {
    const { useAuthStore } = require('./store/authStore')
    return useAuthStore()
  } catch (error) {
    console.warn('AuthStore no disponible:', error)
    return { isAuthenticated: false }
  }
}

// Componentes temporales para probar
const TempLanding = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🏠 Gestor POS - Landing Page</h1>
    <p>PublicLayout funcionando correctamente</p>
    <div style={{ marginTop: '2rem' }}>
      <a href="/auth/login" style={{ margin: '0 1rem', color: '#3b82f6' }}>Login</a>
    </div>
  </div>
)

const App: React.FC = () => {
  try {
    const { isAuthenticated } = useAuthStoreSafe()

    return (
      <Layout style={{ minHeight: '100vh' }}>
        {/* Debug info */}
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: isAuthenticated ? '#d4edda' : '#f8d7da', 
          color: isAuthenticated ? '#155724' : '#721c24',
          padding: '4px 8px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000 
        }}>
          Auth: {isAuthenticated ? '✅' : '❌'}
        </div>
        
        <Routes>
          {/* Solo rutas públicas por ahora */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<TempLanding />} />
            <Route path="pricing" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>💰 Precios</h2></div>} />
            <Route path="about" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>ℹ️ Acerca de</h2></div>} />
          </Route>

          {/* Rutas de autenticación - ahora con AuthLayout */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>🔐 Login</h1>
                <p>AuthLayout funcionando correctamente</p>
                <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
              </div>
            } />
            <Route path="register" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>📝 Registro</h1>
                <p>AuthLayout funcionando correctamente</p>
                <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
              </div>
            } />
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
        <button onClick={() => window.location.reload()}>Recargar</button>
      </div>
    )
  }
}

export default App
