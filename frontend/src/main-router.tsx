import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>🏠 Página Principal</h1>
      <p>React Router está funcionando!</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '1rem', fontFamily: 'system-ui' }}>
        <nav style={{ marginBottom: '2rem', padding: '1rem', background: '#f3f4f6' }}>
          <h2>🧭 Gestor POS - Test de Routing</h2>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={
            <div>
              <h2>📍 Ruta no encontrada</h2>
              <p>Pero React Router está funcionando!</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
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
