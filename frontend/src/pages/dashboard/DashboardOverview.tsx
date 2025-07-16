import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Space, Button } from 'antd'
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Datos de ejemplo para el dashboard
const salesData = [
  { name: 'Ene', ventas: 4000, productos: 240 },
  { name: 'Feb', ventas: 3000, productos: 139 },
  { name: 'Mar', ventas: 2000, productos: 980 },
  { name: 'Abr', ventas: 2780, productos: 390 },
  { name: 'May', ventas: 1890, productos: 480 },
  { name: 'Jun', ventas: 2390, productos: 380 },
  { name: 'Jul', ventas: 3490, productos: 430 },
]

const topProducts = [
  { key: '1', producto: 'Laptop Dell XPS 13', ventas: 156, ingresos: '$234,000', stock: 12 },
  { key: '2', producto: 'iPhone 14 Pro', ventas: 142, ingresos: '$198,600', stock: 8 },
  { key: '3', producto: 'Samsung Galaxy S23', ventas: 98, ingresos: '$147,000', stock: 15 },
  { key: '4', producto: 'MacBook Air M2', ventas: 87, ingresos: '$156,600', stock: 6 },
  { key: '5', producto: 'iPad Pro 11"', ventas: 76, ingresos: '$91,200', stock: 18 },
]

const categoryData = [
  { name: 'Electrónicos', value: 45, color: '#8884d8' },
  { name: 'Ropa', value: 25, color: '#82ca9d' },
  { name: 'Hogar', value: 20, color: '#ffc658' },
  { name: 'Deportes', value: 10, color: '#ff7300' },
]

const DashboardOverview: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'producto',
      key: 'producto',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Ventas',
      dataIndex: 'ventas',
      key: 'ventas',
      render: (value: number) => <Tag color="blue">{value}</Tag>
    },
    {
      title: 'Ingresos',
      dataIndex: 'ingresos',
      key: 'ingresos',
      render: (value: string) => <span style={{ color: '#52c41a', fontWeight: 500 }}>{value}</span>
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (value: number) => (
        <Tag color={value > 10 ? 'green' : value > 5 ? 'orange' : 'red'}>
          {value}
        </Tag>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} />
          <Button size="small" icon={<EditOutlined />} />
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: '24px', background: '#f5f5f5' }}>
      {/* Métricas principales */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Ventas Totales"
              value={125340}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+12.5% vs mes anterior</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Órdenes"
              value={1234}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+8.2% vs mes anterior</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Clientes"
              value={892}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowDownOutlined style={{ color: '#cf1322', marginRight: '4px' }} />
              <span style={{ color: '#cf1322' }}>-2.1% vs mes anterior</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Productos"
              value={567}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<InboxOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+5.7% vs mes anterior</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gráficos */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="Tendencia de Ventas" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={{ fill: '#1890ff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Ventas por Categoría" loading={loading}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px' }}>
              {categoryData.map((item, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: item.color, 
                      marginRight: '8px',
                      borderRadius: '2px'
                    }}></span>
                    {item.name}
                  </span>
                  <span style={{ fontWeight: 500 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabla de productos más vendidos */}
      <Row>
        <Col span={24}>
          <Card title="Productos Más Vendidos" loading={loading}>
            <Table
              columns={columns}
              dataSource={topProducts}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardOverview
