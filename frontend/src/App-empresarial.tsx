import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Card, Statistic, Row, Col, Form, Input, Select, Table, Modal, message, Space, Tag, DatePicker, InputNumber, Upload, Typography, TimePicker, Checkbox, Dropdown } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekday from 'dayjs/plugin/weekday';

dayjs.locale('es');
dayjs.extend(weekOfYear);
dayjs.extend(weekday);

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
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  MoreOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
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
  imagen?: string; // URL de la imagen del producto
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
  ubicacion?: string;
  participantes?: string;
  recordatorio?: boolean;
  recurrente?: boolean;
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
  const [pedidosProcesados, setPedidosProcesados] = useState<Array<{
    id: number;
    numero: string;
    fecha: string;
    items: any[];
    total: number;
    estado: string;
  }>>([]);

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
  
  // Estados adicionales para calendario avanzado
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day' | 'list'>('month');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [quickEventType, setQuickEventType] = useState<string | null>(null);

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
    const savedPedidos = localStorage.getItem('pedidosProcesados');

    // Cargar productos
    if (savedProducts) {
      setProductos(JSON.parse(savedProducts));
    } else {
      // Agregar algunos productos de ejemplo si no existen
      const defaultProducts: Product[] = [
        {
          id: 1,
          codigo: 'LAPTOP001',
          nombre: 'Laptop Dell Inspiron',
          categoria: 'Electrónicos',
          precio: 899.99,
          stock: 15,
          descripcion: 'Laptop Dell Inspiron 15 3000, Intel Core i5, 8GB RAM, 256GB SSD',
          imagen: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: 2,
          codigo: 'PHONE001',
          nombre: 'Smartphone Samsung',
          categoria: 'Electrónicos',
          precio: 699.99,
          stock: 25,
          descripcion: 'Samsung Galaxy A54 5G, 128GB, Cámara 50MP',
          imagen: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: 3,
          codigo: 'SHIRT001',
          nombre: 'Camisa Formal',
          categoria: 'Ropa',
          precio: 45.99,
          stock: 40,
          descripcion: 'Camisa formal de algodón, disponible en varios colores',
          imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: 4,
          codigo: 'BOOK001',
          nombre: 'Libro de Programación',
          categoria: 'Libros',
          precio: 29.99,
          stock: 20,
          descripcion: 'Guía completa de JavaScript moderno y desarrollo web',
          imagen: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center'
        },
        {
          id: 5,
          codigo: 'CHAIR001',
          nombre: 'Silla Ergonómica',
          categoria: 'Hogar',
          precio: 159.99,
          stock: 12,
          descripcion: 'Silla de oficina ergonómica con soporte lumbar ajustable',
          imagen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
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
    if (savedFacturas) {
      setFacturas(JSON.parse(savedFacturas));
    } else {
      // Agregar facturas de ejemplo
      const defaultFacturas: Factura[] = [
        {
          id: 1,
          numero: 'FAC-001',
          cliente: 'Cliente Ejemplo',
          fecha: '2025-07-15',
          fechaVencimiento: '2025-08-15',
          productos: [
            {
              nombre: 'Producto Ejemplo 1',
              cantidad: 2,
              precio: 100.00,
              total: 200.00
            },
            {
              nombre: 'Producto Ejemplo 2',
              cantidad: 1,
              precio: 50.00,
              total: 50.00
            }
          ],
          subtotal: 250.00,
          impuestos: 40.00,
          total: 290.00,
          estado: 'pendiente',
          notas: 'Factura de ejemplo para pruebas'
        },
        {
          id: 2,
          numero: 'FAC-002',
          cliente: 'Cliente Empresa',
          fecha: '2025-07-10',
          fechaVencimiento: '2025-08-10',
          productos: [
            {
              nombre: 'Producto Empresarial',
              cantidad: 3,
              precio: 75.00,
              total: 225.00
            }
          ],
          subtotal: 225.00,
          impuestos: 36.00,
          total: 261.00,
          estado: 'pendiente',
          notas: 'Factura empresarial'
        }
      ];
      setFacturas(defaultFacturas);
    }
    if (savedEventos) {
      setEventos(JSON.parse(savedEventos));
    } else {
      // Crear eventos de ejemplo
      const eventosEjemplo: EventoCalendario[] = [
        {
          id: 1,
          titulo: 'Reunión con Cliente Principal',
          descripcion: 'Presentación de nuevos productos y negociación de contratos',
          fecha: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          horaInicio: '09:00',
          horaFin: '11:00',
          tipo: 'reunion',
          prioridad: 'alta',
          completado: false,
          ubicacion: 'Sala de Juntas Principal',
          participantes: 'Director Comercial, Cliente ABC',
          recordatorio: true
        },
        {
          id: 2,
          titulo: 'Revisión de Inventario Mensual',
          descripcion: 'Auditoría completa del inventario y ajustes necesarios',
          fecha: dayjs().add(3, 'day').format('YYYY-MM-DD'),
          horaInicio: '14:00',
          horaFin: '17:00',
          tipo: 'tarea',
          prioridad: 'media',
          completado: false,
          ubicacion: 'Almacén Central',
          participantes: 'Equipo de Inventario'
        },
        {
          id: 3,
          titulo: 'Recordatorio: Pago a Proveedores',
          descripcion: 'Procesar pagos pendientes a proveedores principales',
          fecha: dayjs().add(5, 'day').format('YYYY-MM-DD'),
          horaInicio: '10:00',
          horaFin: '12:00',
          tipo: 'recordatorio',
          prioridad: 'alta',
          completado: false,
          participantes: 'Departamento de Finanzas'
        },
        {
          id: 4,
          titulo: 'Capacitación en Sistema POS',
          descripcion: 'Entrenamiento del personal en las nuevas funcionalidades del sistema',
          fecha: dayjs().add(7, 'day').format('YYYY-MM-DD'),
          horaInicio: '08:00',
          horaFin: '12:00',
          tipo: 'evento',
          prioridad: 'media',
          completado: false,
          ubicacion: 'Aula de Capacitación',
          participantes: 'Todo el personal de ventas'
        },
        {
          id: 5,
          titulo: 'Reunión de Equipo Semanal',
          descripcion: 'Revisión de objetivos, avances y planificación de la semana',
          fecha: dayjs().format('YYYY-MM-DD'),
          horaInicio: '16:00',
          horaFin: '17:30',
          tipo: 'reunion',
          prioridad: 'media',
          completado: false,
          ubicacion: 'Sala de Conferencias',
          participantes: 'Todo el equipo',
          recurrente: true
        },
        {
          id: 6,
          titulo: 'Planificación Estratégica Q4',
          descripcion: 'Definir objetivos y estrategias para el último trimestre del año',
          fecha: dayjs().add(10, 'day').format('YYYY-MM-DD'),
          horaInicio: '09:00',
          horaFin: '18:00',
          tipo: 'evento',
          prioridad: 'alta',
          completado: false,
          ubicacion: 'Oficina Ejecutiva',
          participantes: 'Directivos y Gerentes'
        }
      ];
      setEventos(eventosEjemplo);
    }
    if (savedPedidos) setPedidosProcesados(JSON.parse(savedPedidos));
    
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

  useEffect(() => {
    if (datosInicializados) {
      localStorage.setItem('pedidosProcesados', JSON.stringify(pedidosProcesados));
    }
  }, [pedidosProcesados, datosInicializados]);

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

    // Crear el pedido
    const pedido = {
      id: Date.now(),
      numero: `PED-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toISOString().split('T')[0],
      items: carritoProveedor,
      total: calcularTotalPedido(),
      estado: 'pendiente'
    };

    // Guardar pedido en el historial
    setPedidosProcesados([...pedidosProcesados, pedido]);

    // Generar documento del pedido
    generarDocumentoPedido(pedido);

    console.log('Pedido procesado:', pedido);
    message.success(`Pedido procesado exitosamente. Número: ${pedido.numero} - Total: $${calcularTotalPedido().toFixed(2)}`);
    setCarritoProveedor([]);
    setProveedorSeleccionado(null);
  };

  // Función para generar documento del pedido
  const generarDocumentoPedido = (pedido: any) => {
    // Crear contenido HTML del documento
    const contenidoHTML = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Orden de Compra - ${pedido.numero}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #0066cc; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
          }
          .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #0066cc; 
            margin-bottom: 5px;
          }
          .document-title { 
            font-size: 24px; 
            color: #333; 
            margin-bottom: 10px;
          }
          .order-info { 
            background-color: #f8f9fa; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
          }
          .order-info div {
            flex: 1;
          }
          .supplier-info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .supplier-info h3 {
            margin-top: 0;
            color: #0066cc;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px 8px; 
            text-align: left;
          }
          th { 
            background-color: #0066cc; 
            color: white; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f2f2f2; 
          }
          tr:hover {
            background-color: #e8f4fd;
          }
          .total-section { 
            background-color: #f8f9fa; 
            padding: 20px; 
            border-radius: 5px; 
            text-align: right;
            border-left: 4px solid #0066cc;
          }
          .total-amount { 
            font-size: 24px; 
            font-weight: bold; 
            color: #0066cc; 
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .terms {
            margin-top: 30px;
            padding: 15px;
            background-color: #fff3cd;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
          }
          .terms h4 {
            margin-top: 0;
            color: #856404;
          }
          .status-badge {
            display: inline-block;
            padding: 5px 15px;
            background-color: #ffc107;
            color: #212529;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">GESTOR POS</div>
          <div class="document-title">ORDEN DE COMPRA</div>
          <div>Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-ES')}</div>
        </div>

        <div class="order-info">
          <div>
            <strong>Número de Pedido:</strong> ${pedido.numero}<br>
            <strong>Estado:</strong> <span class="status-badge">${pedido.estado.toUpperCase()}</span><br>
            <strong>Fecha de Emisión:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-ES')}
          </div>
          <div style="text-align: right;">
            <strong>Fecha de Entrega Estimada:</strong> ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}<br>
            <strong>Método de Pago:</strong> Por Definir<br>
            <strong>Moneda:</strong> USD
          </div>
        </div>

        ${pedido.items.map((item: any, index: number) => `
          <div class="supplier-info">
            <h3>Proveedor ${index + 1}: ${item.proveedor.nombre}</h3>
            <p><strong>Email:</strong> ${item.proveedor.email}</p>
            <p><strong>Teléfono:</strong> ${item.proveedor.telefono}</p>
            <p><strong>Dirección:</strong> ${item.proveedor.direccion}</p>
          </div>
        `).join('')}

        <table>
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 25%;">Proveedor</th>
              <th style="width: 30%;">Producto</th>
              <th style="width: 10%;">Cantidad</th>
              <th style="width: 15%;">Precio Unitario</th>
              <th style="width: 15%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${pedido.items.map((item: any, index: number) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.proveedor.nombre}</td>
                <td>
                  <strong>${item.producto.nombre}</strong><br>
                  <small style="color: #666;">
                    Tiempo de entrega: ${item.producto.tiempoEntrega}<br>
                    Cantidad mínima: ${item.producto.cantidadMinima} unidades
                  </small>
                </td>
                <td style="text-align: center;">${item.cantidad}</td>
                <td style="text-align: right;">$${item.producto.precio.toFixed(2)}</td>
                <td style="text-align: right; font-weight: bold;">$${(item.cantidad * item.producto.precio).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div style="margin-bottom: 10px;">
            <strong>Subtotal:</strong> $${pedido.total.toFixed(2)}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>Impuestos (0%):</strong> $0.00
          </div>
          <div style="margin-bottom: 15px;">
            <strong>Costos de Envío:</strong> Por Definir
          </div>
          <div class="total-amount">
            TOTAL: $${pedido.total.toFixed(2)}
          </div>
        </div>

        <div class="terms">
          <h4>Términos y Condiciones:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            <li>Los precios están sujetos a cambios sin previo aviso</li>
            <li>El pago se realizará según los términos acordados con cada proveedor</li>
            <li>La entrega se coordinará directamente con cada proveedor</li>
            <li>Cualquier discrepancia debe ser reportada dentro de 24 horas</li>
            <li>Esta orden de compra es válida por 30 días desde la fecha de emisión</li>
          </ul>
        </div>

        <div class="footer">
          <p>Documento generado automáticamente por GESTOR POS</p>
          <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
          <p>Para consultas, contacte al departamento de compras</p>
        </div>
      </body>
      </html>
    `;

    // Crear y abrir ventana para imprimir/guardar
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(contenidoHTML);
      ventanaImpresion.document.close();
      
      // Esperar a que cargue y luego mostrar diálogo de impresión
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    } else {
      // Fallback: descargar como archivo HTML
      const blob = new Blob([contenidoHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Orden_Compra_${pedido.numero}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      message.info('Documento descargado. Puedes abrirlo en tu navegador para imprimir.');
    }
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
    setPedidosProcesados([]);
    setUsers([]);
    setCurrentUser(null);
    setIsLoggedIn(false);
    message.success('Todos los datos han sido eliminados. Recarga la página para restaurar datos de ejemplo.');
  };

  // Funciones para calcular datos de reportes
  const calcularDatosReportes = () => {
    // Calcular ventas por mes (últimos 6 meses)
    const ventasPorMes = [];
    const gastosPorMes = [];
    const comprasPorMes = [];
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const mesAnio = fecha.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      
      // Ventas del mes
      const ventasDelMes = ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        return fechaVenta.getMonth() === fecha.getMonth() && 
               fechaVenta.getFullYear() === fecha.getFullYear();
      });
      const totalVentas = ventasDelMes.reduce((sum, venta) => sum + venta.total, 0);
      
      // Compras a proveedores del mes
      const comprasDelMes = pedidosProcesados.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha);
        return fechaPedido.getMonth() === fecha.getMonth() && 
               fechaPedido.getFullYear() === fecha.getFullYear();
      });
      const totalCompras = comprasDelMes.reduce((sum, pedido) => sum + pedido.total, 0);
      
      // Gastos operativos (simulados basados en ventas)
      const gastosOperativos = totalVentas * 0.3; // 30% de las ventas como gastos operativos
      
      ventasPorMes.push({
        mes: mesAnio,
        ventas: totalVentas,
        cantidad: ventasDelMes.length
      });
      
      gastosPorMes.push({
        mes: mesAnio,
        gastos: gastosOperativos + totalCompras,
        operativos: gastosOperativos,
        compras: totalCompras
      });
      
      comprasPorMes.push({
        mes: mesAnio,
        compras: totalCompras,
        pedidos: comprasDelMes.length
      });
    }
    
    return { ventasPorMes, gastosPorMes, comprasPorMes };
  };

  // Calcular datos para gráfico de productos más vendidos
  const calcularProductosMasVendidos = () => {
    const productosVentas: { [key: string]: number } = {};
    
    ventas.forEach(venta => {
      venta.productos.forEach(producto => {
        if (productosVentas[producto.nombre]) {
          productosVentas[producto.nombre] += producto.cantidad;
        } else {
          productosVentas[producto.nombre] = producto.cantidad;
        }
      });
    });
    
    return Object.entries(productosVentas)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);
  };

  // Calcular distribución de ventas por categoría
  const calcularVentasPorCategoria = () => {
    const ventasPorCategoria: { [key: string]: number } = {};
    
    ventas.forEach(venta => {
      venta.productos.forEach(productoVenta => {
        const producto = productos.find(p => p.nombre === productoVenta.nombre);
        if (producto) {
          const categoria = producto.categoria;
          const total = productoVenta.cantidad * productoVenta.precio;
          if (ventasPorCategoria[categoria]) {
            ventasPorCategoria[categoria] += total;
          } else {
            ventasPorCategoria[categoria] = total;
          }
        }
      });
    });
    
    return Object.entries(ventasPorCategoria)
      .map(([categoria, total]) => ({ categoria, total, porcentaje: 0 }))
      .sort((a, b) => b.total - a.total);
  };
  const verificarLocalStorage = () => {
    console.log('=== VERIFICACIÓN DE LOCALSTORAGE ===');
    console.log('Productos en localStorage:', localStorage.getItem('productos'));
    console.log('Clientes en localStorage:', localStorage.getItem('clientes'));
    console.log('Proveedores en localStorage:', localStorage.getItem('proveedores'));
    console.log('Pedidos procesados en localStorage:', localStorage.getItem('pedidosProcesados'));
    console.log('Estado actual - Productos:', productos);
    console.log('Estado actual - Clientes:', clientes);
    console.log('Estado actual - Proveedores:', proveedores);
    console.log('Estado actual - Pedidos procesados:', pedidosProcesados);
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
    { 
      title: 'Imagen', 
      dataIndex: 'imagen', 
      key: 'imagen',
      width: 80,
      render: (imagen: string, record: Product) => (
        <div className="flex justify-center">
          {imagen ? (
            <img 
              src={imagen} 
              alt={record.nombre}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                // Crear modal para ver imagen en tamaño completo
                Modal.info({
                  title: record.nombre,
                  content: (
                    <div className="flex justify-center">
                      <img src={imagen} alt={record.nombre} className="max-w-full max-h-96 object-contain" />
                    </div>
                  ),
                  width: 600,
                  okText: 'Cerrar'
                });
              }}
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <ProductOutlined className="text-gray-400 text-lg" />
            </div>
          )}
        </div>
      )
    },
    { title: 'Código', dataIndex: 'codigo', key: 'codigo', width: 100 },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Categoría', dataIndex: 'categoria', key: 'categoria', width: 120 },
    { title: 'Precio', dataIndex: 'precio', key: 'precio', width: 100, render: (precio: number) => `$${precio.toFixed(2)}` },
    { title: 'Stock', dataIndex: 'stock', key: 'stock', width: 80 },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 120,
      render: (_: any, record: Product) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record)} size="small" />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record.id)} size="small" />
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

    if (editingFactura) {
      // Al editar, conservamos los productos originales si no hay productos en el carrito
      const productosFinales = productos.length > 0 ? productos : editingFactura.productos;
      const subtotal = productosFinales.reduce((sum, p) => sum + p.total, 0);
      const impuestos = subtotal * 0.16; // 16% IVA
      const total = subtotal + impuestos;

      const updatedFactura: Factura = {
        ...editingFactura,
        cliente: values.cliente,
        fecha: values.fecha.format('YYYY-MM-DD'),
        fechaVencimiento: values.fechaVencimiento.format('YYYY-MM-DD'),
        notas: values.notas,
        productos: productosFinales,
        subtotal,
        impuestos,
        total
      };
      setFacturas(facturas.map(f => f.id === editingFactura.id ? updatedFactura : f));
      message.success('Factura actualizada correctamente');
    } else {
      // Al crear nueva factura, necesitamos productos en el carrito
      if (productos.length === 0) {
        message.error('Debe agregar al menos un producto al carrito para crear una factura');
        return;
      }

      const subtotal = productos.reduce((sum, p) => sum + p.total, 0);
      const impuestos = subtotal * 0.16; // 16% IVA
      const total = subtotal + impuestos;

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
    // Solo limpiar carrito si no estamos editando o si agregamos productos nuevos
    if (!editingFactura || productos.length > 0) {
      setCarrito([]);
    }
  };

  const handleEditFactura = (factura: Factura) => {
    setEditingFactura(factura);
    facturaForm.setFieldsValue({
      cliente: factura.cliente,
      fecha: dayjs(factura.fecha),
      fechaVencimiento: dayjs(factura.fechaVencimiento),
      notas: factura.notas
    });
    setIsFacturaModalVisible(true);
  };

  const handleDeleteFactura = (id: number) => {
    setFacturas(facturas.filter(f => f.id !== id));
    message.success('Factura eliminada correctamente');
  };

  const handleChangeFacturaEstado = (id: number, nuevoEstado: 'pendiente' | 'pagado' | 'vencido' | 'cancelado') => {
    setFacturas(facturas.map(f => 
      f.id === id ? { ...f, estado: nuevoEstado } : f
    ));
    
    const mensajes = {
      'pendiente': 'Factura marcada como pendiente',
      'pagado': 'Factura marcada como pagada',
      'vencido': 'Factura marcada como vencida',
      'cancelado': 'Factura cancelada'
    };
    
    message.success(mensajes[nuevoEstado]);
  };

  const handleViewFactura = (factura: Factura) => {
    setSelectedFactura(factura);
    setIsFacturaDetailVisible(true);
  };

  // Funciones para calendario
  const handleSaveEvento = (values: any) => {
    const eventoData = {
      ...values,
      fecha: values.fecha.format('YYYY-MM-DD'),
      horaInicio: values.horaInicio.format('HH:mm'),
      horaFin: values.horaFin.format('HH:mm'),
    };

    if (editingEvento) {
      const updatedEvento: EventoCalendario = {
        ...editingEvento,
        ...eventoData
      };
      setEventos(eventos.map(e => e.id === editingEvento.id ? updatedEvento : e));
      message.success('Evento actualizado correctamente');
    } else {
      const newEvento: EventoCalendario = {
        id: Date.now(),
        ...eventoData,
        completado: false
      };
      setEventos([...eventos, newEvento]);
      message.success('Evento creado correctamente');
    }

    setIsEventoModalVisible(false);
    setEditingEvento(null);
    setQuickEventType(null);
    eventoForm.resetFields();
  };

  const handleEditEvento = (evento: EventoCalendario) => {
    setEditingEvento(evento);
    eventoForm.setFieldsValue({
      ...evento,
      fecha: dayjs(evento.fecha),
      horaInicio: dayjs(evento.horaInicio, 'HH:mm'),
      horaFin: dayjs(evento.horaFin, 'HH:mm')
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

  // Funciones auxiliares para el calendario avanzado
  const formatCalendarTitle = () => {
    switch (calendarView) {
      case 'month':
        return currentDate.format('MMMM YYYY');
      case 'week':
        const startWeek = currentDate.startOf('week');
        const endWeek = currentDate.endOf('week');
        return `${startWeek.format('DD MMM')} - ${endWeek.format('DD MMM YYYY')}`;
      case 'day':
        return currentDate.format('dddd, DD [de] MMMM [de] YYYY');
      case 'list':
        return 'Lista de Eventos';
      default:
        return currentDate.format('MMMM YYYY');
    }
  };

  const handlePreviousPeriod = () => {
    switch (calendarView) {
      case 'month':
        setCurrentDate(currentDate.subtract(1, 'month'));
        break;
      case 'week':
        setCurrentDate(currentDate.subtract(1, 'week'));
        break;
      case 'day':
        setCurrentDate(currentDate.subtract(1, 'day'));
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (calendarView) {
      case 'month':
        setCurrentDate(currentDate.add(1, 'month'));
        break;
      case 'week':
        setCurrentDate(currentDate.add(1, 'week'));
        break;
      case 'day':
        setCurrentDate(currentDate.add(1, 'day'));
        break;
    }
  };

  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const getFilteredEvents = () => {
    let filtered = eventos;
    
    if (eventFilter !== 'all') {
      filtered = filtered.filter(evento => evento.tipo === eventFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(evento => 
        evento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getTodayEvents = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return eventos.filter(evento => evento.fecha === today);
  };

  const getThisWeekEvents = () => {
    const startWeek = dayjs().startOf('week');
    const endWeek = dayjs().endOf('week');
    return eventos.filter(evento => {
      const eventoDate = dayjs(evento.fecha);
      return eventoDate.isAfter(startWeek) && eventoDate.isBefore(endWeek);
    });
  };

  const getUpcomingEvents = () => {
    const now = dayjs();
    return eventos
      .filter(evento => dayjs(evento.fecha).isAfter(now) || 
        (dayjs(evento.fecha).isSame(now, 'day') && evento.horaInicio > now.format('HH:mm')))
      .sort((a, b) => {
        const dateA = dayjs(`${a.fecha} ${a.horaInicio}`);
        const dateB = dayjs(`${b.fecha} ${b.horaInicio}`);
        return dateA.isBefore(dateB) ? -1 : 1;
      });
  };

  const getEventTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'reunion':
        return 'border-blue-400 bg-blue-500/30 text-gray-800 shadow-lg';
      case 'tarea':
        return 'border-green-400 bg-green-500/30 text-gray-800 shadow-lg';
      case 'recordatorio':
        return 'border-yellow-400 bg-yellow-500/30 text-gray-800 shadow-lg';
      case 'evento':
        return 'border-purple-400 bg-purple-500/30 text-gray-800 shadow-lg';
      default:
        return 'border-gray-400 bg-gray-500/30 text-gray-800 shadow-lg';
    }
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return 'red';
      case 'media':
        return 'orange';
      case 'baja':
        return 'green';
      default:
        return 'default';
    }
  };

  const handleExportCalendar = () => {
    const dataStr = JSON.stringify(eventos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `calendario_${dayjs().format('YYYY-MM-DD')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    message.success('Calendario exportado correctamente');
  };

  // Funciones de renderizado de vistas del calendario
  const renderMonthView = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startCalendar = startOfMonth.startOf('week');
    const endCalendar = endOfMonth.endOf('week');
    
    const days = [];
    let day = startCalendar;
    
    while (day.isBefore(endCalendar)) {
      days.push(day);
      day = day.add(1, 'day');
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dayName => (
            <div key={dayName} className="p-2 text-center font-semibold text-gray-800 bg-white/20 rounded-lg">
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayEvents = getFilteredEvents().filter(evento => 
              dayjs(evento.fecha).isSame(day, 'day')
            );
            const isCurrentMonth = day.isSame(currentDate, 'month');
            const isToday = day.isSame(dayjs(), 'day');
            
            return (
              <div
                key={day.format('YYYY-MM-DD')}
                className={`min-h-[100px] p-2 border border-white/30 ${
                  isCurrentMonth ? 'bg-white/20' : 'bg-white/10'
                } ${isToday ? 'ring-2 ring-yellow-400 bg-yellow-500/20' : ''} hover:bg-white/30 transition-colors cursor-pointer shadow-sm`}
                onClick={() => {
                  setCurrentDate(day);
                  setCalendarView('day');
                }}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isCurrentMonth ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {day.format('D')}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(evento => (
                    <div
                      key={evento.id}
                      className={`text-xs p-1 rounded truncate ${getEventTypeColor(evento.tipo)} 
                                 ${evento.completado ? 'opacity-50' : ''}`}
                      title={evento.titulo}
                    >
                      {evento.titulo}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = currentDate.startOf('week');
    const days = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
    
    return (
      <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
        <div className="grid grid-cols-8 gap-2">
          {/* Header de horas */}
          <div className="font-semibold text-gray-800 bg-white/20 rounded-lg p-2"></div>
          {days.map(day => (
            <div key={day.format('YYYY-MM-DD')} className="text-center bg-white/20 rounded-lg p-2">
              <div className="font-semibold text-gray-800">{day.format('ddd')}</div>
              <div className={`text-sm ${day.isSame(dayjs(), 'day') ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                {day.format('DD/MM')}
              </div>
            </div>
          ))}
          
          {/* Filas de horas */}
          {Array.from({ length: 24 }, (_, hour) => (
            <React.Fragment key={hour}>
              <div className="text-xs text-gray-800 p-2 border-r border-white/30 bg-white/20 rounded-lg">
                {String(hour).padStart(2, '0')}:00
              </div>
              {days.map(day => {
                const dayEvents = getFilteredEvents().filter(evento => {
                  const eventoDate = dayjs(evento.fecha);
                  const eventoHour = parseInt(evento.horaInicio.split(':')[0]);
                  return eventoDate.isSame(day, 'day') && eventoHour === hour;
                });
                
                return (
                  <div key={`${day.format('YYYY-MM-DD')}-${hour}`} 
                       className="min-h-[40px] p-1 border border-white/20 hover:bg-white/20 bg-white/10 rounded-sm">
                    {dayEvents.map(evento => (
                      <div
                        key={evento.id}
                        className={`text-xs p-1 rounded mb-1 truncate cursor-pointer ${getEventTypeColor(evento.tipo)}`}
                        onClick={() => handleEditEvento(evento)}
                        title={`${evento.titulo} - ${evento.horaInicio} a ${evento.horaFin}`}
                      >
                        {evento.titulo}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getFilteredEvents()
      .filter(evento => dayjs(evento.fecha).isSame(currentDate, 'day'))
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    return (
      <div className="bg-white/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
        <div className="mb-4 bg-white/20 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {currentDate.format('dddd, DD [de] MMMM [de] YYYY')}
          </h3>
          <p className="text-gray-700">{dayEvents.length} eventos programados</p>
        </div>
        
        {dayEvents.length > 0 ? (
          <div className="space-y-3">
            {dayEvents.map(evento => (
              <div
                key={evento.id}
                className={`p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors 
                           ${getEventTypeColor(evento.tipo)} ${evento.completado ? 'opacity-60' : ''}`}
                onClick={() => handleEditEvento(evento)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className={`font-semibold text-gray-800 mb-1 ${evento.completado ? 'line-through' : ''}`}>
                      {evento.titulo}
                    </h4>
                    {evento.descripcion && (
                      <p className="text-gray-700 text-sm mb-2">{evento.descripcion}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>⏰ {evento.horaInicio} - {evento.horaFin}</span>
                      <span>📋 {evento.tipo}</span>
                      {evento.ubicacion && <span>📍 {evento.ubicacion}</span>}
                      <Tag color={getPriorityColor(evento.prioridad)}>
                        {evento.prioridad}
                      </Tag>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      type={evento.completado ? "default" : "primary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEvento(evento.id);
                      }}
                    >
                      {evento.completado ? '↩' : '✓'}
                    </Button>
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvento(evento.id);
                      }}
                      type="text"
                      danger
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <CalendarOutlined className="text-4xl mb-4" />
            <p>No hay eventos programados para este día</p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                eventoForm.setFieldsValue({ fecha: currentDate });
                setIsEventoModalVisible(true);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Agregar Evento
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const filteredEvents = getFilteredEvents()
      .sort((a, b) => {
        const dateA = dayjs(`${a.fecha} ${a.horaInicio}`);
        const dateB = dayjs(`${b.fecha} ${b.horaInicio}`);
        return dateA.isBefore(dateB) ? -1 : 1;
      });

    const upcomingEvents = filteredEvents.filter(evento => 
      dayjs(`${evento.fecha} ${evento.horaInicio}`).isAfter(dayjs())
    );
    const pastEvents = filteredEvents.filter(evento => 
      dayjs(`${evento.fecha} ${evento.horaInicio}`).isBefore(dayjs())
    );

    return (
      <div className="space-y-6">
        {/* Eventos próximos */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Próximos Eventos ({upcomingEvents.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {upcomingEvents.map(evento => (
              <div
                key={evento.id}
                className={`p-4 rounded-lg cursor-pointer hover:bg-white/10 transition-colors 
                           border-l-4 ${getEventTypeColor(evento.tipo)}`}
                onClick={() => handleEditEvento(evento)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{evento.titulo}</h4>
                    {evento.descripcion && (
                      <p className="text-gray-700 text-sm mt-1">{evento.descripcion}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>📅 {dayjs(evento.fecha).format('DD/MM/YYYY')}</span>
                      <span>⏰ {evento.horaInicio} - {evento.horaFin}</span>
                      <span>📋 {evento.tipo}</span>
                      {evento.ubicacion && <span>📍 {evento.ubicacion}</span>}
                      <Tag color={getPriorityColor(evento.prioridad)}>
                        {evento.prioridad}
                      </Tag>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="small"
                      type="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleEvento(evento.id);
                      }}
                    >
                      ✓
                    </Button>
                    <Button
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvento(evento.id);
                      }}
                      type="text"
                      danger
                    />
                  </div>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <CalendarOutlined className="text-3xl mb-2" />
                <p>No hay eventos próximos</p>
              </div>
            )}
          </div>
        </div>

        {/* Eventos pasados */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Eventos Pasados ({pastEvents.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pastEvents.slice(0, 10).map(evento => (
              <div
                key={evento.id}
                className={`p-3 rounded-lg opacity-70 border-l-4 ${getEventTypeColor(evento.tipo)} 
                           ${evento.completado ? 'bg-green-500/10' : 'bg-gray-500/10'}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h5 className={`font-medium text-gray-800 ${evento.completado ? 'line-through' : ''}`}>
                      {evento.titulo}
                    </h5>
                    <div className="text-sm text-gray-600">
                      📅 {dayjs(evento.fecha).format('DD/MM/YYYY')} • ⏰ {evento.horaInicio}
                      {evento.completado && <span className="text-green-600 ml-2">✓ Completado</span>}
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteEvento(evento.id)}
                    type="text"
                    danger
                  />
                </div>
              </div>
            ))}
            {pastEvents.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p>No hay eventos pasados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Función para renderizar el contenido según la selección
  const renderContent = () => {
    switch (selectedKey) {
      case '1': // Dashboard
        const totalIngresos = ventas.reduce((total, venta) => total + venta.total, 0);
        const totalGastos = pedidosProcesados.reduce((total, pedido) => total + pedido.total, 0) + (totalIngresos * 0.3);
        const gananciaNeta = totalIngresos - totalGastos;
        const productosStockBajo = productos.filter(p => p.stock < 10);
        const ventasHoy = ventas.filter(v => v.fecha === new Date().toISOString().split('T')[0]);
        const facturasPendientes = facturas.filter(f => f.estado === 'pendiente');
        const eventosHoy = eventos.filter(e => e.fecha === new Date().toISOString().split('T')[0]);
        const inventarioTotal = productos.reduce((total, p) => total + (p.precio * p.stock), 0);

        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Dashboard Empresarial</Title>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockCircleOutlined />
                <span>Última actualización: {new Date().toLocaleString('es-ES')}</span>
              </div>
            </div>

            {/* KPIs Principales */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:shadow-lg transition-shadow">
                  <Statistic
                    title={<span className="text-white opacity-90">Total Productos</span>}
                    value={productos.length}
                    valueStyle={{ color: 'white' }}
                    prefix={<ProductOutlined />}
                  />
                  <div className="text-xs opacity-75 mt-2">
                    {productosStockBajo.length} con stock bajo
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:shadow-lg transition-shadow">
                  <Statistic
                    title={<span className="text-white opacity-90">Ventas Totales</span>}
                    value={ventas.length}
                    valueStyle={{ color: 'white' }}
                    prefix={<ShoppingCartOutlined />}
                  />
                  <div className="text-xs opacity-75 mt-2">
                    {ventasHoy.length} ventas hoy
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:shadow-lg transition-shadow">
                  <Statistic
                    title={<span className="text-white opacity-90">Ingresos Totales</span>}
                    value={totalIngresos}
                    precision={2}
                    valueStyle={{ color: 'white' }}
                    prefix="$"
                  />
                  <div className="text-xs opacity-75 mt-2">
                    Ganancia: ${gananciaNeta.toFixed(2)}
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 hover:shadow-lg transition-shadow">
                  <Statistic
                    title={<span className="text-white opacity-90">Valor Inventario</span>}
                    value={inventarioTotal}
                    precision={2}
                    valueStyle={{ color: 'white' }}
                    prefix="$"
                  />
                  <div className="text-xs opacity-75 mt-2">
                    {clientes.length} clientes activos
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Alertas y Notificaciones */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={24}>
                <Card title="🚨 Alertas del Sistema" className="border-l-4 border-l-red-500">
                  <Row gutter={16}>
                    <Col span={6}>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{productosStockBajo.length}</div>
                        <div className="text-sm text-red-700">Productos con Stock Bajo</div>
                        <Button size="small" type="link" onClick={() => setSelectedKey('4')}>Ver Inventario</Button>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{facturasPendientes.length}</div>
                        <div className="text-sm text-yellow-700">Facturas Pendientes</div>
                        <Button size="small" type="link" onClick={() => setSelectedKey('9')}>Ver Facturas</Button>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{eventosHoy.length}</div>
                        <div className="text-sm text-blue-700">Eventos Hoy</div>
                        <Button size="small" type="link" onClick={() => setSelectedKey('10')}>Ver Calendario</Button>
                      </div>
                    </Col>
                    <Col span={6}>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{pedidosProcesados.length}</div>
                        <div className="text-sm text-green-700">Pedidos Procesados</div>
                        <Button size="small" type="link" onClick={() => setSelectedKey('6')}>Ver Proveedores</Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Gráficos y Análisis */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={12}>
                <Card title="📊 Rendimiento Mensual" extra={<Button size="small" onClick={() => setSelectedKey('7')}>Ver Reportes</Button>}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Ventas del Mes</span>
                      <span className="text-green-600 font-bold">${ventasHoy.reduce((sum, v) => sum + v.total, 0).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${Math.min((ventasHoy.reduce((sum, v) => sum + v.total, 0) / 10000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Meta Mensual</span>
                      <span className="text-blue-600 font-bold">$10,000</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">{((totalIngresos / 10000) * 100).toFixed(1)}%</div>
                        <div className="text-xs text-green-700">Meta Alcanzada</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">{ventas.length > 0 ? (totalIngresos / ventas.length).toFixed(2) : '0'}</div>
                        <div className="text-xs text-blue-700">Venta Promedio</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="🏆 Top Productos" extra={<Button size="small" onClick={() => setSelectedKey('2')}>Ver Productos</Button>}>
                  <div className="space-y-3">
                    {productos.slice(0, 5).map((producto, index) => {
                      const ventasProducto = ventas.reduce((count, venta) => {
                        return count + venta.productos.filter(p => p.nombre === producto.nombre).length;
                      }, 0);
                      
                      return (
                        <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{producto.nombre}</div>
                              <div className="text-sm text-gray-500">{producto.categoria} - Stock: {producto.stock}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">${producto.precio}</div>
                            <div className="text-sm text-gray-500">{ventasProducto} vendidos</div>
                          </div>
                        </div>
                      );
                    })}
                    {productos.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <ProductOutlined className="text-4xl mb-2" />
                        <p>No hay productos registrados</p>
                        <Button type="primary" onClick={() => setSelectedKey('2')}>Agregar Producto</Button>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Tablas de Información */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card 
                  title="⚠️ Productos con Stock Bajo" 
                  extra={<Button size="small" onClick={() => setSelectedKey('4')}>Gestionar Inventario</Button>}
                  className="h-80"
                >
                  <div className="overflow-y-auto h-60">
                    {productosStockBajo.length > 0 ? (
                      <div className="space-y-2">
                        {productosStockBajo.map(producto => (
                          <div key={producto.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                            <div>
                              <div className="font-medium text-red-800">{producto.nombre}</div>
                              <div className="text-sm text-red-600">{producto.categoria}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-red-600">{producto.stock}</div>
                              <div className="text-sm text-red-500">unidades</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <CheckCircleOutlined className="text-4xl text-green-500 mb-2" />
                        <p>Todos los productos tienen stock suficiente</p>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card 
                  title="🕒 Actividad Reciente" 
                  extra={<Button size="small" onClick={() => setSelectedKey('3')}>Ir al POS</Button>}
                  className="h-80"
                >
                  <div className="overflow-y-auto h-60">
                    {ventas.length > 0 ? (
                      <div className="space-y-2">
                        {ventas.slice(-5).reverse().map(venta => (
                          <div key={venta.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                            <div>
                              <div className="font-medium text-green-800">Venta #{venta.id}</div>
                              <div className="text-sm text-green-600">
                                {venta.cliente} - {new Date(venta.fecha).toLocaleDateString('es-ES')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {venta.productos.length} productos
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-600">${venta.total.toFixed(2)}</div>
                              <Tag color="green">{venta.estado}</Tag>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <ShoppingCartOutlined className="text-4xl mb-2" />
                        <p>No hay ventas registradas</p>
                        <Button type="primary" onClick={() => setSelectedKey('3')}>Realizar Venta</Button>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Acciones Rápidas */}
            <Row gutter={[16, 16]} className="mt-6">
              <Col span={24}>
                <Card title="🚀 Acciones Rápidas" className="border-l-4 border-l-blue-500">
                  <Row gutter={16}>
                    <Col span={4}>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('3')}
                        className="h-16 bg-green-600 hover:bg-green-700"
                      >
                        Nueva Venta
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="default" 
                        icon={<ProductOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('2')}
                        className="h-16"
                      >
                        Agregar Producto
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="default" 
                        icon={<UserAddOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('5')}
                        className="h-16"
                      >
                        Nuevo Cliente
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="default" 
                        icon={<StockOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('4')}
                        className="h-16"
                      >
                        Inventario
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="default" 
                        icon={<FileTextOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('9')}
                        className="h-16"
                      >
                        Nueva Factura
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button 
                        type="default" 
                        icon={<BarChartOutlined />} 
                        size="large" 
                        block 
                        onClick={() => setSelectedKey('7')}
                        className="h-16"
                      >
                        Ver Reportes
                      </Button>
                    </Col>
                  </Row>
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
                <Form.Item name="imagen" label="Imagen del Producto">
                  <div className="space-y-2">
                    <Input 
                      placeholder="URL de la imagen (opcional)" 
                      onChange={(e) => {
                        const value = e.target.value;
                        productForm.setFieldValue('imagen', value);
                      }}
                    />
                    <div className="text-xs text-gray-500">
                      Puedes usar una URL de imagen o subir a un servicio como Imgur, CloudFlare, etc.
                    </div>
                    {productForm.getFieldValue('imagen') && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-600 mb-1">Vista previa:</div>
                        <img 
                          src={productForm.getFieldValue('imagen')} 
                          alt="Vista previa"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
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
                          cover={
                            producto.imagen ? (
                              <div className="h-24 overflow-hidden">
                                <img 
                                  src={producto.imagen} 
                                  alt={producto.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-24 bg-gray-100 flex items-center justify-center">
                                <ProductOutlined className="text-gray-400 text-2xl" />
                              </div>
                            )
                          }
                        >
                          <div className="text-center">
                            <div className="font-medium text-sm mb-1">{producto.nombre}</div>
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
        const productosStockBajoInventario = productos.filter(p => p.stock <= 10);
        const valorInventarioTotal = productos.reduce((total, p) => total + (p.precio * p.stock), 0);
        const productosSinStock = productos.filter(p => p.stock === 0);
        
        // Crear columnas para la tabla de inventario
        const inventoryProductColumns = [
          { 
            title: 'Imagen', 
            dataIndex: 'imagen', 
            key: 'imagen',
            width: 70,
            render: (imagen: string, record: Product) => (
              <div className="flex justify-center">
                {imagen ? (
                  <img 
                    src={imagen} 
                    alt={record.nombre}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                    <ProductOutlined className="text-gray-400 text-sm" />
                  </div>
                )}
              </div>
            )
          },
          { 
            title: 'Código', 
            dataIndex: 'codigo', 
            key: 'codigo',
            width: 80,
            sorter: (a: Product, b: Product) => a.codigo.localeCompare(b.codigo)
          },
          { 
            title: 'Producto', 
            dataIndex: 'nombre', 
            key: 'nombre',
            render: (text: string, record: Product) => (
              <div>
                <div className="font-semibold">{text}</div>
                <div className="text-sm text-gray-500">{record.categoria}</div>
              </div>
            ),
            sorter: (a: Product, b: Product) => a.nombre.localeCompare(b.nombre)
          },
          { 
            title: 'Stock Actual', 
            dataIndex: 'stock', 
            key: 'stock',
            width: 120,
            render: (stock: number) => (
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${
                  stock === 0 ? 'text-red-600' : 
                  stock <= 10 ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {stock}
                </span>
                {stock === 0 && <Tag color="red">Sin Stock</Tag>}
                {stock > 0 && stock <= 10 && <Tag color="orange">Stock Bajo</Tag>}
                {stock > 50 && <Tag color="green">Stock Alto</Tag>}
              </div>
            ),
            sorter: (a: Product, b: Product) => a.stock - b.stock
          },
          { 
            title: 'Precio Unitario', 
            dataIndex: 'precio', 
            key: 'precio',
            width: 120,
            render: (precio: number) => (
              <span className="font-medium text-green-600">${precio.toFixed(2)}</span>
            ),
            sorter: (a: Product, b: Product) => a.precio - b.precio
          },
          { 
            title: 'Valor en Stock', 
            key: 'valorStock',
            width: 140,
            render: (_: any, record: Product) => (
              <span className="font-bold text-blue-600">
                ${(record.precio * record.stock).toFixed(2)}
              </span>
            ),
            sorter: (a: Product, b: Product) => (a.precio * a.stock) - (b.precio * b.stock)
          },
          {
            title: 'Estado',
            key: 'estado',
            width: 120,
            render: (_: any, record: Product) => {
              if (record.stock === 0) return <Tag color="red">Agotado</Tag>;
              if (record.stock <= 10) return <Tag color="orange">Crítico</Tag>;
              if (record.stock <= 30) return <Tag color="yellow">Normal</Tag>;
              return <Tag color="green">Disponible</Tag>;
            },
            filters: [
              { text: 'Agotado', value: 'agotado' },
              { text: 'Crítico', value: 'critico' },
              { text: 'Normal', value: 'normal' },
              { text: 'Disponible', value: 'disponible' }
            ],
            onFilter: (value: any, record: Product) => {
              if (value === 'agotado') return record.stock === 0;
              if (value === 'critico') return record.stock > 0 && record.stock <= 10;
              if (value === 'normal') return record.stock > 10 && record.stock <= 30;
              if (value === 'disponible') return record.stock > 30;
              return true;
            }
          },
          {
            title: 'Acciones',
            key: 'acciones',
            width: 120,
            render: (_: any, record: Product) => (
              <Space>
                <Button 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={() => {
                    inventoryForm.setFieldsValue({
                      producto: record.nombre,
                      tipo: 'entrada',
                      fecha: new Date()
                    });
                    setIsInventoryModalVisible(true);
                  }}
                  title="Entrada de Stock"
                  className="text-green-600 hover:text-green-800"
                />
                <Button 
                  icon={<ExportOutlined />} 
                  size="small"
                  onClick={() => {
                    inventoryForm.setFieldsValue({
                      producto: record.nombre,
                      tipo: 'salida',
                      fecha: new Date()
                    });
                    setIsInventoryModalVisible(true);
                  }}
                  title="Salida de Stock"
                  className="text-red-600 hover:text-red-800"
                />
              </Space>
            )
          }
        ];

        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>Gestión de Inventario</Title>
              <Space>
                <Button 
                  icon={<ExportOutlined />}
                  onClick={() => message.info('Función de exportar en desarrollo')}
                >
                  Exportar Inventario
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsInventoryModalVisible(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Registrar Movimiento
                </Button>
              </Space>
            </div>
            
            {/* KPIs de Inventario */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="border-l-4 border-l-blue-500">
                  <Statistic
                    title="Total Productos"
                    value={productos.length}
                    prefix={<ProductOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    Productos registrados
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-green-500">
                  <Statistic
                    title="Valor Total Inventario"
                    value={valorInventarioTotal}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    Valor en almacén
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-orange-500">
                  <Statistic
                    title="Productos Stock Bajo"
                    value={productosStockBajoInventario.length}
                    prefix={<ExportOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    Necesitan reposición
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-red-500">
                  <Statistic
                    title="Productos Sin Stock"
                    value={productosSinStock.length}
                    prefix={<ExportOutlined />}
                    valueStyle={{ color: '#f5222d' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    Agotados
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Alertas de Inventario */}
            {(productosStockBajoInventario.length > 0 || productosSinStock.length > 0) && (
              <Row gutter={[16, 16]} className="mb-6">
                <Col span={24}>
                  <Card 
                    title="⚠️ Alertas de Inventario" 
                    className="border-l-4 border-l-red-500"
                    extra={<Button size="small" onClick={() => setSelectedKey('6')}>Ver Proveedores</Button>}
                  >
                    <Row gutter={16}>
                      {productosSinStock.length > 0 && (
                        <Col span={12}>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <h4 className="text-red-700 font-semibold mb-2">🚫 Productos Agotados ({productosSinStock.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {productosSinStock.slice(0, 5).map(producto => (
                                <div key={producto.id} className="text-sm text-red-600">
                                  • {producto.nombre} ({producto.categoria})
                                </div>
                              ))}
                              {productosSinStock.length > 5 && (
                                <div className="text-sm text-red-500">
                                  ... y {productosSinStock.length - 5} más
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                      )}
                      {productosStockBajoInventario.length > 0 && (
                        <Col span={12}>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h4 className="text-orange-700 font-semibold mb-2">⚠️ Stock Bajo ({productosStockBajoInventario.length})</h4>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {productosStockBajoInventario.slice(0, 5).map(producto => (
                                <div key={producto.id} className="text-sm text-orange-600">
                                  • {producto.nombre}: {producto.stock} unidades
                                </div>
                              ))}
                              {productosStockBajoInventario.length > 5 && (
                                <div className="text-sm text-orange-500">
                                  ... y {productosStockBajoInventario.length - 5} más
                                </div>
                              )}
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Tabla Principal de Inventario */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={24}>
                <Card title="📦 Inventario de Productos">
                  <Table
                    columns={inventoryProductColumns}
                    dataSource={productos}
                    rowKey="id"
                    pagination={{ 
                      pageSize: 15,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`
                    }}
                    size="middle"
                    scroll={{ x: 900 }}
                    rowClassName={(record) => {
                      if (record.stock === 0) return 'bg-red-50';
                      if (record.stock <= 10) return 'bg-orange-50';
                      return '';
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Historial de Movimientos */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="📋 Historial de Movimientos de Inventario">
                  <Table
                    columns={inventoryColumns}
                    dataSource={movimientosInventario.slice(-20)} // Mostrar últimos 20 movimientos
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                  />
                </Card>
              </Col>
            </Row>

            {/* Modal para Registrar Movimientos */}
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
                  <Select 
                    placeholder="Selecciona un producto"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {productos.map(producto => (
                      <Option key={producto.id} value={producto.nombre}>
                        {producto.nombre} - Stock actual: {producto.stock}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="tipo" label="Tipo de Movimiento" rules={[{ required: true }]}>
                  <Select placeholder="Selecciona el tipo">
                    <Option value="entrada">
                      <span className="text-green-600">📥 Entrada</span> - Agregar stock
                    </Option>
                    <Option value="salida">
                      <span className="text-red-600">📤 Salida</span> - Reducir stock
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item name="cantidad" label="Cantidad" rules={[{ required: true }]}>
                  <InputNumber 
                    min={1} 
                    placeholder="Cantidad" 
                    style={{ width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </Form.Item>
                <Form.Item name="fecha" label="Fecha" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="motivo" label="Motivo" rules={[{ required: true }]}>
                  <Input.TextArea 
                    rows={3} 
                    placeholder="Ejemplo: Compra a proveedor, Venta, Ajuste de inventario, Pérdida, etc." 
                  />
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
                      Registrar Movimiento
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

                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Button
                            type="default"
                            block
                            icon={<FileTextOutlined />}
                            onClick={() => {
                              const pedidoTemp = {
                                id: Date.now(),
                                numero: `PED-${Date.now().toString().slice(-6)}`,
                                fecha: new Date().toISOString().split('T')[0],
                                items: carritoProveedor,
                                total: calcularTotalPedido(),
                                estado: 'borrador'
                              };
                              generarDocumentoPedido(pedidoTemp);
                            }}
                            disabled={carritoProveedor.length === 0}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            Generar Documento
                          </Button>
                          
                          <Button
                            type="primary"
                            block
                            icon={<ShoppingCartOutlined />}
                            onClick={procesarPedidoProveedor}
                            disabled={carritoProveedor.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Procesar Pedido
                          </Button>
                        </Space>
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

            {/* Historial de Pedidos */}
            {pedidosProcesados.length > 0 && (
              <Card className="mt-4">
                <div className="mb-4">
                  <Title level={4}>Historial de Pedidos Procesados</Title>
                </div>
                <Table
                  dataSource={pedidosProcesados}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                  size="small"
                  columns={[
                    {
                      title: 'Número',
                      dataIndex: 'numero',
                      key: 'numero',
                      width: 120,
                      render: (numero: string) => (
                        <Tag color="blue">{numero}</Tag>
                      )
                    },
                    {
                      title: 'Fecha',
                      dataIndex: 'fecha',
                      key: 'fecha',
                      width: 100,
                      render: (fecha: string) => new Date(fecha).toLocaleDateString('es-ES')
                    },
                    {
                      title: 'Proveedores',
                      dataIndex: 'items',
                      key: 'proveedores',
                      render: (items: any[]) => {
                        const proveedoresUnicos = [...new Set(items.map(item => item.proveedor.nombre))];
                        return (
                          <div>
                            {proveedoresUnicos.slice(0, 2).map((nombre, index) => (
                              <Tag key={index} className="mb-1">{nombre}</Tag>
                            ))}
                            {proveedoresUnicos.length > 2 && (
                              <Tag>+{proveedoresUnicos.length - 2} más</Tag>
                            )}
                          </div>
                        );
                      }
                    },
                    {
                      title: 'Productos',
                      dataIndex: 'items',
                      key: 'productos',
                      width: 100,
                      render: (items: any[]) => (
                        <Tag color="green">{items.length} productos</Tag>
                      )
                    },
                    {
                      title: 'Total',
                      dataIndex: 'total',
                      key: 'total',
                      width: 100,
                      render: (total: number) => (
                        <span className="font-semibold text-green-600">
                          ${total.toFixed(2)}
                        </span>
                      )
                    },
                    {
                      title: 'Estado',
                      dataIndex: 'estado',
                      key: 'estado',
                      width: 100,
                      render: (estado: string) => (
                        <Tag color={estado === 'pendiente' ? 'orange' : 'green'}>
                          {estado.toUpperCase()}
                        </Tag>
                      )
                    },
                    {
                      title: 'Acciones',
                      key: 'acciones',
                      width: 120,
                      render: (_: any, record: any) => (
                        <Space>
                          <Button
                            type="text"
                            icon={<FileTextOutlined />}
                            onClick={() => generarDocumentoPedido(record)}
                            title="Generar documento"
                            className="text-blue-600 hover:text-blue-800"
                          />
                          <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                              Modal.info({
                                title: `Detalles del Pedido ${record.numero}`,
                                width: 600,
                                content: (
                                  <div className="mt-4">
                                    <p><strong>Fecha:</strong> {new Date(record.fecha).toLocaleDateString('es-ES')}</p>
                                    <p><strong>Total:</strong> ${record.total.toFixed(2)}</p>
                                    <p><strong>Estado:</strong> {record.estado.toUpperCase()}</p>
                                    <div className="mt-3">
                                      <strong>Productos:</strong>
                                      <ul className="mt-2">
                                        {record.items.map((item: any, index: number) => (
                                          <li key={index} className="flex justify-between py-1 border-b">
                                            <span>{item.producto.nombre} ({item.proveedor.nombre})</span>
                                            <span>{item.cantidad} x ${item.producto.precio} = ${(item.cantidad * item.producto.precio).toFixed(2)}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )
                              });
                            }}
                            title="Ver detalles"
                            className="text-green-600 hover:text-green-800"
                          />
                        </Space>
                      )
                    }
                  ]}
                />
              </Card>
            )}

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
        const { ventasPorMes, gastosPorMes, comprasPorMes } = calcularDatosReportes();
        const productosMasVendidos = calcularProductosMasVendidos();
        const ventasPorCategoria = calcularVentasPorCategoria();
        const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
        const totalCompras = pedidosProcesados.reduce((sum, pedido) => sum + pedido.total, 0);
        const totalGastosReporte = totalCompras + (totalVentas * 0.3); // Gastos operativos estimados
        
        return (
          <div className="p-6">
            <Title level={2} className="mb-6">Reportes y Análisis Financiero</Title>
            
            {/* KPIs Principales */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Ingresos Totales</span>}
                    value={totalVentas}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: 'white' }}
                  />
                  <div className="text-sm opacity-75 mt-2">
                    {ventas.length} ventas realizadas
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Gastos Totales</span>}
                    value={totalGastosReporte}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: 'white' }}
                  />
                  <div className="text-sm opacity-75 mt-2">
                    Operativos + Compras
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Compras a Proveedores</span>}
                    value={totalCompras}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: 'white' }}
                  />
                  <div className="text-sm opacity-75 mt-2">
                    {pedidosProcesados.length} pedidos procesados
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
                  <Statistic
                    title={<span className="text-white opacity-90">Ganancia Neta</span>}
                    value={totalVentas - totalGastosReporte}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: 'white' }}
                  />
                  <div className="text-sm opacity-75 mt-2">
                    {((totalVentas - totalGastosReporte) / totalVentas * 100 || 0).toFixed(1)}% margen
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Gráficos Principales */}
            <Row gutter={[16, 16]} className="mb-6">
              {/* Gráfico de Ventas vs Gastos */}
              <Col span={12}>
                <Card title="Ventas vs Gastos (Últimos 6 Meses)" className="h-96">
                  <div className="w-full h-72 flex flex-col">
                    <div className="mb-3 text-center">
                      <h4 className="text-sm font-medium text-gray-600">Tendencia Mensual</h4>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2">
                      <div className="space-y-4">
                        {ventasPorMes.map((item, index) => {
                          const gastos = gastosPorMes[index]?.gastos || 0;
                          const maxValue = Math.max(item.ventas, gastos, 1000); // Valor mínimo para escala
                          return (
                            <div key={item.mes} className="space-y-2 pb-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-xs text-gray-700 min-w-0 flex-shrink-0">
                                  {item.mes}
                                </span>
                                <div className="text-right text-xs min-w-0 ml-2">
                                  <div className="text-green-600 truncate">
                                    V: ${item.ventas > 1000 ? `${(item.ventas/1000).toFixed(1)}k` : item.ventas.toFixed(0)}
                                  </div>
                                  <div className="text-red-600 truncate">
                                    G: ${gastos > 1000 ? `${(gastos/1000).toFixed(1)}k` : gastos.toFixed(0)}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="relative">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                                      style={{ width: `${maxValue > 0 ? Math.min((item.ventas / maxValue) * 100, 100) : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="absolute -right-1 -top-1 text-xs text-green-600 font-medium">
                                    {((item.ventas / maxValue) * 100).toFixed(0)}%
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-red-500 rounded-full transition-all duration-300"
                                      style={{ width: `${maxValue > 0 ? Math.min((gastos / maxValue) * 100, 100) : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="absolute -right-1 -top-1 text-xs text-red-600 font-medium">
                                    {((gastos / maxValue) * 100).toFixed(0)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex justify-center space-x-4 text-xs">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded mr-1"></div>
                          <span className="text-gray-600">Ventas</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded mr-1"></div>
                          <span className="text-gray-600">Gastos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Gráfico Circular de Gastos */}
              <Col span={12}>
                <Card title="Distribución de Gastos" className="h-96">
                  <div className="w-full h-80 flex justify-center items-center">
                    <div className="text-center">
                      <div className="relative w-48 h-48 mx-auto mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#e5e7eb" 
                            strokeWidth="8"
                          />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="8"
                            strokeDasharray={`${totalGastosReporte > 0 ? (totalCompras / totalGastosReporte) * 251.2 : 0} 251.2`}
                            strokeLinecap="round"
                          />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="32" 
                            fill="none" 
                            stroke="#ef4444" 
                            strokeWidth="8"
                            strokeDasharray={`${totalGastosReporte > 0 ? ((totalGastosReporte - totalCompras) / totalGastosReporte) * 201 : 0} 201`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">${totalGastosReporte.toFixed(0)}</div>
                            <div className="text-sm text-gray-500">Total</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span className="text-sm">Compras a Proveedores</span>
                          </div>
                          <span className="text-sm font-medium">${totalCompras.toFixed(0)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span className="text-sm">Gastos Operativos</span>
                          </div>
                          <span className="text-sm font-medium">${(totalGastosReporte - totalCompras).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Gráficos Secundarios */}
            <Row gutter={[16, 16]}>
              {/* Productos Más Vendidos */}
              <Col span={8}>
                <Card title="Productos Más Vendidos" className="h-80">
                  <div className="space-y-3">
                    {productosMasVendidos.length > 0 ? productosMasVendidos.map((item, index) => (
                      <div key={item.nombre} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">#{index + 1} {item.nombre}</span>
                          <span className="text-blue-600">{item.cantidad} uds</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${productosMasVendidos.length > 0 ? (item.cantidad / productosMasVendidos[0].cantidad) * 100 : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center text-gray-500 py-8">
                        <ProductOutlined className="text-4xl mb-2" />
                        <p>No hay datos de ventas disponibles</p>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>

              {/* Ventas por Categoría */}
              <Col span={8}>
                <Card title="Ventas por Categoría" className="h-80">
                  <div className="space-y-3">
                    {ventasPorCategoria.length > 0 ? ventasPorCategoria.map((item, index) => {
                      const maxValue = ventasPorCategoria[0]?.total || 1;
                      const porcentaje = (item.total / totalVentas * 100) || 0;
                      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                      return (
                        <div key={item.categoria} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{item.categoria}</span>
                            <span className="text-gray-600">{porcentaje.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${colors[index % colors.length]} h-2 rounded-full`}
                              style={{ width: `${(item.total / maxValue) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">${item.total.toFixed(0)}</div>
                        </div>
                      );
                    }) : (
                      <div className="text-center text-gray-500 py-8">
                        <BarChartOutlined className="text-4xl mb-2" />
                        <p>No hay datos de categorías disponibles</p>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>

              {/* Resumen Mensual */}
              <Col span={8}>
                <Card title="Resumen del Mes Actual" className="h-80">
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${ventasPorMes[ventasPorMes.length - 1]?.ventas.toFixed(0) || '0'}
                      </div>
                      <div className="text-sm text-green-700">Ventas del Mes</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ventasPorMes[ventasPorMes.length - 1]?.cantidad || 0} transacciones
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        ${gastosPorMes[gastosPorMes.length - 1]?.gastos.toFixed(0) || '0'}
                      </div>
                      <div className="text-sm text-red-700">Gastos del Mes</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {comprasPorMes[comprasPorMes.length - 1]?.pedidos || 0} pedidos a proveedores
                      </div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${((ventasPorMes[ventasPorMes.length - 1]?.ventas || 0) - (gastosPorMes[gastosPorMes.length - 1]?.gastos || 0)).toFixed(0)}
                      </div>
                      <div className="text-sm text-blue-700">Ganancia del Mes</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Ingresos - Gastos
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Tabla de Análisis Detallado */}
            <Row gutter={[16, 16]} className="mt-6">
              <Col span={24}>
                <Card title="Análisis Financiero Detallado" extra={<Button icon={<ExportOutlined />}>Exportar Reporte</Button>}>
                  <Table
                    dataSource={ventasPorMes.map((venta, index) => ({
                      key: index,
                      mes: venta.mes,
                      ventas: venta.ventas,
                      cantidadVentas: venta.cantidad,
                      gastos: gastosPorMes[index]?.gastos || 0,
                      compras: comprasPorMes[index]?.compras || 0,
                      ganancia: venta.ventas - (gastosPorMes[index]?.gastos || 0),
                      margen: venta.ventas > 0 ? ((venta.ventas - (gastosPorMes[index]?.gastos || 0)) / venta.ventas * 100) : 0
                    }))}
                    columns={[
                      { title: 'Mes', dataIndex: 'mes', key: 'mes' },
                      { 
                        title: 'Ventas', 
                        dataIndex: 'ventas', 
                        key: 'ventas',
                        render: (value: number) => <span className="text-green-600 font-medium">${value.toFixed(2)}</span>
                      },
                      { 
                        title: 'Cant. Ventas', 
                        dataIndex: 'cantidadVentas', 
                        key: 'cantidadVentas',
                        align: 'center'
                      },
                      { 
                        title: 'Gastos', 
                        dataIndex: 'gastos', 
                        key: 'gastos',
                        render: (value: number) => <span className="text-red-600 font-medium">${value.toFixed(2)}</span>
                      },
                      { 
                        title: 'Compras', 
                        dataIndex: 'compras', 
                        key: 'compras',
                        render: (value: number) => <span className="text-blue-600 font-medium">${value.toFixed(2)}</span>
                      },
                      { 
                        title: 'Ganancia', 
                        dataIndex: 'ganancia', 
                        key: 'ganancia',
                        render: (value: number) => (
                          <span className={`font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${value.toFixed(2)}
                          </span>
                        )
                      },
                      { 
                        title: 'Margen %', 
                        dataIndex: 'margen', 
                        key: 'margen',
                        render: (value: number) => (
                          <span className={`font-medium ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {value.toFixed(1)}%
                          </span>
                        )
                      }
                    ]}
                    pagination={false}
                    size="small"
                  />
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
                      <p><strong>Total de pedidos procesados:</strong> {pedidosProcesados.length}</p>
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



      case '9': // Facturas Empresariales
        const facturaColumns = [
          { 
            title: 'Número', 
            dataIndex: 'numero', 
            key: 'numero',
            width: 120,
            render: (numero: string) => (
              <span className="font-mono font-semibold text-blue-600">{numero}</span>
            )
          },
          { 
            title: 'Cliente', 
            dataIndex: 'cliente', 
            key: 'cliente',
            render: (cliente: string) => (
              <div>
                <div className="font-semibold">{cliente}</div>
                <div className="text-sm text-gray-500">Cliente</div>
              </div>
            )
          },
          { 
            title: 'Fecha Emisión', 
            dataIndex: 'fecha', 
            key: 'fecha',
            width: 120,
            render: (fecha: string) => new Date(fecha).toLocaleDateString('es-ES')
          },
          { 
            title: 'Fecha Vencimiento', 
            dataIndex: 'fechaVencimiento', 
            key: 'fechaVencimiento',
            width: 120,
            render: (fecha: string) => {
              const fechaVenc = new Date(fecha);
              const hoy = new Date();
              const diasRestantes = Math.ceil((fechaVenc.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
              return (
                <div>
                  <div>{fechaVenc.toLocaleDateString('es-ES')}</div>
                  <div className={`text-xs ${diasRestantes < 0 ? 'text-red-500' : diasRestantes <= 7 ? 'text-orange-500' : 'text-green-500'}`}>
                    {diasRestantes < 0 ? `Vencida (${Math.abs(diasRestantes)} días)` : 
                     diasRestantes <= 7 ? `${diasRestantes} días restantes` : 
                     `${diasRestantes} días`}
                  </div>
                </div>
              );
            }
          },
          { 
            title: 'Total', 
            dataIndex: 'total', 
            key: 'total',
            width: 120,
            render: (total: number) => (
              <span className="font-bold text-green-600 text-lg">${total.toFixed(2)}</span>
            ),
            sorter: (a: Factura, b: Factura) => a.total - b.total
          },
          { 
            title: 'Estado', 
            dataIndex: 'estado', 
            key: 'estado',
            width: 120,
            render: (estado: string) => {
              const colors = {
                'pendiente': 'orange',
                'pagado': 'green',
                'vencido': 'red',
                'cancelado': 'default'
              };
              return <Tag color={colors[estado as keyof typeof colors]}>{estado.toUpperCase()}</Tag>;
            },
            filters: [
              { text: 'Pendiente', value: 'pendiente' },
              { text: 'Pagado', value: 'pagado' },
              { text: 'Vencido', value: 'vencido' },
              { text: 'Cancelado', value: 'cancelado' }
            ],
            onFilter: (value: any, record: Factura) => record.estado === value
          },
          {
            title: 'Acciones',
            key: 'acciones',
            width: 250,
            render: (_: any, record: Factura) => {
              const estadoMenuItems = [
                {
                  key: 'pendiente',
                  icon: <ClockCircleOutlined />,
                  label: 'Marcar como Pendiente',
                  disabled: record.estado === 'pendiente',
                  onClick: () => handleChangeFacturaEstado(record.id, 'pendiente')
                },
                {
                  key: 'pagado',
                  icon: <CheckOutlined />,
                  label: 'Marcar como Pagado',
                  disabled: record.estado === 'pagado',
                  onClick: () => handleChangeFacturaEstado(record.id, 'pagado')
                },
                {
                  key: 'vencido',
                  icon: <ExclamationCircleOutlined />,
                  label: 'Marcar como Vencido',
                  disabled: record.estado === 'vencido',
                  onClick: () => handleChangeFacturaEstado(record.id, 'vencido')
                },
                {
                  key: 'cancelado',
                  icon: <CloseOutlined />,
                  label: 'Cancelar Factura',
                  disabled: record.estado === 'cancelado',
                  onClick: () => handleChangeFacturaEstado(record.id, 'cancelado')
                }
              ];

              return (
                <Space>
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewFactura(record)}
                    title="Ver Factura"
                    size="small"
                  />
                  <Button 
                    icon={<PrinterOutlined />} 
                    onClick={() => generarPDFFactura(record)}
                    title="Imprimir"
                    size="small"
                    className="text-blue-600"
                  />
                  <Dropdown 
                    menu={{ items: estadoMenuItems }}
                    trigger={['click']}
                    disabled={record.estado === 'cancelado'}
                  >
                    <Button 
                      icon={<MoreOutlined />} 
                      title="Cambiar Estado"
                      size="small"
                      className="text-green-600"
                    />
                  </Dropdown>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => handleEditFactura(record)}
                    title="Editar"
                    size="small"
                    disabled={record.estado === 'pagado' || record.estado === 'cancelado'}
                  />
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleDeleteFactura(record.id)}
                    title="Eliminar"
                    size="small"
                    danger
                    disabled={record.estado === 'pagado'}
                  />
                </Space>
              )
            }
          }
        ];

        // Función para generar PDF de factura
        const generarPDFFactura = (factura: Factura) => {
          const contenidoHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Factura ${factura.numero}</title>
              <style>
                body { 
                  font-family: 'Arial', sans-serif; 
                  margin: 0; 
                  padding: 20px; 
                  color: #333;
                  line-height: 1.4;
                  background: white;
                }
                .header { 
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  border-bottom: 3px solid #2563eb; 
                  padding-bottom: 20px; 
                  margin-bottom: 30px;
                }
                .company-info {
                  flex: 1;
                }
                .company-name { 
                  font-size: 32px; 
                  font-weight: bold; 
                  color: #2563eb; 
                  margin-bottom: 5px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .invoice-info {
                  text-align: right;
                  flex: 1;
                }
                .invoice-title { 
                  font-size: 28px; 
                  font-weight: bold;
                  color: #1f2937; 
                  margin-bottom: 10px;
                }
                .invoice-number {
                  font-size: 20px;
                  color: #2563eb;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                table { 
                  width: 100%; 
                  border-collapse: collapse; 
                  margin-bottom: 30px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  border-radius: 8px;
                  overflow: hidden;
                }
                th { 
                  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
                  color: white; 
                  font-weight: bold;
                  padding: 15px 12px;
                  text-align: left;
                  font-size: 14px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                td { 
                  border-bottom: 1px solid #e5e7eb; 
                  padding: 12px; 
                  vertical-align: top;
                }
                tr:nth-child(even) { 
                  background-color: #f9fafb; 
                }
                .totals-section { 
                  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
                  padding: 25px; 
                  border-radius: 8px; 
                  margin-bottom: 30px;
                  border: 1px solid #cbd5e1;
                }
                .total-final {
                  border-top: 2px solid #2563eb;
                  padding-top: 15px;
                  margin-top: 15px;
                  font-size: 24px;
                  color: #2563eb;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="company-info">
                  <div class="company-name">GESTOR POS</div>
                  <div>Sistema de Gestión Empresarial</div>
                  <div>info@gestorpos.com | +1 (555) 123-4567</div>
                </div>
                <div class="invoice-info">
                  <div class="invoice-title">FACTURA</div>
                  <div class="invoice-number">${factura.numero}</div>
                  <div>Estado: ${factura.estado.toUpperCase()}</div>
                </div>
              </div>

              <div style="margin-bottom: 30px;">
                <strong>Cliente:</strong> ${factura.cliente}<br>
                <strong>Fecha de Emisión:</strong> ${new Date(factura.fecha).toLocaleDateString('es-ES')}<br>
                <strong>Fecha de Vencimiento:</strong> ${new Date(factura.fechaVencimiento).toLocaleDateString('es-ES')}
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${factura.productos.map(producto => `
                    <tr>
                      <td>${producto.nombre}</td>
                      <td style="text-align: center;">${producto.cantidad}</td>
                      <td style="text-align: right;">$${producto.precio.toFixed(2)}</td>
                      <td style="text-align: right; font-weight: bold;">$${producto.total.toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totals-section">
                <div style="text-align: right;">
                  <div>Subtotal: $${factura.subtotal.toFixed(2)}</div>
                  <div>Impuestos (16% IVA): $${factura.impuestos.toFixed(2)}</div>
                  <div class="total-final">TOTAL: $${factura.total.toFixed(2)}</div>
                </div>
              </div>

              ${factura.notas ? `
                <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <strong>Notas:</strong><br>
                  ${factura.notas}
                </div>
              ` : ''}

              <div style="text-align: center; font-size: 12px; color: #666; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                <p>Gracias por su preferencia - GESTOR POS</p>
                <p>Factura generada el ${new Date().toLocaleString('es-ES')}</p>
              </div>
            </body>
            </html>
          `;

          // Crear ventana para imprimir
          const ventanaImpresion = window.open('', '_blank', 'width=900,height=700');
          if (ventanaImpresion) {
            ventanaImpresion.document.write(contenidoHTML);
            ventanaImpresion.document.close();
            
            // Esperar a que cargue y mostrar diálogo de impresión
            setTimeout(() => {
              ventanaImpresion.print();
            }, 500);
          } else {
            // Fallback: descargar como archivo HTML
            const blob = new Blob([contenidoHTML], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Factura_${factura.numero}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            message.info('Factura descargada. Puede abrirla en su navegador para imprimir.');
          }
        };

        // Calcular estadísticas de facturas
        const totalFacturado = facturas.reduce((sum, f) => sum + f.total, 0);
        const facturasPagadas = facturas.filter(f => f.estado === 'pagado');
        const totalCobrado = facturasPagadas.reduce((sum, f) => sum + f.total, 0);
        const facturasPendientesCount = facturas.filter(f => f.estado === 'pendiente').length;
        const facturasVencidas = facturas.filter(f => {
          const fechaVenc = new Date(f.fechaVencimiento);
          const hoy = new Date();
          return fechaVenc < hoy && f.estado !== 'pagado';
        });

        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <Title level={2}>💼 Gestión de Facturas</Title>
              <Space>
                <Button 
                  icon={<FileExcelOutlined />}
                  onClick={() => message.info('Función de exportar en desarrollo')}
                >
                  Exportar Excel
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsFacturaModalVisible(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Nueva Factura
                </Button>
              </Space>
            </div>

            {/* KPIs de Facturación */}
            <Row gutter={[16, 16]} className="mb-6">
              <Col span={6}>
                <Card className="border-l-4 border-l-blue-500">
                  <Statistic
                    title="Total Facturado"
                    value={totalFacturado}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {facturas.length} facturas emitidas
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-green-500">
                  <Statistic
                    title="Total Cobrado"
                    value={totalCobrado}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {facturasPagadas.length} facturas pagadas
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-orange-500">
                  <Statistic
                    title="Pendientes de Cobro"
                    value={totalFacturado - totalCobrado}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    {facturasPendientesCount} facturas pendientes
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card className="border-l-4 border-l-red-500">
                  <Statistic
                    title="Facturas Vencidas"
                    value={facturasVencidas.length}
                    valueStyle={{ color: '#f5222d' }}
                  />
                  <div className="text-sm text-gray-500 mt-2">
                    Requieren seguimiento
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Alertas de Facturas */}
            {facturasVencidas.length > 0 && (
              <Row gutter={[16, 16]} className="mb-6">
                <Col span={24}>
                  <Card 
                    title="⚠️ Alertas de Facturación" 
                    className="border-l-4 border-l-red-500"
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <h4 className="text-red-700 font-semibold mb-2">📅 Facturas Vencidas ({facturasVencidas.length})</h4>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {facturasVencidas.slice(0, 5).map(factura => {
                              const diasVencidos = Math.ceil((new Date().getTime() - new Date(factura.fechaVencimiento).getTime()) / (1000 * 3600 * 24));
                              return (
                                <div key={factura.id} className="flex justify-between items-center text-sm text-red-600 bg-white p-2 rounded">
                                  <span>
                                    <strong>{factura.numero}</strong> - {factura.cliente}
                                  </span>
                                  <span>
                                    ${factura.total.toFixed(2)} - Vencida {diasVencidos} días
                                  </span>
                                </div>
                              );
                            })}
                            {facturasVencidas.length > 5 && (
                              <div className="text-sm text-red-500 text-center">
                                ... y {facturasVencidas.length - 5} facturas más vencidas
                              </div>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Tabla de Facturas */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="📋 Lista de Facturas">
                  <Table
                    columns={facturaColumns}
                    dataSource={facturas}
                    rowKey="id"
                    pagination={{ 
                      pageSize: 15,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} facturas`
                    }}
                    size="middle"
                    scroll={{ x: 1200 }}
                    rowClassName={(record) => {
                      const fechaVenc = new Date(record.fechaVencimiento);
                      const hoy = new Date();
                      if (record.estado === 'vencido' || (fechaVenc < hoy && record.estado !== 'pagado')) {
                        return 'bg-red-50';
                      }
                      if (record.estado === 'pagado') {
                        return 'bg-green-50';
                      }
                      return '';
                    }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Modal para crear/editar factura */}
            <Modal
              title={editingFactura ? "Editar Factura" : "Nueva Factura"}
              open={isFacturaModalVisible}
              onCancel={() => {
                setIsFacturaModalVisible(false);
                setEditingFactura(null);
                facturaForm.resetFields();
              }}
              footer={null}
              width={800}
            >
              <Form form={facturaForm} onFinish={handleSaveFactura} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="cliente" label="Cliente" rules={[{ required: true, message: 'Selecciona un cliente' }]}>
                      <Select 
                        placeholder="Selecciona un cliente"
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        {clientes.map(cliente => (
                          <Option key={cliente.id} value={cliente.nombre}>
                            {cliente.nombre} - {cliente.email}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="fecha" label="Fecha de Emisión" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="fechaVencimiento" label="Fecha de Vencimiento" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="notas" label="Notas (Opcional)">
                      <Input.TextArea rows={2} placeholder="Notas adicionales de la factura" />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Productos existentes de la factura (al editar) */}
                {editingFactura && editingFactura.productos.length > 0 && (
                  <div className="mb-4">
                    <h4>Productos de la factura:</h4>
                    <div className="bg-blue-50 p-4 rounded border">
                      {editingFactura.productos.map((producto, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="font-medium">{producto.nombre}</span>
                          <span>{producto.cantidad} x ${producto.precio.toFixed(2)} = ${producto.total.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 font-bold text-blue-700">
                        <span>Subtotal:</span>
                        <span>${editingFactura.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-blue-600">
                        <span>Impuestos (16%):</span>
                        <span>${editingFactura.impuestos.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-blue-800 text-lg border-t pt-2 mt-2">
                        <span>Total:</span>
                        <span>${editingFactura.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      💡 Para cambiar los productos, agréguelos al carrito desde el módulo POS
                    </div>
                  </div>
                )}

                {/* Productos del carrito (si hay) */}
                {carrito.length > 0 && (
                  <div className="mb-4">
                    <h4>Productos en el carrito {editingFactura ? '(se reemplazarán los productos existentes)' : ''}:</h4>
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                      {carrito.map(item => (
                        <div key={item.producto.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span>{item.producto.nombre}</span>
                          <span>{item.cantidad} x ${item.producto.precio.toFixed(2)} = ${(item.cantidad * item.producto.precio).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 font-bold">
                        <span>Total:</span>
                        <span>${calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Form.Item className="mb-0 pt-4">
                  <Space className="w-full justify-end">
                    <Button onClick={() => {
                      setIsFacturaModalVisible(false);
                      setEditingFactura(null);
                      facturaForm.resetFields();
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit" className="bg-blue-600">
                      {editingFactura ? 'Actualizar' : 'Crear'} Factura
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal para ver detalles de factura */}
            <Modal
              title={`Factura ${selectedFactura?.numero}`}
              open={isFacturaDetailVisible}
              onCancel={() => {
                setIsFacturaDetailVisible(false);
                setSelectedFactura(null);
              }}
              footer={[
                <Button key="print" icon={<PrinterOutlined />} onClick={() => selectedFactura && generarPDFFactura(selectedFactura)}>
                  Imprimir
                </Button>,
                <Button key="close" onClick={() => {
                  setIsFacturaDetailVisible(false);
                  setSelectedFactura(null);
                }}>
                  Cerrar
                </Button>
              ]}
              width={700}
            >
              {selectedFactura && (
                <div>
                  <Row gutter={16} className="mb-4">
                    <Col span={12}>
                      <p><strong>Cliente:</strong> {selectedFactura.cliente}</p>
                      <p><strong>Fecha:</strong> {new Date(selectedFactura.fecha).toLocaleDateString('es-ES')}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Vencimiento:</strong> {new Date(selectedFactura.fechaVencimiento).toLocaleDateString('es-ES')}</p>
                      <p><strong>Estado:</strong> <Tag color={selectedFactura.estado === 'pagado' ? 'green' : selectedFactura.estado === 'vencido' ? 'red' : 'orange'}>{selectedFactura.estado.toUpperCase()}</Tag></p>
                    </Col>
                  </Row>
                  
                  <Table
                    columns={[
                      { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
                      { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad', align: 'center' },
                      { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (precio: number) => `$${precio.toFixed(2)}`, align: 'right' },
                      { title: 'Total', dataIndex: 'total', key: 'total', render: (total: number) => `$${total.toFixed(2)}`, align: 'right' }
                    ]}
                    dataSource={selectedFactura.productos}
                    pagination={false}
                    size="small"
                  />
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded">
                    <Row>
                      <Col span={18}><strong>Subtotal:</strong></Col>
                      <Col span={6} className="text-right">${selectedFactura.subtotal.toFixed(2)}</Col>
                    </Row>
                    <Row>
                      <Col span={18}><strong>Impuestos:</strong></Col>
                      <Col span={6} className="text-right">${selectedFactura.impuestos.toFixed(2)}</Col>
                    </Row>
                    <Row className="font-bold text-lg border-t pt-2 mt-2">
                      <Col span={18}><strong>TOTAL:</strong></Col>
                      <Col span={6} className="text-right">${selectedFactura.total.toFixed(2)}</Col>
                    </Row>
                  </div>
                  
                  {selectedFactura.notas && (
                    <div className="mt-4">
                      <strong>Notas:</strong>
                      <p className="mt-2 p-3 bg-blue-50 rounded">{selectedFactura.notas}</p>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </div>
        );

    case '10': // Calendario y Eventos Completo
      return (
        <div className="space-y-6">
          {/* Header del Calendario */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Calendario y Eventos</h2>
              <p className="text-gray-300 text-sm">Gestiona tus eventos, reuniones y tareas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button.Group>
                <Button 
                  type={calendarView === 'month' ? 'primary' : 'default'}
                  onClick={() => setCalendarView('month')}
                  size="small"
                  className={calendarView === 'month' ? 'bg-blue-600 border-blue-500' : 'bg-white/20 border-white/30 text-gray-800 hover:bg-white/30'}
                >
                  📅 Mes
                </Button>
                <Button 
                  type={calendarView === 'week' ? 'primary' : 'default'}
                  onClick={() => setCalendarView('week')}
                  size="small"
                  className={calendarView === 'week' ? 'bg-blue-600 border-blue-500' : 'bg-white/20 border-white/30 text-gray-800 hover:bg-white/30'}
                >
                  📊 Semana
                </Button>
                <Button 
                  type={calendarView === 'day' ? 'primary' : 'default'}
                  onClick={() => setCalendarView('day')}
                  size="small"
                  className={calendarView === 'day' ? 'bg-blue-600 border-blue-500' : 'bg-white/20 border-white/30 text-gray-800 hover:bg-white/30'}
                >
                  🗓️ Día
                </Button>
                <Button 
                  type={calendarView === 'list' ? 'primary' : 'default'}
                  onClick={() => setCalendarView('list')}
                  size="small"
                  className={calendarView === 'list' ? 'bg-blue-600 border-blue-500' : 'bg-white/20 border-white/30 text-gray-800 hover:bg-white/30'}
                >
                  📋 Lista
                </Button>
              </Button.Group>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsEventoModalVisible(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-none shadow-lg"
              >
                Nuevo Evento
              </Button>
            </div>
          </div>

          {/* Navegación del calendario */}
          <div className="bg-white/30 backdrop-blur-lg rounded-xl p-4 border border-white/40 shadow-xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Button 
                  icon={<LeftOutlined />} 
                  onClick={handlePreviousPeriod}
                  className="bg-blue-500/30 border-blue-400/50 text-gray-800 hover:bg-blue-500/50 shadow-md"
                />
                <Button 
                  icon={<RightOutlined />} 
                  onClick={handleNextPeriod}
                  className="bg-blue-500/30 border-blue-400/50 text-gray-800 hover:bg-blue-500/50 shadow-md"
                />
                <Button 
                  onClick={handleToday}
                  className="bg-green-500/30 border-green-400/50 text-gray-800 hover:bg-green-500/50 shadow-md"
                >
                  Hoy
                </Button>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800">
                {formatCalendarTitle()}
              </h3>

              <div className="flex items-center space-x-2">
                <Select
                  value={eventFilter}
                  onChange={setEventFilter}
                  className="w-32"
                  size="small"
                >
                  <Select.Option value="all">Todos</Select.Option>
                  <Select.Option value="reunion">Reuniones</Select.Option>
                  <Select.Option value="tarea">Tareas</Select.Option>
                  <Select.Option value="recordatorio">Recordatorios</Select.Option>
                  <Select.Option value="evento">Eventos</Select.Option>
                </Select>
                <Button 
                  icon={<SearchOutlined />}
                  onClick={() => setShowSearch(!showSearch)}
                  className="bg-white/20 border-white/30 text-gray-800 hover:bg-white/30"
                />
              </div>
            </div>

            {/* Búsqueda */}
            {showSearch && (
              <div className="mt-4">
                <Input
                  placeholder="Buscar eventos..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}
          </div>

          {/* Vista del calendario */}
          {calendarView === 'month' && renderMonthView()}
          {calendarView === 'week' && renderWeekView()}
          {calendarView === 'day' && renderDayView()}
          {calendarView === 'list' && renderListView()}

          {/* Panel lateral con resumen */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Estadísticas rápidas */}
            <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-white/30 pb-2">📊 Resumen</h4>
              <div className="space-y-3">
                <div className="flex justify-between bg-white/20 p-3 rounded-lg">
                  <span className="text-gray-700">Total eventos:</span>
                  <span className="font-bold text-gray-800">{getFilteredEvents().length}</span>
                </div>
                <div className="flex justify-between bg-white/20 p-3 rounded-lg">
                  <span className="text-gray-700">Hoy:</span>
                  <span className="font-bold text-yellow-600">{getTodayEvents().length}</span>
                </div>
                <div className="flex justify-between bg-white/20 p-3 rounded-lg">
                  <span className="text-gray-700">Esta semana:</span>
                  <span className="font-bold text-green-600">{getThisWeekEvents().length}</span>
                </div>
                <div className="flex justify-between bg-white/20 p-3 rounded-lg">
                  <span className="text-gray-700">Completados:</span>
                  <span className="font-bold text-purple-600">
                    {eventos.filter(e => e.completado).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Próximos eventos */}
            <div className="lg:col-span-2 bg-gradient-to-br from-green-500/30 to-blue-500/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-white/30 pb-2">📅 Próximos Eventos</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {getUpcomingEvents().slice(0, 5).map(evento => (
                  <div
                    key={evento.id}
                    className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(evento.tipo)} 
                               ${evento.completado ? 'opacity-60' : ''} 
                               hover:bg-white/20 transition-all duration-200 cursor-pointer transform hover:scale-105`}
                    onClick={() => handleEditEvento(evento)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className={`font-medium text-gray-800 ${evento.completado ? 'line-through' : ''}`}>
                          {evento.titulo}
                        </h5>
                        <p className="text-gray-700 text-sm">{evento.descripcion}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                          <span>📅 {dayjs(evento.fecha).format('DD/MM/YYYY')}</span>
                          <span>⏰ {evento.horaInicio} - {evento.horaFin}</span>
                          <Tag color={getPriorityColor(evento.prioridad)}>
                            {evento.prioridad}
                          </Tag>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="small"
                          type={evento.completado ? "default" : "primary"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleEvento(evento.id);
                          }}
                          className="text-xs"
                        >
                          {evento.completado ? '↩' : '✓'}
                        </Button>
                        <Button
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvento(evento.id);
                          }}
                          type="text"
                          danger
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {getUpcomingEvents().length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <CalendarOutlined className="text-3xl mb-2" />
                    <p>No hay eventos próximos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-lg rounded-xl p-6 border border-white/40 shadow-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b border-white/30 pb-2">⚡ Acciones Rápidas</h4>
              <div className="space-y-3">
                <Button
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setQuickEventType('reunion');
                    setIsEventoModalVisible(true);
                  }}
                  className="bg-blue-600/40 border-blue-400 text-gray-800 hover:bg-blue-600/60 shadow-lg h-12 font-medium"
                >
                  🤝 Nueva Reunión
                </Button>
                <Button
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setQuickEventType('tarea');
                    setIsEventoModalVisible(true);
                  }}
                  className="bg-green-600/40 border-green-400 text-gray-800 hover:bg-green-600/60 shadow-lg h-12 font-medium"
                >
                  ✅ Nueva Tarea
                </Button>
                <Button
                  block
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setQuickEventType('recordatorio');
                    setIsEventoModalVisible(true);
                  }}
                  className="bg-yellow-600/40 border-yellow-400 text-gray-800 hover:bg-yellow-600/60 shadow-lg h-12 font-medium"
                >
                  ⏰ Recordatorio
                </Button>
                <Button
                  block
                  icon={<ExportOutlined />}
                  onClick={handleExportCalendar}
                  className="bg-purple-600/40 border-purple-400 text-gray-800 hover:bg-purple-600/60 shadow-lg h-12 font-medium"
                >
                  📥 Exportar Calendario
                </Button>
              </div>
            </div>
          </div>

          {/* Modal para crear/editar evento mejorado */}
          <Modal
            title={
              <div className="flex items-center space-x-2">
                <CalendarOutlined />
                <span>{editingEvento ? 'Editar Evento' : 'Nuevo Evento'}</span>
              </div>
            }
            open={isEventoModalVisible}
            onCancel={() => {
              setIsEventoModalVisible(false);
              setEditingEvento(null);
              setQuickEventType(null);
              eventoForm.resetFields();
            }}
            footer={null}
            width={700}
            className="custom-modal"
          >
            <Form
              form={eventoForm}
              layout="vertical"
              onFinish={handleSaveEvento}
              className="space-y-4"
              initialValues={{
                tipo: quickEventType || 'evento',
                prioridad: 'media',
                fecha: dayjs(),
                horaInicio: dayjs().add(1, 'hour'),
                horaFin: dayjs().add(2, 'hour'),
                recordatorio: false,
                recurrente: false
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Título del Evento"
                  name="titulo"
                  rules={[{ required: true, message: 'El título es requerido' }]}
                  className="col-span-2"
                >
                  <Input placeholder="Ej: Reunión con cliente, Entrega de proyecto..." size="large" />
                </Form.Item>

                <Form.Item
                  label="Tipo de Evento"
                  name="tipo"
                >
                  <Select size="large">
                    <Select.Option value="reunion">🤝 Reunión</Select.Option>
                    <Select.Option value="tarea">✅ Tarea</Select.Option>
                    <Select.Option value="recordatorio">⏰ Recordatorio</Select.Option>
                    <Select.Option value="evento">📅 Evento</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Prioridad"
                  name="prioridad"
                >
                  <Select size="large">
                    <Select.Option value="baja">🟢 Baja</Select.Option>
                    <Select.Option value="media">🟡 Media</Select.Option>
                    <Select.Option value="alta">🔴 Alta</Select.Option>
                  </Select>
                </Form.Item>
              </div>

              <Form.Item
                label="Descripción"
                name="descripcion"
              >
                <TextArea 
                  rows={3} 
                  placeholder="Detalles adicionales del evento..." 
                  showCount 
                  maxLength={500}
                />
              </Form.Item>

              <div className="grid grid-cols-3 gap-4">
                <Form.Item
                  label="Fecha"
                  name="fecha"
                  rules={[{ required: true, message: 'La fecha es requerida' }]}
                >
                  <DatePicker 
                    className="w-full" 
                    size="large"
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                  />
                </Form.Item>

                <Form.Item
                  label="Hora de Inicio"
                  name="horaInicio"
                  rules={[{ required: true, message: 'La hora de inicio es requerida' }]}
                >
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>

                <Form.Item
                  label="Hora de Fin"
                  name="horaFin"
                  rules={[{ required: true, message: 'La hora de fin es requerida' }]}
                >
                  <TimePicker format="HH:mm" className="w-full" size="large" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Ubicación (opcional)"
                  name="ubicacion"
                >
                  <Input placeholder="Sala de reuniones, Oficina principal..." size="large" />
                </Form.Item>

                <Form.Item
                  label="Participantes (opcional)"
                  name="participantes"
                >
                  <Input placeholder="Juan, María, Equipo de ventas..." size="large" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item name="recordatorio" valuePropName="checked">
                  <Checkbox>🔔 Activar recordatorio (15 min antes)</Checkbox>
                </Form.Item>

                <Form.Item name="recurrente" valuePropName="checked">
                  <Checkbox>🔄 Evento recurrente</Checkbox>
                </Form.Item>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button onClick={() => setIsEventoModalVisible(false)} size="large">
                  Cancelar
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  {editingEvento ? 'Actualizar Evento' : 'Crear Evento'}
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