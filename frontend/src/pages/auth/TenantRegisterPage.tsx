import React, { useState } from 'react'
import { Form, Input, Button, Divider, Select, Steps } from 'antd'
import { 
  ShopOutlined, 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined 
} from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const { Step } = Steps
const { TextArea } = Input

interface TenantRegisterForm {
  // Datos de la empresa
  company_name: string
  company_description?: string
  business_type: string
  country: string
  city: string
  address?: string
  phone?: string
  website?: string
  
  // Datos del administrador
  admin_first_name: string
  admin_last_name: string
  admin_email: string
  admin_phone?: string
  admin_password: string
  confirm_password: string
}

const TenantRegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const businessTypes = [
    { value: 'retail', label: 'Venta al por menor' },
    { value: 'wholesale', label: 'Venta al por mayor' },
    { value: 'restaurant', label: 'Restaurante/Bar' },
    { value: 'services', label: 'Servicios' },
    { value: 'manufacturing', label: 'Manufactura' },
    { value: 'other', label: 'Otro' },
  ]

  const countries = [
    { value: 'CO', label: 'Colombia' },
    { value: 'MX', label: 'México' },
    { value: 'AR', label: 'Argentina' },
    { value: 'PE', label: 'Perú' },
    { value: 'CL', label: 'Chile' },
    { value: 'EC', label: 'Ecuador' },
  ]

  const handleSubmit = async (values: TenantRegisterForm) => {
    setLoading(true)
    
    try {
      // TODO: Implementar registro de empresa
      console.log('Registro de empresa:', values)
      toast.success('¡Empresa registrada exitosamente!')
      navigate('/auth/login')
    } catch (error) {
      toast.error('Error al registrar empresa')
    } finally {
      setLoading(false)
    }
  }

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1)
    }).catch(() => {
      toast.error('Por favor completa todos los campos requeridos')
    })
  }

  const prev = () => {
    setCurrentStep(currentStep - 1)
  }

  const steps = [
    {
      title: 'Información de la Empresa',
      content: (
        <>
          <Form.Item
            name="company_name"
            label="Nombre de la Empresa"
            rules={[
              { required: true, message: 'El nombre de la empresa es requerido' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            ]}
          >
            <Input 
              prefix={<ShopOutlined />} 
              placeholder="Mi Empresa S.A.S."
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="company_description"
            label="Descripción (Opcional)"
          >
            <TextArea 
              placeholder="Breve descripción de tu empresa..."
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="business_type"
            label="Tipo de Negocio"
            rules={[{ required: true, message: 'Selecciona el tipo de negocio' }]}
          >
            <Select 
              placeholder="Selecciona el tipo de negocio"
              size="large"
              options={businessTypes}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="country"
              label="País"
              rules={[{ required: true, message: 'Selecciona el país' }]}
            >
              <Select 
                prefix={<GlobalOutlined />}
                placeholder="Selecciona el país"
                size="large"
                options={countries}
              />
            </Form.Item>

            <Form.Item
              name="city"
              label="Ciudad"
              rules={[{ required: true, message: 'La ciudad es requerida' }]}
            >
              <Input 
                prefix={<EnvironmentOutlined />}
                placeholder="Ciudad"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="address"
            label="Dirección (Opcional)"
          >
            <Input 
              prefix={<EnvironmentOutlined />}
              placeholder="Dirección completa"
              size="large"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
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
              name="website"
              label="Sitio Web (Opcional)"
            >
              <Input 
                prefix={<GlobalOutlined />}
                placeholder="https://miempresa.com"
                size="large"
              />
            </Form.Item>
          </div>
        </>
      )
    },
    {
      title: 'Datos del Administrador',
      content: (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="admin_first_name"
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
              name="admin_last_name"
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
            name="admin_email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'El correo es requerido' },
              { type: 'email', message: 'Ingresa un correo válido' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="admin@miempresa.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="admin_phone"
            label="Teléfono (Opcional)"
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="+1234567890"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="admin_password"
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
            dependencies={['admin_password']}
            rules={[
              { required: true, message: 'Confirma tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('admin_password') === value) {
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
        </>
      )
    }
  ]

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registrar Nueva Empresa</h2>
        <p className="text-gray-600 mt-2">
          Crea tu cuenta empresarial para comenzar
        </p>
      </div>

      <Steps current={currentStep} className="mb-8">
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        name="tenant-register"
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <div>{steps[currentStep].content}</div>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <Button size="large" onClick={prev}>
              Anterior
            </Button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <Button type="primary" size="large" onClick={next} className="ml-auto">
              Siguiente
            </Button>
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="ml-auto"
            >
              Crear Empresa
            </Button>
          )}
        </div>
      </Form>

      <Divider>¿Ya tienes cuenta?</Divider>

      <div className="text-center space-x-4">
        <Link to="/auth/login" className="text-blue-600 hover:text-blue-500">
          Iniciar Sesión
        </Link>
        <span className="text-gray-400">|</span>
        <Link to="/auth/register" className="text-green-600 hover:text-green-500">
          Registro de Usuario
        </Link>
      </div>
    </div>
  )
}

export default TenantRegisterPage
