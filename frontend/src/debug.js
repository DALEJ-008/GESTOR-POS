// Script de depuración para limpiar localStorage
console.log('Estado actual del localStorage:');
console.log('gestor_authenticated:', localStorage.getItem('gestor_authenticated'));
console.log('gestor_productos:', localStorage.getItem('gestor_productos'));
console.log('gestor_ventas:', localStorage.getItem('gestor_ventas'));
console.log('gestor_gastos:', localStorage.getItem('gestor_gastos'));
console.log('gestor_compras:', localStorage.getItem('gestor_compras'));
console.log('gestor_clientes:', localStorage.getItem('gestor_clientes'));
console.log('gestor_proveedores:', localStorage.getItem('gestor_proveedores'));

// Función para limpiar localStorage
function limpiarDatos() {
  localStorage.clear();
  console.log('localStorage limpiado');
  window.location.reload();
}

// Función para inicializar datos de prueba
function inicializarDatos() {
  // Datos de prueba
  const productosTest = [
    {
      key: '1',
      codigo: 'P001',
      nombre: 'Producto Test 1',
      categoria: 'Electrónicos',
      precio: 100,
      stock: 50,
      estado: 'Activo'
    },
    {
      key: '2',
      codigo: 'P002',
      nombre: 'Producto Test 2',
      categoria: 'Ropa',
      precio: 50,
      stock: 5, // Stock bajo para probar alertas
      estado: 'Activo'
    }
  ];
  
  const ventasTest = [
    {
      id: '1',
      fecha: new Date().toISOString(),
      total: 150,
      items: [
        { nombre: 'Producto Test 1', cantidad: 1, precio: 100 },
        { nombre: 'Producto Test 2', cantidad: 1, precio: 50 }
      ]
    }
  ];
  
  const gastosTest = [
    {
      id: '1',
      fecha: new Date().toISOString(),
      monto: 50,
      descripcion: 'Gasto de prueba',
      categoria: 'Operación'
    }
  ];
  
  const clientesTest = [
    {
      key: '1',
      nombre: 'Cliente Test',
      email: 'test@example.com',
      telefono: '123456789',
      tipo: 'Individual',
      estado: 'Activo',
      totalCompras: 150
    }
  ];
  
  localStorage.setItem('gestor_productos', JSON.stringify(productosTest));
  localStorage.setItem('gestor_ventas', JSON.stringify(ventasTest));
  localStorage.setItem('gestor_gastos', JSON.stringify(gastosTest));
  localStorage.setItem('gestor_compras', JSON.stringify([]));
  localStorage.setItem('gestor_clientes', JSON.stringify(clientesTest));
  localStorage.setItem('gestor_proveedores', JSON.stringify([]));
  
  console.log('Datos de prueba inicializados');
  window.location.reload();
}

// Exportar funciones para uso en consola
window.limpiarDatos = limpiarDatos;
window.inicializarDatos = inicializarDatos;

console.log('Funciones disponibles:');
console.log('- limpiarDatos(): Limpia todo el localStorage');
console.log('- inicializarDatos(): Carga datos de prueba');
