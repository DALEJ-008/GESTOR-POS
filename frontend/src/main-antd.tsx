import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider, Button, Card, Layout } from 'antd'
import esES from 'antd/locale/es_ES'

const { Header, Content } = Layout

function HomePage() {
  return (
    <Card title="🏠 Página Principal" style={{ margin: '1rem' }}>
      <p>React Router + Ant Design están funcionando!</p>
      <Button type="primary" onClick={() => alert('¡Ant Design funciona!')}>
        Probar Botón
      </Button>
    </Card>
  )
}

function App() {
  return (
    <ConfigProvider locale={esES}>
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ background: '#001529' }}>
            <h2 style={{ color: 'white', margin: 0 }}>🧪 Test Ant Design + Router</h2>
          </Header>
          <Content style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={
                <Card title="📍 Ruta no encontrada">
                  <p>Pero Ant Design y React Router están funcionando!</p>
                </Card>
              } />
            </Routes>
          </Content>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
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
