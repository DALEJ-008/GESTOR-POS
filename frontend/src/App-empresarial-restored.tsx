// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import { Layout, Button, Card, Typography, Space, Row, Col, Form, Input, Checkbox, message, Menu, Table, Tag, Modal, Select, InputNumber, Statistic, Progress, Radio } from 'antd'
import { 
  HomeOutlined, 
  LoginOutlined, 
  UserAddOutlined, 
  DashboardOutlined,
  ShopOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  TrophyOutlined,
  SafetyOutlined,
  CloudOutlined,
  UserOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout
const { Title, Text, Paragraph } = Typography

// Paleta de colores personalizada
const colors = {
  primary: '#5B9279',     // Verde principal - Para elementos principales y botones
  secondary: '#E2FCEF',   // Verde claro - Para fondos y áreas destacadas
  accent: '#02A9EA',      // Azul - Para enlaces y elementos interactivos
  dark: '#373F51',        // Gris oscuro - Para textos y elementos de contraste
  light: '#FCC8C2'        // Rosa claro - Para alertas suaves y elementos decorativos
}

// Estilos personalizados
const customStyles = {
  header: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderBottom: 'none'
  },
  sider: {
    background: colors.dark,
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
  },
  content: {
    background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
    minHeight: 'calc(100vh - 64px)'
  },
  menuItem: {
    color: '#ffffff',
    borderRadius: '8px',
    margin: '4px 8px',
    '&:hover': {
      backgroundColor: colors.primary,
      color: '#ffffff'
    }
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: `0 2px 4px ${colors.primary}40`,
    '&:hover': {
      backgroundColor: colors.accent,
      borderColor: colors.accent
    }
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.secondary}`,
    overflow: 'hidden'
  },
  cardHeader: {
    background: `linear-gradient(45deg, ${colors.secondary} 0%, #ffffff 100%)`,
    borderBottom: `2px solid ${colors.primary}`,
    color: colors.dark
  }
}

// Componente de botón personalizado
const CustomButton = ({ type = 'default', ...props }) => {
  const buttonStyle = type === 'primary' ? {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: `0 2px 4px ${colors.primary}40`,
    borderRadius: '6px',
    fontWeight: 500
  } : type === 'accent' ? {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: 'white',
    boxShadow: `0 2px 4px ${colors.accent}40`,
    borderRadius: '6px',
    fontWeight: 500
  } : type === 'danger' ? {
    backgroundColor: colors.light,
    borderColor: '#ff4d4f',
    color: '#ff4d4f',
    borderRadius: '6px'
  } : {}

  return (
    <Button 
      {...props} 
      type={type} 
      style={{ 
        ...buttonStyle, 
        ...props.style 
      }}
      onMouseEnter={(e) => {
        if (type === 'primary') {
          e.target.style.backgroundColor = colors.accent
          e.target.style.borderColor = colors.accent
        }
      }}
      onMouseLeave={(e) => {
        if (type === 'primary') {
          e.target.style.backgroundColor = colors.primary
          e.target.style.borderColor = colors.primary
        }
      }}
    />
  )
}

// Componente de Card personalizada
const CustomCard = ({ title, children, ...props }) => {
  return (
    <Card
      {...props}
      style={{
        ...customStyles.card,
        ...props.style
      }}
      title={
        <div style={customStyles.cardHeader}>
          {title}
        </div>
      }
    >
      {children}
    </Card>
  )
}

// Hook de autenticación
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true)
  
  const login = () => setIsAuthenticated(true)
  const logout = () => setIsAuthenticated(false)
  
  return { isAuthenticated, login, logout }
}

// Dashboard empresarial con sidebar
const DashboardPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }): React.JSX.Element => {
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState('1')

  // Estados para Productos con persistencia en localStorage
  const [productos, setProductos] = React.useState(() => {
    const productosGuardados = localStorage.getItem('gestor_productos')
    return productosGuardados ? JSON.parse(productosGuardados) : []
  })

  // Estados para Clientes con persistencia en localStorage
  const [clientes, setClientes] = React.useState(() => {
    const clientesGuardados = localStorage.getItem('gestor_clientes')
    return clientesGuardados ? JSON.parse(clientesGuardados) : []
  })

  // Estados para Proveedores con persistencia en localStorage
  const [proveedores, setProveedores] = React.useState(() => {
    const proveedoresGuardados = localStorage.getItem('gestor_proveedores')
    return proveedoresGuardados ? JSON.parse(proveedoresGuardados) : []
  })

  // Estados para Gastos con persistencia en localStorage
  const [gastos, setGastos] = React.useState(() => {
    const gastosGuardados = localStorage.getItem('gestor_gastos')
    return gastosGuardados ? JSON.parse(gastosGuardados) : []
  })

  // Estados para Compras con persistencia en localStorage
  const [compras, setCompras] = React.useState(() => {
    const comprasGuardadas = localStorage.getItem('gestor_compras')
    return comprasGuardadas ? JSON.parse(comprasGuardadas) : []
  })

  const [ventas, setVentas] = React.useState(() => {
    const ventasGuardadas = localStorage.getItem('gestor_ventas')
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : []
  })

  // Estados para Carrito POS
  const [carritoItems, setCarritoItems] = React.useState<any[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState<string | null>(null)

  // Estados para Modales
  const [modalProductoVisible, setModalProductoVisible] = React.useState(false)
  const [modalClienteVisible, setModalClienteVisible] = React.useState(false)
  const [modalProveedorVisible, setModalProveedorVisible] = React.useState(false)
  const [modalFacturaVisible, setModalFacturaVisible] = React.useState(false)
  const [editandoItem, setEditandoItem] = React.useState<any>(null)

  // Forms
  const [formProducto] = Form.useForm()
  const [formCliente] = Form.useForm()
  const [formProveedor] = Form.useForm()

  // Funciones CRUD para Productos
  const agregarProducto = (valores: any) => {
    const nuevoProducto = {
      key: Date.now().toString(),
      codigo: `PROD-${String(productos.length + 1).padStart(3, '0')}`,
      ...valores,
      estado: valores.stock > 0 ? 'Activo' : 'Sin Stock'
    }
    const nuevosProductos = [...productos, nuevoProducto]
    setProductos(nuevosProductos)
    localStorage.setItem('gestor_productos', JSON.stringify(nuevosProductos))
    setModalProductoVisible(false)
    formProducto.resetFields()
    message.success('Producto agregado exitosamente')
  }

  const editarProducto = (valores: any) => {
    const productosActualizados = productos.map(producto => 
      producto.key === editandoItem.key 
        ? { ...producto, ...valores, estado: valores.stock > 0 ? 'Activo' : 'Sin Stock' }
        : producto
    )
    setProductos(productosActualizados)
    localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))
    setModalProductoVisible(false)
    setEditandoItem(null)
    formProducto.resetFields()
    message.success('Producto actualizado exitosamente')
  }

  const eliminarProducto = (key: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este producto?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        const productosActualizados = productos.filter(producto => producto.key !== key)
        setProductos(productosActualizados)
        localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))
        message.success('Producto eliminado exitosamente')
      }
    })
  }

  // Funciones CRUD para Clientes
  const agregarCliente = (valores: any) => {
    const nuevoCliente = {
      key: Date.now().toString(),
      codigo: `CLI-${String(clientes.length + 1).padStart(3, '0')}`,
      ...valores
    }
    const nuevosClientes = [...clientes, nuevoCliente]
    setClientes(nuevosClientes)
    localStorage.setItem('gestor_clientes', JSON.stringify(nuevosClientes))
    setModalClienteVisible(false)
    formCliente.resetFields()
    message.success('Cliente agregado exitosamente')
  }

  const editarCliente = (valores: any) => {
    const clientesActualizados = clientes.map(cliente => 
      cliente.key === editandoItem.key 
        ? { ...cliente, ...valores }
        : cliente
    )
    setClientes(clientesActualizados)
    localStorage.setItem('gestor_clientes', JSON.stringify(clientesActualizados))
    setModalClienteVisible(false)
    setEditandoItem(null)
    formCliente.resetFields()
    message.success('Cliente actualizado exitosamente')
  }

  const eliminarCliente = (key: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este cliente?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        const clientesActualizados = clientes.filter(cliente => cliente.key !== key)
        setClientes(clientesActualizados)
        localStorage.setItem('gestor_clientes', JSON.stringify(clientesActualizados))
        message.success('Cliente eliminado exitosamente')
      }
    })
  }

  // Función para generar datos de ejemplo
  const generarDatosEjemplo = () => {
    const productosEjemplo = [
      {
        key: '1',
        codigo: 'PROD-001',
        nombre: 'Laptop HP Pavilion 15',
        categoria: 'Electrónicos',
        precio: 899.99,
        stock: 15,
        estado: 'Activo',
        descripcion: 'Laptop HP con procesador Intel i5, 8GB RAM, 256GB SSD'
      },
      {
        key: '2',
        codigo: 'PROD-002',
        nombre: 'Mouse Logitech MX Master 3',
        categoria: 'Accesorios',
        precio: 99.99,
        stock: 25,
        estado: 'Activo',
        descripcion: 'Mouse ergonómico inalámbrico de alta precisión'
      },
      {
        key: '3',
        codigo: 'PROD-003',
        nombre: 'Teclado Mecánico Corsair K95',
        categoria: 'Accesorios',
        precio: 179.99,
        stock: 8,
        estado: 'Activo',
        descripcion: 'Teclado mecánico RGB con switches Cherry MX'
      },
      {
        key: '4',
        codigo: 'PROD-004',
        nombre: 'Monitor Samsung 24"',
        categoria: 'Electrónicos',
        precio: 299.99,
        stock: 12,
        estado: 'Activo',
        descripcion: 'Monitor Full HD 1920x1080, 75Hz, IPS'
      },
      {
        key: '5',
        codigo: 'PROD-005',
        nombre: 'Smartphone iPhone 13',
        categoria: 'Móviles',
        precio: 799.99,
        stock: 5,
        estado: 'Activo',
        descripcion: 'iPhone 13 128GB, cámara dual, iOS 15'
      }
    ]

    const clientesEjemplo = [
      {
        key: '1',
        codigo: 'CLI-001',
        nombre: 'Juan Carlos Pérez',
        email: 'juan.perez@email.com',
        telefono: '+57 300 123 4567',
        direccion: 'Calle 123 #45-67, Bogotá',
        tipoDocumento: 'Cédula',
        numeroDocumento: '12345678'
      },
      {
        key: '2',
        codigo: 'CLI-002',
        nombre: 'María González López',
        email: 'maria.gonzalez@email.com',
        telefono: '+57 310 987 6543',
        direccion: 'Carrera 78 #12-34, Medellín',
        tipoDocumento: 'Cédula',
        numeroDocumento: '87654321'
      },
      {
        key: '3',
        codigo: 'CLI-003',
        nombre: 'Tech Solutions SAS',
        email: 'contacto@techsolutions.com',
        telefono: '+57 601 234 5678',
        direccion: 'Zona Rosa, Calle 85 #15-20, Bogotá',
        tipoDocumento: 'NIT',
        numeroDocumento: '900123456-1'
      }
    ]

    setProductos(productosEjemplo)
    setClientes(clientesEjemplo)
    localStorage.setItem('gestor_productos', JSON.stringify(productosEjemplo))
    localStorage.setItem('gestor_clientes', JSON.stringify(clientesEjemplo))
    message.success('Datos de ejemplo cargados exitosamente')
  }

  // Menú lateral
  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: 'Productos',
    },
    {
      key: '3',
      icon: <DollarOutlined />,
      label: 'Punto de Venta',
    },
    {
      key: '4',
      icon: <AppstoreOutlined />,
      label: 'Inventario',
    },
    {
      key: '5',
      icon: <TeamOutlined />,
      label: 'Clientes',
    },
    {
      key: '6',
      icon: <ShopOutlined />,
      label: 'Proveedores',
    },
    {
      key: '7',
      icon: <BarChartOutlined />,
      label: 'Reportes',
    },
    {
      key: '8',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
    {
      key: '9',
      icon: <FileTextOutlined />,
      label: 'Facturas',
    },
    {
      key: '10',
      icon: <CalendarOutlined />,
      label: 'Calendario',
    }
  ]

  // Función para renderizar contenido según la sección seleccionada
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return (
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: '32px' }}>
              <Col>
                <Title level={2} style={{ margin: 0, color: colors.dark }}>
                  <DashboardOutlined style={{ marginRight: '12px', color: colors.primary }} />
                  Dashboard Empresarial
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Resumen general de tu negocio
                </Text>
              </Col>
              <Col>
                <Space>
                  <CustomButton 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={generarDatosEjemplo}
                  >
                    Cargar Datos de Ejemplo
                  </CustomButton>
                </Space>
              </Col>
            </Row>
            
            {/* Estadísticas principales */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} sm={12} lg={6}>
                <CustomCard>
                  <Statistic
                    title="Ventas del Día"
                    value={1128}
                    prefix="$"
                    valueStyle={{ color: '#3f8600', fontSize: '28px', fontWeight: 'bold' }}
                    suffix={
                      <div style={{ fontSize: '14px', color: '#52c41a' }}>
                        <UpOutlined /> +12%
                      </div>
                    }
                  />
                </CustomCard>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <CustomCard>
                  <Statistic
                    title="Productos Activos"
                    value={productos.length}
                    valueStyle={{ color: colors.primary, fontSize: '28px', fontWeight: 'bold' }}
                    suffix={
                      <div style={{ fontSize: '14px', color: colors.accent }}>
                        <ShoppingOutlined />
                      </div>
                    }
                  />
                </CustomCard>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <CustomCard>
                  <Statistic
                    title="Clientes Registrados"
                    value={clientes.length}
                    valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
                    suffix={
                      <div style={{ fontSize: '14px', color: '#722ed1' }}>
                        <TeamOutlined />
                      </div>
                    }
                  />
                </CustomCard>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <CustomCard>
                  <Statistic
                    title="Stock Bajo"
                    value={productos.filter(p => p.stock < 10).length}
                    valueStyle={{ color: '#cf1322', fontSize: '28px', fontWeight: 'bold' }}
                    suffix={
                      <div style={{ fontSize: '14px', color: '#cf1322' }}>
                        <WarningOutlined />
                      </div>
                    }
                  />
                </CustomCard>
              </Col>
            </Row>

            {/* Gráficos y resúmenes */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <CustomCard title="Ventas de los Últimos 7 Días">
                  <div style={{ 
                    height: '300px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <BarChartOutlined style={{ fontSize: '48px', color: colors.primary, marginBottom: '16px' }} />
                      <Title level={4} style={{ color: colors.dark }}>Gráfico de Ventas</Title>
                      <Text type="secondary">Los datos se mostrarán aquí cuando tengas ventas registradas</Text>
                    </div>
                  </div>
                </CustomCard>
              </Col>
              
              <Col xs={24} lg={8}>
                <CustomCard title="Productos Más Vendidos">
                  <div style={{ height: '300px' }}>
                    {productos.length > 0 ? (
                      <div>
                        {productos.slice(0, 5).map((producto, index) => (
                          <div key={producto.key} style={{ 
                            padding: '12px 0', 
                            borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <Text strong>{producto.nombre}</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {producto.categoria}
                              </Text>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>
                                ${producto.precio}
                              </Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                Stock: {producto.stock}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <ShoppingOutlined style={{ fontSize: '48px', color: colors.secondary, marginBottom: '16px' }} />
                        <Text type="secondary">No hay productos registrados</Text>
                        <CustomButton 
                          type="primary" 
                          size="small" 
                          style={{ marginTop: '8px' }}
                          onClick={generarDatosEjemplo}
                        >
                          Cargar Datos de Ejemplo
                        </CustomButton>
                      </div>
                    )}
                  </div>
                </CustomCard>
              </Col>
            </Row>
          </div>
        )

      case '2':
        return (
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
              <Col>
                <Title level={2} style={{ margin: 0, color: colors.dark }}>
                  <ShoppingOutlined style={{ marginRight: '12px', color: colors.primary }} />
                  Gestión de Productos
                </Title>
                <Text type="secondary">Administra tu catálogo de productos</Text>
              </Col>
              <Col>
                <Space>
                  <CustomButton 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditandoItem(null)
                      formProducto.resetFields()
                      setModalProductoVisible(true)
                    }}
                  >
                    Nuevo Producto
                  </CustomButton>
                  <CustomButton 
                    icon={<DownloadOutlined />}
                    onClick={generarDatosEjemplo}
                  >
                    Datos de Ejemplo
                  </CustomButton>
                </Space>
              </Col>
            </Row>

            <CustomCard>
              <Table
                dataSource={productos}
                columns={[
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    width: 120,
                  },
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    ellipsis: true,
                  },
                  {
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    width: 120,
                    render: (categoria) => (
                      <Tag color="blue">{categoria}</Tag>
                    ),
                  },
                  {
                    title: 'Precio',
                    dataIndex: 'precio',
                    key: 'precio',
                    width: 100,
                    render: (precio) => `$${precio?.toFixed(2)}`,
                  },
                  {
                    title: 'Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 80,
                    render: (stock) => (
                      <span style={{ 
                        color: stock < 10 ? '#ff4d4f' : stock < 50 ? '#faad14' : '#52c41a',
                        fontWeight: 'bold'
                      }}>
                        {stock}
                      </span>
                    ),
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'estado',
                    key: 'estado',
                    width: 100,
                    render: (estado) => (
                      <Tag color={estado === 'Activo' ? 'green' : 'red'}>
                        {estado}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Acciones',
                    key: 'acciones',
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => {
                            setEditandoItem(record)
                            formProducto.setFieldsValue(record)
                            setModalProductoVisible(true)
                          }}
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          onClick={() => eliminarProducto(record.key)}
                        />
                      </Space>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`,
                }}
                locale={{
                  emptyText: (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                      <ShoppingOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                      <Title level={4} style={{ color: colors.dark }}>No hay productos registrados</Title>
                      <Text type="secondary">Comienza agregando tu primer producto</Text>
                      <br />
                      <CustomButton 
                        type="primary" 
                        style={{ marginTop: '16px' }}
                        onClick={() => setModalProductoVisible(true)}
                      >
                        Agregar Producto
                      </CustomButton>
                    </div>
                  ),
                }}
              />
            </CustomCard>

            {/* Modal para agregar/editar producto */}
            <Modal
              title={editandoItem ? 'Editar Producto' : 'Nuevo Producto'}
              visible={modalProductoVisible}
              onCancel={() => {
                setModalProductoVisible(false)
                setEditandoItem(null)
                formProducto.resetFields()
              }}
              footer={null}
              width={600}
            >
              <Form 
                form={formProducto} 
                layout="vertical" 
                onFinish={editandoItem ? editarProducto : agregarProducto}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="nombre" label="Nombre del Producto" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                      <Input placeholder="Ej: Laptop HP Pavilion" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="categoria" label="Categoría" rules={[{ required: true, message: 'Seleccione la categoría' }]}>
                      <Select placeholder="Seleccionar categoría">
                        <Select.Option value="Electrónicos">Electrónicos</Select.Option>
                        <Select.Option value="Accesorios">Accesorios</Select.Option>
                        <Select.Option value="Móviles">Móviles</Select.Option>
                        <Select.Option value="Oficina">Oficina</Select.Option>
                        <Select.Option value="Hogar">Hogar</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="precio" label="Precio" rules={[{ required: true, message: 'Ingrese el precio' }]}>
                      <InputNumber 
                        style={{ width: '100%' }}
                        min={0} 
                        step={0.01}
                        placeholder="0.00" 
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Ingrese el stock' }]}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="descripcion" label="Descripción">
                  <Input.TextArea rows={3} placeholder="Descripción del producto" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <CustomButton type="primary" htmlType="submit">
                      {editandoItem ? 'Actualizar' : 'Guardar'}
                    </CustomButton>
                    <Button onClick={() => {
                      setModalProductoVisible(false)
                      setEditandoItem(null)
                      formProducto.resetFields()
                    }}>
                      Cancelar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )

      case '3':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <DollarOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
              Punto de Venta
            </Title>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <CustomCard title="Carrito de Ventas">
                  <div style={{ 
                    minHeight: '400px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#fafafa',
                    borderRadius: '8px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <ShoppingCartOutlined style={{ fontSize: '64px', color: colors.primary, marginBottom: '16px' }} />
                      <Title level={4} style={{ color: colors.dark }}>Punto de Venta</Title>
                      <Text type="secondary">Aquí podrás realizar ventas cuando tengas productos</Text>
                      <br />
                      <CustomButton 
                        type="primary" 
                        style={{ marginTop: '16px' }}
                        onClick={() => setSelectedKey('2')}
                      >
                        Ir a Productos
                      </CustomButton>
                    </div>
                  </div>
                </CustomCard>
              </Col>
              
              <Col xs={24} lg={8}>
                <CustomCard title="Resumen de Venta">
                  <div style={{ minHeight: '400px', padding: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>Subtotal: </Text>
                      <Text style={{ float: 'right' }}>$0.00</Text>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>IVA (19%): </Text>
                      <Text style={{ float: 'right' }}>$0.00</Text>
                    </div>
                    <div style={{ marginBottom: '24px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                      <Text strong style={{ fontSize: '18px' }}>Total: </Text>
                      <Text style={{ float: 'right', fontSize: '18px', fontWeight: 'bold', color: colors.primary }}>$0.00</Text>
                    </div>
                    <CustomButton type="primary" block disabled>
                      Procesar Venta
                    </CustomButton>
                  </div>
                </CustomCard>
              </Col>
            </Row>
          </div>
        )

      case '4':
        return (
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
              <Col>
                <Title level={2} style={{ margin: 0, color: colors.dark }}>
                  <AppstoreOutlined style={{ marginRight: '12px', color: colors.accent }} />
                  Gestión de Inventario
                </Title>
                <Text type="secondary">Controla el stock de tus productos</Text>
              </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <CustomCard>
                  <Statistic
                    title="Valor Total Inventario"
                    value={productos.reduce((total, item) => total + (item.precio * item.stock), 0)}
                    prefix="$"
                    precision={2}
                    valueStyle={{ color: colors.primary, fontSize: '24px', fontWeight: 'bold' }}
                  />
                </CustomCard>
              </Col>
              <Col xs={24} sm={8}>
                <CustomCard>
                  <Statistic
                    title="Productos con Stock Bajo"
                    value={productos.filter(p => p.stock < 10).length}
                    valueStyle={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}
                    suffix={<WarningOutlined />}
                  />
                </CustomCard>
              </Col>
              <Col xs={24} sm={8}>
                <CustomCard>
                  <Statistic
                    title="Productos Sin Stock"
                    value={productos.filter(p => p.stock === 0).length}
                    valueStyle={{ color: '#ff4d4f', fontSize: '24px', fontWeight: 'bold' }}
                    suffix={<AlertOutlined />}
                  />
                </CustomCard>
              </Col>
            </Row>

            <CustomCard>
              <Table
                dataSource={productos}
                columns={[
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    width: 100,
                  },
                  {
                    title: 'Producto',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    ellipsis: true,
                  },
                  {
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    width: 120,
                    render: (categoria) => <Tag color="blue">{categoria}</Tag>,
                  },
                  {
                    title: 'Precio Unitario',
                    dataIndex: 'precio',
                    key: 'precio',
                    width: 120,
                    render: (precio) => `$${precio?.toFixed(2)}`,
                  },
                  {
                    title: 'Stock Actual',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 100,
                    render: (stock) => (
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ 
                          color: stock === 0 ? '#ff4d4f' : stock < 10 ? '#faad14' : '#52c41a',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {stock}
                        </Text>
                      </div>
                    ),
                  },
                  {
                    title: 'Estado Stock',
                    key: 'estadoStock',
                    width: 110,
                    render: (_, record) => {
                      if (record.stock === 0) {
                        return <Tag color="red">Sin Stock</Tag>
                      } else if (record.stock < 10) {
                        return <Tag color="orange">Stock Bajo</Tag>
                      } else {
                        return <Tag color="green">Stock OK</Tag>
                      }
                    },
                  },
                  {
                    title: 'Valor Total',
                    key: 'valorTotal',
                    width: 120,
                    render: (_, record) => (
                      <Text strong style={{ color: colors.primary, fontSize: '14px' }}>
                        ${(record.precio * record.stock).toFixed(2)}
                      </Text>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} items`,
                }}
                locale={{
                  emptyText: (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                      <AppstoreOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                      <Title level={4} style={{ color: colors.dark }}>No hay productos en inventario</Title>
                      <Text type="secondary">Agrega productos para comenzar a gestionar tu inventario</Text>
                      <br />
                      <CustomButton 
                        type="primary" 
                        style={{ marginTop: '16px' }}
                        onClick={() => setSelectedKey('2')}
                      >
                        Agregar Productos
                      </CustomButton>
                    </div>
                  ),
                }}
              />
            </CustomCard>
          </div>
        )

      case '5':
        return (
          <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
              <Col>
                <Title level={2} style={{ margin: 0, color: colors.dark }}>
                  <TeamOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                  Gestión de Clientes
                </Title>
                <Text type="secondary">Administra tu base de clientes</Text>
              </Col>
              <Col>
                <Space>
                  <CustomButton 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditandoItem(null)
                      formCliente.resetFields()
                      setModalClienteVisible(true)
                    }}
                  >
                    Nuevo Cliente
                  </CustomButton>
                </Space>
              </Col>
            </Row>

            <CustomCard>
              <Table
                dataSource={clientes}
                columns={[
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    width: 100,
                  },
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    ellipsis: true,
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                    ellipsis: true,
                  },
                  {
                    title: 'Teléfono',
                    dataIndex: 'telefono',
                    key: 'telefono',
                    width: 150,
                  },
                  {
                    title: 'Documento',
                    key: 'documento',
                    width: 150,
                    render: (_, record) => `${record.tipoDocumento}: ${record.numeroDocumento}`,
                  },
                  {
                    title: 'Acciones',
                    key: 'acciones',
                    width: 120,
                    render: (_, record) => (
                      <Space>
                        <Button
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => {
                            setEditandoItem(record)
                            formCliente.setFieldsValue(record)
                            setModalClienteVisible(true)
                          }}
                        />
                        <Button
                          icon={<DeleteOutlined />}
                          size="small"
                          danger
                          onClick={() => eliminarCliente(record.key)}
                        />
                      </Space>
                    ),
                  },
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} clientes`,
                }}
                locale={{
                  emptyText: (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                      <TeamOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                      <Title level={4} style={{ color: colors.dark }}>No hay clientes registrados</Title>
                      <Text type="secondary">Comienza agregando tu primer cliente</Text>
                      <br />
                      <CustomButton 
                        type="primary" 
                        style={{ marginTop: '16px' }}
                        onClick={() => setModalClienteVisible(true)}
                      >
                        Agregar Cliente
                      </CustomButton>
                    </div>
                  ),
                }}
              />
            </CustomCard>

            {/* Modal para agregar/editar cliente */}
            <Modal
              title={editandoItem ? 'Editar Cliente' : 'Nuevo Cliente'}
              visible={modalClienteVisible}
              onCancel={() => {
                setModalClienteVisible(false)
                setEditandoItem(null)
                formCliente.resetFields()
              }}
              footer={null}
              width={600}
            >
              <Form 
                form={formCliente} 
                layout="vertical" 
                onFinish={editandoItem ? editarCliente : agregarCliente}
              >
                <Form.Item name="nombre" label="Nombre Completo" rules={[{ required: true, message: 'Ingrese el nombre' }]}>
                  <Input placeholder="Ej: Juan Carlos Pérez" />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Email inválido' }]}>
                      <Input placeholder="correo@ejemplo.com" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="telefono" label="Teléfono">
                      <Input placeholder="+57 300 123 4567" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="tipoDocumento" label="Tipo de Documento" rules={[{ required: true, message: 'Seleccione el tipo' }]}>
                      <Select placeholder="Seleccionar tipo">
                        <Select.Option value="Cédula">Cédula de Ciudadanía</Select.Option>
                        <Select.Option value="Pasaporte">Pasaporte</Select.Option>
                        <Select.Option value="NIT">NIT</Select.Option>
                        <Select.Option value="Extranjería">Cédula de Extranjería</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="numeroDocumento" label="Número de Documento" rules={[{ required: true, message: 'Ingrese el número' }]}>
                      <Input placeholder="12345678" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="direccion" label="Dirección">
                  <Input.TextArea rows={2} placeholder="Dirección completa" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <CustomButton type="primary" htmlType="submit">
                      {editandoItem ? 'Actualizar' : 'Guardar'}
                    </CustomButton>
                    <Button onClick={() => {
                      setModalClienteVisible(false)
                      setEditandoItem(null)
                      formCliente.resetFields()
                    }}>
                      Cancelar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )

      case '6':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <ShopOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
              Gestión de Proveedores
            </Title>
            <CustomCard>
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <ShopOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                <Title level={4} style={{ color: colors.dark }}>Gestión de Proveedores</Title>
                <Text type="secondary">Esta sección estará disponible próximamente</Text>
              </div>
            </CustomCard>
          </div>
        )

      case '7':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <BarChartOutlined style={{ marginRight: '12px', color: '#13c2c2' }} />
              Reportes y Análisis
            </Title>
            <CustomCard>
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <BarChartOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                <Title level={4} style={{ color: colors.dark }}>Reportes y Análisis</Title>
                <Text type="secondary">Esta sección estará disponible próximamente</Text>
              </div>
            </CustomCard>
          </div>
        )

      case '8':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <SettingOutlined style={{ marginRight: '12px', color: '#8c8c8c' }} />
              Configuración del Sistema
            </Title>
            <CustomCard>
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <SettingOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                <Title level={4} style={{ color: colors.dark }}>Configuración</Title>
                <Text type="secondary">Esta sección estará disponible próximamente</Text>
              </div>
            </CustomCard>
          </div>
        )

      case '9':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <FileTextOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
              Gestión de Facturas
            </Title>
            <CustomCard>
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <FileTextOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                <Title level={4} style={{ color: colors.dark }}>Gestión de Facturas</Title>
                <Text type="secondary">Esta sección estará disponible próximamente</Text>
              </div>
            </CustomCard>
          </div>
        )

      case '10':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px', color: colors.dark }}>
              <CalendarOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
              Calendario de Actividades
            </Title>
            <CustomCard>
              <div style={{ 
                minHeight: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <CalendarOutlined style={{ fontSize: '64px', color: colors.secondary, marginBottom: '16px' }} />
                <Title level={4} style={{ color: colors.dark }}>Calendario</Title>
                <Text type="secondary">Esta sección estará disponible próximamente</Text>
              </div>
            </CustomCard>
          </div>
        )

      default:
        return (
          <div>
            <Title level={2}>Página no encontrada</Title>
            <CustomCard>
              <Text>La sección solicitada no existe.</Text>
            </CustomCard>
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
        style={customStyles.sider}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px', 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>
            {collapsed ? '🏪' : '🏪 Gestor POS'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setSelectedKey(key)}
          style={{ 
            background: 'transparent',
            border: 'none'
          }}
        />
      </Sider>
      
      <Layout>
        <Header style={customStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>
              Sistema de Gestión Empresarial
            </Title>
          </div>
          
          <Space size="large">
            <Button 
              type="text" 
              icon={<UserOutlined />} 
              style={{ color: 'white' }}
              size="large"
            >
              Usuario Admin
            </Button>
            <Button 
              type="text" 
              icon={<LogoutOutlined />} 
              style={{ color: 'white' }}
              size="large"
              onClick={() => {
                Modal.confirm({
                  title: '¿Estás seguro de cerrar sesión?',
                  content: 'Serás redirigido a la página de inicio',
                  okText: 'Sí, cerrar sesión',
                  cancelText: 'Cancelar',
                  onOk: () => {
                    logout()
                    if (onLogout) onLogout()
                  }
                })
              }}
            >
              Cerrar Sesión
            </Button>
          </Space>
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

// Función principal que se exporta
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState('dashboard')
  
  return (
    <div>
      <DashboardPage onLogout={() => setCurrentPage('home')} />
    </div>
  )
}

export default App
