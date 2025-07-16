import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Button, Card, Typography, Space } from 'antd'
import { 
  LoginOutlined, 
  UserAddOutlined, 
  ShopOutlined,
  BarChartOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title, Text } = Typography

// Hook de autenticación
import { useAuthStore } from './store/authStore'

// Componente de Header unificado
const AppHeader: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const { isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <Header style={{ 
      background: '#001529', 
      padding: '0 50px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          🏪 Gestor POS
        </Title>
        <Text style={{ color: '#8c8c8c', marginLeft: '16px' }}>
          {currentPage}
        </Text>
      </div>
      
      <Space className="header-nav">
        {!isAuthenticated ? (
          <>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={() => window.location.href = '/'}
            >
              Inicio
            </Button>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={() => window.location.href = '/auth/login'}
            >
              Iniciar Sesión
            </Button>
            <Button 
              type="primary"
              onClick={() => window.location.href = '/auth/register'}
            >
              Registrarse
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
            <Button 
              type="text" 
              style={{ color: 'white' }}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </>
        )}
      </Space>
    </Header>
  )
}

// Página de inicio
const HomePage: React.FC = () => (
  <Layout style={{ minHeight: '100vh' }} className="page-enter">
    <AppHeader currentPage="Inicio" />
    <Content style={{ padding: '50px', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <Title level={1} style={{ color: '#001529', marginBottom: '24px' }}>
          🚀 Bienvenido a Gestor POS
        </Title>
        <Text style={{ fontSize: '18px', color: '#666', display: 'block', marginBottom: '40px' }}>
          Sistema completo de gestión empresarial con punto de venta, inventario y reportes
        </Text>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '40px'
        }} className="feature-grid">
          <Card hoverable style={{ textAlign: 'center' }}>
            <ShopOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={4}>Punto de Venta</Title>
            <Text>Sistema POS completo para gestionar tus ventas diarias</Text>
          </Card>
          
          <Card hoverable style={{ textAlign: 'center' }}>
            <BarChartOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={4}>Reportes</Title>
            <Text>Análisis detallados de ventas, inventario y rendimiento</Text>
          </Card>
          
          <Card hoverable style={{ textAlign: 'center' }}>
            <TeamOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
            <Title level={4}>Multi-empresa</Title>
            <Text>Gestiona múltiples empresas desde una sola plataforma</Text>
          </Card>
        </div>

        <Space size="large">
          <Button 
            type="primary" 
            size="large"
            icon={<LoginOutlined />}
            onClick={() => window.location.href = '/auth/login'}
          >
            Iniciar Sesión
          </Button>
          <Button 
            size="large"
            icon={<UserAddOutlined />}
            onClick={() => window.location.href = '/auth/register'}
          >
            Registrarse Gratis
          </Button>
        </Space>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center', background: '#001529', color: 'white' }}>
      Gestor POS ©2025 - Sistema de Gestión Empresarial
    </Footer>
  </Layout>
)

// Página de login
const LoginPage: React.FC = () => (
  <Layout style={{ minHeight: '100vh' }} className="page-enter">
    <AppHeader currentPage="Iniciar Sesión" />
    <Content style={{ 
      padding: '50px', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <LoginOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '24px' }} />
        <Title level={3}>Iniciar Sesión</Title>
        <div style={{ 
          background: '#f9f9f9', 
          padding: '24px', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Text>Formulario de inicio de sesión en desarrollo...</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Sistema de autenticación funcional próximamente
          </Text>
        </div>
        <Button 
          type="default" 
          onClick={() => window.location.href = '/'}
          style={{ width: '100%' }}
        >
          ← Volver al inicio
        </Button>
      </Card>
    </Content>
  </Layout>
)

// Página de registro
const RegisterPage: React.FC = () => (
  <Layout style={{ minHeight: '100vh' }} className="page-enter">
    <AppHeader currentPage="Registro" />
    <Content style={{ 
      padding: '50px', 
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Card style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <UserAddOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '24px' }} />
        <Title level={3}>Registro</Title>
        <div style={{ 
          background: '#f9f9f9', 
          padding: '24px', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Text>Formulario de registro en desarrollo...</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Crear cuenta funcional próximamente
          </Text>
        </div>
        <Button 
          type="default" 
          onClick={() => window.location.href = '/'}
          style={{ width: '100%' }}
        >
          ← Volver al inicio
        </Button>
      </Card>
    </Content>
  </Layout>
)

// Dashboard simplificado
const DashboardPage: React.FC = () => (
  <Layout style={{ minHeight: '100vh' }} className="page-enter">
    <AppHeader currentPage="Dashboard" />
    <Content style={{ padding: '24px', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>
          📊 Dashboard Empresarial
        </Title>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }} className="dashboard-grid">
          <Card hoverable onClick={() => window.location.href = '/dashboard/products'}>
            <div style={{ textAlign: 'center' }}>
              <ShopOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
              <Title level={4}>Productos</Title>
              <Text>Gestión del catálogo</Text>
            </div>
          </Card>
          
          <Card hoverable onClick={() => window.location.href = '/dashboard/sales'}>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
              <Title level={4}>Ventas</Title>
              <Text>Punto de venta</Text>
            </div>
          </Card>
          
          <Card hoverable onClick={() => window.location.href = '/dashboard/customers'}>
            <div style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '12px' }} />
              <Title level={4}>Clientes</Title>
              <Text>Base de datos</Text>
            </div>
          </Card>
          
          <Card hoverable onClick={() => window.location.href = '/dashboard/reports'}>
            <div style={{ textAlign: 'center' }}>
              <BarChartOutlined style={{ fontSize: '32px', color: '#fa8c16', marginBottom: '12px' }} />
              <Title level={4}>Reportes</Title>
              <Text>Análisis y métricas</Text>
            </div>
          </Card>
        </div>
      </div>
    </Content>
  </Layout>
)

// Página genérica para módulos
const ModulePage: React.FC<{ title: string; icon: React.ReactNode; description: string }> = ({ title, icon, description }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <AppHeader currentPage={title} />
    <Content style={{ padding: '50px', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>{icon}</div>
        <Title level={2}>{title}</Title>
        <Text style={{ fontSize: '16px', color: '#666', display: 'block', marginBottom: '32px' }}>
          {description}
        </Text>
        <Card style={{ marginBottom: '24px' }}>
          <Text>Este módulo está en desarrollo activo. Próximamente tendrás acceso a todas las funcionalidades.</Text>
        </Card>
        <Button 
          type="primary" 
          onClick={() => window.location.href = '/dashboard'}
        >
          ← Volver al Dashboard
        </Button>
      </div>
    </Content>
  </Layout>
)

const App: React.FC = () => {
  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<HomePage />} />
      
      {/* Autenticación */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/products" element={
        <ModulePage 
          title="Gestión de Productos" 
          icon={<ShopOutlined />}
          description="Administra tu catálogo de productos, precios, stock y categorías"
        />
      } />
      <Route path="/dashboard/sales" element={
        <ModulePage 
          title="Punto de Venta" 
          icon={<BarChartOutlined />}
          description="Sistema POS completo para procesar ventas y pagos"
        />
      } />
      <Route path="/dashboard/customers" element={
        <ModulePage 
          title="Gestión de Clientes" 
          icon={<TeamOutlined />}
          description="Base de datos de clientes y historial de compras"
        />
      } />
      <Route path="/dashboard/reports" element={
        <ModulePage 
          title="Reportes y Analytics" 
          icon={<BarChartOutlined />}
          description="Análisis detallados de ventas, inventario y rendimiento"
        />
      } />
      
      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
