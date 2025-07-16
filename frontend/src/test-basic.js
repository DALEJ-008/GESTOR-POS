console.log('🚀 Archivo de test cargando...')

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 DOM cargado')
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1 style="color: #2563eb;">🔧 Gestor POS - Test Básico</h1>
        <p>Hora: ${new Date().toLocaleString()}</p>
        <p>✅ JavaScript está funcionando</p>
        <p>✅ DOM está disponible</p>
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h3>Estado:</h3>
          <p>🌐 Vite: Funcionando</p>
          <p>📦 Módulos: Cargando</p>
          <p>🎯 Root element: Encontrado</p>
        </div>
      </div>
    `
    console.log('✅ Contenido inyectado en el DOM')
  } else {
    console.error('❌ No se encontró el elemento root')
  }
})

console.log('🎯 Script terminó de ejecutarse')
