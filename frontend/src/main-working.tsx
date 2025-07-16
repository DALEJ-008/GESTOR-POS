import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1 style={{ color: '#059669' }}>🎉 Gestor POS Funcionando!</h1>
      <p>Fecha: {new Date().toLocaleDateString()}</p>
      <p>Hora: {new Date().toLocaleTimeString()}</p>
      
      <div style={{ 
        background: '#ecfdf5', 
        border: '1px solid #059669',
        padding: '1rem', 
        borderRadius: '0.5rem',
        marginTop: '1rem'
      }}>
        <h2>✅ Estado del Sistema</h2>
        <ul>
          <li>✅ React 18 - Funcionando</li>
          <li>✅ TypeScript - Funcionando</li>
          <li>✅ Vite - Funcionando</li>
          <li>✅ Hot Reload - Activo</li>
        </ul>
      </div>

      <button 
        onClick={() => alert('¡React está funcionando correctamente!')}
        style={{
          background: '#059669',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginTop: '1rem',
          fontSize: '1rem'
        }}
      >
        🚀 Probar Interactividad
      </button>
    </div>
  )
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('No se encontró el elemento root')
}

const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
