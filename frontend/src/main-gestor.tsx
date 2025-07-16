import { StrictMode, Component, ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import { Toaster } from 'react-hot-toast'

// Importar la aplicación principal
import App from './App-debug-layouts'
import './index.css'

// Error Boundary para capturar errores
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error en la aplicación:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
          <h1 style={{ color: '#ef4444' }}>❌ Error en la aplicación</h1>
          <p>Error: {this.state.error?.message}</p>
          <details style={{ marginTop: '1rem' }}>
            <summary>Detalles técnicos</summary>
            <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
              {this.state.error?.stack}
            </pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

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

// Configuración de Ant Design
const antdConfig = {
  locale: esES,
  theme: {
    token: {
      colorPrimary: '#3b82f6',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      borderRadius: 8,
      fontFamily: 'Inter, system-ui, sans-serif',
    },
  },
}

const container = document.getElementById('root')
if (!container) {
  throw new Error('No se encontró el elemento root')
}

const root = createRoot(container)
root.render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider {...antdConfig}>
          <BrowserRouter>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
