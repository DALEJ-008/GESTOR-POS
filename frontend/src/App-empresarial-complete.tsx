// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { Layout, Menu, Avatar, Dropdown, Input, Select, Button, Card, Space, Table, Form, Modal, Typography, Row, Col, Statistic, DatePicker, message, Tag, Progress, InputNumber, Radio } from 'antd'
import { 
  DashboardOutlined, 
  ShoppingOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  TruckOutlined,
  BellOutlined,
  SettingOutlined,
  DollarOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  PrinterOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  DownloadOutlined,
  TrophyOutlined,
  SafetyOutlined,
  CloudOutlined
} from '@ant-design/icons'

const { Header, Sider, Content, Footer } = Layout
const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

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
  card: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.secondary}`,
    overflow: 'hidden'
  }
}

// Funciones para normalizar texto para búsqueda
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

// Componente principal
const AppEmpresarial: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('1')
  
  // Estados para Productos con persistencia en localStorage
  const [productos, setProductos] = useState(() => {
    const productosGuardados = localStorage.getItem('gestor_productos')
    return productosGuardados ? JSON.parse(productosGuardados) : []
  })

  // Estados para Clientes con persistencia en localStorage
  const [clientes, setClientes] = useState(() => {
    const clientesGuardados = localStorage.getItem('gestor_clientes')
    return clientesGuardados ? JSON.parse(clientesGuardados) : []
  })

  // Estados para Proveedores con persistencia en localStorage
  const [proveedores, setProveedores] = useState(() => {
    const proveedoresGuardados = localStorage.getItem('gestor_proveedores')
    return proveedoresGuardados ? JSON.parse(proveedoresGuardados) : []
  })

  // Estados para Gastos con persistencia en localStorage
  const [gastos, setGastos] = useState(() => {
    const gastosGuardados = localStorage.getItem('gestor_gastos')
    return gastosGuardados ? JSON.parse(gastosGuardados) : []
  })

  // Estados para Compras con persistencia en localStorage
  const [compras, setCompras] = useState(() => {
    const comprasGuardadas = localStorage.getItem('gestor_compras')
    return comprasGuardadas ? JSON.parse(comprasGuardadas) : []
  })

  const [ventas, setVentas] = useState(() => {
    const ventasGuardadas = localStorage.getItem('gestor_ventas')
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : []
  })

  // Estados para Carrito POS
  const [carritoItems, setCarritoItems] = useState<any[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(null)

  // Estados para Modales
  const [modalProductoVisible, setModalProductoVisible] = useState(false)
  const [modalClienteVisible, setModalClienteVisible] = useState(false)
  const [modalProveedorVisible, setModalProveedorVisible] = useState(false)
  const [modalFacturaVisible, setModalFacturaVisible] = useState(false)
  const [editandoItem, setEditandoItem] = useState<any>(null)

  // Estados para búsqueda de Productos
  const [busquedaProducto, setBusquedaProducto] = useState('')
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([])
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string | null>(null)
  const [filtroStock, setFiltroStock] = useState<string | null>(null)
  const [filtroRangoPrecio, setFiltroRangoPrecio] = useState<{min: number | null, max: number | null}>({min: null, max: null})
  const [tipoVista, setTipoVista] = useState<'tabla' | 'tarjetas'>('tabla')

  // Estados para búsqueda de Inventario
  const [busquedaInventario, setBusquedaInventario] = useState('')
  const [inventarioFiltrado, setInventarioFiltrado] = useState<any[]>([])
  const [filtroStockBajo, setFiltroStockBajo] = useState(false)
  const [filtroSinStock, setFiltroSinStock] = useState(false)

  // Forms
  const [formProducto] = Form.useForm()
  const [formCliente] = Form.useForm()
  const [formProveedor] = Form.useForm()

  // Datos de ejemplo para productos
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
        proveedor: 'HP Inc.',
        stockMinimo: 5,
        costoCompra: 650.00
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
        proveedor: 'Logitech',
        stockMinimo: 10,
        costoCompra: 65.00
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
        proveedor: 'Corsair',
        stockMinimo: 5,
        costoCompra: 120.00
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
        proveedor: 'Samsung',
        stockMinimo: 3,
        costoCompra: 200.00
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
        proveedor: 'Apple',
        stockMinimo: 2,
        costoCompra: 600.00
      },
      {
        key: '6',
        codigo: 'PRD006',
        nombre: 'Audífonos Sony WH-1000XM4',
        categoria: 'Audio',
        precio: 349.99,
        stock: 18,
        estado: 'Activo',
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        proveedor: 'Sony',
        stockMinimo: 5,
        costoCompra: 250.00
      },
      {
        key: '7',
        codigo: 'PRD007',
        nombre: 'Tablet iPad Air',
        categoria: 'Electrónicos',
        precio: 599.99,
        stock: 10,
        estado: 'Activo',
        descripcion: 'iPad Air 64GB Wi-Fi, pantalla 10.9 pulgadas',
        proveedor: 'Apple',
        stockMinimo: 3,
        costoCompra: 450.00
      },
      {
        key: '8',
        codigo: 'PRD008',
        nombre: 'Cámara Canon EOS R5',
        categoria: 'Fotografía',
        precio: 3899.99,
        stock: 3,
        estado: 'Activo',
        descripcion: 'Cámara mirrorless full frame 45MP',
        proveedor: 'Canon',
        stockMinimo: 1,
        costoCompra: 3200.00
      }
    ]
    
    setProductos(datosEjemplo)
    setProductosFiltrados(datosEjemplo)
    setInventarioFiltrado(datosEjemplo)
    localStorage.setItem('gestor_productos', JSON.stringify(datosEjemplo))
    message.success('Datos de ejemplo cargados correctamente')
  }

  // Efectos para inicializar productos e inventario filtrados
  useEffect(() => {
    setProductosFiltrados(productos)
    setInventarioFiltrado(productos)
  }, [productos])

  // Función de búsqueda para productos
  const buscarProductos = (termino: string) => {
    setBusquedaProducto(termino)
    
    if (!termino.trim()) {
      aplicarFiltrosProductos()
      return
    }
    
    let resultados = productos.filter(producto => {
      const textoCompleto = `${producto.nombre} ${producto.categoria} ${producto.codigo} ${producto.descripcion || ''} ${producto.proveedor || ''}`
      return calcularSimilitud(textoCompleto, termino) > 0.3
    }).sort((a, b) => {
      const similitudA = calcularSimilitud(`${a.nombre} ${a.categoria} ${a.codigo}`, termino)
      const similitudB = calcularSimilitud(`${b.nombre} ${b.categoria} ${b.codigo}`, termino)
      return similitudB - similitudA
    })

    // Aplicar filtros adicionales
    if (filtroCategoria) {
      resultados = resultados.filter(producto => producto.categoria === filtroCategoria)
    }
    
    if (filtroEstado) {
      resultados = resultados.filter(producto => producto.estado === filtroEstado)
    }
    
    if (filtroStock === 'bajo') {
      resultados = resultados.filter(producto => producto.stock < 10)
    } else if (filtroStock === 'medio') {
      resultados = resultados.filter(producto => producto.stock >= 10 && producto.stock < 50)
    } else if (filtroStock === 'alto') {
      resultados = resultados.filter(producto => producto.stock >= 50)
    }
    
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
    if (filtroRangoPrecio.min !== null) {
      resultados = resultados.filter(producto => producto.precio >= filtroRangoPrecio.min)
    }
    if (filtroRangoPrecio.max !== null) {
      resultados = resultados.filter(producto => producto.precio <= filtroRangoPrecio.max)
    }
    
    setProductosFiltrados(resultados)
  }

  // Función de búsqueda para inventario
  const buscarInventario = (termino: string) => {
    setBusquedaInventario(termino)
    
    if (!termino.trim()) {
      let resultados = [...productos]
      
      if (filtroStockBajo) {
        resultados = resultados.filter(producto => producto.stock < (producto.stockMinimo || 5))
      }
      
      if (filtroSinStock) {
        resultados = resultados.filter(producto => producto.stock === 0)
      }
      
      setInventarioFiltrado(resultados)
      return
    }
    
    let resultados = productos.filter(producto => {
      const textoCompleto = `${producto.nombre} ${producto.categoria} ${producto.codigo} ${producto.descripcion || ''}`
      return calcularSimilitud(textoCompleto, termino) > 0.3
    }).sort((a, b) => {
      const similitudA = calcularSimilitud(`${a.nombre} ${a.categoria} ${a.codigo}`, termino)
      const similitudB = calcularSimilitud(`${b.nombre} ${b.categoria} ${b.codigo}`, termino)
      return similitudB - similitudA
    })
    
    if (filtroStockBajo) {
      resultados = resultados.filter(producto => producto.stock < (producto.stockMinimo || 5))
    }
    
    if (filtroSinStock) {
      resultados = resultados.filter(producto => producto.stock === 0)
    }
    
    setInventarioFiltrado(resultados)
  }

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltrosProductos()
  }, [filtroCategoria, filtroEstado, filtroStock, filtroRangoPrecio, productos])

  // Aplicar filtros de inventario cuando cambien
  useEffect(() => {
    buscarInventario(busquedaInventario)
  }, [filtroStockBajo, filtroSinStock, productos])

  // Función para agregar producto
  const agregarProducto = (valores: any) => {
    const nuevoProducto = {
      key: Date.now().toString(),
      codigo: `PRD${String(productos.length + 1).padStart(3, '0')}`,
      ...valores,
      estado: valores.stock > 0 ? 'Activo' : 'Sin Stock',
      stockMinimo: valores.stockMinimo || 5,
      costoCompra: valores.costoCompra || 0
    }
    const nuevosProductos = [...productos, nuevoProducto]
    setProductos(nuevosProductos)
    localStorage.setItem('gestor_productos', JSON.stringify(nuevosProductos))
    setModalProductoVisible(false)
    formProducto.resetFields()
    message.success('Producto agregado exitosamente')
  }

  // Función para editar producto
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

  // Función para eliminar producto
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

  // Menú del usuario
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

  // Items del menú lateral
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

  // Función para renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case '1':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <DashboardOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Dashboard Empresarial
            </Title>
            
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Ventas del Día"
                    value={ventas.reduce((total, venta) => total + venta.total, 0)}
                    prefix="$"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Productos Activos"
                    value={productos.filter(p => p.estado === 'Activo').length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Stock Total"
                    value={productos.reduce((total, producto) => total + producto.stock, 0)}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Stock Bajo"
                    value={productos.filter(p => p.stock < (p.stockMinimo || 5)).length}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card title="Productos con Stock Bajo" style={customStyles.card}>
                  {productos.filter(p => p.stock < (p.stockMinimo || 5)).length > 0 ? (
                    <Table
                      dataSource={productos.filter(p => p.stock < (p.stockMinimo || 5))}
                      columns={[
                        { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
                        { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
                        { title: 'Stock Actual', dataIndex: 'stock', key: 'stock' },
                        { title: 'Stock Mínimo', dataIndex: 'stockMinimo', key: 'stockMinimo' },
                        {
                          title: 'Estado',
                          key: 'estado',
                          render: (_, record) => (
                            <Tag color="red">Stock Bajo</Tag>
                          )
                        }
                      ]}
                      pagination={false}
                      size="small"
                    />
                  ) : (
                    <Text>No hay productos con stock bajo</Text>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )

      case '2':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <ShoppingOutlined style={{ marginRight: '12px', color: colors.primary }} />
                Gestión de Productos
              </Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditandoItem(null)
                    formProducto.resetFields()
                    setModalProductoVisible(true)
                  }}
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                >
                  Nuevo Producto
                </Button>
              </Space>
            </div>

            <Card style={{ ...customStyles.card, marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
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
                    <Option value="Audio">Audio</Option>
                    <Option value="Fotografía">Fotografía</Option>
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
                    <Option value="Sin Stock">Sin Stock</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Nivel de Stock"
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
                <Col xs={24} sm={12} md={6}>
                  <Space>
                    <Button
                      icon={<FilterOutlined />}
                      onClick={aplicarFiltrosProductos}
                      size="large"
                    >
                      Aplicar Filtros
                    </Button>
                    <Button
                      onClick={generarDatosEjemplo}
                      size="large"
                    >
                      Cargar Datos
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card style={customStyles.card}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  Productos encontrados: {productosFiltrados.length}
                  {busquedaProducto && (
                    <Text type="secondary"> para "{busquedaProducto}"</Text>
                  )}
                </Text>
                <Radio.Group value={tipoVista} onChange={(e) => setTipoVista(e.target.value)}>
                  <Radio.Button value="tabla">Tabla</Radio.Button>
                  <Radio.Button value="tarjetas">Tarjetas</Radio.Button>
                </Radio.Group>
              </div>
              
              {tipoVista === 'tabla' ? (
                <Table
                  dataSource={productosFiltrados}
                  columns={[
                    {
                      title: 'Código',
                      dataIndex: 'codigo',
                      key: 'codigo',
                      width: 100,
                      sorter: (a, b) => a.codigo.localeCompare(b.codigo),
                    },
                    {
                      title: 'Nombre',
                      dataIndex: 'nombre',
                      key: 'nombre',
                      ellipsis: true,
                      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
                    },
                    {
                      title: 'Categoría',
                      dataIndex: 'categoria',
                      key: 'categoria',
                      width: 120,
                      filters: [
                        { text: 'Electrónicos', value: 'Electrónicos' },
                        { text: 'Accesorios', value: 'Accesorios' },
                        { text: 'Móviles', value: 'Móviles' },
                        { text: 'Audio', value: 'Audio' },
                        { text: 'Fotografía', value: 'Fotografía' },
                      ],
                      onFilter: (value, record) => record.categoria === value,
                    },
                    {
                      title: 'Precio',
                      dataIndex: 'precio',
                      key: 'precio',
                      width: 100,
                      render: (precio) => `$${precio.toFixed(2)}`,
                      sorter: (a, b) => a.precio - b.precio,
                    },
                    {
                      title: 'Stock',
                      dataIndex: 'stock',
                      key: 'stock',
                      width: 80,
                      render: (stock, record) => (
                        <span style={{ 
                          color: stock === 0 ? '#ff4d4f' : 
                                stock < (record.stockMinimo || 5) ? '#faad14' : 
                                '#52c41a' 
                        }}>
                          {stock}
                        </span>
                      ),
                      sorter: (a, b) => a.stock - b.stock,
                    },
                    {
                      title: 'Estado',
                      dataIndex: 'estado',
                      key: 'estado',
                      width: 100,
                      render: (estado) => {
                        const color = estado === 'Activo' ? 'green' : estado === 'Sin Stock' ? 'red' : 'orange'
                        return <Tag color={color}>{estado}</Tag>
                      },
                      filters: [
                        { text: 'Activo', value: 'Activo' },
                        { text: 'Inactivo', value: 'Inactivo' },
                        { text: 'Sin Stock', value: 'Sin Stock' },
                      ],
                      onFilter: (value, record) => record.estado === value,
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
                  scroll={{ x: 1000 }}
                />
              ) : (
                <Row gutter={[16, 16]}>
                  {productosFiltrados.map((producto) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={producto.key}>
                      <Card
                        size="small"
                        title={producto.nombre}
                        extra={
                          <Space>
                            <Button
                              icon={<EditOutlined />}
                              size="small"
                              onClick={() => {
                                setEditandoItem(producto)
                                formProducto.setFieldsValue(producto)
                                setModalProductoVisible(true)
                              }}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              size="small"
                              danger
                              onClick={() => eliminarProducto(producto.key)}
                            />
                          </Space>
                        }
                        style={{ height: '300px', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div>
                          <Text strong>{producto.codigo}</Text>
                          <br />
                          <Tag color="blue">{producto.categoria}</Tag>
                          <br />
                          <Text type="secondary" ellipsis>{producto.descripcion}</Text>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Text strong style={{ fontSize: '18px', color: colors.primary }}>
                                ${producto.precio.toFixed(2)}
                              </Text>
                            </Col>
                            <Col>
                              <Text style={{ 
                                color: producto.stock === 0 ? '#ff4d4f' : 
                                      producto.stock < (producto.stockMinimo || 5) ? '#faad14' : 
                                      '#52c41a' 
                              }}>
                                Stock: {producto.stock}
                              </Text>
                            </Col>
                          </Row>
                          <Tag 
                            color={producto.estado === 'Activo' ? 'green' : producto.estado === 'Sin Stock' ? 'red' : 'orange'}
                            style={{ marginTop: '8px' }}
                          >
                            {producto.estado}
                          </Tag>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card>

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
              width={700}
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
                        <Option value="Electrónicos">Electrónicos</Option>
                        <Option value="Accesorios">Accesorios</Option>
                        <Option value="Móviles">Móviles</Option>
                        <Option value="Audio">Audio</Option>
                        <Option value="Fotografía">Fotografía</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item name="precio" label="Precio de Venta" rules={[{ required: true, message: 'Ingrese el precio' }]}>
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
                  <Col span={8}>
                    <Form.Item name="costoCompra" label="Costo de Compra">
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
                  <Col span={8}>
                    <Form.Item name="stock" label="Stock Inicial" rules={[{ required: true, message: 'Ingrese el stock' }]}>
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="stockMinimo" label="Stock Mínimo">
                      <InputNumber style={{ width: '100%' }} min={0} placeholder="5" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="proveedor" label="Proveedor">
                      <Input placeholder="Ej: HP Inc." />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="descripcion" label="Descripción">
                  <Input.TextArea rows={3} placeholder="Descripción detallada del producto" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                    >
                      {editandoItem ? 'Actualizar' : 'Guardar'}
                    </Button>
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
            <Title level={2} style={{ marginBottom: '24px' }}>
              <DollarOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
              Punto de Venta
            </Title>
            <Card style={customStyles.card}>
              <Text>Módulo de Punto de Venta - En desarrollo</Text>
              <div style={{ marginTop: '20px' }}>
                <Text type="secondary">
                  Aquí se implementará el sistema de ventas con:
                </Text>
                <ul style={{ marginTop: '10px' }}>
                  <li>Carrito de compras</li>
                  <li>Selección de productos</li>
                  <li>Cálculo de totales</li>
                  <li>Gestión de clientes</li>
                  <li>Métodos de pago</li>
                  <li>Impresión de facturas</li>
                </ul>
              </div>
            </Card>
          </div>
        )

      case '4':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <AppstoreOutlined style={{ marginRight: '12px', color: colors.accent }} />
                Gestión de Inventario
              </Title>
            </div>

            <Card style={{ ...customStyles.card, marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Input.Search
                    placeholder="Buscar en inventario por nombre, código, categoría..."
                    allowClear
                    value={busquedaInventario}
                    onChange={(e) => buscarInventario(e.target.value)}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Space>
                    <Button
                      type={filtroStockBajo ? 'primary' : 'default'}
                      onClick={() => setFiltroStockBajo(!filtroStockBajo)}
                      size="large"
                    >
                      Stock Bajo
                    </Button>
                    <Button
                      type={filtroSinStock ? 'primary' : 'default'}
                      onClick={() => setFiltroSinStock(!filtroSinStock)}
                      size="large"
                    >
                      Sin Stock
                    </Button>
                  </Space>
                </Col>
                <Col xs={24} sm={12} md={4}>
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

            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Valor Total Inventario"
                    value={inventarioFiltrado.reduce((total, item) => total + (item.precio * item.stock), 0)}
                    prefix="$"
                    precision={2}
                    valueStyle={{ color: colors.primary }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Items con Stock Bajo"
                    value={productos.filter(p => p.stock < (p.stockMinimo || 5)).length}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card style={customStyles.card}>
                  <Statistic
                    title="Items Sin Stock"
                    value={productos.filter(p => p.stock === 0).length}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card style={customStyles.card}>
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  Items en inventario: {inventarioFiltrado.length}
                  {busquedaInventario && (
                    <Text type="secondary"> para "{busquedaInventario}"</Text>
                  )}
                </Text>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Valor total mostrado: ${inventarioFiltrado.reduce((total, item) => total + (item.precio * item.stock), 0).toFixed(2)}
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
                    sorter: (a, b) => a.codigo.localeCompare(b.codigo),
                  },
                  {
                    title: 'Producto',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    ellipsis: true,
                    sorter: (a, b) => a.nombre.localeCompare(b.nombre),
                  },
                  {
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    width: 120,
                    filters: [
                      { text: 'Electrónicos', value: 'Electrónicos' },
                      { text: 'Accesorios', value: 'Accesorios' },
                      { text: 'Móviles', value: 'Móviles' },
                      { text: 'Audio', value: 'Audio' },
                      { text: 'Fotografía', value: 'Fotografía' },
                    ],
                    onFilter: (value, record) => record.categoria === value,
                  },
                  {
                    title: 'Precio Unitario',
                    dataIndex: 'precio',
                    key: 'precio',
                    width: 120,
                    render: (precio) => `$${precio.toFixed(2)}`,
                    sorter: (a, b) => a.precio - b.precio,
                  },
                  {
                    title: 'Stock Actual',
                    dataIndex: 'stock',
                    key: 'stock',
                    width: 100,
                    render: (stock, record) => (
                      <div style={{ textAlign: 'center' }}>
                        <Text style={{ 
                          color: stock === 0 ? '#ff4d4f' : 
                                stock < (record.stockMinimo || 5) ? '#faad14' : 
                                '#52c41a',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {stock}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Min: {record.stockMinimo || 5}
                        </Text>
                      </div>
                    ),
                    sorter: (a, b) => a.stock - b.stock,
                  },
                  {
                    title: 'Estado Stock',
                    key: 'estadoStock',
                    width: 110,
                    render: (_, record) => {
                      if (record.stock === 0) {
                        return <Tag color="red">Sin Stock</Tag>
                      } else if (record.stock < (record.stockMinimo || 5)) {
                        return <Tag color="orange">Stock Bajo</Tag>
                      } else {
                        return <Tag color="green">Stock OK</Tag>
                      }
                    },
                    filters: [
                      { text: 'Sin Stock', value: 'sin' },
                      { text: 'Stock Bajo', value: 'bajo' },
                      { text: 'Stock OK', value: 'ok' },
                    ],
                    onFilter: (value, record) => {
                      if (value === 'sin') return record.stock === 0
                      if (value === 'bajo') return record.stock > 0 && record.stock < (record.stockMinimo || 5)
                      if (value === 'ok') return record.stock >= (record.stockMinimo || 5)
                      return true
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
                    sorter: (a, b) => (a.precio * a.stock) - (b.precio * b.stock),
                  },
                  {
                    title: 'Utilidad',
                    key: 'utilidad',
                    width: 100,
                    render: (_, record) => {
                      if (record.costoCompra) {
                        const utilidad = ((record.precio - record.costoCompra) / record.costoCompra * 100)
                        return (
                          <Text style={{ color: utilidad > 0 ? '#52c41a' : '#ff4d4f' }}>
                            {utilidad.toFixed(1)}%
                          </Text>
                        )
                      }
                      return <Text type="secondary">N/D</Text>
                    },
                    sorter: (a, b) => {
                      const utilidadA = a.costoCompra ? ((a.precio - a.costoCompra) / a.costoCompra * 100) : 0
                      const utilidadB = b.costoCompra ? ((b.precio - b.costoCompra) / b.costoCompra * 100) : 0
                      return utilidadA - utilidadB
                    },
                  },
                ]}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} items`,
                }}
                scroll={{ x: 1200 }}
                summary={(pageData) => {
                  const totalValor = pageData.reduce((total, item) => total + (item.precio * item.stock), 0)
                  const totalItems = pageData.reduce((total, item) => total + item.stock, 0)
                  
                  return (
                    <Table.Summary.Row style={{ backgroundColor: '#fafafa' }}>
                      <Table.Summary.Cell index={0}>
                        <Text strong>TOTALES</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>
                        <Text strong>{pageData.length} productos</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2}></Table.Summary.Cell>
                      <Table.Summary.Cell index={3}></Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        <Text strong style={{ color: colors.primary }}>{totalItems} unidades</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}></Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        <Text strong style={{ color: colors.primary, fontSize: '16px' }}>
                          ${totalValor.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  )
                }}
              />
            </Card>
          </div>
        )

      case '5':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <TeamOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
              Gestión de Clientes
            </Title>
            <Card style={customStyles.card}>
              <Text>Módulo de Gestión de Clientes - En desarrollo</Text>
            </Card>
          </div>
        )

      case '6':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <TruckOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
              Gestión de Proveedores
            </Title>
            <Card style={customStyles.card}>
              <Text>Módulo de Gestión de Proveedores - En desarrollo</Text>
            </Card>
          </div>
        )

      case '7':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <BarChartOutlined style={{ marginRight: '12px', color: '#13c2c2' }} />
              Reportes y Análisis
            </Title>
            <Card style={customStyles.card}>
              <Text>Módulo de Reportes y Análisis - En desarrollo</Text>
            </Card>
          </div>
        )

      case '8':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <SettingOutlined style={{ marginRight: '12px', color: '#8c8c8c' }} />
              Configuración del Sistema
            </Title>
            <Card style={customStyles.card}>
              <Text>Módulo de Configuración - En desarrollo</Text>
            </Card>
          </div>
        )

      default:
        return (
          <div>
            <Title level={2}>Página no encontrada</Title>
            <Card style={customStyles.card}>
              <Text>La sección solicitada no existe.</Text>
            </Card>
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
        theme="dark"
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
          selectedKeys={[activeSection]}
          mode="inline"
          items={menuItems}
          onSelect={({ key }) => setActiveSection(key)}
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
              icon={<BellOutlined />} 
              style={{ color: 'white' }}
              size="large"
            />
            <Dropdown overlay={userMenu} placement="bottomRight">
              <Space style={{ cursor: 'pointer', color: 'white' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: colors.accent }} />
                <Text strong style={{ color: 'white' }}>Usuario Admin</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px',
          padding: '24px',
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

export default AppEmpresarial
