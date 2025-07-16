import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Layout, Menu, Button, Space } from 'antd'
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout

const PublicLayout: React.FC = () => {
  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">Inicio</Link>,
    },
    {
      key: 'pricing',
      label: <Link to="/pricing">Precios</Link>,
    },
    {
      key: 'about',
      label: <Link to="/about">Acerca de</Link>,
    },
    {
      key: 'contact',
      label: <Link to="/contact">Contacto</Link>,
    },
  ]

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 mr-8">
              Gestor POS
            </Link>
            <Menu
              mode="horizontal"
              items={menuItems}
              className="border-none"
              style={{ background: 'transparent' }}
            />
          </div>
          <Space>
            <Button type="text" icon={<LoginOutlined />}>
              <Link to="/auth/login">Iniciar Sesión</Link>
            </Button>
            <Button type="primary" icon={<UserAddOutlined />}>
              <Link to="/auth/register">Registrarse</Link>
            </Button>
          </Space>
        </div>
      </Header>
      <Content className="flex-1">
        <Outlet />
      </Content>
      <Footer className="text-center bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p>&copy; 2024 Gestor POS. Todos los derechos reservados.</p>
        </div>
      </Footer>
    </Layout>
  )
}

export default PublicLayout
