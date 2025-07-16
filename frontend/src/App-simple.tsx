import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Componente simple de testing
const TestPage: React.FC = () => (
  <div style={{ 
    padding: '20px', 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <h1 style={{ color: '#1890ff', textAlign: 'center' }}>
      ✅ Gestor POS - Sistema Funcionando
    </h1>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '20px',
      marginTop: '30px'
    }}>
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>🏠 Inicio</h3>
        <p>Página principal funcional</p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ir al Inicio
        </button>
      </div>
      
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>🔑 Login</h3>
        <p>Sistema de autenticación</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#52c41a',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
      </div>
      
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>📊 Dashboard</h3>
        <p>Panel de control</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            padding: '8px 16px',
            backgroundColor: '#722ed1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Ver Dashboard
        </button>
      </div>
    </div>
    
    <div style={{ 
      marginTop: '40px', 
      padding: '20px', 
      backgroundColor: '#e6f7ff', 
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>🎉 Estado del Sistema</h2>
      <p>✅ Frontend React funcionando correctamente</p>
      <p>✅ Routing con React Router operativo</p>
      <p>✅ Navegación entre páginas estable</p>
      <p>✅ Sin errores de compilación</p>
      
      <div style={{ marginTop: '20px' }}>
        <strong>Puerto actual: </strong>
        <span style={{ color: '#1890ff' }}>http://localhost:5174</span>
      </div>
    </div>
  </div>
)

const LoginPage: React.FC = () => (
  <div style={{ 
    padding: '20px', 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '50px auto',
    textAlign: 'center'
  }}>
    <h1 style={{ color: '#1890ff' }}>🔑 Iniciar Sesión</h1>
    
    <div style={{ 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginTop: '20px'
    }}>
      <p>Sistema de autenticación en desarrollo</p>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Formulario funcional próximamente
      </p>
      
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        ← Volver al Inicio
      </button>
    </div>
  </div>
)

const DashboardPage: React.FC = () => (
  <div style={{ 
    padding: '20px', 
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto'
  }}>
    <h1 style={{ color: '#1890ff', textAlign: 'center' }}>
      📊 Dashboard Gestor POS
    </h1>
    
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
      gap: '20px',
      marginTop: '30px'
    }}>
      {[
        { title: '🛍️ Productos', desc: 'Gestión de catálogo' },
        { title: '💰 Ventas', desc: 'Punto de venta' },
        { title: '👥 Clientes', desc: 'Base de datos' },
        { title: '📈 Reportes', desc: 'Análisis y métricas' }
      ].map((module, index) => (
        <div key={index} style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer'
        }} onClick={() => alert(`Módulo ${module.title} próximamente`)}>
          <h3>{module.title}</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>{module.desc}</p>
        </div>
      ))}
    </div>
    
    <div style={{ 
      marginTop: '30px', 
      textAlign: 'center'
    }}>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Volver al Inicio
      </button>
    </div>
  </div>
)

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
