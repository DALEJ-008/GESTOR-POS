import React, { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Input, Select, Button, Card, Space, Table, Form, Modal, Typography, Row, Col, Statistic } from 'antd'
import { 
  DashboardOutlined, 
  ShoppingOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  TruckOutlined,
  BellOutlined,
  SettingOutlined,
  DollarOutlined,
  PlusOutlined,
  FilterOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography
const { Option } = Select

// Función para normalizar texto para búsqueda
const normalizarTexto = (texto: string): string => {
  return texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// Función para calcular similitud entre textos
const calcularSimilitud = (texto1: string, texto2: string): number => {
  const norm1 = normalizarTexto(texto1)
  const norm2 = normalizarTexto(texto2)
  
  if (norm1.includes(norm2) || norm2.includes(norm1)) {
    return 0.9
  }
  
  const palabras1 = norm1.split(' ')
  const palabras2 = norm2.split(' ')
  
  let coincidencias = 0
  palabras2.forEach(palabra => {
    if (palabras1.some(p => p.includes(palabra) || palabra.includes(p))) {
      coincidencias++
    }
  })
  
  return coincidencias / Math.max(palabras1.length, palabras2.length)
}

const AppEmpresarial: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('1')
  
  // Estados para productos
  const [productos, setProductos] = useState<any[]>([])
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroStock, setFiltroStock] = useState('')
  const [filtroRangoPrecio] = useState<[number, number]>([0, 1000]) // Reservado para futuras funcionalidades
  
  // Estados para inventario  
  const [busquedaInventario, setBusquedaInventario] = useState('')
  const [inventarioFiltrado, setInventarioFiltrado] = useState<any[]>([])
  
  // Form instances
  const [formProducto] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)

  // Generar datos de ejemplo
  const generarDatosEjemplo = () => {
    const datosEjemplo = [
      {
        key: '1',
        codigo: 'PRD001',
        nombre: 'Laptop HP Pavilion 15',
        categoria: 'Electrónicos',
        precio: 899.99,
        stock: 15,
        estado: 'Activo',
        descripcion: 'Laptop HP con procesador Intel i5, 8GB RAM, 256GB SSD',
        proveedor: 'HP Inc.'
      },
      {
        key: '2',
        codigo: 'PRD002',
        nombre: 'Mouse Logitech MX Master 3',
        categoria: 'Accesorios',
        precio: 99.99,
        stock: 25,
        estado: 'Activo',
        descripcion: 'Mouse ergonómico inalámbrico de alta precisión',
        proveedor: 'Logitech'
      },
      {
        key: '3',
        codigo: 'PRD003',
        nombre: 'Teclado Mecánico Corsair K95',
        categoria: 'Accesorios',
        precio: 179.99,
        stock: 8,
        estado: 'Activo',
        descripcion: 'Teclado mecánico RGB con switches Cherry MX',
        proveedor: 'Corsair'
      },
      {
        key: '4',
        codigo: 'PRD004',
        nombre: 'Monitor Samsung 24"',
        categoria: 'Electrónicos',
        precio: 299.99,
        stock: 12,
        estado: 'Activo',
        descripcion: 'Monitor Full HD 1920x1080, 75Hz, IPS',
        proveedor: 'Samsung'
      },
      {
        key: '5',
        codigo: 'PRD005',
        nombre: 'Smartphone iPhone 13',
        categoria: 'Móviles',
        precio: 799.99,
        stock: 5,
        estado: 'Activo',
        descripcion: 'iPhone 13 128GB, cámara dual, iOS 15',
        proveedor: 'Apple'
      }
    ]
    
    setProductos(datosEjemplo)
    setProductosFiltrados(datosEjemplo)
    setInventarioFiltrado(datosEjemplo)
    localStorage.setItem('productos_ejemplo', JSON.stringify(datosEjemplo))
  }

  // Cargar datos al inicio
  useEffect(() => {
    const datosGuardados = localStorage.getItem('productos_ejemplo')
    if (datosGuardados) {
      const datos = JSON.parse(datosGuardados)
      setProductos(datos)
      setProductosFiltrados(datos)
      setInventarioFiltrado(datos)
    } else {
      generarDatosEjemplo()
    }
  }, [])

  // Función de búsqueda para productos
  const buscarProductos = (termino: string) => {
    setBusquedaProducto(termino)
    
    if (!termino.trim()) {
      setProductosFiltrados(productos)
      return
    }
    
    const resultados = productos.filter(producto => {
      const textoCompleto = `${producto.nombre} ${producto.categoria} ${producto.codigo} ${producto.descripcion || ''} ${producto.proveedor || ''}`
      return calcularSimilitud(textoCompleto, termino) > 0.3
    }).sort((a, b) => {
      const similitudA = calcularSimilitud(`${a.nombre} ${a.categoria} ${a.codigo}`, termino)
      const similitudB = calcularSimilitud(`${b.nombre} ${b.categoria} ${b.codigo}`, termino)
      return similitudB - similitudA
    })
    
    setProductosFiltrados(resultados)
  }

  // Aplicar filtros adicionales para productos
  const aplicarFiltrosProductos = () => {
    let resultados = [...productos]
    
    // Filtro por búsqueda de texto
    if (busquedaProducto.trim()) {
      resultados = resultados.filter(producto => {
        const textoCompleto = `${producto.nombre} ${producto.categoria} ${producto.codigo} ${producto.descripcion || ''}`
        return calcularSimilitud(textoCompleto, busquedaProducto) > 0.3
      })
    }
    
    // Filtro por categoría
    if (filtroCategoria) {
      resultados = resultados.filter(producto => producto.categoria === filtroCategoria)
    }
    
    // Filtro por estado
    if (filtroEstado) {
      resultados = resultados.filter(producto => producto.estado === filtroEstado)
    }
    
    // Filtro por stock
    if (filtroStock === 'bajo') {
      resultados = resultados.filter(producto => producto.stock < 10)
    } else if (filtroStock === 'medio') {
      resultados = resultados.filter(producto => producto.stock >= 10 && producto.stock < 50)
    } else if (filtroStock === 'alto') {
      resultados = resultados.filter(producto => producto.stock >= 50)
    }
    
    // Filtro por rango de precio
    resultados = resultados.filter(producto => 
      producto.precio >= filtroRangoPrecio[0] && producto.precio <= filtroRangoPrecio[1]
    )
    
    setProductosFiltrados(resultados)
  }

  // Función de búsqueda para inventario
  const buscarInventario = (termino: string) => {
    setBusquedaInventario(termino)
    
    if (!termino.trim()) {
      setInventarioFiltrado(productos)
      return
    }
    
    const resultados = productos.filter(producto => {
      const textoCompleto = `${producto.nombre} ${producto.categoria} ${producto.codigo} ${producto.descripcion || ''}`
      return calcularSimilitud(textoCompleto, termino) > 0.3
    }).sort((a, b) => {
      const similitudA = calcularSimilitud(`${a.nombre} ${a.categoria} ${a.codigo}`, termino)
      const similitudB = calcularSimilitud(`${b.nombre} ${b.categoria} ${b.codigo}`, termino)
      return similitudB - similitudA
    })
    
    setInventarioFiltrado(resultados)
  }

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltrosProductos()
  }, [filtroCategoria, filtroEstado, filtroStock, filtroRangoPrecio, productos])

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
      icon: <TruckOutlined />,
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
    }
  ]

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Mi Perfil
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Configuración
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Cerrar Sesión
      </Menu.Item>
    </Menu>
  )

  const renderContent = () => {
    switch (activeSection) {
      case '1':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <DashboardOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Dashboard
            </Title>
            
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Ventas del Día"
                    value={1128}
                    prefix="$"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Productos"
                    value={productos.length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Clientes"
                    value={93}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="Stock Bajo"
                    value={5}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Card title="Resumen de Actividad">
              <Text>Bienvenido al sistema de gestión empresarial. Aquí puedes ver un resumen de las operaciones del día.</Text>
            </Card>
          </div>
        );

      case '2':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <ShoppingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                Gestión de Productos
              </Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  Nuevo Producto
                </Button>
              </Space>
            </div>

            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Input.Search
                    placeholder="Buscar productos por nombre, código, categoría..."
                    allowClear
                    value={busquedaProducto}
                    onChange={(e) => buscarProductos(e.target.value)}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Categoría"
                    allowClear
                    value={filtroCategoria}
                    onChange={setFiltroCategoria}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Option value="Electrónicos">Electrónicos</Option>
                    <Option value="Accesorios">Accesorios</Option>
                    <Option value="Móviles">Móviles</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Estado"
                    allowClear
                    value={filtroEstado}
                    onChange={setFiltroEstado}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Option value="Activo">Activo</Option>
                    <Option value="Inactivo">Inactivo</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Stock"
                    allowClear
                    value={filtroStock}
                    onChange={setFiltroStock}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Option value="bajo">Stock Bajo (&lt;10)</Option>
                    <Option value="medio">Stock Medio (10-49)</Option>
                    <Option value="alto">Stock Alto (≥50)</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Button
                    icon={<FilterOutlined />}
                    onClick={aplicarFiltrosProductos}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    Aplicar Filtros
                  </Button>
                </Col>
              </Row>
            </Card>

            <Card>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>
                  Productos encontrados: {productosFiltrados.length}
                  {busquedaProducto && (
                    <Text type="secondary"> para "{busquedaProducto}"</Text>
                  )}
                </Text>
                <Button onClick={generarDatosEjemplo} type="dashed">
                  Cargar Datos de Ejemplo
                </Button>
              </div>
              
              <Table
                dataSource={productosFiltrados}
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
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    width: 120,
                  },
                  {
                    title: 'Precio',
                    dataIndex: 'precio',
                    key: 'precio',
                    width: 100,
                    render: (precio) => `$${precio}`,
                  },
                  {
                    title: 'Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 80,
                    render: (stock) => (
                      <span style={{ color: stock < 10 ? '#ff4d4f' : stock < 50 ? '#faad14' : '#52c41a' }}>
                        {stock}
                      </span>
                    ),
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'estado',
                    key: 'estado',
                    width: 100,
                  },
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`,
                }}
                scroll={{ x: 800 }}
              />
            </Card>

            <Modal
              title="Nuevo Producto"
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              footer={null}
              width={600}
            >
              <Form form={formProducto} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="codigo" label="Código" rules={[{ required: true }]}>
                      <Input placeholder="Código del producto" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                      <Input placeholder="Nombre del producto" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="categoria" label="Categoría" rules={[{ required: true }]}>
                      <Select placeholder="Seleccionar categoría">
                        <Option value="Electrónicos">Electrónicos</Option>
                        <Option value="Accesorios">Accesorios</Option>
                        <Option value="Móviles">Móviles</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
                      <Input type="number" placeholder="0.00" prefix="$" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="descripcion" label="Descripción">
                  <Input.TextArea rows={3} placeholder="Descripción del producto" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Guardar
                    </Button>
                    <Button onClick={() => setModalVisible(false)}>
                      Cancelar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );

      case '3':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <DollarOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
              Punto de Venta
            </Title>
            <Card>
              <Text>Módulo de Punto de Venta - En desarrollo</Text>
            </Card>
          </div>
        );

      case '4':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <AppstoreOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                Gestión de Inventario
              </Title>
            </div>

            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={18}>
                  <Input.Search
                    placeholder="Buscar en inventario por nombre, código, categoría..."
                    allowClear
                    value={busquedaInventario}
                    onChange={(e) => buscarInventario(e.target.value)}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={6}>
                  <Button
                    onClick={generarDatosEjemplo}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    Cargar Datos
                  </Button>
                </Col>
              </Row>
            </Card>

            <Card>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>
                  Items en inventario: {inventarioFiltrado.length}
                  {busquedaInventario && (
                    <Text type="secondary"> para "{busquedaInventario}"</Text>
                  )}
                </Text>
                <Text type="secondary">
                  Valor total: ${inventarioFiltrado.reduce((total, item) => total + (item.precio * item.stock), 0).toFixed(2)}
                </Text>
              </div>
              
              <Table
                dataSource={inventarioFiltrado}
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
                  },
                  {
                    title: 'Precio Unitario',
                    dataIndex: 'precio',
                    key: 'precio',
                    width: 120,
                    render: (precio) => `$${precio}`,
                  },
                  {
                    title: 'Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 80,
                    render: (stock) => (
                      <span style={{ color: stock < 10 ? '#ff4d4f' : stock < 50 ? '#faad14' : '#52c41a' }}>
                        {stock}
                      </span>
                    ),
                  },
                  {
                    title: 'Valor Total',
                    key: 'valorTotal',
                    width: 120,
                    render: (_, record) => `$${(record.precio * record.stock).toFixed(2)}`,
                  },
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} items`,
                }}
                scroll={{ x: 800 }}
              />
            </Card>
          </div>
        );

      case '5':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <TeamOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
              Gestión de Clientes
            </Title>
            <Card>
              <Text>Módulo de Gestión de Clientes - En desarrollo</Text>
            </Card>
          </div>
        );

      case '6':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <TruckOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
              Gestión de Proveedores
            </Title>
            <Card>
              <Text>Módulo de Gestión de Proveedores - En desarrollo</Text>
            </Card>
          </div>
        );

      case '7':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <BarChartOutlined style={{ marginRight: '12px', color: '#13c2c2' }} />
              Reportes y Análisis
            </Title>
            <Card>
              <Text>Módulo de Reportes y Análisis - En desarrollo</Text>
            </Card>
          </div>
        );

      case '8':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <SettingOutlined style={{ marginRight: '12px', color: '#8c8c8c' }} />
              Configuración del Sistema
            </Title>
            <Card>
              <Text>Módulo de Configuración - En desarrollo</Text>
            </Card>
          </div>
        );

      default:
        return (
          <div>
            <Title level={2}>Página no encontrada</Title>
            <Card>
              <Text>La sección solicitada no existe.</Text>
            </Card>
          </div>
        );
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="dark"
        width={250}
      >
        <div style={{ 
          height: '64px', 
          margin: '16px', 
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? '🏪' : '🏪 Gestor POS'}
          </Title>
        </div>
        
        <Menu
          theme="dark"
          selectedKeys={[activeSection]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setActiveSection(key)}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              Sistema de Gestión Empresarial
            </Text>
          </div>
          
          <Space size="middle">
            <Button type="text" icon={<BellOutlined />} />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text strong>Usuario Admin</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 280
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppEmpresarial
