import React, { useState } from 'react'
import { Form, Input, Button, Divider } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import toast from 'react-hot-toast'

interface RegisterForm {
  username: string
  first_name: string
  last_name: string
  email: string
  password: string
  confirm_password: string
}

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true)
    
    try {
      await authAPI.register(values)
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.')
      navigate('/auth/login')
    } catch (error: any) {
      // Manejo mejorado de errores
      let errorMessage = 'Error al registrar usuario'
      
      if (error.response?.data) {
        const data = error.response.data
        
        // Si hay errores específicos de campo
        if (data.username) {
          errorMessage = Array.isArray(data.username) ? data.username[0] : data.username
        } else if (data.email) {
          errorMessage = Array.isArray(data.email) ? data.email[0] : data.email
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors
        } else if (data.message) {
          errorMessage = data.message
        } else if (data.error) {
          errorMessage = data.error
        } else if (typeof data === 'string') {
          errorMessage = data
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="text-gray-600 mt-2">
          Regístrate para acceder al sistema
        </p>
      </div>

      <Form
        form={form}
        name="register"
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="first_name"
            label="Nombre"
            rules={[
              { required: true, message: 'El nombre es requerido' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nombre"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Apellido"
            rules={[
              { required: true, message: 'El apellido es requerido' },
              { min: 2, message: 'El apellido debe tener al menos 2 caracteres' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Apellido"
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="username"
          label="Nombre de Usuario"
          rules={[
            { required: true, message: 'El nombre de usuario es requerido' },
            { min: 3, message: 'El nombre de usuario debe tener al menos 3 caracteres' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Solo letras, números y guión bajo' }
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="tu_usuario"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo Electrónico"
          rules={[
            { required: true, message: 'El correo es requerido' },
            { type: 'email', message: 'Ingresa un correo válido' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="correo@ejemplo.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Teléfono (Opcional)"
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="+1234567890"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'La contraseña es requerida' },
            { min: 8, message: 'La contraseña debe tener al menos 8 caracteres' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Contraseña"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Confirmar Contraseña"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Confirma tu contraseña' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Las contraseñas no coinciden'))
              },
            }),
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Confirmar contraseña"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="w-full"
          >
            Crear Cuenta
          </Button>
        </Form.Item>
      </Form>

      <Divider>¿Ya tienes cuenta?</Divider>

      <div className="text-center">
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-500">
          Iniciar Sesión
        </Link>
      </div>

      <Divider>¿Quieres crear una empresa?</Divider>

      <div className="text-center">
        <Link to="/auth/tenant-register" className="text-green-600 hover:text-green-500">
          Registrar Nueva Empresa
        </Link>
      </div>
    </div>
  )
}

export default RegisterPage
