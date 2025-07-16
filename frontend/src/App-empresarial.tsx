import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Statistic, Row, Col, Form, Input, Select, Table, Modal, message, Space, Tag, DatePicker, InputNumber, Upload, Typography, TimePicker, Divider } from 'antd';

const { TextArea } = Input;
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ProductOutlined,
  TeamOutlined,
  ShopOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  PrinterOutlined,
  ExportOutlined,
  UserAddOutlined,
  StockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  MailOutlined,
  FileTextOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

// Interfaces para TypeScript
interface Product {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  codigo: string;
}

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: string;
}

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  productos: Array<{
    id: number;
    nombre: string;
    precio: number;
    tiempoEntrega: string;
    cantidadMinima: number;
  }>;
  fechaRegistro: string;
  activo: boolean;
}

interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
  total: number;
  estado: string;
}

interface InventoryMovement {
  id: number;
  producto: string;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
  motivo: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  nombre: string;
  rol: 'admin' | 'empleado' | 'gerente';
  fechaCreacion: string;
}

interface Factura {
  id: number;
  numero: string;
  cliente: string;
  fecha: string;
  fechaVencimiento: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
    total: number;
  }>;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'pendiente' | 'pagado' | 'vencido' | 'cancelado';
  notas?: string;
}

interface EventoCalendario {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: 'reunion' | 'tarea' | 'recordatorio' | 'evento';
  prioridad: 'alta' | 'media' | 'baja';
  completado: boolean;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  
  // Estados para autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [showRegister, setShowRegister] = useState(false);
  
  // Estados para productos
  const [productos, setProductos] = useState<Product[]>([]);
  const [productForm] = Form.useForm();
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estados para clientes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clientForm] = Form.useForm();
  const [isClientModalVisible, setIsClientModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  // Estados para proveedores
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [supplierForm] = Form.useForm();
  const [isSupplierModalVisible, setIsSupplierModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Proveedor | null>(null);
  const [proveedorProductos, setProveedorProductos] = useState<Array<{
    id: number;
    nombre: string;
    precio: number;
    tiempoEntrega: string;
    cantidadMinima: number;
  }>>([]);
  const [isSupplierProductModalVisible, setIsSupplierProductModalVisible] = useState(false);
  const [supplierProductForm] = Form.useForm();

  // Estados para carrito de pedidos a proveedores
  const [carritoProveedor, setCarritoProveedor] = useState<Array<{
    proveedor: Proveedor;
    producto: {
      id: number;
      nombre: string;
      precio: number;
      tiempoEntrega: string;
      cantidadMinima: number;
    };
    cantidad: number;
  }>>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);

  // Estados para ventas y POS
  const [carrito, setCarrito] = useState<Array<{producto: Product, cantidad: number}>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [ventas, setVentas] = useState<Venta[]>([]);

  // Estados para inventario
  const [movimientosInventario, setMovimientosInventario] = useState<InventoryMovement[]>([]);
  const [inventoryForm] = Form.useForm();
  const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);

  // Estados para facturas
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [facturaForm] = Form.useForm();
  const [isFacturaModalVisible, setIsFacturaModalVisible] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Factura | null>(null);
  const [isFacturaDetailVisible, setIsFacturaDetailVisible] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);

  // Estados para calendario
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);
  const [eventoForm] = Form.useForm();
  const [isEventoModalVisible, setIsEventoModalVisible] = useState(false);
  const [editingEvento, setEditingEvento] = useState<EventoCalendario | null>(null);

  // Estados para controlar si ya se cargaron los datos iniciales
  const [datosInicializados, setDatosInicializados] = useState(false);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem('productos');
    const savedClients = localStorage.getItem('clientes');
    const savedSuppliers = localStorage.getItem('proveedores');
    const savedSales = localStorage.getItem('ventas');
    const savedInventory = localStorage.getItem('movimientosInventario');
    const savedUsers = localStorage.getItem('users');
    const savedCurrentUser = localStorage.getItem('currentUser');
    const savedFacturas = localStorage.getItem('facturas');
    const savedEventos = localStorage.getItem('eventos');

    // Cargar productos
    if (savedProducts) {
      setProductos(JSON.parse(savedProducts));
    } else {
      // Agregar algunos productos de ejemplo si no existen
      const defaultProducts: Product[] = [
        {
          id: 1,
          codigo: 'PROD001',
          nombre: 'Producto Ejemplo 1',
          categoria: 'Electrónicos',
          precio: 100.00,
          stock: 50,
          descripcion: 'Producto de ejemplo'
        },
        {
          id: 2,
          codigo: 'PROD002',
          nombre: 'Producto Ejemplo 2',
          categoria: 'Ropa',
          precio: 50.00,
          stock: 30,
          descripcion: 'Otro producto de ejemplo'
        }
      ];
      setProductos(defaultProducts);
    }

    // Cargar clientes
    if (savedClients) {
      setClientes(JSON.parse(savedClients));
    } else {
      // Agregar algunos clientes de ejemplo
      const defaultClients: Cliente[] = [
        {
          id: 1,
          nombre: 'Cliente Ejemplo',
          email: 'cliente@email.com',
          telefono: '123-456-7890',
          direccion: 'Dirección ejemplo',
          tipo: 'Regular'
        }
      ];
      setClientes(defaultClients);
    }

    // Cargar proveedores
    if (savedSuppliers) {
      setProveedores(JSON.parse(savedSuppliers));
    } else {
      // Agregar algunos proveedores de ejemplo
      const defaultSuppliers: Proveedor[] = [
        {
          id: 1,
          nombre: 'Proveedor Ejemplo',
          email: 'proveedor@email.com',
          telefono: '098-765-4321',
          direccion: 'Dirección proveedor',
          productos: [
            {
              id: 1,
              nombre: 'Producto Proveedor 1',
              precio: 80.00,
              tiempoEntrega: '3-5 días',
              cantidadMinima: 10
            }
          ],
          fechaRegistro: new Date().toISOString().split('T')[0],
          activo: true
        }
      ];
      setProveedores(defaultSuppliers);
    }

    if (savedSales) setVentas(JSON.parse(savedSales));
    if (savedInventory) setMovimientosInventario(JSON.parse(savedInventory));
    if (savedFacturas) setFacturas(JSON.parse(savedFacturas));
    if (savedEventos) setEventos(JSON.parse(savedEventos));
    
    // Cargar usuarios y sesión
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Crear usuario administrador por defecto
      const defaultAdmin: User = {
        id: 1,
        username: 'admin',
        email: 'admin@empresa.com',
        password: 'admin123',
        nombre: 'Administrador',
        rol: 'admin',
        fechaCreacion: new Date().toISOString()
      };
      setUsers([defaultAdmin]);
      localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
      setIsLoggedIn(true);
    }
    
    // Marcar que los datos han sido inicializados
    console.log('Datos inicializados correctamente');
    setDatosInicializados(true);
  }, []);

  // Guardar en localStorage cuando cambian los datos (solo después de la inicialización)
  useEffect(() => {
    if (datosInicializados) {
      console.log('Guardando productos en localStorage:', productos);
      localStorage.setItem('productos', JSON.stringify(productos));
    }
  }, [productos, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      console.log('Guardando clientes en localStorage:', clientes);
      localStorage.setItem('clientes', JSON.stringify(clientes));
    }
  }, [clientes, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      console.log('Guardando proveedores en localStorage:', proveedores);
      localStorage.setItem('proveedores', JSON.stringify(proveedores));
    }
  }, [proveedores, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('ventas', JSON.stringify(ventas));
    }
  }, [ventas, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('movimientosInventario', JSON.stringify(movimientosInventario));
    }
  }, [movimientosInventario, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('facturas', JSON.stringify(facturas));
    }
  }, [facturas, datosInicializados]);

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('eventos', JSON.stringify(eventos));
    }
  }, [eventos, datosInicializados]);

  // Funciones de autenticación
  const handleLogin = (values: any) => {
    const user = users.find(u => 
      (u.username === values.username || u.email === values.username) && 
      u.password === values.password
    );
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      message.success(`¡Bienvenido ${user.nombre}!`);
      loginForm.resetFields();
    } else {
      message.error('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = (values: any) => {
    // Verificar si el usuario ya existe
    const existingUser = users.find(u => 
      u.username === values.username || u.email === values.email
    );
    
    if (existingUser) {
      message.error('El usuario o email ya existe');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      username: values.username,
      email: values.email,
      password: values.password,
      nombre: values.nombre,
      rol: 'empleado',
      fechaCreacion: new Date().toISOString()
    };

    setUsers([...users, newUser]);
    message.success('Usuario registrado correctamente');
    registerForm.resetFields();
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    message.success('Sesión cerrada correctamente');
  };

  // Funciones para productos
  const handleSaveProduct = (values: any) => {
    console.log('Guardando producto:', values);
    if (editingProduct) {
      const updatedProducts = productos.map(p => 
        p.id === editingProduct.id ? { ...values, id: editingProduct.id } : p
      );
      console.log('Productos actualizados:', updatedProducts);
      setProductos(updatedProducts);
      message.success('Producto actualizado correctamente');
    } else {
      const newProduct: Product = {
        ...values,
        id: Date.now()
      };
      const updatedProducts = [...productos, newProduct];
      console.log('Nuevo producto agregado, lista actualizada:', updatedProducts);
      setProductos(updatedProducts);
      message.success('Producto agregado correctamente');
    }
    setIsProductModalVisible(false);
    setEditingProduct(null);
    productForm.resetFields();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    productForm.setFieldsValue(product);
    setIsProductModalVisible(true);
  };

  const handleDeleteProduct = (id: number) => {
    setProductos(productos.filter(p => p.id !== id));
    message.success('Producto eliminado correctamente');
  };

  // Funciones para clientes
  const handleSaveClient = (values: any) => {
    if (editingClient) {
      setClientes(clientes.map(c => 
        c.id === editingClient.id ? { ...values, id: editingClient.id } : c
      ));
      message.success('Cliente actualizado correctamente');
    } else {
      const newClient: Cliente = {
        ...values,
        id: Date.now()
      };
      setClientes([...clientes, newClient]);
      message.success('Cliente agregado correctamente');
    }
    setIsClientModalVisible(false);
    setEditingClient(null);
    clientForm.resetFields();
  };

  const handleEditClient = (client: Cliente) => {
    setEditingClient(client);
    clientForm.setFieldsValue(client);
    setIsClientModalVisible(true);
  };

  const handleDeleteClient = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
    message.success('Cliente eliminado correctamente');
  };

  // Funciones para proveedores
  const handleSaveSupplier = (values: any) => {
    console.log('Guardando proveedor:', values);
    if (editingSupplier) {
      const updatedSupplier: Proveedor = {
        ...editingSupplier,
        ...values,
        productos: proveedorProductos
      };
      const updatedSuppliers = proveedores.map(s => 
        s.id === editingSupplier.id ? updatedSupplier : s
      );
      console.log('Proveedores actualizados:', updatedSuppliers);
      setProveedores(updatedSuppliers);
      message.success('Proveedor actualizado correctamente');
    } else {
      const newSupplier: Proveedor = {
        ...values,
        id: Date.now(),
        productos: proveedorProductos,
        fechaRegistro: new Date().toISOString().split('T')[0],
        activo: true
      };
      const updatedSuppliers = [...proveedores, newSupplier];
      console.log('Nuevo proveedor agregado, lista actualizada:', updatedSuppliers);
      setProveedores(updatedSuppliers);
      message.success('Proveedor agregado correctamente');
    }
    setIsSupplierModalVisible(false);
    setEditingSupplier(null);
    setProveedorProductos([]);
    supplierForm.resetFields();
  };

  const handleEditSupplier = (supplier: Proveedor) => {
    setEditingSupplier(supplier);
    setProveedorProductos(supplier.productos || []);
    supplierForm.setFieldsValue(supplier);
    setIsSupplierModalVisible(true);
  };

  const handleDeleteSupplier = (id: number) => {
    setProveedores(proveedores.filter(s => s.id !== id));
    message.success('Proveedor eliminado correctamente');
  };

  const handleAddProductToSupplier = (values: any) => {
    const newProduct = {
      id: Date.now(),
      nombre: values.nombre,
      precio: values.precio,
      tiempoEntrega: values.tiempoEntrega,
      cantidadMinima: values.cantidadMinima
    };
    setProveedorProductos([...proveedorProductos, newProduct]);
    setIsSupplierProductModalVisible(false);
    supplierProductForm.resetFields();
    message.success('Producto agregado al proveedor');
  };

  const handleRemoveProductFromSupplier = (productId: number) => {
    setProveedorProductos(proveedorProductos.filter(p => p.id !== productId));
    message.success('Producto removido del proveedor');
  };

  // Funciones para carrito de pedidos a proveedores
  const agregarAlCarritoProveedor = (proveedor: Proveedor, producto: any, cantidad: number = 1) => {
    const existingItem = carritoProveedor.find(
      item => item.proveedor.id === proveedor.id && item.producto.id === producto.id
    );

    if (existingItem) {
      setCarritoProveedor(carritoProveedor.map(item =>
        item.proveedor.id === proveedor.id && item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      ));
    } else {
      setCarritoProveedor([...carritoProveedor, { proveedor, producto, cantidad }]);
    }
    message.success(`${producto.nombre} agregado al pedido`);
  };

  const actualizarCantidadCarritoProveedor = (proveedorId: number, productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setCarritoProveedor(carritoProveedor.filter(
        item => !(item.proveedor.id === proveedorId && item.producto.id === productoId)
      ));
    } else {
      setCarritoProveedor(carritoProveedor.map(item =>
        item.proveedor.id === proveedorId && item.producto.id === productoId
          ? { ...item, cantidad }
          : item
      ));
    }
  };

  const eliminarDelCarritoProveedor = (proveedorId: number, productoId: number) => {
    setCarritoProveedor(carritoProveedor.filter(
      item => !(item.proveedor.id === proveedorId && item.producto.id === productoId)
    ));
    message.success('Producto eliminado del pedido');
  };

  const calcularTotalPedido = () => {
    return carritoProveedor.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  const procesarPedidoProveedor = () => {
    if (carritoProveedor.length === 0) {
      message.error('El carrito está vacío');
      return;
    }

    // Aquí se podría integrar con un sistema de órdenes de compra
    const pedido = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      items: carritoProveedor,
      total: calcularTotalPedido(),
      estado: 'pendiente'
    };

    console.log('Pedido procesado:', pedido);
    message.success(`Pedido procesado exitosamente. Total: $${calcularTotalPedido().toFixed(2)}`);
    setCarritoProveedor([]);
    setProveedorSeleccionado(null);
  };

  const limpiarCarritoProveedor = () => {
    setCarritoProveedor([]);
    setProveedorSeleccionado(null);
    message.info('Carrito limpiado');
  };

  // Función para limpiar todos los datos (útil para pruebas)
  const limpiarTodosLosDatos = () => {
    localStorage.clear();
    setProductos([]);
    setClientes([]);
    setProveedores([]);
    setVentas([]);
    setMovimientosInventario([]);
    setFacturas([]);
    setEventos([]);
    setUsers([]);
    setCurrentUser(null);
    setIsLoggedIn(false);
    message.success('Todos los datos han sido eliminados. Recarga la página para restaurar datos de ejemplo.');
  };

  // Función para verificar localStorage (para debugging)
  const verificarLocalStorage = () => {
    console.log('=== VERIFICACIÓN DE LOCALSTORAGE ===');
    console.log('Productos en localStorage:', localStorage.getItem('productos'));
    console.log('Clientes en localStorage:', localStorage.getItem('clientes'));
    console.log('Proveedores en localStorage:', localStorage.getItem('proveedores'));
    console.log('Estado actual - Productos:', productos);
    console.log('Estado actual - Clientes:', clientes);
    console.log('Estado actual - Proveedores:', proveedores);
    console.log('Datos inicializados:', datosInicializados);
  };

  // Funciones para POS
  const agregarAlCarrito = (producto: Product) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      setCarrito(carrito.map(item => 
        item.producto.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
    }
  };

  const removerDelCarrito = (productId: number) => {
    setCarrito(carrito.filter(item => item.producto.id !== productId));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  };

  const procesarVenta = () => {
    if (carrito.length === 0) {
      message.error('El carrito está vacío');
      return;
    }

    const nuevaVenta: Venta = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      cliente: clienteSeleccionado?.nombre || 'Cliente General',
      productos: carrito.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.producto.precio
      })),
      total: calcularTotal(),
      estado: 'completada'
    };

    setVentas([...ventas, nuevaVenta]);
    
    // Actualizar stock
    carrito.forEach(item => {
      setProductos(productos.map(p => 
        p.id === item.producto.id 
          ? { ...p, stock: p.stock - item.cantidad }
          : p
      ));
    });

    setCarrito([]);
    setClienteSeleccionado(null);
    message.success('Venta procesada correctamente');
  };

  // Funciones para inventario
  const handleInventoryMovement = (values: any) => {
    const movement: InventoryMovement = {
      id: Date.now(),
      producto: values.producto,
      tipo: values.tipo,
      cantidad: values.cantidad,
      fecha: values.fecha.format('YYYY-MM-DD'),
      motivo: values.motivo
    };

    setMovimientosInventario([...movimientosInventario, movement]);

    // Actualizar stock del producto
    if (values.tipo === 'entrada') {
      setProductos(productos.map(p => 
        p.nombre === values.producto 
          ? { ...p, stock: p.stock + values.cantidad }
          : p
      ));
    } else {
      setProductos(productos.map(p => 
        p.nombre === values.producto 
          ? { ...p, stock: p.stock - values.cantidad }
          : p
      ));
    }

    setIsInventoryModalVisible(false);
    inventoryForm.resetFields();
    message.success('Movimiento de inventario registrado');
  };

  // Columnas para tablas
  const productColumns = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria' },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (precio: number) => `$${precio.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Product) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record.id)} />
        </Space>
      )
    }
  ];

  const clientColumns = [
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Cliente) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditClient(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteClient(record.id)} />
        </Space>
      )
    }
  ];

  const supplierColumns = [
    { 
      title: 'Nombre', 
      dataIndex: 'nombre', 
      key: 'nombre',
      render: (text: string, record: Proveedor) => (
        <div>
          <div className="font-semibold">{text}</div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      )
    },
    { 
      title: 'Contacto', 
      dataIndex: 'telefono', 
      key: 'telefono',
      render: (telefono: string, record: Proveedor) => (
        <div>
          <div>📞 {telefono}</div>
          <div className="text-sm text-gray-500">📧 {record.email}</div>
        </div>
      )
    },
    { 
      title: 'Productos', 
      dataIndex: 'productos', 
      key: 'productos', 
      render: (productos: Array<{nombre: string}>) => (
        <div>
          <Tag color="blue">{productos?.length || 0} productos</Tag>
          {productos?.slice(0, 2).map((prod, index) => (
            <Tag key={index} className="mt-1">{prod.nombre}</Tag>
          ))}
          {productos?.length > 2 && <Tag>+{productos.length - 2} más</Tag>}
        </div>
      )
    },
    {
      title: 'Estado',
      dataIndex: 'activo',
      key: 'activo',
      render: (activo: boolean) => (
        <Tag color={activo ? 'green' : 'red'}>
          {activo ? 'Activo' : 'Inactivo'}
        </Tag>
      )
    },
    {
      title: 'Fecha Registro',
      dataIndex: 'fechaRegistro',
      key: 'fechaRegistro',
      render: (fecha: string) => fecha ? new Date(fecha).toLocaleDateString() : 'N/A'
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Proveedor) => (
        <Space>
          <Button 
            icon={<ShoppingCartOutlined />} 
            onClick={() => setProveedorSeleccionado(record)}
            type="text"
            className="text-green-600 hover:text-green-800"
            title="Ver productos"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditSupplier(record)}
            type="text"
            className="text-blue-600 hover:text-blue-800"
          />
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteSupplier(record.id)}
            type="text" 
            danger
            className="text-red-600 hover:text-red-800"
          />
        </Space>
      )
    }
  ];

  const salesColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Cliente', dataIndex: 'cliente', key: 'cliente' },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total: number) => `$${total.toFixed(2)}` },
    { title: 'Estado', dataIndex: 'estado', key: 'estado', render: (estado: string) => <Tag color="green">{estado}</Tag> }
  ];

  const inventoryColumns = [
    { title: 'Producto', dataIndex: 'producto', key: 'producto' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: (tipo: string) => <Tag color={tipo === 'entrada' ? 'green' : 'red'}>{tipo}</Tag> },
    { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'Motivo', dataIndex: 'motivo', key: 'motivo' }
  ];

  // Menú de navegación
  const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '2', icon: <ProductOutlined />, label: 'Productos' },
    { key: '3', icon: <ShoppingCartOutlined />, label: 'Punto de Venta' },
    { key: '4', icon: <StockOutlined />, label: 'Inventario' },
    { key: '5', icon: <TeamOutlined />, label: 'Clientes' },
    { key: '6', icon: <ShopOutlined />, label: 'Proveedores' },
    { key: '7', icon: <BarChartOutlined />, label: 'Reportes' },
    { key: '8', icon: <SettingOutlined />, label: 'Configuración' },
    { key: '9', icon: <FileTextOutlined />, label: 'Facturas' },
    { key: '10', icon: <CalendarOutlined />, label: 'Calendario' }
  ];

  // Funciones para facturas
  const handleSaveFactura = (values: any) => {
    const productos = carrito.map(item => ({
      nombre: item.producto.nombre,
      cantidad: item.cantidad,
      precio: item.producto.precio,
      total: item.cantidad * item.producto.precio
    }));

    const subtotal = productos.reduce((sum, p) => sum + p.total, 0);
    const impuestos = subtotal * 0.16; // 16% IVA
    const total = subtotal + impuestos;

    if (editingFactura) {
      const updatedFactura: Factura = {
        ...editingFactura,
        ...values,
        productos: productos.length > 0 ? productos : editingFactura.productos,
        subtotal: productos.length > 0 ? subtotal : editingFactura.subtotal,
        impuestos: productos.length > 0 ? impuestos : editingFactura.impuestos,
        total: productos.length > 0 ? total : editingFactura.total
      };
      setFacturas(facturas.map(f => f.id === editingFactura.id ? updatedFactura : f));
      message.success('Factura actualizada correctamente');
    } else {
      const newFactura: Factura = {
        id: Date.now(),
        numero: `FAC-${Date.now().toString().slice(-6)}`,
        cliente: values.cliente,
        fecha: values.fecha.format('YYYY-MM-DD'),
        fechaVencimiento: values.fechaVencimiento.format('YYYY-MM-DD'),
        productos,
        subtotal,
        impuestos,
        total,
        estado: 'pendiente',
        notas: values.notas
      };
      setFacturas([...facturas, newFactura]);
      message.success('Factura creada correctamente');
    }

    setIsFacturaModalVisible(false);
    setEditingFactura(null);
    facturaForm.resetFields();
    setCarrito([]);
  };

  const handleEditFactura = (factura: Factura) => {
    setEditingFactura(factura);
    facturaForm.setFieldsValue({
      ...factura,
      fecha: factura.fecha,
      fechaVencimiento: factura.fechaVencimiento
    });
    setIsFacturaModalVisible(true);
  };

  const handleDeleteFactura = (id: number) => {
    setFacturas(facturas.filter(f => f.id !== id));
    message.success('Factura eliminada correctamente');
  };

  const handleViewFactura = (factura: Factura) => {
    setSelectedFactura(factura);
    setIsFacturaDetailVisible(true);
  };

  // Funciones para calendario
  const handleSaveEvento = (values: any) => {
    if (editingEvento) {
      const updatedEvento: EventoCalendario = {
        ...editingEvento,
        ...values,
        fecha: values.fecha.format('YYYY-MM-DD')
      };
      setEventos(eventos.map(e => e.id === editingEvento.id ? updatedEvento : e));
      message.success('Evento actualizado correctamente');
    } else {
      const newEvento: EventoCalendario = {
        id: Date.now(),
        ...values,
        fecha: values.fecha.format('YYYY-MM-DD'),
        completado: false
      };
      setEventos([...eventos, newEvento]);
      message.success('Evento creado correctamente');
    }

    setIsEventoModalVisible(false);
    setEditingEvento(null);
    eventoForm.resetFields();
  };

  const handleEditEvento = (evento: EventoCalendario) => {
    setEditingEvento(evento);
    eventoForm.setFieldsValue({
      ...evento,
      fecha: evento.fecha
    });
    setIsEventoModalVisible(true);
  };

  const handleDeleteEvento = (id: number) => {
    setEventos(eventos.filter(e => e.id !== id));
    message.success('Evento eliminado correctamente');
  };

  const handleToggleEvento = (id: number) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, completado: !e.completado } : e
    ));
  };

  // Función para renderizar el contenido según la selección
  const renderContent = () => {
    switch (selectedKey) {
      case '1': // Dashboard
        return (
          <div className="p-6">
            <Title level={2} className="mb-6">Dashboard Empresarial</Title>
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Total Productos</span>}
                    value={productos.length}
                    valueStyle={{ color: 'white' }}
                    prefix={<ProductOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Total Ventas</span>}
                    value={ventas.length}
                    valueStyle={{ color: 'white' }}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Total Clientes</span>}
                    value={clientes.length}
                    valueStyle={{ color: 'white' }}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Ingresos Total</span>}
                    value={ventas.reduce((total, venta) => total + venta.total, 0)}
                    precision={2}
                    valueStyle={{ color: 'white' }}
                    prefix="$"
                  />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Productos con Stock Bajo" className="h-96">
                  <div className="space-y-2">
                    {productos.filter(p => p.stock <= 10).map(producto => (
                      <div key={producto.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span>{producto.nombre}</span>
                        <Tag color="red">Stock: {producto.stock}</Tag>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Ventas Recientes" className="h-96">
                  <div className="space-y-2">
                    {ventas.slice(-5).map(venta => (
                      <div key={venta.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <div>
                          <div className="font-medium">{venta.cliente}</div>
                          <div className="text-sm text-gray-500">{venta.fecha}</div>
                        </div>
                        <Tag color="green">${venta.total.toFixed(2)}</Tag>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case '2': // Productos
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Gestión de Productos</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsProductModalVisible(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Agregar Producto
              </Button>
            </div>
            
            <Card>
              <Table
                columns={productColumns}
                dataSource={productos}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>

            <Modal
              title={editingProduct ? "Editar Producto" : "Agregar Producto"}
              open={isProductModalVisible}
              onCancel={() => {
                setIsProductModalVisible(false);
                setEditingProduct(null);
                productForm.resetFields();
              }}
              footer={null}
              width={600}
            >
              <Form form={productForm} onFinish={handleSaveProduct} layout="vertical">
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
                      <Select placeholder="Selecciona una categoría">
                        <Option value="Electrónicos">Electrónicos</Option>
                        <Option value="Ropa">Ropa</Option>
                        <Option value="Hogar">Hogar</Option>
                        <Option value="Deportes">Deportes</Option>
                        <Option value="Libros">Libros</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="precio" label="Precio" rules={[{ required: true }]}>
                      <InputNumber
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
                      <InputNumber min={0} placeholder="Cantidad en stock" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="descripcion" label="Descripción">
                  <Input.TextArea rows={3} placeholder="Descripción del producto" />
                </Form.Item>
                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button onClick={() => {
                      setIsProductModalVisible(false);
                      setEditingProduct(null);
                      productForm.resetFields();
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      {editingProduct ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );

      case '3': // Punto de Venta
        return (
          <div className="p-6">
            <Title level={2} className="mb-6">Punto de Venta</Title>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <Card title="Productos Disponibles" className="h-96 overflow-y-auto">
                  <Row gutter={[8, 8]}>
                    {productos.map(producto => (
                      <Col span={8} key={producto.id}>
                        <Card
                          size="small"
                          hoverable
                          onClick={() => agregarAlCarrito(producto)}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="text-center">
                            <div className="font-medium text-sm">{producto.nombre}</div>
                            <div className="text-lg font-bold text-green-600">${producto.precio}</div>
                            <div className="text-xs text-gray-500">Stock: {producto.stock}</div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Carrito de Compras">
                  <div className="mb-4">
                    <Select
                      placeholder="Seleccionar cliente"
                      style={{ width: '100%' }}
                      value={clienteSeleccionado?.id}
                      onChange={(value) => {
                        const cliente = clientes.find(c => c.id === value);
                        setClienteSeleccionado(cliente || null);
                      }}
                    >
                      {clientes.map(cliente => (
                        <Option key={cliente.id} value={cliente.id}>{cliente.nombre}</Option>
                      ))}
                    </Select>
                  </div>
                  
                  <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                    {carrito.map(item => (
                      <div key={item.producto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.producto.nombre}</div>
                          <div className="text-xs text-gray-500">
                            {item.cantidad} x ${item.producto.precio} = ${(item.cantidad * item.producto.precio).toFixed(2)}
                          </div>
                        </div>
                        <Button 
                          size="small" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={() => removerDelCarrito(item.producto.id)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">Total:</span>
                      <span className="text-xl font-bold text-green-600">${calcularTotal().toFixed(2)}</span>
                    </div>
                    <Button 
                      type="primary" 
                      block 
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={procesarVenta}
                      disabled={carrito.length === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Procesar Venta
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case '4': // Inventario
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Gestión de Inventario</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsInventoryModalVisible(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Registrar Movimiento
              </Button>
            </div>
            
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Productos"
                    value={productos.length}
                    prefix={<ProductOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Stock Total"
                    value={productos.reduce((total, p) => total + p.stock, 0)}
                    prefix={<StockOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Productos Bajo Stock"
                    value={productos.filter(p => p.stock <= 10).length}
                    prefix={<ExportOutlined />}
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Movimientos de Inventario">
              <Table
                columns={inventoryColumns}
                dataSource={movimientosInventario}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>

            <Modal
              title="Registrar Movimiento de Inventario"
              open={isInventoryModalVisible}
              onCancel={() => {
                setIsInventoryModalVisible(false);
                inventoryForm.resetFields();
              }}
              footer={null}
              width={500}
            >
              <Form form={inventoryForm} onFinish={handleInventoryMovement} layout="vertical">
                <Form.Item name="producto" label="Producto" rules={[{ required: true }]}>
                  <Select placeholder="Selecciona un producto">
                    {productos.map(producto => (
                      <Option key={producto.id} value={producto.nombre}>{producto.nombre}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="tipo" label="Tipo de Movimiento" rules={[{ required: true }]}>
                  <Select placeholder="Selecciona el tipo">
                    <Option value="entrada">Entrada</Option>
                    <Option value="salida">Salida</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
                  <InputNumber min={1} placeholder="Cantidad" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="motivo" label="Motivo" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} placeholder="Motivo del movimiento" />
                </Form.Item>
                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button onClick={() => {
                      setIsInventoryModalVisible(false);
                      inventoryForm.resetFields();
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      Registrar
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );

      case '5': // Clientes
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Gestión de Clientes</Title>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={() => setIsClientModalVisible(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Agregar Cliente
              </Button>
            </div>
            
            <Card>
              <Table
                columns={clientColumns}
                dataSource={clientes}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                size="middle"
              />
            </Card>

            <Modal
              title={editingClient ? "Editar Cliente" : "Agregar Cliente"}
              open={isClientModalVisible}
              onCancel={() => {
                setIsClientModalVisible(false);
                setEditingClient(null);
                clientForm.resetFields();
              }}
              footer={null}
              width={600}
            >
              <Form form={clientForm} onFinish={handleSaveClient} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
                      <Input placeholder="Nombre completo" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                      <Input placeholder="correo@ejemplo.com" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="telefono" label="Teléfono" rules={[{ required: true }]}>
                      <Input placeholder="Número de teléfono" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="tipo" label="Tipo de Cliente" rules={[{ required: true }]}>
                      <Select placeholder="Selecciona el tipo">
                        <Option value="Individual">Individual</Option>
                        <Option value="Empresa">Empresa</Option>
                        <Option value="VIP">VIP</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item name="direccion" label="Dirección">
                  <Input.TextArea rows={3} placeholder="Dirección completa" />
                </Form.Item>
                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button onClick={() => {
                      setIsClientModalVisible(false);
                      setEditingClient(null);
                      clientForm.resetFields();
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      {editingClient ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );

      case '6': // Proveedores
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Gestión de Proveedores</Title>
              <div className="flex space-x-2">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setProveedorProductos([]);
                    setIsSupplierModalVisible(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Agregar Proveedor
                </Button>
                {carritoProveedor.length > 0 && (
                  <Button
                    type="default"
                    icon={<DeleteOutlined />}
                    onClick={limpiarCarritoProveedor}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Limpiar Carrito
                  </Button>
                )}
              </div>
            </div>

            <Row gutter={16}>
              {/* Sección izquierda: Gestión de Proveedores */}
              <Col span={14}>
                <Card className="mb-4">
                  <div className="mb-4">
                    <Title level={4}>Lista de Proveedores</Title>
                  </div>
                  <Table
                    dataSource={proveedores}
                    columns={supplierColumns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    size="small"
                  />
                </Card>

                {/* Lista de productos por proveedor seleccionado */}
                {proveedorSeleccionado && (
                  <Card>
                    <div className="flex justify-between items-center mb-4">
                      <Title level={4}>
                        Productos de {proveedorSeleccionado.nombre}
                      </Title>
                      <Button
                        type="text"
                        onClick={() => setProveedorSeleccionado(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {proveedorSeleccionado.productos?.map((producto) => (
                        <div
                          key={producto.id}
                          className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">
                              ${producto.precio} | Min: {producto.cantidadMinima} | 
                              Entrega: {producto.tiempoEntrega}
                            </div>
                          </div>
                          <Button
                            type="primary"
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => agregarAlCarritoProveedor(
                              proveedorSeleccionado, 
                              producto, 
                              producto.cantidadMinima
                            )}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Agregar
                          </Button>
                        </div>
                      ))}
                      {(!proveedorSeleccionado.productos || proveedorSeleccionado.productos.length === 0) && (
                        <div className="text-center text-gray-500 py-4">
                          <ProductOutlined className="text-2xl mb-2" />
                          <p>Este proveedor no tiene productos registrados</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </Col>

              {/* Sección derecha: Carrito de Pedidos */}
              <Col span={10}>
                <Card>
                  <div className="mb-4">
                    <Title level={4}>Carrito de Pedidos</Title>
                  </div>
                  
                  {/* Selector de proveedor */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar Proveedor
                    </label>
                    <Select
                      placeholder="Selecciona un proveedor para ver sus productos"
                      className="w-full"
                      value={proveedorSeleccionado?.id}
                      onChange={(value) => {
                        const proveedor = proveedores.find(p => p.id === value);
                        setProveedorSeleccionado(proveedor || null);
                      }}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {proveedores.filter(p => p.activo).map(proveedor => (
                        <Select.Option key={proveedor.id} value={proveedor.id}>
                          <div>
                            <div className="font-medium">{proveedor.nombre}</div>
                            <div className="text-xs text-gray-500">
                              {proveedor.productos?.length || 0} productos disponibles
                            </div>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  {carritoProveedor.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                        {carritoProveedor.map((item) => (
                          <div
                            key={`${item.proveedor.id}-${item.producto.id}`}
                            className="flex justify-between items-center p-3 border border-gray-100 rounded-lg bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{item.producto.nombre}</div>
                              <div className="text-sm text-gray-600">
                                Proveedor: {item.proveedor.nombre}
                              </div>
                              <div className="text-sm text-gray-600">
                                ${item.producto.precio} c/u | Entrega: {item.producto.tiempoEntrega}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1 border border-gray-300 rounded">
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => actualizarCantidadCarritoProveedor(
                                    item.proveedor.id, 
                                    item.producto.id, 
                                    item.cantidad - 1
                                  )}
                                  className="text-gray-600 hover:bg-gray-200"
                                >
                                  −
                                </Button>
                                <span className="font-medium px-2 min-w-[30px] text-center">
                                  {item.cantidad}
                                </span>
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => actualizarCantidadCarritoProveedor(
                                    item.proveedor.id, 
                                    item.producto.id, 
                                    item.cantidad + 1
                                  )}
                                  className="text-gray-600 hover:bg-gray-200"
                                >
                                  +
                                </Button>
                              </div>
                              <div className="text-right min-w-[80px]">
                                <div className="font-bold text-green-600">
                                  ${(item.producto.precio * item.cantidad).toFixed(2)}
                                </div>
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => eliminarDelCarritoProveedor(
                                    item.proveedor.id, 
                                    item.producto.id
                                  )}
                                  className="text-red-500 hover:text-red-700"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Resumen del pedido */}
                      <div className="border-t pt-4">
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span>Items:</span>
                            <span>{carritoProveedor.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Proveedores:</span>
                            <span>{new Set(carritoProveedor.map(item => item.proveedor.id)).size}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Cantidad total:</span>
                            <span>{carritoProveedor.reduce((sum, item) => sum + item.cantidad, 0)}</span>
                          </div>
                          <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                            <span>Total del Pedido:</span>
                            <span className="text-green-600">
                              ${calcularTotalPedido().toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="primary"
                          block
                          icon={<ShoppingCartOutlined />}
                          onClick={procesarPedidoProveedor}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Procesar Pedido
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <ShoppingCartOutlined className="text-4xl mb-4" />
                      <p className="text-lg mb-2">Carrito vacío</p>
                      <p className="text-sm">Selecciona un proveedor para ver sus productos</p>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {/* Modales existentes */}
            <Modal
              title={editingSupplier ? "Editar Proveedor" : "Agregar Proveedor"}
              open={isSupplierModalVisible}
              onCancel={() => {
                setIsSupplierModalVisible(false);
                setEditingSupplier(null);
                setProveedorProductos([]);
                supplierForm.resetFields();
              }}
              footer={null}
              width={800}
            >
              <Form
                form={supplierForm}
                layout="vertical"
                onFinish={handleSaveSupplier}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nombre del Proveedor"
                      name="nombre"
                      rules={[{ required: true, message: 'El nombre es requerido' }]}
                    >
                      <Input placeholder="Nombre del proveedor" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'El email es requerido' },
                        { type: 'email', message: 'Email no válido' }
                      ]}
                    >
                      <Input placeholder="correo@proveedor.com" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Teléfono"
                      name="telefono"
                      rules={[{ required: true, message: 'El teléfono es requerido' }]}
                    >
                      <Input placeholder="Número de teléfono" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Estado"
                      name="activo"
                      initialValue={true}
                    >
                      <Select>
                        <Select.Option value={true}>Activo</Select.Option>
                        <Select.Option value={false}>Inactivo</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                >
                  <TextArea rows={3} placeholder="Dirección del proveedor" />
                </Form.Item>

                {/* Sección de productos del proveedor */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold">Productos que Suministra</h4>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => setIsSupplierProductModalVisible(true)}
                    >
                      Agregar Producto
                    </Button>
                  </div>

                  {proveedorProductos.length > 0 ? (
                    <div className="space-y-2">
                      {proveedorProductos.map((producto) => (
                        <div
                          key={producto.id}
                          className="flex justify-between items-center p-3 bg-white rounded border"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{producto.nombre}</div>
                            <div className="text-sm text-gray-500">
                              Precio: ${producto.precio} | 
                              Entrega: {producto.tiempoEntrega} | 
                              Cantidad mínima: {producto.cantidadMinima}
                            </div>
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveProductFromSupplier(producto.id)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <ProductOutlined className="text-2xl mb-2" />
                      <p>No hay productos asignados</p>
                      <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
                    </div>
                  )}
                </div>

                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button
                      onClick={() => {
                        setIsSupplierModalVisible(false);
                        setEditingSupplier(null);
                        setProveedorProductos([]);
                        supplierForm.resetFields();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      {editingSupplier ? 'Actualizar' : 'Guardar'}
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal para agregar productos al proveedor */}
            <Modal
              title="Agregar Producto al Proveedor"
              open={isSupplierProductModalVisible}
              onCancel={() => {
                setIsSupplierProductModalVisible(false);
                supplierProductForm.resetFields();
              }}
              footer={null}
              width={600}
            >
              <Form
                form={supplierProductForm}
                layout="vertical"
                onFinish={handleAddProductToSupplier}
              >
                <Form.Item
                  label="Seleccionar Producto Existente o Crear Nuevo"
                  name="nombre"
                  rules={[{ required: true, message: 'El nombre del producto es requerido' }]}
                >
                  <Select
                    placeholder="Seleccionar producto existente o escribir nuevo nombre"
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {productos.map(producto => (
                      <Select.Option key={producto.id} value={producto.nombre}>
                        {producto.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Precio del Proveedor"
                      name="precio"
                      rules={[{ required: true, message: 'El precio es requerido' }]}
                    >
                      <InputNumber
                        placeholder="0.00"
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Cantidad Mínima de Pedido"
                      name="cantidadMinima"
                      rules={[{ required: true, message: 'La cantidad mínima es requerida' }]}
                    >
                      <InputNumber
                        placeholder="1"
                        min={1}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Tiempo de Entrega"
                  name="tiempoEntrega"
                  rules={[{ required: true, message: 'El tiempo de entrega es requerido' }]}
                >
                  <Select placeholder="Seleccionar tiempo de entrega">
                    <Select.Option value="1-2 días">1-2 días</Select.Option>
                    <Select.Option value="3-5 días">3-5 días</Select.Option>
                    <Select.Option value="1 semana">1 semana</Select.Option>
                    <Select.Option value="2 semanas">2 semanas</Select.Option>
                    <Select.Option value="1 mes">1 mes</Select.Option>
                    <Select.Option value="Personalizado">Personalizado</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button onClick={() => setIsSupplierProductModalVisible(false)}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      Agregar Producto
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );

      case '7': // Reportes
        return (
          <div className="p-6">
            <Title level={2} className="mb-6">Reportes y Análisis</Title>
            
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Ventas del Mes"
                    value={ventas.length}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Ingresos del Mes"
                    value={ventas.reduce((total, venta) => total + venta.total, 0)}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Productos Vendidos"
                    value={ventas.reduce((total, venta) => total + venta.productos.length, 0)}
                    prefix={<ProductOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Clientes Activos"
                    value={clientes.length}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Ventas Recientes" extra={<Button icon={<ExportOutlined />}>Exportar</Button>}>
                  <Table
                    columns={salesColumns}
                    dataSource={ventas.slice(-10)}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Productos Más Vendidos">
                  <div className="space-y-2">
                    {productos.slice(0, 5).map((producto, index) => (
                      <div key={producto.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">#{index + 1} {producto.nombre}</span>
                        <Tag color="blue">{Math.floor(Math.random() * 50) + 1} ventas</Tag>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );

      case '8': // Configuración
        return (
          <div className="p-6">
            <Title level={2} className="mb-6">Configuración del Sistema</Title>
            
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="Configuración General" className="mb-4">
                  <Form layout="vertical">
                    <Form.Item label="Nombre de la Empresa">
                      <Input defaultValue="Mi Empresa POS" />
                    </Form.Item>
                    <Form.Item label="Dirección">
                      <Input.TextArea rows={2} defaultValue="Dirección de la empresa" />
                    </Form.Item>
                    <Form.Item label="Teléfono">
                      <Input defaultValue="+1234567890" />
                    </Form.Item>
                    <Form.Item label="Email">
                      <Input defaultValue="info@miempresa.com" />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" className="bg-blue-600">Guardar Cambios</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Configuración de Impresión" className="mb-4">
                  <Form layout="vertical">
                    <Form.Item label="Impresora Predeterminada">
                      <Select defaultValue="printer1">
                        <Option value="printer1">Impresora de Recibos</Option>
                        <Option value="printer2">Impresora de Facturas</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item label="Tamaño de Papel">
                      <Select defaultValue="80mm">
                        <Option value="80mm">80mm (Recibos)</Option>
                        <Option value="a4">A4 (Facturas)</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" className="bg-blue-600">Configurar</Button>
                    </Form.Item>
                  </Form>
                </Card>
                
                <Card title="Respaldo de Datos">
                  <div className="space-y-4">
                    <Button type="primary" icon={<ExportOutlined />} block className="bg-green-600">
                      Exportar Datos
                    </Button>
                    <Upload>
                      <Button icon={<UploadOutlined />} block>
                        Importar Datos
                      </Button>
                    </Upload>
                    <Button type="default" icon={<PrinterOutlined />} block>
                      Configurar Impresora
                    </Button>
                  </div>
                </Card>

                <Card title="Gestión de Datos" className="mt-4">
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>Total de productos:</strong> {productos.length}</p>
                      <p><strong>Total de clientes:</strong> {clientes.length}</p>
                      <p><strong>Total de proveedores:</strong> {proveedores.length}</p>
                      <p><strong>Total de ventas:</strong> {ventas.length}</p>
                    </div>
                    <Button 
                      type="default" 
                      onClick={verificarLocalStorage}
                      block
                      className="mb-2"
                    >
                      Verificar localStorage (Consola)
                    </Button>
                    <Button 
                      type="primary" 
                      danger 
                      icon={<DeleteOutlined />} 
                      block
                      onClick={() => {
                        Modal.confirm({
                          title: '¿Estás seguro?',
                          content: 'Esta acción eliminará todos los datos y no se puede deshacer.',
                          okText: 'Sí, eliminar',
                          cancelText: 'Cancelar',
                          onOk: limpiarTodosLosDatos
                        });
                      }}
                    >
                      Limpiar Todos los Datos
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>        </div>
      );

    case '9':
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Gestión de Facturas</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsFacturaModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg"
            >
              Nueva Factura
            </Button>
          </div>

          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
            <Table
              dataSource={facturas}
              rowKey="id"
              columns={[
                {
                  title: 'Número',
                  dataIndex: 'numero',
                  key: 'numero',
                  render: (text) => <span className="font-semibold text-blue-700">{text}</span>
                },
                {
                  title: 'Cliente',
                  dataIndex: 'cliente',
                  key: 'cliente'
                },
                {
                  title: 'Fecha',
                  dataIndex: 'fecha',
                  key: 'fecha',
                  render: (text) => new Date(text).toLocaleDateString()
                },
                {
                  title: 'Total',
                  dataIndex: 'total',
                  key: 'total',
                  render: (value) => <span className="font-bold text-green-600">${value.toFixed(2)}</span>
                },
                {
                  title: 'Estado',
                  dataIndex: 'estado',
                  key: 'estado',
                  render: (estado) => (
                    <Tag color={estado === 'pagado' ? 'green' : estado === 'vencido' ? 'red' : 'orange'}>
                      {estado.toUpperCase()}
                    </Tag>
                  )
                },
                {
                  title: 'Acciones',
                  key: 'actions',
                  render: (_, record) => (
                    <div className="space-x-2">
                      <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => handleViewFactura(record)}
                        type="text"
                        className="text-blue-600 hover:text-blue-800"
                      />
                      <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEditFactura(record)}
                        type="text"
                        className="text-green-600 hover:text-green-800"
                      />
                      <Button 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteFactura(record.id)}
                        type="text" 
                        danger
                        className="text-red-600 hover:text-red-800"
                      />
                    </div>
                  )
                }
              ]}
              pagination={{ pageSize: 10 }}
              className="custom-table"
            />
          </div>

          {/* Modal para crear/editar factura */}
          <Modal
            title={editingFactura ? 'Editar Factura' : 'Nueva Factura'}
            open={isFacturaModalVisible}
            onCancel={() => {
              setIsFacturaModalVisible(false);
              setEditingFactura(null);
              facturaForm.resetFields();
            }}
            footer={null}
            width={800}
            className="custom-modal"
          >
            <Form
              form={facturaForm}
              layout="vertical"
              onFinish={handleSaveFactura}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Cliente"
                  name="cliente"
                  rules={[{ required: true, message: 'El cliente es requerido' }]}
                >
                  <Select
                    placeholder="Seleccionar cliente"
                    className="w-full"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {clientes.map(cliente => (
                      <Select.Option key={cliente.id} value={cliente.nombre}>
                        {cliente.nombre}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Fecha"
                  name="fecha"
                  rules={[{ required: true, message: 'La fecha es requerida' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Fecha de Vencimiento"
                  name="fechaVencimiento"
                  rules={[{ required: true, message: 'La fecha de vencimiento es requerida' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Estado"
                  name="estado"
                  initialValue="pendiente"
                >
                  <Select>
                    <Select.Option value="pendiente">Pendiente</Select.Option>
                    <Select.Option value="pagado">Pagado</Select.Option>
                    <Select.Option value="vencido">Vencido</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item label="Notas" name="notas">
                <TextArea rows={3} placeholder="Notas adicionales..." />
              </Form.Item>

              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsFacturaModalVisible(false)}>
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingFactura ? 'Actualizar' : 'Crear'} Factura
                </Button>
              </div>
            </Form>
          </Modal>

          {/* Modal para ver detalle de factura */}
          <Modal
            title={`Factura ${selectedFactura?.numero}`}
            open={isFacturaDetailVisible}
            onCancel={() => setIsFacturaDetailVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsFacturaDetailVisible(false)}>
                Cerrar
              </Button>
            ]}
            width={600}
          >
            {selectedFactura && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Cliente:</strong> {selectedFactura.cliente}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {new Date(selectedFactura.fecha).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Vencimiento:</strong> {new Date(selectedFactura.fechaVencimiento).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Estado:</strong> 
                    <Tag color={selectedFactura.estado === 'pagado' ? 'green' : selectedFactura.estado === 'vencido' ? 'red' : 'orange'} className="ml-2">
                      {selectedFactura.estado.toUpperCase()}
                    </Tag>
                  </div>
                </div>

                <Divider />

                <div>
                  <h4 className="font-semibold mb-2">Productos:</h4>
                  <Table
                    dataSource={selectedFactura.productos}
                    rowKey="nombre"
                    pagination={false}
                    size="small"
                    columns={[
                      { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
                      { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
                      { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (value) => `$${value.toFixed(2)}` },
                      { title: 'Total', dataIndex: 'total', key: 'total', render: (value) => `$${value.toFixed(2)}` }
                    ]}
                  />
                </div>

                <Divider />

                <div className="text-right space-y-2">
                  <div><strong>Subtotal:</strong> ${selectedFactura.subtotal.toFixed(2)}</div>
                  <div><strong>Impuestos:</strong> ${selectedFactura.impuestos.toFixed(2)}</div>
                  <div className="text-lg"><strong>Total:</strong> ${selectedFactura.total.toFixed(2)}</div>
                </div>

                {selectedFactura.notas && (
                  <>
                    <Divider />
                    <div>
                      <strong>Notas:</strong>
                      <p className="mt-2 p-3 bg-gray-50 rounded">{selectedFactura.notas}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </Modal>
        </div>
      );

    case '10':
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Calendario y Eventos</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsEventoModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 border-none shadow-lg"
            >
              Nuevo Evento
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de eventos */}
            <div className="lg:col-span-2">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Próximos Eventos</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {eventos
                    .filter(evento => new Date(evento.fecha) >= new Date())
                    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                    .map(evento => (
                      <div
                        key={evento.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          evento.tipo === 'reunion' ? 'border-blue-500 bg-blue-50' :
                          evento.tipo === 'tarea' ? 'border-green-500 bg-green-50' :
                          evento.tipo === 'recordatorio' ? 'border-yellow-500 bg-yellow-50' :
                          'border-purple-500 bg-purple-50'
                        } ${evento.completado ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-semibold ${evento.completado ? 'line-through' : ''}`}>
                                {evento.titulo}
                              </h4>
                              <Tag color={
                                evento.prioridad === 'alta' ? 'red' :
                                evento.prioridad === 'media' ? 'orange' : 'green'
                              }>
                                {evento.prioridad}
                              </Tag>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{evento.descripcion}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>📅 {new Date(evento.fecha).toLocaleDateString()}</span>
                              <span>⏰ {evento.horaInicio} - {evento.horaFin}</span>
                              <span>📋 {evento.tipo}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="small"
                              type={evento.completado ? "default" : "primary"}
                              onClick={() => handleToggleEvento(evento.id)}
                              className="text-xs"
                            >
                              {evento.completado ? 'Pendiente' : 'Completar'}
                            </Button>
                            <Button 
                              size="small"
                              icon={<EditOutlined />} 
                              onClick={() => handleEditEvento(evento)}
                              type="text"
                            />
                            <Button 
                              size="small"
                              icon={<DeleteOutlined />} 
                              onClick={() => handleDeleteEvento(evento.id)}
                              type="text" 
                              danger
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  {eventos.filter(evento => new Date(evento.fecha) >= new Date()).length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <CalendarOutlined className="text-4xl mb-2" />
                      <p>No hay eventos próximos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen del día */}
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Resumen de Hoy</h3>
                <div className="space-y-3">
                  {eventos
                    .filter(evento => {
                      const today = new Date().toDateString();
                      const eventoDate = new Date(evento.fecha).toDateString();
                      return today === eventoDate;
                    })
                    .map(evento => (
                      <div key={evento.id} className="p-3 bg-white/30 rounded-lg">
                        <div className="font-medium">{evento.titulo}</div>
                        <div className="text-sm text-gray-600">
                          {evento.horaInicio} - {evento.horaFin}
                        </div>
                      </div>
                    ))}
                  {eventos.filter(evento => {
                    const today = new Date().toDateString();
                    const eventoDate = new Date(evento.fecha).toDateString();
                    return today === eventoDate;
                  }).length === 0 && (
                    <p className="text-gray-300 text-center py-4">No hay eventos para hoy</p>
                  )}
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total eventos:</span>
                    <span className="font-bold">{eventos.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completados:</span>
                    <span className="font-bold text-green-400">
                      {eventos.filter(e => e.completado).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pendientes:</span>
                    <span className="font-bold text-orange-400">
                      {eventos.filter(e => !e.completado).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Esta semana:</span>
                    <span className="font-bold">
                      {eventos.filter(evento => {
                        const today = new Date();
                        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                        const eventoDate = new Date(evento.fecha);
                        return eventoDate >= today && eventoDate <= weekFromNow;
                      }).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal para crear/editar evento */}
          <Modal
            title={editingEvento ? 'Editar Evento' : 'Nuevo Evento'}
            open={isEventoModalVisible}
            onCancel={() => {
              setIsEventoModalVisible(false);
              setEditingEvento(null);
              eventoForm.resetFields();
            }}
            footer={null}
            width={600}
            className="custom-modal"
          >
            <Form
              form={eventoForm}
              layout="vertical"
              onFinish={handleSaveEvento}
              className="space-y-4"
            >
              <Form.Item
                label="Título"
                name="titulo"
                rules={[{ required: true, message: 'El título es requerido' }]}
              >
                <Input placeholder="Título del evento" />
              </Form.Item>

              <Form.Item
                label="Descripción"
                name="descripcion"
              >
                <TextArea rows={3} placeholder="Descripción del evento" />
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Fecha"
                  name="fecha"
                  rules={[{ required: true, message: 'La fecha es requerida' }]}
                >
                  <DatePicker className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Tipo"
                  name="tipo"
                  initialValue="tarea"
                >
                  <Select>
                    <Select.Option value="reunion">Reunión</Select.Option>
                    <Select.Option value="tarea">Tarea</Select.Option>
                    <Select.Option value="recordatorio">Recordatorio</Select.Option>
                    <Select.Option value="evento">Evento</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Hora de Inicio"
                  name="horaInicio"
                  rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
                >
                  <TimePicker format="HH:mm" className="w-full" />
                </Form.Item>

                <Form.Item
                  label="Hora de Fin"
                  name="horaFin"
                  rules={[{ required: true, message: 'La hora de fin es requerida' }]}
                >
                  <TimePicker format="HH:mm" className="w-full" />
                </Form.Item>
              </div>

              <Form.Item
                label="Prioridad"
                name="prioridad"
                initialValue="media"
              >
                <Select>
                  <Select.Option value="baja">Baja</Select.Option>
                  <Select.Option value="media">Media</Select.Option>
                  <Select.Option value="alta">Alta</Select.Option>
                </Select>
              </Form.Item>

              <div className="flex justify-end space-x-2">
                <Button onClick={() => setIsEventoModalVisible(false)}>
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit">
                  {editingEvento ? 'Actualizar' : 'Crear'} Evento
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      );

    default:
        return <div>Contenido no encontrado</div>;
    }
  };

  // Renderizar pantalla de login
  const renderLoginScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <UserOutlined className="text-3xl text-white" />
              </div>
              <Title level={2} className="mb-2">Gestor POS</Title>
              <p className="text-gray-600">
                {showRegister ? 'Crear nueva cuenta' : 'Inicia sesión en tu cuenta'}
              </p>
            </div>

            {!showRegister ? (
              // Formulario de Login
              <Form form={loginForm} onFinish={handleLogin} layout="vertical" size="large">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Ingresa tu usuario o email' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Usuario o Email"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Contraseña"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 font-medium"
                  >
                    Iniciar Sesión
                  </Button>
                </Form.Item>
                <div className="text-center">
                  <Button
                    type="link"
                    onClick={() => setShowRegister(true)}
                    className="text-blue-600"
                  >
                    ¿No tienes cuenta? Regístrate aquí
                  </Button>
                </div>
              </Form>
            ) : (
              // Formulario de Registro
              <Form form={registerForm} onFinish={handleRegister} layout="vertical" size="large">
                <Form.Item
                  name="nombre"
                  rules={[{ required: true, message: 'Ingresa tu nombre completo' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nombre completo"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Ingresa un nombre de usuario' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nombre de usuario"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Ingresa tu email' },
                    { type: 'email', message: 'Email no válido' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Ingresa una contraseña' },
                    { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Contraseña"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Confirma tu contraseña' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Las contraseñas no coinciden'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirmar contraseña"
                    className="h-12"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 border-0 font-medium"
                  >
                    Registrarse
                  </Button>
                </Form.Item>
                <div className="text-center">
                  <Button
                    type="link"
                    onClick={() => setShowRegister(false)}
                    className="text-blue-600"
                  >
                    ¿Ya tienes cuenta? Inicia sesión
                  </Button>
                </div>
              </Form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 text-center">
                <p className="mb-2">Credenciales de prueba:</p>
                <p><strong>Usuario:</strong> admin</p>
                <p><strong>Contraseña:</strong> admin123</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isLoggedIn ? (
        renderLoginScreen()
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider 
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            width={250}
            theme="dark"
            style={{
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            }}
          >
            <div className="p-4 text-center">
              <h2 className="text-white text-lg font-bold m-0">
                {collapsed ? 'POS' : 'Gestor POS'}
              </h2>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={({ key }) => setSelectedKey(key)}
              items={menuItems}
              style={{ background: 'transparent', border: 'none' }}
            />
          </Sider>
          
          <Layout>
            <Header 
              style={{ 
                padding: '0 24px', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '16px', width: 64, height: 64, color: 'white' }}
              />
              <div className="flex items-center gap-4">
                <span className="text-white text-lg font-medium">Sistema POS Empresarial</span>
                <div className="flex items-center gap-2 text-white">
                  <UserOutlined />
                  <span>{currentUser?.nombre}</span>
                  <Button
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    className="text-white hover:bg-white/20"
                    title="Cerrar Sesión"
                  />
                </div>
              </div>
            </Header>
            
            <Content style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
              {renderContent()}
            </Content>
          </Layout>
        </Layout>
      )}
    </>
  );
};

export default App;