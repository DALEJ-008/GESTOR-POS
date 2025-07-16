import React, { useState } from 'react'
import { Form, Input, Button, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

interface LoginForm {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true)
    clearError()

    try {
      await login(values.username, values.password)
      toast.success('¡Bienvenido de vuelta!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="text-gray-600 mt-2">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          className="mb-4"
          closable
          onClose={clearError}
        />
      )}

      <Form
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          label="Nombre de usuario"
          rules={[
            { required: true, message: 'Por favor ingresa tu nombre de usuario' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="tu_usuario"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Por favor ingresa tu contraseña' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Iniciar Sesión
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center space-y-2">
        <div>
          <Link
            to="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-500"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Regístrate aquí
          </Link>
        </div>
        <div className="text-gray-600 text-sm">
          ¿Representas una empresa?{' '}
          <Link
            to="/auth/tenant-register"
            className="text-green-600 hover:text-green-500 font-medium"
          >
            Registra tu empresa
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
