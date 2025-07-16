import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  TeamOutlined,
  InboxOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleMenuClick = (key: string) => {
    navigate(`/dashboard/${key}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const menuItems = [
    {
      key: '',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Productos',
    },
    {
      key: 'inventory',
      icon: <InboxOutlined />,
      label: 'Inventario',
    },
    {
      key: 'sales',
      icon: <FileTextOutlined />,
      label: 'Ventas',
    },
    {
      key: 'pos',
      icon: <ShoppingCartOutlined />,
      label: 'Punto de Venta',
    },
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: 'Clientes',
    },
    {
      key: 'suppliers',
      icon: <UsergroupAddOutlined />,
      label: 'Proveedores',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reportes',
    },
    {
      key: 'configuration',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
      onClick: () => navigate('/dashboard/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      onClick: handleLogout,
    },
  ];

  const selectedKey = location.pathname.replace('/dashboard/', '') || '';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
      >
        <div className="logo p-4 text-white text-center font-bold">
          {collapsed ? 'GP' : 'Gestor POS'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <div className="flex justify-between items-center px-6 h-full">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Space>
              <span>Bienvenido, {user?.first_name || 'Usuario'}</span>
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
              >
                <Avatar 
                  size="large" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                />
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: 6 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout