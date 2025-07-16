import React from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'

const { Content } = Layout

const AuthLayout: React.FC = () => {
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Content className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestor POS
            </h1>
            <p className="text-gray-600">
              Sistema de Gestión Empresarial
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <Outlet />
          </div>
        </div>
      </Content>
    </Layout>
  )
}

export default AuthLayout
