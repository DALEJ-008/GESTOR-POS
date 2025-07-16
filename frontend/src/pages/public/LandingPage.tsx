import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gestor POS
          </h1>
          <h2 className="text-3xl font-semibold text-blue-600 mb-8">
            Sistema Completo de Gestión Empresarial
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Administra tu inventario, procesa ventas, gestiona clientes y genera reportes 
            desde una sola plataforma. Diseñado especialmente para empresas modernas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/tenant-register">
              <Button type="primary" size="large" className="w-full sm:w-auto">
                Comenzar Prueba Gratuita
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button size="large" className="w-full sm:w-auto">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Características Principales
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏪</span>
            </div>
            <h4 className="text-xl font-semibold mb-4">Punto de Venta (POS)</h4>
            <p className="text-gray-600">
              Procesa ventas rápidamente con soporte para múltiples métodos de pago, 
              descuentos e impresión de tickets.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h4 className="text-xl font-semibold mb-4">Control de Inventario</h4>
            <p className="text-gray-600">
              Gestiona tu stock en tiempo real con alertas automáticas de productos 
              con bajo inventario y control de movimientos.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold mb-4">Reportes y Analytics</h4>
            <p className="text-gray-600">
              Obtén insights valiosos de tu negocio con reportes detallados de 
              ventas, inventario y rendimiento financiero.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para revolucionar tu negocio?
          </h3>
          <p className="text-xl mb-8">
            Únete a miles de empresas que ya confían en Gestor POS
          </p>
          <Link to="/auth/tenant-register">
            <Button type="primary" size="large" className="bg-white text-blue-600 border-white hover:bg-gray-100">
              Comenzar Ahora - Es Gratis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
