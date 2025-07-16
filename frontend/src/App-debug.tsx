import React from 'react'
import { Button, Card, Typography, Space, message } from 'antd'

const { Title, Text } = Typography

const App: React.FC = () => {
  const [contador, setContador] = React.useState(0)

  const cargarAppOriginal = async () => {
    try {
      message.loading('Cargando aplicación principal...', 2)
      // Cambiar de vuelta al app original
      window.location.href = window.location.href + '?modo=normal'
    } catch (error) {
      console.error('Error:', error)
      message.error('Error al cargar la aplicación principal')
    }
  }

  const limpiarYReiniciar = () => {
    // Limpiar TODOS los datos incluyendo la bandera de limpieza
    localStorage.clear()
    message.success('Todos los datos eliminados. Reiniciando...')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const resetCompleto = () => {
    // Limpiar todo excepto configuraciones de VS Code
    const keysToKeep = ['vscode-userDataSync', 'vscode-webview', 'vscode']
    const allKeys = Object.keys(localStorage)
    
    allKeys.forEach(key => {
      if (!keysToKeep.some(keepKey => key.startsWith(keepKey))) {
        localStorage.removeItem(key)
      }
    })
    
    message.success('Reset completo realizado. La aplicación iniciará limpia.')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }

  const inicializarDatos = () => {
    // Datos básicos para probar
    localStorage.setItem('gestor_authenticated', 'false')
    localStorage.setItem('gestor_productos', JSON.stringify([]))
    localStorage.setItem('gestor_ventas', JSON.stringify([]))
    localStorage.setItem('gestor_gastos', JSON.stringify([]))
    localStorage.setItem('gestor_compras', JSON.stringify([]))
    localStorage.setItem('gestor_clientes', JSON.stringify([]))
    localStorage.setItem('gestor_proveedores', JSON.stringify([]))
    message.success('Datos inicializados correctamente')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '600px',
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: '24px' }}>
          🔧 Debug Mode - Gestor POS
        </Title>
        
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ 
            background: '#f6ffed', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #b7eb8f'
          }}>
            <Text strong style={{ color: '#52c41a' }}>✅ Sistema Base Funcionando</Text>
            <br />
            <Text style={{ fontSize: '12px', color: '#666' }}>
              React, Ant Design y TypeScript están cargados correctamente
            </Text>
          </div>

          <div>
            <Text>Test de Estado: Contador = {contador}</Text>
            <br />
            <Button 
              type="primary" 
              onClick={() => setContador(contador + 1)}
              style={{ marginTop: '8px' }}
            >
              Incrementar (+1)
            </Button>
          </div>
          
          <div style={{ 
            background: '#fff7e6', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #ffd591'
          }}>
            <Text strong>🛠️ Herramientas de Debug</Text>
            <Space direction="vertical" style={{ marginTop: '12px', width: '100%' }}>
              <Button 
                onClick={limpiarYReiniciar}
                style={{ width: '100%' }}
              >
                🗑️ Limpiar localStorage y reiniciar
              </Button>
              
              <Button 
                onClick={resetCompleto}
                type="primary"
                danger
                style={{ width: '100%' }}
              >
                🔄 Reset Completo (Forzar limpieza total)
              </Button>
              
              <Button 
                onClick={inicializarDatos}
                style={{ width: '100%' }}
              >
                � Inicializar datos vacíos
              </Button>
              
              <Button 
                onClick={() => {
                  console.log('Estado localStorage:')
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i)
                    if (key) {
                      console.log(key, localStorage.getItem(key))
                    }
                  }
                }}
                style={{ width: '100%' }}
              >
                📋 Ver localStorage en consola
              </Button>
            </Space>
          </div>

          <div style={{ 
            background: '#e6f7ff', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #91d5ff'
          }}>
            <Text strong>🚀 Cargar Aplicación Principal</Text>
            <br />
            <Text style={{ fontSize: '12px', color: '#666', display: 'block', margin: '8px 0' }}>
              Si todo funciona bien aquí, podemos cargar la aplicación completa
            </Text>
            <Button 
              type="primary" 
              size="large"
              onClick={cargarAppOriginal}
              style={{ width: '100%', marginTop: '8px' }}
            >
              ▶️ Ir a Gestor POS Completo
            </Button>
          </div>
        </Space>
        
        <div style={{ 
          marginTop: '24px', 
          padding: '12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          fontSize: '11px',
          color: '#666'
        }}>
          💡 Tip: Abre las herramientas de desarrollador (F12) para ver logs detallados
        </div>
      </Card>
    </div>
  )
}

export default App
