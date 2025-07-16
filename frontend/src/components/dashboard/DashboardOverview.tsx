import React from 'react'
import { Card, Row, Col, Statistic } from 'antd'
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  InboxOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons'

const DashboardOverview: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Ventas Hoy"
              value={1128.5}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+12.5% vs ayer</span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Órdenes"
              value={234}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+8.2% vs ayer</span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Clientes"
              value={1567}
              valueStyle={{ color: '#722ed1' }}
              prefix={<UserOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowDownOutlined style={{ color: '#cf1322', marginRight: '4px' }} />
              <span style={{ color: '#cf1322' }}>-2.1% vs ayer</span>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Productos"
              value={892}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<InboxOutlined />}
            />
            <div style={{ marginTop: '8px' }}>
              <ArrowUpOutlined style={{ color: '#3f8600', marginRight: '4px' }} />
              <span style={{ color: '#3f8600' }}>+5.7% vs ayer</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardOverview
