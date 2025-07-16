import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Button, Card, Layout, Alert } from 'antd'
import { QueryClient, QueryClientProvider } from 'react-query'
import esES from 'antd/locale/es_ES'

const { Header, Content } = Layout

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
})

function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Alert 
        message="🧪 Test Completo Exitoso" 
        description="React + Router + Ant Design + React Query están funcionando"
        type="success"
        style={{ marginBottom: '1rem' }}
      />
      <Card title="🏠 Página Principal">
        <p>Todas las dependencias principales están funcionando correctamente!</p>
        <Button type="primary" onClick={() => alert('¡Todo funciona!')}>
          Probar Interactividad
        </Button>
      </Card>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={esES}>
        <BrowserRouter>
          <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ background: '#001529' }}>
              <h2 style={{ color: 'white', margin: 0 }}>
                🧪 Test Completo: React + Router + Ant Design + React Query
              </h2>
            </Header>
            <Content style={{ padding: '2rem' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="*" element={
                  <Card title="📍 Ruta no encontrada">
                    <p>Pero todas las dependencias están funcionando!</p>
                  </Card>
                } />
              </Routes>
            </Content>
          </Layout>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
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
