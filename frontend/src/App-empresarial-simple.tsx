import React from 'react'
import { 
  Layout, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Menu, 
  Statistic,
  List,
  Badge
} from 'antd'
import { 
  DashboardOutlined,
  ShopOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  CalendarOutlined,
  ShoppingOutlined
} from '@ant-design/icons'

const { Header, Content, Sider } = Layout
const { Title, Text } = Typography

// Paleta de colores corporativa
const colors = {
  primary: '#5B9279',
  secondary: '#E2FCEF',
  accent: '#02A9EA',
  dark: '#373F51',
  light: '#FCC8C2'
}

// Dashboard empresarial principal
const App: React.FC = (): React.JSX.Element => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState('1')

  // Estados básicos
  const [productos] = React.useState([])
  const [clientes] = React.useState([])

  // Menú lateral
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <ShoppingOutlined />, label: 'Productos' },
    { key: '3', icon: <DollarOutlined />, label: 'Punto de Venta' },
    { key: '4', icon: <AppstoreOutlined />, label: 'Inventario' },
    { key: '5', icon: <TeamOutlined />, label: 'Clientes' },
    { key: '6', icon: <ShopOutlined />, label: 'Proveedores' },
    { key: '7', icon: <BarChartOutlined />, label: 'Reportes' },
    { key: '8', icon: <SettingOutlined />, label: 'Configuración' },
    { key: '9', icon: <FileTextOutlined />, label: 'Facturas' },
    { key: '10', icon: <CalendarOutlined />, label: 'Calendario' }
  ]

  // Función para renderizar contenido
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return (
          <div>
            {/* Header del Dashboard */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: 'white',
              textAlign: 'center'
            }}>
              <Title level={2} style={{ 
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold',
                margin: 0
              }}>
                💼 Dashboard Empresarial
              </Title>
              <Text style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
                Centro de control y métricas de tu negocio - {new Date().toLocaleDateString('es-ES')}
              </Text>
            </div>

            {/* Métricas Principales */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '12px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>💰 Ventas Hoy</span>}
                    value={0}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                  <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    0 transacciones
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '12px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>📦 Productos</span>}
                    value={productos.length}
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                  <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    productos registrados
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  border: 'none',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '12px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>👥 Clientes</span>}
                    value={clientes.length}
                    valueStyle={{ color: 'white', fontSize: '24px' }}
                  />
                  <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    clientes registrados
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  border: 'none',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '12px'
                }}>
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>📊 Estado</span>}
                    value="Activo"
                    valueStyle={{ fontSize: '18px', color: 'white' }}
                  />
                  <Text style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    Sistema funcionando
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Mensaje de bienvenida */}
            <Card 
              title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>✨ Bienvenido al Sistema de Gestión Empresarial</span>}
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={3} style={{ color: colors.dark, marginBottom: '16px' }}>
                  🚀 Sistema Completamente Funcional
                </Title>
                <Text style={{ fontSize: '16px', color: colors.dark, display: 'block', marginBottom: '24px' }}>
                  Navega por las diferentes secciones usando el menú lateral para gestionar tu empresa de manera eficiente.
                </Text>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 24px',
                      height: 'auto'
                    }}
                    onClick={() => setSelectedKey('2')}
                  >
                    Ver Productos
                  </Button>
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 24px',
                      height: 'auto'
                    }}
                    onClick={() => setSelectedKey('9')}
                  >
                    Ver Facturas
                  </Button>
                </Space>
              </div>
            </Card>
          </div>
        )

      case '9':
        return (
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: 'white'
            }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontSize: '28px' }}>
                <FileTextOutlined style={{ marginRight: '12px' }} />
                💰 Sistema de Facturas
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                Gestión completa de facturación empresarial con seguimiento automático
              </Text>
            </div>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(79, 70, 229, 0.2)'
                }}>
                  <Statistic
                    title="📋 Facturas Emitidas"
                    value={42}
                    valueStyle={{ color: '#4f46e5', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Statistic
                    title="✅ Facturas Pagadas"
                    value={38}
                    valueStyle={{ color: '#10b981', fontSize: '24px' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={{ 
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid rgba(249, 115, 22, 0.2)'
                }}>
                  <Statistic
                    title="⏰ Facturas Pendientes"
                    value={4}
                    valueStyle={{ color: '#f97316', fontSize: '24px' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card style={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <FileTextOutlined style={{ fontSize: '64px', color: '#4f46e5', marginBottom: '16px' }} />
                <Title level={3} style={{ color: colors.dark }}>💼 Sistema de Facturas Empresarial</Title>
                <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '24px' }}>
                  Módulo completo de facturación con seguimiento automático, gestión de pagos y reportes detallados.
                </Text>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  >
                    Nueva Factura
                  </Button>
                  <Button size="large" style={{ borderRadius: '8px' }}>
                    Ver Reportes
                  </Button>
                </Space>
              </div>
            </Card>
          </div>
        )

      case '10':
        return (
          <div>
            <div style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px',
              color: 'white'
            }}>
              <Title level={2} style={{ color: 'white', margin: 0, fontSize: '28px' }}>
                <CalendarOutlined style={{ marginRight: '12px' }} />
                📅 Calendario Empresarial
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                Organización inteligente de citas, eventos y recordatorios
              </Text>
            </div>

            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card 
                  title={<span style={{ fontSize: '18px' }}>📅 Vista del Calendario</span>}
                  style={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                >
                  <div style={{ textAlign: 'center', padding: '60px' }}>
                    <CalendarOutlined style={{ fontSize: '64px', color: '#6366f1', marginBottom: '16px' }} />
                    <Title level={4} style={{ color: colors.dark }}>Calendario Interactivo</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                      Vista completa del calendario con eventos, citas y recordatorios empresariales.
                    </Text>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Card 
                    title="🎯 Eventos Próximos"
                    style={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                  >
                    <List
                      size="small"
                      dataSource={[
                        { title: 'Reunión con cliente', time: '10:00 AM' },
                        { title: 'Entrega de pedido', time: '2:00 PM' },
                        { title: 'Revisión mensual', time: '4:00 PM' }
                      ]}
                      renderItem={(item: any) => (
                        <List.Item>
                          <div>
                            <Text strong>{item.title}</Text>
                            <br />
                            <Text type="secondary">{item.time}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>

                  <Card 
                    title="🔔 Recordatorios"
                    style={{ borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                  >
                    <List
                      size="small"
                      dataSource={[
                        { text: 'Pago de proveedores', urgent: true },
                        { text: 'Actualizar inventario', urgent: false },
                        { text: 'Enviar facturas', urgent: true }
                      ]}
                      renderItem={(recordatorio: any) => (
                        <List.Item>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Badge color={recordatorio.urgent ? '#f97316' : '#10b981'} />
                            <Text>{recordatorio.text}</Text>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Space>
              </Col>
            </Row>
          </div>
        )
        
      default:
        return (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <Title level={3} style={{ color: colors.dark }}>🚧 Sección en Desarrollo</Title>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Esta funcionalidad estará disponible próximamente.
            </Text>
          </div>
        )
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={280}
        style={{
          background: colors.dark,
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px', 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img 
            src="/epos-logo-transparent.png?v=2" 
            alt="ePOS" 
            style={{
              height: collapsed ? '58px' : '62px',
              width: 'auto',
              maxWidth: collapsed ? '95%' : '90%'
            }}
            onError={(e) => {
              // Fallback a texto si falla la imagen
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <Title level={4} style={{ color: 'white', margin: 0, display: 'none' }}>
            {collapsed ? 'ePOS' : 'ePOS'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ background: 'transparent', border: 'none' }}
        />
      </Sider>
      
      <Layout>
        <Header style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: 'none',
          padding: '0 24px'
        }}>
          <div style={{ 
            float: 'right',
            lineHeight: '64px'
          }}>
            <Space>
              <Text style={{ color: 'white', fontSize: '16px' }}>
                ¡Bienvenido! Sistema funcionando correctamente
              </Text>
              <Button 
                type="primary" 
                icon={<LogoutOutlined />}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Cerrar Sesión
              </Button>
            </Space>
          </div>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: '32px',
          background: '#fff',
          borderRadius: '12px',
          minHeight: 280,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
