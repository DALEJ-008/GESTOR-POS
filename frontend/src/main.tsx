import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import esES from 'antd/locale/es_ES'
import './index.css'

// Importar aplicación empresarial
import AppEmpresarial from './App-empresarial.tsx'

console.log('🚀 Iniciando aplicación empresarial')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider locale={esES}>
      <AppEmpresarial />
    </ConfigProvider>
  </React.StrictMode>,
)