import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'

const { Content } = Layout

// Componentes de prueba super simples
const HomePage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#059669' }}>🏠 Gestor POS - Home</h1>
    <p>Si ves esto, el problema estaba en los layouts o authStore</p>
    <div style={{ marginTop: '2rem' }}>
      <a href="/login" style={{ margin: '0 1rem', color: '#3b82f6' }}>Login</a>
      <a href="/dashboard" style={{ margin: '0 1rem', color: '#3b82f6' }}>Dashboard</a>
    </div>
  </div>
)

const LoginPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#3b82f6' }}>🔐 Login</h1>
    <p>Página de login sin authStore</p>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const DashboardPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#7c3aed' }}>📊 Dashboard</h1>
    <p>Dashboard sin layouts complejos</p>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#ef4444' }}>404 - Página no encontrada</h1>
    <a href="/" style={{ color: '#059669' }}>← Volver al inicio</a>
  </div>
)

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Content>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Content>
    </Layout>
  )
}

export default App
