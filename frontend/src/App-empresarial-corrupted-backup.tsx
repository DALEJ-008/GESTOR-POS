// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import { Layout, Button, Card, Typography, Space, Row, Col, Form, Input, Checkbox, message, Menu, Table, Tag, Modal, Select, InputNumber, Statistic, Progress, Radio } from 'antd'
import { 
  HomeOutlined, 
  LoginOutlined, 
  UserAddOutlined, 
  DashboardOutlined,
  ShopOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  TrophyOutlined,
  SafetyOutlined,
  CloudOutlined,
  UserOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  CalendarOutlined,
  WarningOutlined,
  ShoppingCartOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'

const { Header, Content, Footer, Sider } = Layout
const { Title, Text, Paragraph } = Typography

// Paleta de colores personalizada
const colors = {
  primary: '#5B9279',     // Verde principal - Para elementos principales y botones
  secondary: '#E2FCEF',   // Verde claro - Para fondos y áreas destacadas
  accent: '#02A9EA',      // Azul - Para enlaces y elementos interactivos
  dark: '#373F51',        // Gris oscuro - Para textos y elementos de contraste
  light: '#FCC8C2'        // Rosa claro - Para alertas suaves y elementos decorativos
}

// Estilos personalizados
const customStyles = {
  header: {
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderBottom: 'none'
  },
  sider: {
    background: colors.dark,
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
  },
  content: {
    background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
    minHeight: 'calc(100vh - 64px)'
  },
  menuItem: {
    color: '#ffffff',
    borderRadius: '8px',
    margin: '4px 8px',
    '&:hover': {
      backgroundColor: colors.primary,
      color: '#ffffff'
    }
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: `0 2px 4px ${colors.primary}40`,
    '&:hover': {
      backgroundColor: colors.accent,
      borderColor: colors.accent
    }
  },
  card: {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.secondary}`,
    overflow: 'hidden'
  },
  cardHeader: {
    background: `linear-gradient(45deg, ${colors.secondary} 0%, #ffffff 100%)`,
    borderBottom: `2px solid ${colors.primary}`,
    color: colors.dark
  }
}

// Componente de botón personalizado
const CustomButton = ({ type = 'default', ...props }) => {
  const buttonStyle = type === 'primary' ? {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: `0 2px 4px ${colors.primary}40`,
    borderRadius: '6px',
    fontWeight: 500
  } : type === 'accent' ? {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: 'white',
    boxShadow: `0 2px 4px ${colors.accent}40`,
    borderRadius: '6px',
    fontWeight: 500
  } : type === 'danger' ? {
    backgroundColor: colors.light,
    borderColor: '#ff4d4f',
    color: '#ff4d4f',
    borderRadius: '6px'
  } : {}

  return (
    <Button 
      {...props} 
      type={type} 
      style={{ 
        ...buttonStyle, 
        ...props.style 
      }}
      onMouseEnter={(e) => {
        if (type === 'primary') {
          e.target.style.backgroundColor = colors.accent
          e.target.style.borderColor = colors.accent
        }
      }}
      onMouseLeave={(e) => {
        if (type === 'primary') {
          e.target.style.backgroundColor = colors.primary
          e.target.style.borderColor = colors.primary
        }
      }}
    />
  )
}

// Componente de Card personalizada
const CustomCard = ({ title, children, ...props }) => {
  return (
    <Card
      {...props}
      style={{
        ...customStyles.card,
        ...props.style
      }}
      title={
        <div style={customStyles.cardHeader}>
          {title}
        </div>
      }
    >
      {children}
    </Card>
  )
}

// Componente de Gráfico de Barras
const BarChart: React.FC<{ data: { label: string, value: number, color?: string }[], height?: number }> = ({ 
  data, 
  height = 250 
}) => {
  const maxValue = Math.max(...data.map(d => d.value)) || 1
  
  // Función para formatear números de manera amigable
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    } else {
      return `$${num.toFixed(0)}`
    }
  }
  
  return (
    <div style={{ 
      height: height, 
      display: 'flex', 
      alignItems: 'flex-end', 
      justifyContent: 'space-around',
      padding: '32px 48px 24px 48px', // Más padding horizontal para mejor espaciado
      backgroundColor: '#fafafa',
      borderRadius: '12px',
      border: `2px solid ${colors.secondary}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      gap: '24px' // Espaciado entre barras
    }}>
      {data.map((item, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          height: '100%',
          justifyContent: 'flex-end',
          position: 'relative',
          flex: 1, // Distribución equitativa del espacio
          maxWidth: '120px' // Ancho máximo para evitar barras muy anchas
        }}>
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '8px 16px', // Más padding para mejor legibilidad
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            border: `2px solid ${item.color || colors.primary}`,
            zIndex: 10,
            minWidth: '80px', // Ancho mínimo para consistencia
            textAlign: 'center'
          }}>
            <Text style={{
              fontSize: '16px', // Tamaño de fuente mayor
              fontWeight: 'bold',
              color: item.color || colors.primary,
              whiteSpace: 'nowrap' // Evita que el texto se envuelva
            }}>
              {formatNumber(item.value)}
            </Text>
          </div>
          <div style={{
            width: '80px', // Barras más anchas para mejor visualización
            height: `${Math.max((item.value / maxValue) * (height - 140), 30)}px`, // Más espacio para el label superior
            backgroundColor: item.color || colors.primary,
            borderRadius: '16px 16px 0 0', // Bordes más redondeados
            marginBottom: '16px', // Más espacio para el label inferior
            marginTop: '60px', // Más espacio superior para el número
            transition: 'all 0.4s ease',
            boxShadow: `0 8px 24px ${item.color || colors.primary}40`,
            cursor: 'pointer',
            transform: 'scale(1)',
            backgroundImage: `linear-gradient(45deg, ${item.color || colors.primary}, ${item.color || colors.primary}dd)`,
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = `0 12px 32px ${item.color || colors.primary}60`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = `0 8px 24px ${item.color || colors.primary}40`
          }}
          >
            {/* Brillo en la barra */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              right: '12px',
              height: '12px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '4px'
            }} />
          </div>
          <Text style={{ 
            fontSize: '15px', // Tamaño de fuente mayor
            color: colors.dark,
            textAlign: 'center',
            maxWidth: '120px', // Más ancho para acomodar el texto
            wordWrap: 'break-word',
            fontWeight: '700', // Más negrita
            lineHeight: '1.2',
            marginTop: '8px' // Espaciado superior adicional
          }}>
            {item.label}
          </Text>
        </div>
      ))}
    </div>
  )
}

// Componente de Gráfico Circular (Donut)
const DonutChart: React.FC<{ 
  data: { label: string, value: number, color: string }[], 
  size?: number 
}> = ({ data, size = 160 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  
  const radius = size / 2 - 15
  const strokeWidth = 25
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  
  // Función para formatear números de manera amigable
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    } else {
      return `$${num.toFixed(0)}`
    }
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ 
        position: 'relative',
        display: 'inline-block',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '50%',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}>
        <svg width={size} height={size}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((currentAngle / 100) * circumference)
            currentAngle += percentage
            
            return (
              <circle
                key={index}
                stroke={item.color}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                r={normalizedRadius}
                cx={size / 2}
                cy={size / 2}
                style={{
                  transition: 'stroke-dasharray 0.8s ease-in-out, stroke-width 0.3s ease',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.strokeWidth = (strokeWidth + 3).toString()
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.strokeWidth = strokeWidth.toString()
                }}
              />
            )
          })}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={normalizedRadius + strokeWidth / 2}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="2"
          />
          <text
            x={size / 2}
            y={size / 2 - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '16px', fontWeight: 'bold', fill: colors.dark }}
          >
            Total
          </text>
          <text
            x={size / 2}
            y={size / 2 + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '14px', fill: colors.primary, fontWeight: '600' }}
          >
            {formatNumber(total)}
          </text>
        </svg>
      </div>
      <div style={{ 
        marginTop: '20px',
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.secondary}`
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: `${item.color}10`,
            border: `1px solid ${item.color}30`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${item.color}20`
            e.currentTarget.style.transform = 'translateX(4px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = `${item.color}10`
            e.currentTarget.style.transform = 'translateX(0)'
          }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '18px',
                height: '18px',
                backgroundColor: item.color,
                borderRadius: '6px',
                marginRight: '12px',
                boxShadow: `0 2px 4px ${item.color}40`
              }} />
              <Text style={{ fontSize: '15px', fontWeight: '600', color: colors.dark }}>
                {item.label}
              </Text>
            </div>
            <Text strong style={{ fontSize: '15px', color: item.color, fontWeight: 'bold' }}>
              {formatNumber(item.value)}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente de Gráfico de Líneas
const LineChart: React.FC<{ 
  data: { label: string, value: number }[], 
  height?: number,
  color?: string 
}> = ({ data, height = 250, color = colors.primary }) => {
  const maxValue = Math.max(...data.map(d => d.value)) || 1
  const width = 400
  const padding = 50
  
  const points = data.map((item, index) => {
    const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
    const y = height - padding - ((item.value / maxValue) * (height - 2 * padding))
    return `${x},${y}`
  }).join(' ')
  
  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `2px solid ${colors.secondary}`,
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        {/* Grid lines horizontales */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <g key={`h-${index}`}>
            <line
              x1={padding}
              y1={height - padding - (ratio * (height - 2 * padding))}
              x2={width - padding}
              y2={height - padding - (ratio * (height - 2 * padding))}
              stroke="#e8e8e8"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={padding - 15}
              y={height - padding - (ratio * (height - 2 * padding)) + 4}
              textAnchor="end"
              style={{ 
                fontSize: '12px', 
                fill: '#666',
                fontWeight: '500',
                transform: 'rotate(0deg)',
                transformOrigin: 'center'
              }}
            >
              ${(maxValue * ratio / 1000).toFixed(1)}K
            </text>
          </g>
        ))}
        
        {/* Grid lines verticales */}
        {data.map((item, index) => {
          const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
          return (
            <line
              key={`v-${index}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#f0f0f0"
              strokeWidth="1"
            />
          )
        })}
        
        {/* Área bajo la línea */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: color, stopOpacity: 0.3}} />
            <stop offset="100%" style={{stopColor: color, stopOpacity: 0.05}} />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#areaGradient)"
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
        />
        
        {/* Línea principal */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          points={points}
          style={{ 
            filter: `drop-shadow(0 2px 4px ${color}40)`,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }}
        />
        
        {/* Puntos de datos */}
        {data.map((item, index) => {
          const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
          const y = height - padding - ((item.value / maxValue) * (height - 2 * padding))
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill="white"
                stroke={color}
                strokeWidth="3"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('r', '8')
                  e.currentTarget.style.filter = `drop-shadow(0 4px 8px ${color}60)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('r', '6')
                  e.currentTarget.style.filter = 'none'
                }}
              />
              {/* Tooltip en hover */}
              <g style={{ opacity: 0, transition: 'opacity 0.3s ease' }}>
                <rect
                  x={x - 25}
                  y={y - 35}
                  width="50"
                  height="25"
                  fill="white"
                  stroke={color}
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x={x}
                  y={y - 18}
                  textAnchor="middle"
                  style={{ 
                    fontSize: '13px', 
                    fill: color, 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  ${item.value >= 1000 ? `${(item.value/1000).toFixed(1)}K` : item.value.toFixed(0)}
                </text>
              </g>
            </g>
          )
        })}
        
        {/* Labels del eje X */}
        {data.map((item, index) => {
          const x = padding + (index * (width - 2 * padding)) / (data.length - 1)
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              style={{ 
                fontSize: '13px', 
                fill: colors.dark, 
                fontWeight: '600',
                transform: 'rotate(0deg)',
                transformOrigin: `${x}px ${height - 10}px`
              }}
            >
              {item.label.length > 8 ? item.label.substring(0, 8) + '...' : item.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// Componente avanzado de Reportes
const ReportesAvanzados: React.FC<{ ventas: any[], gastos: any[], compras: any[] }> = ({ ventas, gastos, compras }) => {
  return (
    <div>
      <Title level={2} style={{ color: colors.dark }}>
        <BarChartOutlined style={{ marginRight: '12px', color: colors.primary }} />
        Reportes y Analytics Empresariales
      </Title>
      
      {/* Métricas Principales Dashboard */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        {/* Resumen de Ventas */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            ...customStyles.card,
            background: `linear-gradient(135deg, ${colors.primary}20 0%, #ffffff 100%)`
          }}>
            <Statistic
              title="💰 Ventas Hoy"
              value={(() => {
                const ventasHoy = ventas.filter(venta => {
                  const fechaVenta = new Date(venta.fecha).toDateString()
                  const hoy = new Date().toDateString()
                  return fechaVenta === hoy
                })
                return ventasHoy.reduce((sum, venta) => sum + venta.total, 0)
              })()}
              precision={2}
              prefix="$"
              valueStyle={{ color: colors.primary }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length} transacciones
            </Text>
          </Card>
        </Col>

        {/* Resumen de Gastos */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            ...customStyles.card,
            background: `linear-gradient(135deg, ${colors.light}40 0%, #ffffff 100%)`
          }}>
            <Statistic
              title="💸 Gastos Hoy"
              value={(() => {
                const gastosHoy = gastos.filter(gasto => {
                  const fechaGasto = new Date(gasto.fecha).toDateString()
                  const hoy = new Date().toDateString()
                  return fechaGasto === hoy
                })
                return gastosHoy.reduce((sum, gasto) => sum + gasto.monto, 0)
              })()}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString()).length} gastos registrados
            </Text>
          </Card>
        </Col>

        {/* Resumen de Compras */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            ...customStyles.card,
            background: `linear-gradient(135deg, ${colors.accent}20 0%, #ffffff 100%)`
          }}>
            <Statistic
              title="🛒 Compras Hoy"
              value={(() => {
                const comprasHoy = compras.filter(compra => {
                  const fechaCompra = new Date(compra.fecha).toDateString()
                  const hoy = new Date().toDateString()
                  return fechaCompra === hoy
                })
                return comprasHoy.reduce((sum, compra) => sum + compra.total, 0)
              })()}
              precision={2}
              prefix="$"
              valueStyle={{ color: colors.accent }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {compras.filter(c => new Date(c.fecha).toDateString() === new Date().toDateString()).length} compras realizadas
            </Text>
          </Card>
        </Col>

        {/* Utilidad del Día */}
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ 
            ...customStyles.card,
            background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`
          }}>
            <Statistic
              title="📊 Utilidad Hoy"
              value={(() => {
                const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, venta) => sum + venta.total, 0)
                const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, gasto) => sum + gasto.monto, 0)
                const comprasHoy = compras.filter(c => new Date(c.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, compra) => sum + compra.total, 0)
                return ventasHoy - gastosHoy - comprasHoy
              })()}
              precision={2}
              prefix="$"
              valueStyle={{ 
                color: (() => {
                  const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                    .reduce((sum, venta) => sum + venta.total, 0)
                  const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                    .reduce((sum, gasto) => sum + gasto.monto, 0)
                  const comprasHoy = compras.filter(c => new Date(c.fecha).toDateString() === new Date().toDateString())
                    .reduce((sum, compra) => sum + compra.total, 0)
                  return (ventasHoy - gastosHoy - comprasHoy) >= 0 ? colors.primary : '#ff4d4f'
                })()
              }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {(() => {
                const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, venta) => sum + venta.total, 0)
                const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, gasto) => sum + gasto.monto, 0)
                const comprasHoy = compras.filter(c => new Date(c.fecha).toDateString() === new Date().toDateString())
                  .reduce((sum, compra) => sum + compra.total, 0)
                return (ventasHoy - gastosHoy - comprasHoy) >= 0 ? 'Ganancia positiva' : 'Pérdida del día'
              })()}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Gráfico Principal de Tendencias - Pantalla Completa */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  📈 Tendencias de Ventas - Últimos 7 Días
                </span>
                <div style={{ 
                  background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {(() => {
                    const ventasMes = ventas.filter(venta => {
                      const fechaVenta = new Date(venta.fecha)
                      const ahora = new Date()
                      return fechaVenta.getMonth() === ahora.getMonth() && 
                             fechaVenta.getFullYear() === ahora.getFullYear()
                    })
                    const total = ventasMes.reduce((sum, venta) => sum + venta.total, 0)
                    if (total >= 1000000) {
                      return `$${(total / 1000000).toFixed(1)}M este mes`
                    } else if (total >= 1000) {
                      return `$${(total / 1000).toFixed(1)}K este mes`
                    } else {
                      return `$${total.toFixed(0)} este mes`
                    }
                  })()}
                </div>
              </div>
            }
            style={{
              ...customStyles.card,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              minHeight: '400px'
            }}
            headStyle={{
              ...customStyles.cardHeader,
              background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
              borderBottom: `3px solid ${colors.primary}`
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <div style={{ height: '320px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {ventas.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#8c8c8c',
                  fontSize: '16px'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    opacity: 0.5
                  }}>
                    📊
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Aún no hay datos de ventas registradas
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    Las tendencias aparecerán cuando realices tu primera venta
                  </div>
                </div>
              ) : (
                <LineChart
                  data={(() => {
                    const ultimosDias = []
                    for (let i = 6; i >= 0; i--) {
                      const fecha = new Date()
                      fecha.setDate(fecha.getDate() - i)
                      const ventasDia = ventas.filter(venta => {
                        const fechaVenta = new Date(venta.fecha).toDateString()
                        return fechaVenta === fecha.toDateString()
                      })
                      const totalDia = ventasDia.reduce((sum, venta) => sum + venta.total, 0)
                      ultimosDias.push({
                        label: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
                        value: totalDia
                      })
                    }
                    return ultimosDias
                  })()}
                  height={300}
                  color={colors.primary}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sección de Gráficos de Gastos y Compras */}
      <Row gutter={[32, 32]}>
        {/* Gráfico de Gastos por Categoría */}
        <Col xs={24} xl={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  💸 Distribución de Gastos
                </span>
                <div style={{ 
                  background: 'linear-gradient(45deg, #ff4d4f, #ff7875)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {(() => {
                    const gastosMes = gastos.filter(gasto => {
                      const fechaGasto = new Date(gasto.fecha)
                      const ahora = new Date()
                      return fechaGasto.getMonth() === ahora.getMonth() && 
                             fechaGasto.getFullYear() === ahora.getFullYear()
                    })
                    const total = gastosMes.reduce((sum, gasto) => sum + gasto.monto, 0)
                    if (total >= 1000000) {
                      return `$${(total / 1000000).toFixed(1)}M este mes`
                    } else if (total >= 1000) {
                      return `$${(total / 1000).toFixed(1)}K este mes`
                    } else {
                      return `$${total.toFixed(0)} este mes`
                    }
                  })()}
                </div>
              </div>
            }
            style={{
              ...customStyles.card,
              background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
              minHeight: '500px'
            }}
            headStyle={{
              ...customStyles.cardHeader,
              background: 'linear-gradient(135deg, #fff2f0 0%, #ffffff 100%)',
              borderBottom: '3px solid #ff4d4f'
            }}
            bodyStyle={{ padding: '24px', textAlign: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              {gastos.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#8c8c8c',
                  fontSize: '16px'
                }}>
                  <div style={{ 
                    fontSize: '48px', 
                    marginBottom: '16px',
                    opacity: 0.5
                  }}>
                    💸
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Aún no hay gastos registrados
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    La distribución de gastos aparecerá cuando registres el primer gasto
                  </div>
                </div>
              ) : (
                <DonutChart
                  data={(() => {
                    const gastosPorCategoria = {}
                    gastos.forEach(gasto => {
                      if (gastosPorCategoria[gasto.categoria]) {
                        gastosPorCategoria[gasto.categoria] += gasto.monto
                      } else {
                        gastosPorCategoria[gasto.categoria] = gasto.monto
                      }
                    })
                    const coloresCategoria = ['#ff4d4f', '#ff7875', '#ffadd6', '#d3adf7', '#b7eb8f']
                    return Object.entries(gastosPorCategoria).map(([categoria, monto], index) => ({
                      label: categoria,
                      value: monto,
                      color: coloresCategoria[index % coloresCategoria.length]
                    }))
                  })()}
                  size={220}
                />
              )}
            </div>
          </Card>
        </Col>

        {/* Gráfico de Compras por Proveedor */}
        <Col xs={24} xl={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  🛒 Ranking de Proveedores
                </span>
                <div style={{ 
                  background: `linear-gradient(45deg, ${colors.accent}, #40a9ff)`,
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {(() => {
                    const comprasMes = compras.filter(compra => {
                      const fechaCompra = new Date(compra.fecha)
                      const ahora = new Date()
                      return fechaCompra.getMonth() === ahora.getMonth() && 
                             fechaCompra.getFullYear() === ahora.getFullYear()
                    })
                    const total = comprasMes.reduce((sum, compra) => sum + compra.total, 0)
                    if (total >= 1000000) {
                      return `$${(total / 1000000).toFixed(1)}M este mes`
                    } else if (total >= 1000) {
                      return `$${(total / 1000).toFixed(1)}K este mes`
                    } else {
                      return `$${total.toFixed(0)} este mes`
                    }
                  })()}
                </div>
              </div>
            }
            style={{
              ...customStyles.card,
              background: `linear-gradient(135deg, ${colors.accent}10 0%, #ffffff 100%)`,
              minHeight: '500px'
            }}
            headStyle={{
              ...customStyles.cardHeader,
              background: `linear-gradient(135deg, ${colors.accent}20 0%, #ffffff 100%)`,
              borderBottom: `3px solid ${colors.accent}`
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {compras.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                    No hay compras registradas
                  </div>
                  <div style={{ fontSize: '14px', color: '#bfbfbf' }}>
                    Las compras registradas aparecerán aquí organizadas por proveedor
                  </div>
                </div>
              ) : (
                <BarChart
                  data={(() => {
                    const comprasPorProveedor = {}
                    compras.forEach(compra => {
                      if (comprasPorProveedor[compra.proveedor]) {
                        comprasPorProveedor[compra.proveedor] += compra.total
                      } else {
                        comprasPorProveedor[compra.proveedor] = compra.total
                      }
                    })
                    const coloresProveedores = [colors.accent, colors.primary, '#52c41a', '#faad14', '#722ed1']
                    return Object.entries(comprasPorProveedor)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([proveedor, total], index) => ({
                        label: proveedor.length > 12 ? proveedor.substring(0, 10) + '..' : proveedor,
                        value: total,
                        color: coloresProveedores[index % coloresProveedores.length]
                      }))
                  })()}
                  height={350}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gráfico de Comparación Financiera - Pantalla Completa */}
      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  💰 Comparación Financiera del Mes
                </span>
                <div style={{ 
                  background: (() => {
                    const ingresos = ventas.filter(v => {
                      const fecha = new Date(v.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, v) => sum + v.total, 0)
                    
                    const gastosMes = gastos.filter(g => {
                      const fecha = new Date(g.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, g) => sum + g.monto, 0)
                    
                    const comprasMes = compras.filter(c => {
                      const fecha = new Date(c.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, c) => sum + c.total, 0)
                    
                    return (ingresos - gastosMes - comprasMes) >= 0 
                      ? `linear-gradient(45deg, ${colors.primary}, #52c41a)`
                      : 'linear-gradient(45deg, #ff4d4f, #ff7875)'
                  })(),
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  Utilidad: {(() => {
                    const ingresos = ventas.filter(v => {
                      const fecha = new Date(v.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, v) => sum + v.total, 0)
                    
                    const gastosMes = gastos.filter(g => {
                      const fecha = new Date(g.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, g) => sum + g.monto, 0)
                    
                    const comprasMes = compras.filter(c => {
                      const fecha = new Date(c.fecha)
                      const ahora = new Date()
                      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                    }).reduce((sum, c) => sum + c.total, 0)
                    
                    const utilidad = ingresos - gastosMes - comprasMes
                    if (utilidad >= 1000000) {
                      return `$${(utilidad / 1000000).toFixed(1)}M`
                    } else if (utilidad >= 1000) {
                      return `$${(utilidad / 1000).toFixed(1)}K`
                    } else {
                      return `$${utilidad.toFixed(0)}`
                    }
                  })()}
                </div>
              </div>
            }
            style={{
              ...customStyles.card,
              background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
              minHeight: '450px'
            }}
            headStyle={{
              ...customStyles.cardHeader,
              background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
              borderBottom: `3px solid ${colors.primary}`
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart
                data={[
                  {
                    label: 'Ventas',
                    value: (() => {
                      const ventasMes = ventas.filter(venta => {
                        const fechaVenta = new Date(venta.fecha)
                        const ahora = new Date()
                        return fechaVenta.getMonth() === ahora.getMonth() && 
                               fechaVenta.getFullYear() === ahora.getFullYear()
                      })
                      return ventasMes.reduce((sum, venta) => sum + venta.total, 0)
                    })(),
                    color: colors.primary
                  },
                  {
                    label: 'Gastos',
                    value: (() => {
                      const gastosMes = gastos.filter(gasto => {
                        const fechaGasto = new Date(gasto.fecha)
                        const ahora = new Date()
                        return fechaGasto.getMonth() === ahora.getMonth() && 
                               fechaGasto.getFullYear() === ahora.getFullYear()
                      })
                      return gastosMes.reduce((sum, gasto) => sum + gasto.monto, 0)
                    })(),
                    color: '#ff4d4f'
                  },
                  {
                    label: 'Compras',
                    value: (() => {
                      const comprasMes = compras.filter(compra => {
                        const fechaCompra = new Date(compra.fecha)
                        const ahora = new Date()
                        return fechaCompra.getMonth() === ahora.getMonth() && 
                               fechaCompra.getFullYear() === ahora.getFullYear()
                      })
                      return comprasMes.reduce((sum, compra) => sum + compra.total, 0)
                    })(),
                    color: colors.accent
                  }
                ]}
                height={320}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Top Productos - Sección adicional */}
      <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
        <Col span={24}>
          <Card 
            title={
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                🏆 Top Productos Más Vendidos
              </span>
            }
            style={{
              ...customStyles.card,
              background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
            }}
            headStyle={{
              ...customStyles.cardHeader,
              background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)',
              borderBottom: '3px solid #52c41a'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              {(() => {
                const productosVendidos = {}
                ventas.forEach(venta => {
                  venta.items.forEach(item => {
                    if (productosVendidos[item.nombre]) {
                      productosVendidos[item.nombre] += item.cantidad
                    } else {
                      productosVendidos[item.nombre] = item.cantidad
                    }
                  })
                })
                const topProductos = Object.entries(productosVendidos)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                
                if (topProductos.length === 0) {
                  return (
                    <Col span={24}>
                      <div style={{ 
                        textAlign: 'center', 
                        color: '#8c8c8c',
                        fontSize: '16px',
                        padding: '40px 20px'
                      }}>
                        <div style={{ 
                          fontSize: '48px', 
                          marginBottom: '16px',
                          opacity: 0.5
                        }}>
                          🏆
                        </div>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                          Aún no hay productos vendidos
                        </div>
                        <div style={{ fontSize: '14px' }}>
                          Los productos más vendidos aparecerán cuando realices ventas
                        </div>
                      </div>
                    </Col>
                  )
                }
                
                return topProductos.map(([producto, cantidad], index) => (
                  <Col xs={24} sm={12} lg={8} xl={4} key={index}>
                    <div style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '2px solid #52c41a',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(82, 196, 26, 0.25)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.15)'
                    }}
                    >
                      <div style={{
                        background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        #{index + 1}
                      </div>
                      <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                        {producto}
                      </Text>
                      <Text style={{ fontSize: '16px', color: '#52c41a', fontWeight: 'bold' }}>
                        {cantidad} vendidos
                      </Text>
                    </div>
                  </Col>
                ))
              })()}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Análisis Financiero */}
      <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title="📈 Análisis Financiero Mensual"
            style={customStyles.card}
            headStyle={customStyles.cardHeader}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Text type="secondary">Ingresos Totales</Text>
                  <div style={{ fontSize: '24px', color: colors.primary, fontWeight: 'bold' }}>
                    ${(() => {
                      const ventasMes = ventas.filter(venta => {
                        const fechaVenta = new Date(venta.fecha)
                        const ahora = new Date()
                        return fechaVenta.getMonth() === ahora.getMonth() && 
                               fechaVenta.getFullYear() === ahora.getFullYear()
                      })
                      return ventasMes.reduce((sum, venta) => sum + venta.total, 0).toFixed(2)
                    })()}
                  </div>
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <Text type="secondary">Utilidad Neta</Text>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: (() => {
                      const ingresos = ventas.filter(v => {
                        const fecha = new Date(v.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, v) => sum + v.total, 0)
                      
                      const gastosMes = gastos.filter(g => {
                        const fecha = new Date(g.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, g) => sum + g.monto, 0)
                      
                      const comprasMes = compras.filter(c => {
                        const fecha = new Date(c.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, c) => sum + c.total, 0)
                      
                      return (ingresos - gastosMes - comprasMes) >= 0 ? colors.primary : '#ff4d4f'
                    })()
                  }}>
                    ${(() => {
                      const ingresos = ventas.filter(v => {
                        const fecha = new Date(v.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, v) => sum + v.total, 0)
                      
                      const gastosMes = gastos.filter(g => {
                        const fecha = new Date(g.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, g) => sum + g.monto, 0)
                      
                      const comprasMes = compras.filter(c => {
                        const fecha = new Date(c.fecha)
                        const ahora = new Date()
                        return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                      }).reduce((sum, c) => sum + c.total, 0)
                      
                      return (ingresos - gastosMes - comprasMes).toFixed(2)
                    })()}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// Estado de autenticación funcional
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('gestor_authenticated') === 'true'
  })
  
  const login = (email: string, password: string) => {
    // Simulación de login (en producción sería una llamada a API)
    if (email && password) {
      setIsAuthenticated(true)
      localStorage.setItem('gestor_authenticated', 'true')
      localStorage.setItem('gestor_user', email)
      return true
    }
    return false
  }
  
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('gestor_authenticated')
    localStorage.removeItem('gestor_user')
    window.location.href = '/'
  }
  
  return { isAuthenticated, login, logout }
}

// Header empresarial mejorado
const AppHeader: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <Header style={{ 
      background: '#001529', 
      padding: '0 50px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '32px' }}>
          <ShopOutlined style={{ fontSize: '28px', color: '#1890ff', marginRight: '12px' }} />
          <Title level={3} style={{ color: 'white', margin: 0, fontWeight: 600 }}>
            Gestor POS
          </Title>
        </div>
        <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
          {currentPage}
        </Text>
      </div>
      
      <Space size="large">
        {!isAuthenticated ? (
          <>
            <Button 
              type="text" 
              icon={<HomeOutlined />}
              style={{ color: 'rgba(255,255,255,0.85)', border: 'none' }}
              onClick={() => window.location.href = '/'}
            >
              Inicio
            </Button>
            <Button 
              type="text" 
              icon={<LoginOutlined />}
              style={{ color: 'rgba(255,255,255,0.85)', border: 'none' }}
              onClick={() => window.location.href = '/auth/login'}
            >
              Iniciar Sesión
            </Button>
            <Button 
              type="primary"
              icon={<UserAddOutlined />}
              style={{ borderRadius: '6px', fontWeight: 500 }}
              onClick={() => window.location.href = '/auth/register'}
            >
              Registrarse
            </Button>
          </>
        ) : (
          <>
            <Button 
              type="text" 
              icon={<DashboardOutlined />}
              style={{ color: 'rgba(255,255,255,0.85)', border: 'none' }}
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              style={{ color: 'rgba(255,255,255,0.85)', border: 'none' }}
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </>
        )}
      </Space>
    </Header>
  )
}

// HomePage component removed to clean TypeScript warnings

// Página de login empresarial con formulario funcional
const LoginPage: React.FC<{ onLogin: (email: string, password: string) => boolean; onIrARegistro: () => void }> = ({ onLogin, onIrARegistro }) => {
  const [loading, setLoading] = React.useState(false)

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true)
    
    try {
      // Simulación de delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const success = onLogin(values.email, values.password)
      
      if (success) {
        message.success('¡Inicio de sesión exitoso!')
      } else {
        message.error('Credenciales incorrectas')
      }
    } catch (error) {
      message.error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
    message.error('Por favor completa todos los campos requeridos')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '450px', 
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <LoginOutlined style={{ fontSize: '56px', color: '#1890ff', marginBottom: '24px' }} />
          <Title level={2} style={{ marginBottom: '8px' }}>Iniciar Sesión</Title>
          <Text style={{ color: '#666' }}>Accede a tu cuenta empresarial</Text>
        </div>
        
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Formato de email inválido' }
            ]}
          >
            <Input 
              placeholder="ejemplo@empresa.com"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa tu contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password 
              placeholder="Tu contraseña"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recordar sesión</Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block 
              style={{ 
                height: '48px', 
                borderRadius: '6px', 
                fontSize: '16px', 
                fontWeight: 500 
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Form.Item>
        </Form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text style={{ color: '#666' }}>
            ¿No tienes cuenta? {' '}
            <Button 
              type="link" 
              onClick={onIrARegistro}
              style={{ padding: 0, fontSize: '14px' }}
            >
              Regístrate aquí
            </Button>
          </Text>
        </div>
        
        {/* Credenciales de prueba */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #e6f7ff'
        }}>
          <Text strong style={{ color: '#1890ff', fontSize: '12px' }}>
            CREDENCIALES DE PRUEBA:
          </Text>
          <br />
          <Text style={{ fontSize: '12px', color: '#666' }}>
            Email: admin@gestor.com<br />
            Contraseña: 123456
          </Text>
        </div>
      </Card>
    </div>
  )
}

// Componente de Registro
const RegistroPage = ({ onRegistroExitoso }: { onRegistroExitoso: () => void }) => {
  const [form] = Form.useForm()
  const [tipoRegistro, setTipoRegistro] = React.useState<'persona' | 'empresa'>('persona')
  const [loading, setLoading] = React.useState(false)

  const handleRegistro = async (values: any) => {
    setLoading(true)
    try {
      // Simulación de registro (en producción sería una llamada a API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Datos de registro:', { ...values, tipo: tipoRegistro })
      
      // Guardar datos en localStorage (simulación)
      const datosRegistro = {
        ...values,
        tipo: tipoRegistro,
        fechaRegistro: new Date().toISOString(),
        id: Date.now().toString()
      }
      
      const registrosExistentes = JSON.parse(localStorage.getItem('gestor_registros') || '[]')
      registrosExistentes.push(datosRegistro)
      localStorage.setItem('gestor_registros', JSON.stringify(registrosExistentes))
      
      message.success('Registro exitoso! Ahora puedes iniciar sesión')
      onRegistroExitoso()
    } catch (error) {
      message.error('Error en el registro. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '600px',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            <UserAddOutlined style={{ marginRight: '12px' }} />
            Registro en Gestor POS
          </Title>
          <Text style={{ color: '#666', fontSize: '16px' }}>
            Crea tu cuenta para gestionar tu negocio
          </Text>
        </div>

        {/* Selector de tipo de registro */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <Text strong style={{ marginRight: '16px' }}>Tipo de registro:</Text>
          <Button.Group>
            <Button 
              type={tipoRegistro === 'persona' ? 'primary' : 'default'}
              onClick={() => setTipoRegistro('persona')}
              icon={<UserOutlined />}
            >
              Persona
            </Button>
            <Button 
              type={tipoRegistro === 'empresa' ? 'primary' : 'default'}
              onClick={() => setTipoRegistro('empresa')}
              icon={<TeamOutlined />}
            >
              Empresa
            </Button>
          </Button.Group>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegistro}
          autoComplete="off"
        >
          {tipoRegistro === 'persona' ? (
            // Formulario para Persona
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: 'El nombre es requerido' }]}
                  >
                    <Input placeholder="Ej: Juan" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="apellidos"
                    label="Apellidos"
                    rules={[{ required: true, message: 'Los apellidos son requeridos' }]}
                  >
                    <Input placeholder="Ej: Pérez García" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="documento"
                label="Documento de Identidad"
                rules={[{ required: true, message: 'El documento es requerido' }]}
              >
                <Input placeholder="Ej: 12345678A" />
              </Form.Item>
            </>
          ) : (
            // Formulario para Empresa
            <>
              <Form.Item
                name="razonSocial"
                label="Razón Social"
                rules={[{ required: true, message: 'La razón social es requerida' }]}
              >
                <Input placeholder="Ej: Mi Empresa S.L." />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="cif"
                    label="CIF/NIT"
                    rules={[{ required: true, message: 'El CIF/NIT es requerido' }]}
                  >
                    <Input placeholder="Ej: B12345678" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sector"
                    label="Sector"
                    rules={[{ required: true, message: 'El sector es requerido' }]}
                  >
                    <Select placeholder="Seleccionar sector">
                      <Select.Option value="retail">Retail/Comercio</Select.Option>
                      <Select.Option value="servicios">Servicios</Select.Option>
                      <Select.Option value="tecnologia">Tecnología</Select.Option>
                      <Select.Option value="alimentacion">Alimentación</Select.Option>
                      <Select.Option value="moda">Moda</Select.Option>
                      <Select.Option value="otros">Otros</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="representante"
                label="Representante Legal"
                rules={[{ required: true, message: 'El representante es requerido' }]}
              >
                <Input placeholder="Ej: Juan Pérez García" />
              </Form.Item>
            </>
          )}

          {/* Campos comunes */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'El email es requerido' },
              { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input placeholder="ejemplo@email.com" />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            rules={[{ required: true, message: 'El teléfono es requerido' }]}
          >
            <Input placeholder="+34 123 456 789" />
          </Form.Item>

          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: 'La dirección es requerida' }]}
          >
            <Input.TextArea 
              placeholder="Dirección completa"
              rows={3}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                  { required: true, message: 'La contraseña es requerida' },
                  { min: 6, message: 'Mínimo 6 caracteres' }
                ]}
              >
                <Input.Password placeholder="Contraseña" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
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
                <Input.Password placeholder="Confirmar contraseña" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="aceptaTerminos"
            valuePropName="checked"
            rules={[
              { required: true, message: 'Debes aceptar los términos y condiciones' }
            ]}
          >
            <Checkbox>
              Acepto los <a href="#terms">términos y condiciones</a> y la <a href="#privacy">política de privacidad</a>
            </Checkbox>
          </Form.Item>

          <Form.Item
            name="recibirNoticias"
            valuePropName="checked"
          >
            <Checkbox>
              Quiero recibir noticias y actualizaciones por email
            </Checkbox>
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              block
              style={{ height: '48px', fontSize: '16px' }}
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              ¿Ya tienes cuenta? {' '}
              <Button type="link" onClick={onRegistroExitoso} style={{ padding: 0 }}>
                Iniciar Sesión
              </Button>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

// Componente separado para Configuración
const ConfiguracionModule: React.FC = () => {
  // Configuración de la Empresa
  const [configEmpresa, setConfigEmpresa] = React.useState(() => {
    const config = localStorage.getItem('gestor_config_empresa')
    return config ? JSON.parse(config) : {
      nombre: 'Mi Empresa',
      ruc: '12345678901',
      direccion: 'Av. Principal 123',
      telefono: '+1 234 567 8900',
      email: 'contacto@miempresa.com',
      logo: '',
      eslogan: 'Tu socio comercial de confianza'
    }
  })
  
  const [editandoEmpresa, setEditandoEmpresa] = React.useState(false)
  const [formEmpresa] = Form.useForm()
  
  // Configuración del Sistema
  const [configSistema, setConfigSistema] = React.useState(() => {
    const config = localStorage.getItem('gestor_config_sistema')
    return config ? JSON.parse(config) : {
      moneda: 'USD',
      impuesto: 18,
      decimales: 2,
      formatoFecha: 'DD/MM/YYYY',
      codigoFactura: 'F-',
      stockMinimo: 5,
      notificacionStock: true
    }
  })
  
  // Configuración de Impresión
  const [configImpresion, setConfigImpresion] = React.useState(() => {
    const config = localStorage.getItem('gestor_config_impresion')
    return config ? JSON.parse(config) : {
      tamañoPapel: 'A4',
      margen: 10,
      incluirLogo: true,
      piePagina: 'Gracias por su preferencia',
      autoimprimir: false,
      impresora: 'default'
    }
  })
  
  return (
    <div>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
        Configuración del Sistema
      </Title>
      
      {/* Configuración de la Empresa */}
      <Card 
        title="🏢 Información de la Empresa" 
        style={{ 
          marginBottom: '24px',
          ...customStyles.card
        }}
        headStyle={customStyles.cardHeader}
      >
        {!editandoEmpresa ? (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Nombre de la Empresa:</Text>
                  <br />
                  <Text>{configEmpresa.nombre}</Text>
                </div>
                <div>
                  <Text strong>RUC/NIT:</Text>
                  <br />
                  <Text>{configEmpresa.ruc}</Text>
                </div>
                <div>
                  <Text strong>Dirección:</Text>
                  <br />
                  <Text>{configEmpresa.direccion}</Text>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Teléfono:</Text>
                  <br />
                  <Text>{configEmpresa.telefono}</Text>
                </div>
                <div>
                  <Text strong>Email:</Text>
                  <br />
                  <Text>{configEmpresa.email}</Text>
                </div>
                <div>
                  <Text strong>Eslogan:</Text>
                  <br />
                  <Text>{configEmpresa.eslogan}</Text>
                </div>
              </Space>
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  boxShadow: `0 2px 4px ${colors.primary}40`,
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.accent
                  e.target.style.borderColor = colors.accent
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.primary
                  e.target.style.borderColor = colors.primary
                }}
                onClick={() => {
                  setEditandoEmpresa(true)
                  formEmpresa.setFieldsValue(configEmpresa)
                }}
              >
                Editar Información
              </Button>
            </Col>
          </Row>
        ) : (
          <Form
            form={formEmpresa}
            layout="vertical"
            onFinish={(values) => {
              const nuevaConfig = { ...configEmpresa, ...values }
              setConfigEmpresa(nuevaConfig)
              localStorage.setItem('gestor_config_empresa', JSON.stringify(nuevaConfig))
              setEditandoEmpresa(false)
              message.success('Información de empresa actualizada')
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Nombre de la Empresa"
                  name="nombre"
                  rules={[{ required: true, message: 'Ingrese el nombre de la empresa' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="RUC/NIT"
                  name="ruc"
                  rules={[{ required: true, message: 'Ingrese el RUC/NIT' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Dirección"
                  name="direccion"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Teléfono"
                  name="telefono"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ type: 'email', message: 'Ingrese un email válido' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Eslogan"
                  name="eslogan"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Guardar Cambios
                  </Button>
                  <Button onClick={() => setEditandoEmpresa(false)}>
                    Cancelar
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        )}
      </Card>

      <Row gutter={[16, 16]}>
        {/* Configuración del Sistema */}
        <Col xs={24} lg={12}>
          <Card 
            title="⚙️ Configuración del Sistema"
            style={customStyles.card}
            headStyle={customStyles.cardHeader}
          >
            <Form
              layout="vertical"
              initialValues={configSistema}
              onValuesChange={(changedValues, allValues) => {
                const nuevaConfig = { ...configSistema, ...allValues }
                setConfigSistema(nuevaConfig)
                localStorage.setItem('gestor_config_sistema', JSON.stringify(nuevaConfig))
                message.success('Configuración actualizada')
              }}
            >
              <Form.Item
                label="Moneda"
                name="moneda"
              >
                <Select>
                  <Select.Option value="USD">USD - Dólar</Select.Option>
                  <Select.Option value="EUR">EUR - Euro</Select.Option>
                  <Select.Option value="PEN">PEN - Sol</Select.Option>
                  <Select.Option value="COP">COP - Peso Colombiano</Select.Option>
                  <Select.Option value="MXN">MXN - Peso Mexicano</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Impuesto (%)"
                name="impuesto"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                label="Decimales en Precios"
                name="decimales"
              >
                <Select>
                  <Select.Option value={0}>Sin decimales</Select.Option>
                  <Select.Option value={2}>2 decimales</Select.Option>
                  <Select.Option value={3}>3 decimales</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Prefijo de Factura"
                name="codigoFactura"
              >
                <Input placeholder="F-" />
              </Form.Item>
              
              <Form.Item
                label="Stock Mínimo (Alerta)"
                name="stockMinimo"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                name="notificacionStock"
                valuePropName="checked"
              >
                <Checkbox>Notificar cuando el stock esté bajo</Checkbox>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Configuración de Impresión */}
        <Col xs={24} lg={12}>
          <Card 
            title="🖨️ Configuración de Impresión"
            style={customStyles.card}
            headStyle={customStyles.cardHeader}
          >
            <Form
              layout="vertical"
              initialValues={configImpresion}
              onValuesChange={(changedValues, allValues) => {
                const nuevaConfig = { ...configImpresion, ...allValues }
                setConfigImpresion(nuevaConfig)
                localStorage.setItem('gestor_config_impresion', JSON.stringify(nuevaConfig))
                message.success('Configuración de impresión actualizada')
              }}
            >
              <Form.Item
                label="Tamaño de Papel"
                name="tamañoPapel"
              >
                <Select>
                  <Select.Option value="A4">A4</Select.Option>
                  <Select.Option value="Carta">Carta</Select.Option>
                  <Select.Option value="Ticket">Ticket (58mm)</Select.Option>
                  <Select.Option value="Ticket80">Ticket (80mm)</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                label="Margen (mm)"
                name="margen"
              >
                <InputNumber min={0} max={50} style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item
                label="Pie de Página"
                name="piePagina"
              >
                <Input.TextArea rows={2} />
              </Form.Item>
              
              <Form.Item
                name="incluirLogo"
                valuePropName="checked"
              >
                <Checkbox>Incluir logo en impresiones</Checkbox>
              </Form.Item>
              
              <Form.Item
                name="autoimprimir"
                valuePropName="checked"
              >
                <Checkbox>Auto-imprimir facturas al crearlas</Checkbox>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Configuración de Datos y Respaldo */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={12}>
          <Card 
            title="💾 Datos y Respaldo"
            style={customStyles.card}
            headStyle={customStyles.cardHeader}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>Exportar Todos los Datos</Text>
                <br />
                <Text type="secondary">Descarga un respaldo completo de todos los datos del sistema</Text>
                <br />
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  style={{ 
                    marginTop: '8px',
                    backgroundColor: colors.accent,
                    borderColor: colors.accent,
                    boxShadow: `0 2px 4px ${colors.accent}40`,
                    borderRadius: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primary
                    e.target.style.borderColor = colors.primary
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.accent
                    e.target.style.borderColor = colors.accent
                  }}
                  onClick={() => {
                    const datos = {
                      productos: JSON.parse(localStorage.getItem('gestor_productos') || '[]'),
                      clientes: JSON.parse(localStorage.getItem('gestor_clientes') || '[]'),
                      proveedores: JSON.parse(localStorage.getItem('gestor_proveedores') || '[]'),
                      ventas: JSON.parse(localStorage.getItem('gestor_ventas') || '[]'),
                      facturas: JSON.parse(localStorage.getItem('gestor_facturas') || '[]'),
                      configuracion: {
                        empresa: JSON.parse(localStorage.getItem('gestor_config_empresa') || '{}'),
                        sistema: JSON.parse(localStorage.getItem('gestor_config_sistema') || '{}'),
                        impresion: JSON.parse(localStorage.getItem('gestor_config_impresion') || '{}')
                      },
                      fechaRespaldo: new Date().toISOString(),
                      version: '1.0.0'
                    }
                    
                    const dataStr = JSON.stringify(datos, null, 2)
                    const dataBlob = new Blob([dataStr], { type: 'application/json' })
                    const url = URL.createObjectURL(dataBlob)
                    const link = document.createElement('a')
                    link.href = url
                    link.download = `gestor_pos_respaldo_${new Date().toISOString().split('T')[0]}.json`
                    link.click()
                    URL.revokeObjectURL(url)
                    
                    message.success('Respaldo descargado exitosamente')
                  }}
                >
                  Descargar Respaldo Completo
                </Button>
              </div>
              
              <div>
                <Text strong>Limpiar Datos</Text>
                <br />
                <Text type="secondary">Elimina todos los datos del sistema (irreversible)</Text>
                <br />
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  style={{ 
                    marginTop: '8px',
                    backgroundColor: colors.light,
                    borderColor: '#ff4d4f',
                    color: '#ff4d4f',
                    borderRadius: '6px'
                  }}
                  onClick={() => {
                    Modal.confirm({
                      title: '⚠️ ¿Está seguro?',
                      content: 'Esta acción eliminará TODOS los datos del sistema y no se puede deshacer. Se recomienda hacer un respaldo antes.',
                      okText: 'Sí, eliminar todo',
                      cancelText: 'Cancelar',
                      okType: 'danger',
                      onOk() {
                        localStorage.removeItem('gestor_productos')
                        localStorage.removeItem('gestor_clientes')
                        localStorage.removeItem('gestor_proveedores')
                        localStorage.removeItem('gestor_ventas')
                        localStorage.removeItem('gestor_facturas')
                        localStorage.removeItem('gestor_config_empresa')
                        localStorage.removeItem('gestor_config_sistema')
                        localStorage.removeItem('gestor_config_impresion')
                        
                        message.success('Todos los datos han sido eliminados')
                        setTimeout(() => {
                          window.location.reload()
                        }, 1000)
                      }
                    })
                  }}
                >
                  Limpiar Todos los Datos
                </Button>
              </div>
              
              <div>
                <Text strong>Estadísticas del Sistema</Text>
                <br />
                {(() => {
                  const productos = JSON.parse(localStorage.getItem('gestor_productos') || '[]')
                  const clientes = JSON.parse(localStorage.getItem('gestor_clientes') || '[]')
                  const ventas = JSON.parse(localStorage.getItem('gestor_ventas') || '[]')
                  const facturas = JSON.parse(localStorage.getItem('gestor_facturas') || '[]')
                  
                  return (
                    <div style={{ marginTop: '8px' }}>
                      <Text>• Productos registrados: {productos.length}</Text><br />
                      <Text>• Clientes registrados: {clientes.length}</Text><br />
                      <Text>• Ventas procesadas: {ventas.length}</Text><br />
                      <Text>• Facturas generadas: {facturas.length}</Text><br />
                    </div>
                  )
                })()}
              </div>
            </Space>
          </Card>
        </Col>

        {/* Información del Sistema */}
        <Col xs={24} lg={12}>
          <Card 
            title="ℹ️ Información del Sistema"
            style={customStyles.card}
            headStyle={customStyles.cardHeader}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>Gestor POS</Text>
                <br />
                <Text>Versión: 1.0.0</Text>
              </div>
              
              <div>
                <Text strong>Desarrollado por:</Text>
                <br />
                <Text>Tu Empresa de Desarrollo</Text>
              </div>
              
              <div>
                <Text strong>Última actualización:</Text>
                <br />
                <Text>{new Date().toLocaleDateString('es-ES')}</Text>
              </div>
              
              <div>
                <Text strong>Características:</Text>
                <br />
                <Text>• Sistema POS completo</Text><br />
                <Text>• Gestión de inventario</Text><br />
                <Text>• Facturación electrónica</Text><br />
                <Text>• Reportes y analytics</Text><br />
                <Text>• Multi-empresa</Text><br />
                <Text>• Respaldos automáticos</Text>
              </div>
              
              <div>
                <Text strong>Soporte Técnico:</Text>
                <br />
                <Text>Email: soporte@gestorpos.com</Text><br />
                <Text>Teléfono: +1 800 123 4567</Text><br />
                <Text>Web: www.gestorpos.com</Text>
              </div>
              
              <Button 
                type="primary" 
                icon={<BarChartOutlined />}
                onClick={() => {
                  const datosUso = {
                    navegador: navigator.userAgent,
                    idioma: navigator.language,
                    resolucion: `${screen.width}x${screen.height}`,
                    zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    almacenamiento: (() => {
                      let total = 0
                      for (let key in localStorage) {
                        if (key.startsWith('gestor_')) {
                          total += localStorage[key].length
                        }
                      }
                      return `${(total / 1024).toFixed(2)} KB`
                    })()
                  }
                  
                  Modal.info({
                    title: 'Información Técnica',
                    content: (
                      <div>
                        <p><strong>Navegador:</strong> {datosUso.navegador}</p>
                        <p><strong>Idioma:</strong> {datosUso.idioma}</p>
                        <p><strong>Resolución:</strong> {datosUso.resolucion}</p>
                        <p><strong>Zona Horaria:</strong> {datosUso.zona_horaria}</p>
                        <p><strong>Datos almacenados:</strong> {datosUso.almacenamiento}</p>
                      </div>
                    ),
                    width: 500
                  })
                }}
              >
                Ver Información Técnica
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

// Dashboard empresarial con sidebar
const DashboardPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }): React.JSX.Element => {
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [selectedKey, setSelectedKey] = React.useState('1')

  // Estados para Productos con persistencia en localStorage
  const [productos, setProductos] = React.useState(() => {
    const productosGuardados = localStorage.getItem('gestor_productos')
    return productosGuardados ? JSON.parse(productosGuardados) : []
  })

  // Estados para Clientes con persistencia en localStorage
  const [clientes, setClientes] = React.useState(() => {
    const clientesGuardados = localStorage.getItem('gestor_clientes')
    return clientesGuardados ? JSON.parse(clientesGuardados) : []
  })

  // Estados para Proveedores con persistencia en localStorage
  const [proveedores, setProveedores] = React.useState(() => {
    const proveedoresGuardados = localStorage.getItem('gestor_proveedores')
    return proveedoresGuardados ? JSON.parse(proveedoresGuardados) : []
  })

  // Estados para Gastos con persistencia en localStorage
  const [gastos, setGastos] = React.useState(() => {
    const gastosGuardados = localStorage.getItem('gestor_gastos')
    return gastosGuardados ? JSON.parse(gastosGuardados) : []
  })

  // Estados para Compras con persistencia en localStorage
  const [compras, setCompras] = React.useState(() => {
    const comprasGuardadas = localStorage.getItem('gestor_compras')
    return comprasGuardadas ? JSON.parse(comprasGuardadas) : []
  })

  const [ventas, setVentas] = React.useState(() => {
    const ventasGuardadas = localStorage.getItem('gestor_ventas')
    return ventasGuardadas ? JSON.parse(ventasGuardadas) : []
  })

  // Estados para Carrito POS
  const [carritoItems, setCarritoItems] = React.useState<any[]>([])
  const [clienteSeleccionado, setClienteSeleccionado] = React.useState<string | null>(null)

  // Estados para Modales
  const [modalProductoVisible, setModalProductoVisible] = React.useState(false)
  const [modalClienteVisible, setModalClienteVisible] = React.useState(false)
  const [modalProveedorVisible, setModalProveedorVisible] = React.useState(false)
  const [modalProveedoresMultiplesVisible, setModalProveedoresMultiplesVisible] = React.useState(false)
  const [modalFacturaVisible, setModalFacturaVisible] = React.useState(false)
  const [editandoItem, setEditandoItem] = React.useState<any>(null)
  const [editandoFactura, setEditandoFactura] = React.useState<any>(null)

  // Estados para Carrito de Compras a Proveedores
  const [carritoCompras, setCarritoCompras] = React.useState<any[]>([])
  const [proveedorSeleccionado, setProveedorSeleccionado] = React.useState<any>(null)
  const [modalCarritoVisible, setModalCarritoVisible] = React.useState(false)
  const [modalProductosProveedorVisible, setModalProductosProveedorVisible] = React.useState(false)
  const [proveedorEditandoProductos, setProveedorEditandoProductos] = React.useState<any>(null)
  
  // Estados para búsqueda de proveedores
  const [busquedaProveedor, setBusquedaProveedor] = React.useState('')
  const [proveedoresFiltrados, setProveedoresFiltrados] = React.useState<any[]>([])
  const [tipoBusqueda, setTipoBusqueda] = React.useState<'distribuidora' | 'producto' | null>(null)
  const [resultadosBusqueda, setResultadosBusqueda] = React.useState<any[]>([])
  const [mostrarResultadosVacios, setMostrarResultadosVacios] = React.useState(false)

  // Estados para búsqueda de Productos
  const [busquedaProducto, setBusquedaProducto] = React.useState('')
  const [productosFiltrados, setProductosFiltrados] = React.useState<any[]>([])
  const [filtroCategoria, setFiltroCategoria] = React.useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = React.useState<string | null>(null)
  const [filtroStock, setFiltroStock] = React.useState<string | null>(null)
  const [filtroRangoPrecio, setFiltroRangoPrecio] = React.useState<{min: number | null, max: number | null}>({min: null, max: null})
  const [tipoVista, setTipoVista] = React.useState<'tabla' | 'tarjetas'>('tabla')

  // Estados para búsqueda de Inventario
  const [busquedaInventario, setBusquedaInventario] = React.useState('')
  const [inventarioFiltrado, setInventarioFiltrado] = React.useState<any[]>([])
  const [filtroStockBajo, setFiltroStockBajo] = React.useState(false)
  const [filtroSinStock, setFiltroSinStock] = React.useState(false)
  const [filtroMovimientos, setFiltroMovimientos] = React.useState<string | null>(null)

  // Forms
  const [formProducto] = Form.useForm()
  const [formCliente] = Form.useForm()
  const [formProveedor] = Form.useForm()
  const [formProveedoresMultiples] = Form.useForm()
  const [formCarritoCompras] = Form.useForm()
  const [formProductosProveedor] = Form.useForm()

  // Limpieza inicial de datos de ejemplo al cargar la aplicación
  // React.useEffect(() => {
  //   const datosLimpiados = localStorage.getItem('gestor_datos_limpiados')
  //   if (!datosLimpiados) {
  //     // Limpiar TODOS los datos de ejemplo para empezar desde cero
  //     localStorage.removeItem('gestor_productos')
  //     localStorage.removeItem('gestor_clientes')
  //     localStorage.removeItem('gestor_proveedores')
  //     localStorage.removeItem('gestor_gastos')
  //     localStorage.removeItem('gestor_compras')
  //     localStorage.removeItem('gestor_ventas')
  //     localStorage.removeItem('gestor_facturas')
      
  //     // Marcar como limpiado para no hacerlo nuevamente
  //     localStorage.setItem('gestor_datos_limpiados', 'true')
      
  //     // Refrescar TODOS los estados vacíos
  //     setProductos([])
  //     setClientes([])
  //     setProveedores([])
  //     setGastos([])
  //     setCompras([])
  //     setVentas([])
      
  //     console.log('🧹 Datos de ejemplo limpiados. Aplicación lista para uso real.')
  //   }
  // }, [])

  // Helper para obtener facturas con datos persistentes
  const obtenerFacturas = () => {
    const facturasGuardadas = localStorage.getItem('gestor_facturas')
    return facturasGuardadas ? JSON.parse(facturasGuardadas) : []
  }

  // Efectos para inicializar productos e inventario filtrados
  React.useEffect(() => {
    setProductosFiltrados(productos)
    setInventarioFiltrado(productos)
  }, [productos])

  // Efectos para filtrar proveedores cuando cambia la lista
  React.useEffect(() => {
    if (!busquedaProveedor) {
      setProveedoresFiltrados(proveedores)
    } else {
      buscarProveedores(busquedaProveedor)
    }
  }, [proveedores])

  // Funciones CRUD para Productos
  const agregarProducto = (valores: any) => {
    const nuevoProducto = {
      key: Date.now().toString(),
      codigo: `PROD-${String(productos.length + 1).padStart(3, '0')}`,
      ...valores,
      estado: valores.stock > 0 ? 'Activo' : 'Sin Stock'
    }
    const nuevosProductos = [...productos, nuevoProducto]
    setProductos(nuevosProductos)
    localStorage.setItem('gestor_productos', JSON.stringify(nuevosProductos))
    setModalProductoVisible(false)
    formProducto.resetFields()
    message.success('Producto agregado exitosamente')
  }

  const editarProducto = (valores: any) => {
    const productosActualizados = productos.map((producto: any) => 
      producto.key === editandoItem?.key 
        ? { ...producto, ...valores, estado: valores.stock > 0 ? 'Activo' : 'Sin Stock' }
        : producto
    )
    setProductos(productosActualizados)
    localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))
    setModalProductoVisible(false)
    setEditandoItem(null)
    formProducto.resetFields()
    message.success('Producto actualizado exitosamente')
  }

  const eliminarProducto = (key: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este producto?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        const productosActualizados = productos.filter((producto: any) => producto.key !== key)
        setProductos(productosActualizados)
        localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))
        message.success('Producto eliminado exitosamente')
      }
    })
  }

  // Funciones CRUD para Clientes
  const agregarCliente = (valores: any) => {
    const nuevoCliente = {
      key: Date.now().toString(),
      ...valores,
      ultimaCompra: 'Nunca',
      totalCompras: 0,
      estado: 'Activo'
    }
    const nuevosClientes = [...clientes, nuevoCliente]
    setClientes(nuevosClientes)
    localStorage.setItem('gestor_clientes', JSON.stringify(nuevosClientes))
    setModalClienteVisible(false)
    formCliente.resetFields()
    message.success('Cliente agregado exitosamente')
  }

  const editarCliente = (valores: any) => {
    const clientesActualizados = clientes.map((cliente: any) => 
      cliente.key === editandoItem?.key 
        ? { ...cliente, ...valores }
        : cliente
    )
    setClientes(clientesActualizados)
    localStorage.setItem('gestor_clientes', JSON.stringify(clientesActualizados))
    setModalClienteVisible(false)
    setEditandoItem(null)
    formCliente.resetFields()
    message.success('Cliente actualizado exitosamente')
  }

  const eliminarCliente = (key: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este cliente?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        const clientesActualizados = clientes.filter((cliente: any) => cliente.key !== key)
        setClientes(clientesActualizados)
        localStorage.setItem('gestor_clientes', JSON.stringify(clientesActualizados))
        message.success('Cliente eliminado exitosamente')
      }
    })
  }

  // Funciones CRUD para Proveedores
  const agregarProveedor = (valores: any) => {
    const nuevoProveedor = {
      key: Date.now().toString(),
      ...valores,
      estado: 'Activo'
    }
    const nuevosProveedores = [...proveedores, nuevoProveedor]
    setProveedores(nuevosProveedores)
    localStorage.setItem('gestor_proveedores', JSON.stringify(nuevosProveedores))
    setModalProveedorVisible(false)
    formProveedor.resetFields()
    message.success('Proveedor agregado exitosamente')
  }

  const editarProveedor = (valores: any) => {
    const proveedoresActualizados = proveedores.map((proveedor: any) => 
      proveedor.key === editandoItem?.key 
        ? { ...proveedor, ...valores }
        : proveedor
    )
    setProveedores(proveedoresActualizados)
    localStorage.setItem('gestor_proveedores', JSON.stringify(proveedoresActualizados))
    setModalProveedorVisible(false)
    setEditandoItem(null)
    formProveedor.resetFields()
    message.success('Proveedor actualizado exitosamente')
  }

  const eliminarProveedor = (key: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este proveedor?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onOk: () => {
        const proveedoresActualizados = proveedores.filter((proveedor: any) => proveedor.key !== key)
        setProveedores(proveedoresActualizados)
        localStorage.setItem('gestor_proveedores', JSON.stringify(proveedoresActualizados))
        message.success('Proveedor eliminado exitosamente')
      }
    })
  }

  // Funciones para Carrito de Compras a Proveedores
  const agregarArticuloACarritoCompras = (proveedor: any, articulo: string) => {
    const itemExistente = carritoCompras.find((item: any) => 
      item.proveedor.key === proveedor.key && item.articulo === articulo
    )
    
    if (itemExistente) {
      setCarritoCompras(carritoCompras.map((item: any) => 
        item.proveedor.key === proveedor.key && item.articulo === articulo
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
      message.success(`Cantidad de ${articulo} aumentada en el carrito`)
    } else {
      const nuevoItem = {
        key: `${proveedor.key}-${articulo}-${Date.now()}`,
        proveedor: proveedor,
        articulo: articulo,
        cantidad: 1,
        precioUnitario: 0, // Se definirá al procesar
        subtotal: 0
      }
      setCarritoCompras([...carritoCompras, nuevoItem])
      message.success(`${articulo} agregado al carrito de compras`)
    }
  }

  const removerArticuloDelCarritoCompras = (key: string) => {
    setCarritoCompras(carritoCompras.filter((item: any) => item.key !== key))
    message.success('Artículo removido del carrito de compras')
  }

  const actualizarCantidadCarritoCompras = (key: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removerArticuloDelCarritoCompras(key)
      return
    }
    
    setCarritoCompras(carritoCompras.map((item: any) => 
      item.key === key 
        ? { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.precioUnitario }
        : item
    ))
  }

  const actualizarPrecioCarritoCompras = (key: string, nuevoPrecio: number) => {
    setCarritoCompras(carritoCompras.map((item: any) => 
      item.key === key 
        ? { ...item, precioUnitario: nuevoPrecio, subtotal: item.cantidad * nuevoPrecio }
        : item
    ))
  }

  const limpiarCarritoCompras = () => {
    setCarritoCompras([])
    message.success('Carrito de compras limpiado')
  }

  const procesarCompraAProveedor = () => {
    if (carritoCompras.length === 0) {
      message.warning('El carrito está vacío')
      return
    }

    // Validar que todos los artículos tengan precio
    const articulosSinPrecio = carritoCompras.filter((item: any) => !item.precioUnitario || item.precioUnitario <= 0)
    if (articulosSinPrecio.length > 0) {
      message.error('Por favor define el precio de todos los artículos antes de procesar la compra')
      return
    }

    Modal.confirm({
      title: '¿Procesar compra a proveedores?',
      content: `Se agregarán ${carritoCompras.length} artículos al inventario`,
      okText: 'Sí, procesar',
      cancelText: 'Cancelar',
      onOk: () => {
        // Agregar artículos al inventario
        const nuevosProductos = carritoCompras.map((item: any) => ({
          key: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nombre: item.articulo,
          precio: item.precioUnitario,
          stock: item.cantidad,
          categoria: 'Productos de Proveedor',
          descripcion: `Suministrado por: ${item.proveedor.nombre}`,
          proveedor: item.proveedor.nombre,
          fechaIngreso: new Date().toISOString()
        }))

        // Actualizar productos existentes o agregar nuevos
        const productosActualizados = [...productos]
        
        nuevosProductos.forEach((nuevoProducto: any) => {
          const productoExistente = productosActualizados.find((p: any) => 
            p.nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase()
          )
          
          if (productoExistente) {
            // Si el producto ya existe, aumentar stock
            productoExistente.stock += nuevoProducto.stock
          } else {
            // Si no existe, agregarlo como nuevo producto
            productosActualizados.push(nuevoProducto)
          }
        })

        setProductos(productosActualizados)
        localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))
        
        // Limpiar carrito
        setCarritoCompras([])
        message.success(`Compra procesada exitosamente. ${carritoCompras.length} artículos agregados al inventario`)
      }
    })
  }

  // Funciones para gestionar productos específicos del proveedor
  const abrirModalProductosProveedor = (proveedor: any) => {
    setProveedorEditandoProductos(proveedor)
    
    // Inicializar formulario con productos existentes del proveedor
    const productosExistentes = proveedor.productosEspecificos || []
    formProductosProveedor.setFieldsValue({
      productos: productosExistentes.length > 0 ? productosExistentes : [{ nombre: '', precio: 0, descripcion: '' }]
    })
    
    setModalProductosProveedorVisible(true)
  }

  const guardarProductosProveedor = (valores: any) => {
    const { productos: nuevosProductos } = valores
    
    // Filtrar productos válidos (que tengan al menos nombre)
    const productosValidos = nuevosProductos.filter((p: any) => p.nombre && p.nombre.trim() !== '')
    
    if (productosValidos.length === 0) {
      message.warning('Debes agregar al menos un producto válido')
      return
    }

    // Extraer categorías generales de los productos específicos
    const categoriasGenerales = extraerCategoriasGenerales(productosValidos)
    
    // Actualizar el proveedor con los nuevos productos específicos
    const proveedoresActualizados = proveedores.map((proveedor: any) => 
      proveedor.key === proveedorEditandoProductos?.key 
        ? { 
            ...proveedor, 
            productosEspecificos: productosValidos,
            // Mantener artículos originales y agregar categorías generales
            articulos: [...new Set([
              ...(proveedor.articulosOriginales || proveedor.articulos || []),
              ...categoriasGenerales
            ])]
          }
        : proveedor
    )
    
    setProveedores(proveedoresActualizados)
    localStorage.setItem('gestor_proveedores', JSON.stringify(proveedoresActualizados))
    setModalProductosProveedorVisible(false)
    setProveedorEditandoProductos(null)
    formProductosProveedor.resetFields()
    message.success(`Productos del proveedor ${proveedorEditandoProductos?.nombre} actualizados exitosamente`)
  }

  const agregarProductoEspecificoAlCarrito = (proveedor: any, producto: any) => {
    const itemExistente = carritoCompras.find((item: any) => 
      item.proveedor.key === proveedor.key && item.articulo === producto.nombre
    )
    
    if (itemExistente) {
      setCarritoCompras(carritoCompras.map((item: any) => 
        item.proveedor.key === proveedor.key && item.articulo === producto.nombre
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
      message.success(`Cantidad de ${producto.nombre} aumentada en el carrito`)
    } else {
      const nuevoItem = {
        key: `${proveedor.key}-${producto.nombre}-${Date.now()}`,
        proveedor: proveedor,
        articulo: producto.nombre,
        cantidad: 1,
        precioUnitario: producto.precio || 0,
        subtotal: producto.precio || 0,
        descripcion: producto.descripcion || ''
      }
      setCarritoCompras([...carritoCompras, nuevoItem])
      message.success(`${producto.nombre} agregado al carrito de compras`)
    }
  }

  // Funciones de búsqueda para proveedores
  const normalizarTexto = (texto: string) => {
    return texto.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .trim()
  }

  const calcularSimilitud = (texto1: string, texto2: string) => {
    const t1 = normalizarTexto(texto1)
    const t2 = normalizarTexto(texto2)
    
    // Coincidencia exacta
    if (t1 === t2) return 100
    
    // Coincidencia de inicio
    if (t1.startsWith(t2) || t2.startsWith(t1)) return 90
    
    // Contiene la búsqueda
    if (t1.includes(t2) || t2.includes(t1)) return 70
    
    // Similitud por palabras
    const palabras1 = t1.split(' ')
    const palabras2 = t2.split(' ')
    let coincidencias = 0
    
    palabras2.forEach(palabra => {
      if (palabras1.some(p => p.includes(palabra) || palabra.includes(p))) {
        coincidencias++
      }
    })
    
    const porcentajePalabras = (coincidencias / palabras2.length) * 50
    
    return porcentajePalabras
  }

  const buscarProveedores = (textoBusqueda: string) => {
    if (!textoBusqueda || textoBusqueda.trim() === '') {
      setProveedoresFiltrados(proveedores)
      setTipoBusqueda(null)
      setResultadosBusqueda([])
      setMostrarResultadosVacios(false)
      return
    }

    const busqueda = normalizarTexto(textoBusqueda)
    let resultadosDistribuidoras: any[] = []
    let resultadosProductos: any[] = []

    // Buscar en nombres de distribuidoras
    proveedores.forEach((proveedor: any) => {
      const similitudNombre = calcularSimilitud(proveedor.nombre, busqueda)
      if (similitudNombre >= 50) {
        resultadosDistribuidoras.push({
          ...proveedor,
          similitud: similitudNombre,
          tipoCoincidencia: 'distribuidora'
        })
      }
    })

    // Buscar en productos específicos
    proveedores.forEach((proveedor: any) => {
      const productosEncontrados: any[] = []
      
      // Buscar en productos específicos
      if (proveedor.productosEspecificos) {
        proveedor.productosEspecificos.forEach((producto: any) => {
          const similitudProducto = calcularSimilitud(producto.nombre, busqueda)
          if (similitudProducto >= 50) {
            productosEncontrados.push({
              ...producto,
              similitud: similitudProducto
            })
          }
        })
      }
      
      // Buscar en artículos generales
      if (proveedor.articulos) {
        proveedor.articulos.forEach((articulo: string) => {
          const similitudArticulo = calcularSimilitud(articulo, busqueda)
          if (similitudArticulo >= 50) {
            productosEncontrados.push({
              nombre: articulo,
              similitud: similitudArticulo,
              precio: 0,
              descripcion: 'Artículo general'
            })
          }
        })
      }

      // Buscar en categorías generales extraídas de productos específicos
      if (proveedor.productosEspecificos) {
        const categoriasGenerales = extraerCategoriasGenerales(proveedor.productosEspecificos)
        categoriasGenerales.forEach((categoria: string) => {
          const similitudCategoria = calcularSimilitud(categoria, busqueda)
          if (similitudCategoria >= 50) {
            productosEncontrados.push({
              nombre: categoria,
              similitud: similitudCategoria,
              precio: 0,
              descripcion: 'Categoría general'
            })
          }
        })
      }

      if (productosEncontrados.length > 0) {
        const mejorCoincidencia = Math.max(...productosEncontrados.map(p => p.similitud))
        resultadosProductos.push({
          ...proveedor,
          similitud: mejorCoincidencia,
          tipoCoincidencia: 'producto',
          productosCoincidentes: productosEncontrados.sort((a, b) => b.similitud - a.similitud)
        })
      }
    })

    // Ordenar resultados por similitud
    resultadosDistribuidoras.sort((a, b) => b.similitud - a.similitud)
    resultadosProductos.sort((a, b) => b.similitud - a.similitud)

    // Determinar qué tipo de búsqueda mostrar
    let resultadosFinales: any[] = []
    let tipoDetectado: 'distribuidora' | 'producto' | null = null

    if (resultadosDistribuidoras.length > 0 && resultadosProductos.length > 0) {
      // Si hay ambos, priorizar por mayor similitud
      const mejorDistribuidora = resultadosDistribuidoras[0]?.similitud || 0
      const mejorProducto = resultadosProductos[0]?.similitud || 0
      
      if (mejorDistribuidora >= mejorProducto) {
        resultadosFinales = resultadosDistribuidoras
        tipoDetectado = 'distribuidora'
      } else {
        resultadosFinales = resultadosProductos
        tipoDetectado = 'producto'
      }
    } else if (resultadosDistribuidoras.length > 0) {
      resultadosFinales = resultadosDistribuidoras
      tipoDetectado = 'distribuidora'
    } else if (resultadosProductos.length > 0) {
      resultadosFinales = resultadosProductos
      tipoDetectado = 'producto'
    }

    setTipoBusqueda(tipoDetectado)
    setResultadosBusqueda(resultadosFinales)
    setProveedoresFiltrados(resultadosFinales)
    setMostrarResultadosVacios(resultadosFinales.length === 0)
  }

  const limpiarBusqueda = () => {
    setBusquedaProveedor('')
    setProveedoresFiltrados(proveedores)
    setTipoBusqueda(null)
    setResultadosBusqueda([])
    setMostrarResultadosVacios(false)
  }

  // Función para resaltar texto de búsqueda
  const resaltarTexto = (texto: string, busqueda: string) => {
    if (!busqueda) return texto
    
    const regex = new RegExp(`(${busqueda})`, 'gi')
    const partes = texto.split(regex)
    
    return partes.map((parte, index) => 
      regex.test(parte) ? (
        <span key={index} style={{ 
          background: '#fffb8f', 
          color: '#ad6800',
          fontWeight: 'bold',
          padding: '1px 2px',
          borderRadius: '2px'
        }}>
          {parte}
        </span>
      ) : parte
    )
  }

  // Función para verificar si un producto coincide con la búsqueda
  const esProductoCoincidente = (producto: any, record: any) => {
    if (!busquedaProveedor || tipoBusqueda !== 'producto') return false
    
    const resultadoProveedor = resultadosBusqueda.find(r => r.key === record.key)
    if (!resultadoProveedor?.productosCoincidentes) return false
    
    return resultadoProveedor.productosCoincidentes.some((p: any) => 
      normalizarTexto(p.nombre) === normalizarTexto(producto.nombre)
    )
  }

  // Función para extraer categorías generales de productos específicos
  const extraerCategoriasGenerales = (productosEspecificos: any[]) => {
    if (!productosEspecificos || productosEspecificos.length === 0) return []
    
    const categorias = new Set<string>()
    
    productosEspecificos.forEach(producto => {
      const nombre = normalizarTexto(producto.nombre)
      
      // Categorías basadas en palabras clave
      if (nombre.includes('laptop') || nombre.includes('computador') || nombre.includes('portatil')) {
        categorias.add('Laptops')
      } else if (nombre.includes('celular') || nombre.includes('telefono') || nombre.includes('smartphone') || nombre.includes('iphone') || nombre.includes('samsung')) {
        categorias.add('Celulares')
      } else if (nombre.includes('tablet') || nombre.includes('ipad')) {
        categorias.add('Tablets')
      } else if (nombre.includes('monitor') || nombre.includes('pantalla') || nombre.includes('display')) {
        categorias.add('Monitores')
      } else if (nombre.includes('teclado') || nombre.includes('mouse') || nombre.includes('raton')) {
        categorias.add('Periféricos')
      } else if (nombre.includes('impresora') || nombre.includes('scanner') || nombre.includes('escaner')) {
        categorias.add('Impresoras')
      } else if (nombre.includes('audifonos') || nombre.includes('auriculares') || nombre.includes('parlante') || nombre.includes('altavoz')) {
        categorias.add('Audio')
      } else if (nombre.includes('camara') || nombre.includes('webcam')) {
        categorias.add('Cámaras')
      } else if (nombre.includes('cable') || nombre.includes('adaptador') || nombre.includes('cargador')) {
        categorias.add('Accesorios')
      } else if (nombre.includes('disco') || nombre.includes('ssd') || nombre.includes('hdd') || nombre.includes('memoria')) {
        categorias.add('Almacenamiento')
      } else if (nombre.includes('procesador') || nombre.includes('cpu') || nombre.includes('gpu') || nombre.includes('tarjeta')) {
        categorias.add('Componentes')
      } else if (nombre.includes('silla') || nombre.includes('escritorio') || nombre.includes('mesa')) {
        categorias.add('Mobiliario')
      } else if (nombre.includes('licencia') || nombre.includes('software') || nombre.includes('antivirus')) {
        categorias.add('Software')
      } else if (nombre.includes('servidor') || nombre.includes('router') || nombre.includes('switch') || nombre.includes('red')) {
        categorias.add('Redes')
      } else if (nombre.includes('tinta') || nombre.includes('toner') || nombre.includes('cartucho')) {
        categorias.add('Suministros')
      } else if (nombre.includes('proyector') || nombre.includes('television') || nombre.includes('tv')) {
        categorias.add('Proyección')
      } else {
        // Si no coincide con ninguna categoría específica, usar la primera palabra
        const primeraPalabra = producto.nombre.split(' ')[0]
        if (primeraPalabra && primeraPalabra.length > 2) {
          categorias.add(primeraPalabra.charAt(0).toUpperCase() + primeraPalabra.slice(1))
        } else {
          categorias.add('Productos')
        }
      }
    })
    
    return Array.from(categorias)
  }

  // Función para obtener artículos generales de un proveedor
  const obtenerArticulosGenerales = (proveedor: any) => {
    const categoriasDeProductos = extraerCategoriasGenerales(proveedor.productosEspecificos || [])
    const articulosOriginales = proveedor.articulos || []
    
    // Combinar categorías extraídas con artículos originales, evitando duplicados
    const articulosUnicos = new Set([...categoriasDeProductos, ...articulosOriginales])
    
    return Array.from(articulosUnicos)
  }

  // Efecto para filtrar proveedores cuando cambia la lista
  React.useEffect(() => {
    if (!busquedaProveedor) {
      setProveedoresFiltrados(proveedores)
    } else {
      buscarProveedores(busquedaProveedor)
    }
  }, [proveedores])

  // Función para agregar múltiples proveedores con sus artículos
  const agregarProveedoresMultiples = (valores: any) => {
    const { proveedores: nuevosProveedores } = valores
    const proveedoresFormateados = nuevosProveedores.map((proveedor: any, index: number) => ({
      key: (Date.now() + index).toString(),
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      email: proveedor.email,
      direccion: proveedor.direccion,
      articulos: proveedor.articulos || [],
      estado: 'Activo',
      fechaRegistro: new Date().toISOString()
    }))

    const proveedoresActualizados = [...proveedores, ...proveedoresFormateados]
    setProveedores(proveedoresActualizados)
    localStorage.setItem('gestor_proveedores', JSON.stringify(proveedoresActualizados))
    setModalProveedoresMultiplesVisible(false)
    formProveedoresMultiples.resetFields()
    message.success(`${proveedoresFormateados.length} proveedores agregados exitosamente`)
  }

  // Funciones para POS
  const agregarAlCarrito = (producto: any) => {
    const itemExistente = carritoItems.find((item: any) => item.key === producto.key)
    if (itemExistente) {
      setCarritoItems(carritoItems.map((item: any) => 
        item.key === producto.key 
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ))
    } else {
      setCarritoItems([...carritoItems, { ...producto, cantidad: 1 }])
    }
    message.success(`${producto.nombre} agregado al carrito`)
  }

  const removerDelCarrito = (key: string) => {
    setCarritoItems(carritoItems.filter((item: any) => item.key !== key))
    message.success('Producto removido del carrito')
  }

  const actualizarCantidadCarrito = (key: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      removerDelCarrito(key)
      return
    }
    
    setCarritoItems(carritoItems.map((item: any) => 
      item.key === key 
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ))
  }

  const calcularSubtotal = () => {
    return carritoItems.reduce((total: number, item: any) => total + (Number(item.precio) * item.cantidad), 0)
  }

  const calcularImpuestos = () => {
    return calcularSubtotal() * 0.16 // 16% IVA
  }

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuestos()
  }

  const limpiarCarrito = () => {
    setCarritoItems([])
    setClienteSeleccionado(null)
    message.success('Carrito limpiado')
  }

  const procesarVenta = () => {
    if (carritoItems.length === 0) {
      message.error('El carrito está vacío')
      return
    }

    const subtotal = calcularSubtotal()
    const total = calcularTotal()
    
    // Crear registro de venta
    const nuevaVenta = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      items: carritoItems.map((item: any) => ({
        id: item.key,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      })),
      cliente: clienteSeleccionado ? clientes.find((c: any) => c.key === clienteSeleccionado)?.nombre : null,
      subtotal: subtotal,
      total: total,
      metodoPago: 'Efectivo', // Por defecto, se puede expandir más tarde
      vendedor: 'Sistema' // Por defecto, se puede expandir más tarde
    }

    // Guardar venta
    const ventasActualizadas = [...ventas, nuevaVenta]
    setVentas(ventasActualizadas)
    localStorage.setItem('gestor_ventas', JSON.stringify(ventasActualizadas))
    
    // Actualizar stock de productos
    const productosActualizados = productos.map((producto: any) => {
      const itemCarrito = carritoItems.find((item: any) => item.key === producto.key)
      if (itemCarrito) {
        const nuevoStock = producto.stock - itemCarrito.cantidad
        return {
          ...producto,
          stock: nuevoStock,
          estado: nuevoStock > 0 ? 'Activo' : 'Sin Stock'
        }
      }
      return producto
    })
    setProductos(productosActualizados)
    localStorage.setItem('gestor_productos', JSON.stringify(productosActualizados))

    // Actualizar total de compras del cliente si hay uno seleccionado
    if (clienteSeleccionado) {
      const clientesActualizados = clientes.map((cliente: any) => 
        cliente.key === clienteSeleccionado 
          ? { 
              ...cliente, 
              totalCompras: cliente.totalCompras + total,
              ultimaCompra: new Date().toISOString().split('T')[0]
            }
          : cliente
      )
      setClientes(clientesActualizados)
      localStorage.setItem('gestor_clientes', JSON.stringify(clientesActualizados))
    }

    // Limpiar carrito
    limpiarCarrito()
    
    message.success(`Venta procesada exitosamente por $${total.toFixed(2)}`)
  }

  const abrirModalEdicion = (item: any, tipo: string) => {
    setEditandoItem(item)
    if (tipo === 'producto') {
      formProducto.setFieldsValue(item)
      setModalProductoVisible(true)
    } else if (tipo === 'cliente') {
      formCliente.setFieldsValue(item)
      setModalClienteVisible(true)
    } else if (tipo === 'proveedor') {
      formProveedor.setFieldsValue(item)
      setModalProveedorVisible(true)
    }
  }

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => setSelectedKey('1')
    },
    {
      key: '2',
      icon: <ShopOutlined />,
      label: 'Productos',
      onClick: () => setSelectedKey('2')
    },
    {
      key: '3',
      icon: <DollarOutlined />,
      label: 'Punto de Venta',
      onClick: () => setSelectedKey('3')
    },
    {
      key: '4',
      icon: <AppstoreOutlined />,
      label: 'Inventario',
      onClick: () => setSelectedKey('4')
    },
    {
      key: '5',
      icon: <TeamOutlined />,
      label: 'Clientes',
      onClick: () => setSelectedKey('5')
    },
    {
      key: '6',
      icon: <UserOutlined />,
      label: 'Proveedores',
      onClick: () => setSelectedKey('10')
    },
    {
      key: '7',
      icon: <BarChartOutlined />,
      label: 'Reportes',
      onClick: () => setSelectedKey('7')
    },
    {
      key: '8',
      icon: <FileTextOutlined />,
      label: 'Facturación',
      onClick: () => setSelectedKey('8')
    },
    {
      key: '9',
      icon: <SettingOutlined />,
      label: 'Configuración',
      onClick: () => setSelectedKey('9')
    }
  ]

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return (
          <div>
            {/* Header del Dashboard con fecha y hora */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <Title level={2} style={{ 
                color: colors.dark,
                fontSize: '32px',
                fontWeight: 'bold',
                margin: 0,
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.accent} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}>
                💼 Dashboard Empresarial
              </Title>
              <Text style={{ fontSize: '16px', color: colors.dark, marginTop: '8px' }}>
                Centro de control y métricas de tu negocio - {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </div>

            {/* Alertas y Notificaciones Importantes */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={24}>
                <Card style={{ 
                  ...customStyles.card,
                  background: 'linear-gradient(135deg, #fff2e8 0%, #ffffff 100%)',
                  border: '2px solid #fa8c16'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <AlertOutlined style={{ fontSize: '24px', color: '#fa8c16', marginRight: '12px' }} />
                      <div>
                        <Text strong style={{ fontSize: '16px', color: '#fa8c16' }}>
                          Centro de Alertas Empresariales
                        </Text>
                      </div>
                    </div>
                    <Space wrap>
                      {/* Alerta de Stock Bajo */}
                      {(() => {
                        const productosStockBajo = productos.filter(p => p.stock < 10)
                        return productosStockBajo.length > 0 ? (
                          <div style={{ 
                            background: '#ff4d4f',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            🚨 {productosStockBajo.length} productos con stock bajo
                          </div>
                        ) : null
                      })()}
                      
                      {/* Alerta de Ventas del Día */}
                      {(() => {
                        const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                        return ventasHoy.length === 0 && new Date().getHours() > 12 ? (
                          <div style={{ 
                            background: '#faad14',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            ⚠️ Sin ventas registradas hoy
                          </div>
                        ) : null
                      })()}
                      
                      {/* Mensaje Positivo */}
                      {(() => {
                        const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                        return ventasHoy.length > 0 ? (
                          <div style={{ 
                            background: '#52c41a',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            ✅ Sistema funcionando correctamente
                          </div>
                        ) : null
                      })()}
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Métricas Principales Expandidas */}
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  textAlign: 'center', 
                  ...customStyles.card,
                  background: `linear-gradient(135deg, ${colors.primary}20 0%, #ffffff 100%)`,
                  minHeight: '160px'
                }}>
                  <Statistic
                    title="💰 Ventas Hoy"
                    value={(() => {
                      const ventasHoy = ventas.filter(v => {
                        const fechaVenta = new Date(v.fecha).toDateString()
                        const hoy = new Date().toDateString()
                        return fechaVenta === hoy
                      })
                      return ventasHoy.reduce((sum, venta) => sum + venta.total, 0)
                    })()}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: colors.primary, fontSize: '24px' }}
                  />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    {ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString()).length} transacciones
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  textAlign: 'center', 
                  ...customStyles.card,
                  background: `linear-gradient(135deg, ${colors.accent}20 0%, #ffffff 100%)`,
                  minHeight: '160px'
                }}>
                  <Statistic
                    title="📦 Stock Total"
                    value={productos.reduce((sum: number, p: any) => sum + p.stock, 0)}
                    valueStyle={{ color: colors.accent, fontSize: '24px' }}
                    suffix="unidades"
                  />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    {productos.length} productos registrados
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  textAlign: 'center', 
                  ...customStyles.card,
                  background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`,
                  minHeight: '160px'
                }}>
                  <Statistic
                    title="👥 Clientes Activos"
                    value={clientes.filter((c: any) => c.estado === 'Activo').length}
                    valueStyle={{ color: colors.primary, fontSize: '24px' }}
                    prefix={<TeamOutlined />}
                  />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    {clientes.length} clientes totales
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card style={{ 
                  textAlign: 'center', 
                  ...customStyles.card,
                  background: `linear-gradient(135deg, ${colors.light}40 0%, #ffffff 100%)`,
                  minHeight: '160px'
                }}>
                  <Statistic
                    title="📊 Utilidad Hoy"
                    value={(() => {
                      const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                        .reduce((sum, venta) => sum + venta.total, 0)
                      const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                        .reduce((sum, gasto) => sum + gasto.monto, 0)
                      return ventasHoy - gastosHoy
                    })()}
                    precision={2}
                    prefix="$"
                    valueStyle={{ 
                      fontSize: '24px',
                      color: (() => {
                        const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                          .reduce((sum, venta) => sum + venta.total, 0)
                        const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                          .reduce((sum, gasto) => sum + gasto.monto, 0)
                        return (ventasHoy - gastosHoy) >= 0 ? colors.primary : '#ff4d4f'
                      })()
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
                    {(() => {
                      const ventasHoy = ventas.filter(v => new Date(v.fecha).toDateString() === new Date().toDateString())
                        .reduce((sum, venta) => sum + venta.total, 0)
                      const gastosHoy = gastos.filter(g => new Date(g.fecha).toDateString() === new Date().toDateString())
                        .reduce((sum, gasto) => sum + gasto.monto, 0)
                      return (ventasHoy - gastosHoy) >= 0 ? 'Ganancia positiva' : 'Pérdida del día'
                    })()}
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Resumen Semanal */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} lg={12}>
                <Card 
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>📈 Rendimiento Semanal</span>
                      <div style={{ 
                        background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Últimos 7 días
                      </div>
                    </div>
                  }
                  style={{
                    ...customStyles.card,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                  headStyle={customStyles.cardHeader}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary }}>
                          {(() => {
                            const hace7Dias = new Date()
                            hace7Dias.setDate(hace7Dias.getDate() - 7)
                            return ventas.filter(v => new Date(v.fecha) >= hace7Dias).length
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Ventas</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent }}>
                          ${(() => {
                            const hace7Dias = new Date()
                            hace7Dias.setDate(hace7Dias.getDate() - 7)
                            return ventas.filter(v => new Date(v.fecha) >= hace7Dias)
                              .reduce((sum, v) => sum + v.total, 0)
                              .toFixed(0)
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Ingresos</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                          {(() => {
                            const hace7Dias = new Date()
                            hace7Dias.setDate(hace7Dias.getDate() - 7)
                            const ventasSemana = ventas.filter(v => new Date(v.fecha) >= hace7Dias).length
                            const promedio = (ventasSemana / 7).toFixed(1)
                            return promedio
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Promedio/día</Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card 
                  title="⚠️ Productos con Stock Crítico"
                  style={{
                    ...customStyles.card,
                    background: 'linear-gradient(135deg, #fff2f0 0%, #ffffff 100%)'
                  }}
                  headStyle={{
                    ...customStyles.cardHeader,
                    borderBottom: '2px solid #ff4d4f'
                  }}
                >
                  <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                    {(() => {
                      const productosStockBajo = productos.filter(p => p.stock < 10)
                      if (productosStockBajo.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                            <div style={{ color: '#52c41a', fontWeight: 'bold' }}>
                              ¡Excelente! Todos los productos tienen stock suficiente
                            </div>
                          </div>
                        )
                      }
                      return productosStockBajo.slice(0, 3).map((producto, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '8px 12px',
                          marginBottom: '8px',
                          background: '#fff1f0',
                          borderRadius: '8px',
                          border: '1px solid #ffccc7'
                        }}>
                          <div>
                            <Text strong style={{ fontSize: '14px' }}>{producto.nombre}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Categoría: {producto.categoria}
                            </Text>
                          </div>
                          <div style={{ 
                            background: '#ff4d4f',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {producto.stock} unidades
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Top Productos y Análisis de Negocio */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} lg={12}>
                <Card 
                  title="🏆 Top 5 Productos Más Vendidos"
                  style={{
                    ...customStyles.card,
                    background: 'linear-gradient(135deg, #f6ffed 0%, #ffffff 100%)'
                  }}
                  headStyle={{
                    ...customStyles.cardHeader,
                    borderBottom: '2px solid #52c41a'
                  }}
                >
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {(() => {
                      const productosVendidos = {}
                      ventas.forEach(venta => {
                        venta.items.forEach(item => {
                          if (productosVendidos[item.nombre]) {
                            productosVendidos[item.nombre] += item.cantidad
                          } else {
                            productosVendidos[item.nombre] = item.cantidad
                          }
                        })
                      })
                      const topProductos = Object.entries(productosVendidos)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                      
                      if (topProductos.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <ShoppingOutlined style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '8px' }} />
                            <div style={{ color: '#999' }}>No hay productos vendidos aún</div>
                          </div>
                        )
                      }
                      
                      return topProductos.map(([producto, cantidad], index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '12px',
                          marginBottom: '8px',
                          background: 'white',
                          borderRadius: '8px',
                          border: '1px solid #d9f7be',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              background: 'linear-gradient(45deg, #52c41a, #73d13d)',
                              color: 'white',
                              borderRadius: '50%',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>
                              #{index + 1}
                            </div>
                            <div>
                              <Text strong style={{ fontSize: '14px' }}>{producto}</Text>
                            </div>
                          </div>
                          <div style={{ 
                            background: '#52c41a',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {cantidad} vendidos
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card 
                  title="💼 Análisis de Rentabilidad"
                  style={{
                    ...customStyles.card,
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`
                  }}
                  headStyle={customStyles.cardHeader}
                >
                  <div style={{ 
                    background: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${colors.primary}`,
                    marginBottom: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <Text type="secondary" style={{ fontSize: '14px', display: 'block' }}>
                        Ingresos vs Gastos (Este Mes)
                      </Text>
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>
                          ${(() => {
                            const ingresosMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            return ingresosMes.toFixed(0)
                          })()}
                        </div>
                        <Text style={{ fontSize: '12px', color: '#52c41a' }}>Ingresos</Text>
                      </div>
                      <div style={{ margin: '8px 0', fontSize: '20px', color: colors.dark }}>-</div>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                          ${(() => {
                            const gastosMes = gastos.filter(g => {
                              const fecha = new Date(g.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, g) => sum + g.monto, 0)
                            return gastosMes.toFixed(0)
                          })()}
                        </div>
                        <Text style={{ fontSize: '12px', color: '#ff4d4f' }}>Gastos</Text>
                      </div>
                      <div style={{ 
                        marginTop: '12px', 
                        padding: '8px 16px',
                        background: (() => {
                          const ingresosMes = ventas.filter(v => {
                            const fecha = new Date(v.fecha)
                            const ahora = new Date()
                            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                          }).reduce((sum, v) => sum + v.total, 0)
                          const gastosMes = gastos.filter(g => {
                            const fecha = new Date(g.fecha)
                            const ahora = new Date()
                            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                          }).reduce((sum, g) => sum + g.monto, 0)
                          return (ingresosMes - gastosMes) >= 0 ? '#f6ffed' : '#fff2f0'
                        })(),
                        borderRadius: '8px',
                        border: (() => {
                          const ingresosMes = ventas.filter(v => {
                            const fecha = new Date(v.fecha)
                            const ahora = new Date()
                            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                          }).reduce((sum, v) => sum + v.total, 0)
                          const gastosMes = gastos.filter(g => {
                            const fecha = new Date(g.fecha)
                            const ahora = new Date()
                            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                          }).reduce((sum, g) => sum + g.monto, 0)
                          return (ingresosMes - gastosMes) >= 0 ? '1px solid #b7eb8f' : '1px solid #ffccc7'
                        })()
                      }}>
                        <Text strong style={{ 
                          fontSize: '16px',
                          color: (() => {
                            const ingresosMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            const gastosMes = gastos.filter(g => {
                              const fecha = new Date(g.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, g) => sum + g.monto, 0)
                            return (ingresosMes - gastosMes) >= 0 ? '#52c41a' : '#ff4d4f'
                          })()
                        }}>
                          = ${(() => {
                            const ingresosMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            const gastosMes = gastos.filter(g => {
                              const fecha = new Date(g.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, g) => sum + g.monto, 0)
                            return (ingresosMes - gastosMes).toFixed(0)
                          })()} 
                          {(() => {
                            const ingresosMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            const gastosMes = gastos.filter(g => {
                              const fecha = new Date(g.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, g) => sum + g.monto, 0)
                            return (ingresosMes - gastosMes) >= 0 ? '📈' : '📉'
                          })()}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Actividad Reciente y Métricas de Negocio */}
            <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
              <Col xs={24} lg={16}>
                <Card 
                  title="📋 Actividad Reciente del Negocio"
                  extra={
                    <div style={{ 
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.accent})`,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      Últimas 5 transacciones
                    </div>
                  }
                  style={{
                    ...customStyles.card,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}
                  headStyle={customStyles.cardHeader}
                >
                  <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {(() => {
                      const actividadReciente = [
                        ...ventas.map(v => ({ ...v, tipo: 'venta', icono: '💰', color: colors.primary })),
                        ...gastos.map(g => ({ ...g, tipo: 'gasto', icono: '💸', color: '#ff4d4f' })),
                        ...compras.map(c => ({ ...c, tipo: 'compra', icono: '🛒', color: colors.accent }))
                      ]
                        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                        .slice(0, 5)
                      
                      if (actividadReciente.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '40px' }}>
                            <CalendarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                            <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                              No hay actividad reciente
                            </div>
                            <Text type="secondary" style={{ fontSize: '14px' }}>
                              Las transacciones aparecerán aquí cuando se registren
                            </Text>
                          </div>
                        )
                      }
                      
                      return actividadReciente.map((actividad, index) => (
                        <div key={index} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '16px',
                          marginBottom: '12px',
                          background: 'white',
                          borderRadius: '12px',
                          border: `1px solid ${actividad.color}20`,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{
                              background: actividad.color,
                              color: 'white',
                              borderRadius: '50%',
                              width: '40px',
                              height: '40px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '16px',
                              fontSize: '18px'
                            }}>
                              {actividad.icono}
                            </div>
                            <div>
                              <Text strong style={{ fontSize: '14px', display: 'block' }}>
                                {actividad.tipo === 'venta' ? `Venta #${actividad.id}` : 
                                 actividad.tipo === 'gasto' ? actividad.descripcion : 
                                 `Compra - ${actividad.proveedor}`}
                              </Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {new Date(actividad.fecha).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </div>
                          </div>
                          <div style={{ 
                            background: `${actividad.color}10`,
                            color: actividad.color,
                            padding: '6px 12px',
                            borderRadius: '16px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            ${(actividad.total || actividad.monto).toFixed(2)}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card 
                  title="📊 Metas y Objetivos"
                  style={{
                    ...customStyles.card,
                    background: `linear-gradient(135deg, ${colors.accent}10 0%, #ffffff 100%)`
                  }}
                  headStyle={{
                    ...customStyles.cardHeader,
                    borderBottom: `2px solid ${colors.accent}`
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {/* Meta de Ventas Mensual - Solo si hay ventas */}
                    {ventas.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <Text strong>Progreso de Ventas</Text>
                          <Text type="secondary">
                            {(() => {
                              const ventasMes = ventas.filter(v => {
                                const fecha = new Date(v.fecha)
                                const ahora = new Date()
                                return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                              }).reduce((sum, v) => sum + v.total, 0)
                              // Meta basada en el promedio diario multiplicado por 30 días
                              const diasTranscurridos = new Date().getDate()
                              const promedioDiario = ventasMes / diasTranscurridos
                              const metaEstimada = promedioDiario * 30
                              return metaEstimada > 0 ? Math.round((ventasMes / metaEstimada) * 100) : 0
                            })()}%
                          </Text>
                        </div>
                        <Progress 
                          percent={(() => {
                            const ventasMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            const diasTranscurridos = new Date().getDate()
                            const promedioDiario = ventasMes / diasTranscurridos
                            const metaEstimada = promedioDiario * 30
                            return metaEstimada > 0 ? Math.min(Math.round((ventasMes / metaEstimada) * 100), 100) : 0
                          })()} 
                          strokeColor={{
                            '0%': colors.primary,
                            '100%': colors.accent,
                          }}
                          trailColor={colors.secondary}
                          size="small"
                        />
                        <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
                          Proyección mensual: ${(() => {
                            const ventasMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            const diasTranscurridos = new Date().getDate()
                            const promedioDiario = ventasMes / diasTranscurridos
                            const metaEstimada = promedioDiario * 30
                            return metaEstimada.toFixed(0)
                          })()} | Actual: ${(() => {
                            const ventasMes = ventas.filter(v => {
                              const fecha = new Date(v.fecha)
                              const ahora = new Date()
                              return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
                            }).reduce((sum, v) => sum + v.total, 0)
                            return ventasMes.toFixed(0)
                          })()}
                        </Text>
                      </div>
                    )}

                    {/* Estadísticas de Catálogo - Solo si hay productos */}
                    {productos.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <Text strong>Catálogo de Productos</Text>
                          <Text type="secondary">{productos.length} productos</Text>
                        </div>
                        <div style={{ 
                          background: colors.secondary, 
                          padding: '12px', 
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <Text strong style={{ fontSize: '16px', color: colors.primary }}>
                            {productos.filter(p => p.stock > 0).length} en stock
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {productos.filter(p => p.stock === 0).length} agotados
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Estadísticas de Clientes - Solo si hay clientes */}
                    {clientes.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <Text strong>Base de Clientes</Text>
                          <Text type="secondary">{clientes.length} registrados</Text>
                        </div>
                        <div style={{ 
                          background: '#f6ffed', 
                          padding: '12px', 
                          borderRadius: '8px',
                          textAlign: 'center'
                        }}>
                          <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
                            Crecimiento del negocio
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {clientes.length} clientes confían en ti
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Mensaje cuando no hay datos suficientes */}
                    {ventas.length === 0 && productos.length === 0 && clientes.length === 0 && (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '20px',
                        color: '#8c8c8c'
                      }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎯</div>
                        <Text strong>¡Comienza tu negocio!</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Agrega productos, registra clientes y realiza ventas para ver tus métricas
                        </Text>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Resumen Ejecutivo Final */}
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card 
                  title="📈 Resumen Ejecutivo - Vista General del Negocio"
                  style={{
                    ...customStyles.card,
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, #ffffff 100%)`
                  }}
                  headStyle={{
                    ...customStyles.cardHeader,
                    background: `linear-gradient(135deg, ${colors.primary}20 0%, #ffffff 100%)`,
                    borderBottom: `3px solid ${colors.primary}`
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <div style={{ 
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '2px solid #f0f0f0',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                        <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                          Estado Financiero General
                        </Text>
                        <div style={{ 
                          fontSize: '20px', 
                          fontWeight: 'bold',
                          color: (() => {
                            const totalIngresos = ventas.reduce((sum, v) => sum + v.total, 0)
                            const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
                            return (totalIngresos - totalGastos) >= 0 ? '#52c41a' : '#ff4d4f'
                          })()
                        }}>
                          {(() => {
                            const totalIngresos = ventas.reduce((sum, v) => sum + v.total, 0)
                            const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
                            return (totalIngresos - totalGastos) >= 0 ? 'Rentable' : 'En Pérdida'
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Balance total: ${(() => {
                            const totalIngresos = ventas.reduce((sum, v) => sum + v.total, 0)
                            const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)
                            return (totalIngresos - totalGastos).toFixed(2)
                          })()}
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div style={{ 
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '2px solid #f0f0f0',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                        <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                          Nivel de Actividad
                        </Text>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.primary }}>
                          {(() => {
                            const totalTransacciones = ventas.length + gastos.length + compras.length
                            if (totalTransacciones >= 50) return 'Alto'
                            if (totalTransacciones >= 20) return 'Medio'
                            if (totalTransacciones >= 5) return 'Bajo'
                            return 'Iniciando'
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {ventas.length + gastos.length + compras.length} transacciones totales
                        </Text>
                      </div>
                    </Col>

                    <Col xs={24} md={8}>
                      <div style={{ 
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '2px solid #f0f0f0',
                        textAlign: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                        <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                          Crecimiento Potencial
                        </Text>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.accent }}>
                          {(() => {
                            const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0)
                            const clientesActivos = clientes.filter(c => c.estado === 'Activo').length
                            if (stockTotal >= 500 && clientesActivos >= 50) return 'Excelente'
                            if (stockTotal >= 200 && clientesActivos >= 20) return 'Bueno'
                            if (stockTotal >= 50 && clientesActivos >= 5) return 'Regular'
                            return 'Inicial'
                          })()}
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Basado en inventario y clientes
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Gráficos y Progreso */}
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title="Ventas del Mes" 
                  extra={<CalendarOutlined style={{ color: colors.primary }} />}
                  style={customStyles.card}
                  headStyle={customStyles.cardHeader}
                >
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <Progress 
                      type="circle" 
                      percent={75} 
                      format={() => '75% Meta'}
                      size={120}
                      strokeColor={{
                        '0%': colors.primary,
                        '100%': colors.accent,
                      }}
                      trailColor={colors.secondary}
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Text>Meta mensual: $20,000</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card 
                  title="Estado del Sistema" 
                  extra={<WarningOutlined style={{ color: colors.accent }} />}
                  style={customStyles.card}
                  headStyle={customStyles.cardHeader}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text>Inventario: </Text>
                      <Progress 
                        percent={90} 
                        size="small" 
                        strokeColor={colors.primary}
                        trailColor={colors.secondary}
                      />
                    </div>
                    <div>
                      <Text>Ventas: </Text>
                      <Progress 
                        percent={75} 
                        size="small" 
                        strokeColor={colors.accent}
                        trailColor={colors.secondary}
                      />
                    </div>
                    <div>
                      <Text>Clientes: </Text>
                      <Progress 
                        percent={85} 
                        size="small" 
                        strokeColor={colors.primary}
                        trailColor={colors.secondary}
                      />
                    </div>
                    <div>
                      <Text>Sistema: </Text>
                      <Progress 
                        percent={100} 
                        size="small" 
                        status="success"
                        strokeColor={colors.accent}
                        trailColor={colors.secondary}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        )
        
      case '2':
        return (
          <div>
            <Title level={2}>🛠️ Productos - Test</Title>
            <Card>
              <p>✅ Si ves este texto, la sección de productos está funcionando.</p>
              <p>📊 Productos en estado: {productos.length}</p>
              <p>🔍 Productos filtrados: {productosFiltrados ? productosFiltrados.length : 0}</p>
              <Button type="primary" onClick={generarDatosEjemplo}>Cargar Datos de Ejemplo</Button>
              {productos.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3>Lista de Productos:</h3>
                  {productos.map((p: any) => (
                    <div key={p.key} style={{ padding: '8px', border: '1px solid #ddd', margin: '4px 0' }}>
                      <strong>{p.nombre}</strong> - ${p.precio} - Stock: {p.stock}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditandoItem(null)
                    formProducto.resetFields()
                    setModalProductoVisible(true)
                  }}
                >
                  Nuevo Producto
                </Button>
              </Space>
            </div>
            
            {/* Búsqueda y Filtros Avanzados */}
            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Input.Search
                    placeholder="Buscar por nombre, código, categoría..."
                    value={busquedaProducto}
                    onChange={(e) => {
                      setBusquedaProducto(e.target.value)
                      buscarProductos(e.target.value)
                    }}
                    onSearch={buscarProductos}
                    allowClear
                    onClear={() => {
                      setBusquedaProducto('')
                      aplicarFiltrosProductos()
                    }}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select 
                    placeholder="Categoría" 
                    value={filtroCategoria}
                    onChange={setFiltroCategoria}
                    allowClear
                    style={{ width: '100%' }}
                    options={[
                      ...Array.from(new Set(productos.map((p: any) => p.categoria))).map((cat: any) => ({
                        value: cat,
                        label: cat
                      }))
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select 
                    placeholder="Estado" 
                    value={filtroEstado}
                    onChange={setFiltroEstado}
                    allowClear
                    style={{ width: '100%' }}
                    options={[
                      { value: 'active', label: 'Activo' },
                      { value: 'inactive', label: 'Inactivo' },
                      { value: 'out-of-stock', label: 'Sin Stock' }
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select 
                    placeholder="Stock" 
                    value={filtroStock}
                    onChange={setFiltroStock}
                    allowClear
                    style={{ width: '100%' }}
                    options={[
                      { value: 'in-stock', label: 'En Stock' },
                      { value: 'low-stock', label: 'Stock Bajo (≤10)' },
                      { value: 'high-stock', label: 'Stock Alto (>50)' },
                      { value: 'out-of-stock', label: 'Sin Stock' }
                    ]}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Button 
                    onClick={limpiarFiltrosProductos}
                    icon={<SearchOutlined />}
                    style={{ width: '100%' }}
                  >
                    Limpiar Filtros
                  </Button>
                </Col>
              </Row>
              
              {/* Filtros de Precio */}
              <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col xs={12} md={4}>
                  <InputNumber
                    placeholder="Precio mín."
                    value={filtroRangoPrecio.min}
                    onChange={(value) => setFiltroRangoPrecio(prev => ({...prev, min: value}))}
                    style={{ width: '100%' }}
                    prefix="$"
                    min={0}
                  />
                </Col>
                <Col xs={12} md={4}>
                  <InputNumber
                    placeholder="Precio máx."
                    value={filtroRangoPrecio.max}
                    onChange={(value) => setFiltroRangoPrecio(prev => ({...prev, max: value}))}
                    style={{ width: '100%' }}
                    prefix="$"
                    min={0}
                  />
                </Col>
                <Col xs={24} md={8}>
                  <Text style={{ color: '#666', fontSize: '14px' }}>
                    {productosFiltrados.length} de {productos.length} productos
                    {busquedaProducto && (
                      <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                        - Búsqueda: "{busquedaProducto}"
                      </span>
                    )}
                  </Text>
                </Col>
                <Col xs={24} md={8}>
                  <Radio.Group 
                    value={tipoVista} 
                    onChange={(e) => setTipoVista(e.target.value)}
                    buttonStyle="solid"
                    size="small"
                    style={{ float: 'right' }}
                  >
                    <Radio.Button value="tabla">
                      <UnorderedListOutlined /> Tabla
                    </Radio.Button>
                    <Radio.Button value="tarjetas">
                      <AppstoreOutlined /> Tarjetas
                    </Radio.Button>
                  </Radio.Group>
                </Col>
              </Row>
            </Card>

            <Card>
              <Table
                dataSource={productosFiltrados}
                columns={[
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    render: (codigo) => (
                      <span style={{ fontFamily: 'monospace' }}>
                        {codigo || ''}
                      </span>
                    )
                  },
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                    render: (nombre) => (
                      <span>
                        {nombre}
                      </span>
                    )
                  },
                  {
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    render: (categoria) => (
                      <Tag color="blue">
                        {categoria}
                      </Tag>
                    )
                  },
                  {
                    title: 'Precio',
                    dataIndex: 'precio',
                    key: 'precio',
                    render: (precio) => `$${precio}`,
                    sorter: (a, b) => parseFloat(a.precio) - parseFloat(b.precio)
                  },
                  {
                    title: 'Stock',
                    dataIndex: 'stock',
                    key: 'stock',
                    render: (stock) => (
                      <Tag color={stock > 50 ? 'green' : stock > 10 ? 'orange' : stock > 0 ? 'red' : 'volcano'}>
                        {stock} unidades
                      </Tag>
                    ),
                    sorter: (a, b) => a.stock - b.stock
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'estado',
                    key: 'estado',
                    render: (estado) => (
                      <Tag color={estado === 'Activo' ? 'green' : estado === 'Inactivo' ? 'orange' : 'red'}>
                        {estado}
                      </Tag>
                    )
                  },
                  {
                    title: 'Acciones',
                    key: 'acciones',
                    render: (_: any, record: any) => (
                      <Space>
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => message.info(`Viendo detalles de ${record.nombre}`)}
                        />
                        <Button 
                          icon={<EditOutlined />} 
                          size="small"
                          onClick={() => abrirModalEdicion(record, 'producto')}
                        />
                        <Button 
                          icon={<DeleteOutlined />} 
                          size="small" 
                          danger
                          onClick={() => eliminarProducto(record.key)}
                        />
                      </Space>
                    ),
                  },
                ]}
                pagination={{ 
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`,
                  showSizeChanger: true,
                  showQuickJumper: true
                }}
                locale={{
                  emptyText: productosFiltrados.length === 0 && productos.length > 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <SearchOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                      <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                        No se encontraron productos
                      </div>
                      <div style={{ fontSize: '14px', color: '#ccc' }}>
                        Intenta ajustar los filtros de búsqueda
                      </div>
                      <Button 
                        type="link" 
                        onClick={limpiarFiltrosProductos}
                        style={{ marginTop: '8px' }}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : productos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <ShopOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                      <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                        No hay productos registrados
                      </div>
                      <div style={{ fontSize: '14px', color: '#ccc' }}>
                        Agrega tu primer producto para comenzar
                      </div>
                    </div>
                  ) : 'No hay datos'
                }}
              />
            </Card>

            {/* Modal para Producto */}
            <Modal
              title={editandoItem ? 'Editar Producto' : 'Nuevo Producto'}
              visible={modalProductoVisible}
              onCancel={() => {
                setModalProductoVisible(false)
                setEditandoItem(null)
                formProducto.resetFields()
              }}
              footer={null}
              width={600}
            >
              <Form
                form={formProducto}
                layout="vertical"
                onFinish={editandoItem ? editarProducto : agregarProducto}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="nombre"
                      label="Nombre del Producto"
                      rules={[{ required: true, message: 'El nombre es requerido' }]}
                    >
                      <Input placeholder="Ej: Laptop Dell Inspiron" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="categoria"
                      label="Categoría"
                      rules={[{ required: true, message: 'La categoría es requerida' }]}
                    >
                      <Select
                        placeholder="Seleccionar categoría"
                        options={[
                          { value: 'Electrónicos', label: 'Electrónicos' },
                          { value: 'Ropa', label: 'Ropa' },
                          { value: 'Alimentos', label: 'Alimentos' },
                          { value: 'Hogar', label: 'Hogar' },
                          { value: 'Deportes', label: 'Deportes' }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="precio"
                      label="Precio"
                      rules={[{ required: true, message: 'El precio es requerido' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        precision={2}
                        placeholder="0.00"
                        addonBefore="$"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="stock"
                      label="Stock Inicial"
                      rules={[{ required: true, message: 'El stock es requerido' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        placeholder="0"
                        addonAfter="unidades"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                      setModalProductoVisible(false)
                      setEditandoItem(null)
                      formProducto.resetFields()
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                      {editandoItem ? 'Actualizar' : 'Crear'} Producto
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        );
        
      case '3':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <DollarOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
              Punto de Venta
            </Title>
            
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="Productos Disponibles" style={{ height: '600px' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Input 
                        placeholder="Buscar producto o escanear código de barras..." 
                        prefix={<SearchOutlined />}
                        size="large"
                      />
                    </Col>
                  </Row>
                  
                  <div style={{ marginTop: '16px', height: '480px', overflowY: 'auto' }}>
                    <Row gutter={[16, 16]}>
                      {productos.filter((p: any) => p.stock > 0).map((producto: any) => (
                        <Col xs={12} sm={8} md={6} key={producto.key}>
                          <Card 
                            hoverable 
                            size="small"
                            style={{ textAlign: 'center', cursor: 'pointer' }}
                            onClick={() => {
                              agregarAlCarrito(producto)
                              message.success(`${producto.nombre} agregado al carrito`)
                            }}
                          >
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                              📦
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                              {producto.nombre}
                            </div>
                            <div style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '4px' }}>
                              ${producto.precio}
                            </div>
                            <div style={{ fontSize: '10px', color: '#666' }}>
                              Stock: {producto.stock}
                            </div>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                    {productos.filter((p: any) => p.stock > 0).length === 0 && (
                      <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                        <AppstoreOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div>No hay productos disponibles</div>
                      </div>
                    )}
                  </div>
                </Card>
              </Col>
              
              <Col xs={24} lg={8}>
                <Card title="Carrito de Compras" style={{ height: '600px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>Cliente: </Text>
                    <Select 
                      placeholder="Seleccionar cliente" 
                      style={{ width: '100%' }}
                      value={clienteSeleccionado}
                      onChange={setClienteSeleccionado}
                      options={clientes.map((c: any) => ({ value: c.key, label: c.nombre }))}
                    />
                  </div>
                  
                  <div style={{ height: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                    {carritoItems.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                        <ShopOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <div>Carrito vacío</div>
                        <div style={{ fontSize: '12px' }}>Agrega productos para comenzar</div>
                      </div>
                    ) : (
                      <div>
                        {carritoItems.map((item: any, index: number) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '8px 0',
                            borderBottom: '1px solid #f0f0f0'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                {item.nombre}
                              </div>
                              <div style={{ fontSize: '10px', color: '#666' }}>
                                ${item.precio} x {item.cantidad}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Button 
                                size="small" 
                                onClick={() => actualizarCantidadCarrito(item.key, item.cantidad - 1)}
                                disabled={item.cantidad <= 1}
                              >
                                -
                              </Button>
                              <span style={{ minWidth: '20px', textAlign: 'center' }}>
                                {item.cantidad}
                              </span>
                              <Button 
                                size="small" 
                                onClick={() => actualizarCantidadCarrito(item.key, item.cantidad + 1)}
                              >
                                +
                              </Button>
                              <Button 
                                size="small" 
                                danger 
                                icon={<DeleteOutlined />}
                                onClick={() => removerDelCarrito(item.key)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                    <Row justify="space-between" style={{ marginBottom: '8px' }}>
                      <Text>Subtotal:</Text>
                      <Text strong>${calcularTotal().toFixed(2)}</Text>
                    </Row>
                    <Row justify="space-between" style={{ marginBottom: '8px' }}>
                      <Text>IVA (16%):</Text>
                      <Text strong>${(calcularTotal() * 0.16).toFixed(2)}</Text>
                    </Row>
                    <Row justify="space-between" style={{ marginBottom: '16px' }}>
                      <Text strong style={{ fontSize: '16px' }}>Total:</Text>
                      <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                        ${calcularTotal().toFixed(2)}
                      </Text>
                    </Row>
                    
                    <Button 
                      type="primary" 
                      size="large" 
                      block 
                      disabled={carritoItems.length === 0}
                      style={{ marginBottom: '8px' }}
                      onClick={procesarVenta}
                    >
                      Procesar Venta
                    </Button>
                    <Button 
                      size="large" 
                      block
                      onClick={limpiarCarrito}
                      disabled={carritoItems.length === 0}
                    >
                      Limpiar Carrito
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        );
        
      case '4':
        return (
          <div>
            <Title level={2}>📦 Inventario - Test</Title>
            <Card>
              <p>✅ Si ves este texto, la sección de inventario está funcionando.</p>
              <p>📊 Productos en inventario: {productos.length}</p>
              <p>🔍 Inventario filtrado: {inventarioFiltrado ? inventarioFiltrado.length : 0}</p>
              <Button type="primary" onClick={generarDatosEjemplo}>Cargar Datos de Ejemplo</Button>
              {productos.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h3>Inventario:</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Producto</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Precio</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Stock</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.map((p: any) => (
                        <tr key={p.key}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.nombre}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>${p.precio}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{p.stock}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>${(p.precio * p.stock).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <AppstoreOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                Control de Inventario
              </Title>
              <Space>
                <Button icon={<DownloadOutlined />}>Exportar</Button>
                <Button type="primary" icon={<PlusOutlined />}>Ajuste de Inventario</Button>
              </Space>
            </div>
            
            {/* Búsqueda y Filtros Avanzados para Inventario */}
            <Card style={{ marginBottom: '24px' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Input.Search
                    placeholder="Buscar en inventario por nombre, código..."
                    value={busquedaInventario}
                    onChange={(e) => {
                      setBusquedaInventario(e.target.value)
                      buscarInventario(e.target.value)
                    }}
                    onSearch={buscarInventario}
                    allowClear
                    onClear={() => {
                      setBusquedaInventario('')
                      aplicarFiltrosInventario()
                    }}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={8} md={3}>
                  <Checkbox
                    checked={filtroStockBajo}
                    onChange={(e) => setFiltroStockBajo(e.target.checked)}
                  >
                    Stock Bajo
                  </Checkbox>
                </Col>
                <Col xs={24} sm={8} md={3}>
                  <Checkbox
                    checked={filtroSinStock}
                    onChange={(e) => setFiltroSinStock(e.target.checked)}
                  >
                    Sin Stock
                  </Checkbox>
                </Col>
                <Col xs={24} sm={8} md={6}>
                  <Button 
                    onClick={limpiarFiltrosInventario}
                    icon={<SearchOutlined />}
                    style={{ width: '100%' }}
                  >
                    Limpiar Filtros
                  </Button>
                </Col>
              </Row>
              
              <Row style={{ marginTop: '12px' }}>
                <Col xs={24}>
                  <Text style={{ color: '#666', fontSize: '14px' }}>
                    {inventarioFiltrado.length} de {productos.length} productos en inventario
                    {busquedaInventario && (
                      <span style={{ marginLeft: '8px', color: '#1890ff' }}>
                        - Búsqueda: "{busquedaInventario}"
                      </span>
                    )}
                    {(filtroStockBajo || filtroSinStock) && (
                      <span style={{ marginLeft: '8px', color: '#f5222d' }}>
                        - Filtros aplicados
                      </span>
                    )}
                  </Text>
                </Col>
              </Row>
            </Card>
            
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Productos en Stock"
                    value={inventarioFiltrado.filter((p: any) => p.stock > 0).length}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<AppstoreOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Stock Bajo"
                    value={inventarioFiltrado.filter((p: any) => p.stock > 0 && p.stock <= 10).length}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix={<WarningOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Sin Stock"
                    value={inventarioFiltrado.filter((p: any) => p.stock === 0).length}
                    valueStyle={{ color: '#ff4d4f' }}
                    prefix={<WarningOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Valor Total"
                    value={inventarioFiltrado.reduce((total: number, p: any) => total + (p.precio * p.stock), 0)}
                    precision={2}
                    valueStyle={{ color: '#1890ff' }}
                    prefix="$"
                  />
                </Card>
              </Col>
            </Row>

            <Card>
              <Table
                dataSource={inventarioFiltrado.map((producto: any) => ({
                  key: producto.key,
                  producto: producto.nombre,
                  codigo: producto.codigo,
                  categoria: producto.categoria,
                  stockActual: producto.stock,
                  stockMinimo: 10, // Valor por defecto, se puede hacer configurable más tarde
                  ultimaEntrada: new Date().toISOString().split('T')[0], // Fecha actual como placeholder
                  valorStock: producto.precio * producto.stock,
                  precio: producto.precio
                }))}
                columns={[
                  {
                    title: 'Código',
                    dataIndex: 'codigo',
                    key: 'codigo',
                    width: 100,
                    render: (codigo) => (
                      <span style={{ fontFamily: 'monospace' }}>
                        {codigo || ''}
                      </span>
                    )
                  },
                  {
                    title: 'Producto',
                    dataIndex: 'producto',
                    key: 'producto',
                    render: (producto) => (
                      <span>
                        {producto}
                      </span>
                    )
                  },
                  {
                    title: 'Categoría',
                    dataIndex: 'categoria',
                    key: 'categoria',
                    render: (categoria) => (
                      <Tag color="blue">
                        {categoria}
                      </Tag>
                    )
                  },
                  {
                    title: 'Stock Actual',
                    dataIndex: 'stockActual',
                    key: 'stockActual',
                    render: (stock, record) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag color={
                          stock === 0 ? 'red' : 
                          stock <= record.stockMinimo ? 'orange' : 'green'
                        }>
                          {stock} unidades
                        </Tag>
                        {stock === 0 && <WarningOutlined style={{ color: '#ff4d4f' }} />}
                        {stock > 0 && stock <= record.stockMinimo && <WarningOutlined style={{ color: '#fa8c16' }} />}
                      </div>
                    ),
                    sorter: (a, b) => a.stockActual - b.stockActual
                  },
                  {
                    title: 'Stock Mínimo',
                    dataIndex: 'stockMinimo',
                    key: 'stockMinimo',
                    width: 120,
                    render: (stockMinimo) => `${stockMinimo} un.`
                  },
                  {
                    title: 'Precio Unit.',
                    dataIndex: 'precio',
                    key: 'precio',
                    render: (precio) => `$${precio}`,
                    sorter: (a, b) => a.precio - b.precio
                  },
                  {
                    title: 'Valor en Stock',
                    dataIndex: 'valorStock',
                    key: 'valorStock',
                    render: (valor) => (
                      <Text strong style={{ color: valor > 1000 ? '#52c41a' : '#1890ff' }}>
                        ${valor.toFixed(2)}
                      </Text>
                    ),
                    sorter: (a, b) => a.valorStock - b.valorStock
                  },
                  {
                    title: 'Última Entrada',
                    dataIndex: 'ultimaEntrada',
                    key: 'ultimaEntrada',
                    width: 120,
                    render: (fecha) => fecha
                  },
                  {
                    title: 'Acciones',
                    key: 'acciones',
                    width: 150,
                    render: (_, record) => (
                      <Space>
                        <Button 
                          icon={<EditOutlined />} 
                          size="small"
                          type="primary"
                          ghost
                          onClick={() => message.info('Función de ajuste de stock próximamente')}
                        >
                          Ajustar
                        </Button>
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => message.info('Función de historial próximamente')}
                        >
                          Historial
                        </Button>
                      </Space>
                    ),
                  },
                ]}
                pagination={{ 
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} productos`,
                  showSizeChanger: true,
                  showQuickJumper: true
                }}
                scroll={{ x: 1200 }}
                locale={{
                  emptyText: inventarioFiltrado.length === 0 && productos.length > 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <SearchOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                      <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                        No se encontraron productos en el inventario
                      </div>
                      <div style={{ fontSize: '14px', color: '#ccc' }}>
                        Intenta ajustar los filtros de búsqueda
                      </div>
                      <Button 
                        type="link" 
                        onClick={limpiarFiltrosInventario}
                        style={{ marginTop: '8px' }}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  ) : productos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      <AppstoreOutlined style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                      <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                        No hay productos en el inventario
                      </div>
                      <div style={{ fontSize: '14px', color: '#ccc' }}>
                        Agrega productos desde la sección "Productos" para comenzar
                      </div>
                    </div>
                  ) : 'No hay datos'
                }}
              />
            </Card>
          </div>
        );
        
      case '5':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <TeamOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                Gestión de Clientes
              </Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditandoItem(null)
                  formCliente.resetFields()
                  setModalClienteVisible(true)
                }}
              >
                Nuevo Cliente
              </Button>
            </div>
            
            <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Clientes"
                    value={clientes.length}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Clientes Activos"
                    value={clientes.filter((c: any) => c.estado === 'Activo').length}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card>
                  <Statistic
                    title="Total Ventas Clientes"
                    value={clientes.reduce((sum: number, c: any) => sum + c.totalCompras, 0)}
                    valueStyle={{ color: '#1890ff' }}
                    prefix={<DollarOutlined />}
                    precision={2}
                  />
                </Card>
              </Col>
            </Row>

            <Card>
              <div style={{ marginBottom: '16px' }}>
                <Input 
                  placeholder="Buscar clientes..." 
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                />
              </div>
              
              <Table
                dataSource={clientes}
                columns={[
                  {
                    title: 'Nombre',
                    dataIndex: 'nombre',
                    key: 'nombre',
                  },
                  {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                  },
                  {
                    title: 'Teléfono',
                    dataIndex: 'telefono',
                    key: 'telefono',
                  },
                  {
                    title: 'Tipo',
                    dataIndex: 'tipo',
                    key: 'tipo',
                    render: (tipo) => (
                      <Tag color={tipo === 'Empresa' ? 'blue' : 'green'}>
                        {tipo}
                      </Tag>
                    )
                  },
                  {
                    title: 'Total Compras',
                    dataIndex: 'totalCompras',
                    key: 'totalCompras',
                    render: (total) => `$${total.toFixed(2)}`
                  },
                  {
                    title: 'Estado',
                    dataIndex: 'estado',
                    key: 'estado',
                    render: (estado) => (
                      <Tag color={estado === 'Activo' ? 'green' : 'orange'}>
                        {estado}
                      </Tag>
                    )
                  },
                  {
                    title: 'Acciones',
                    key: 'acciones',
                    render: (_: any, record: any) => (
                      <Space>
                        <Button 
                          icon={<EyeOutlined />} 
                          size="small"
                          onClick={() => message.info(`Viendo detalles de ${record.nombre}`)}
                        />
                        <Button 
                          icon={<EditOutlined />} 
                          size="small"
                          onClick={() => abrirModalEdicion(record, 'cliente')}
                        />
                        <Button 
                          icon={<DeleteOutlined />} 
                          size="small" 
                          danger
                          onClick={() => eliminarCliente(record.key)}
                        />
                      </Space>
                    ),
                  },
                ]}
                pagination={{ pageSize: 10 }}
              />
            </Card>

            {/* Modal para Cliente */}
            <Modal
              title={editandoItem ? 'Editar Cliente' : 'Nuevo Cliente'}
              visible={modalClienteVisible}
              onCancel={() => {
                setModalClienteVisible(false)
                setEditandoItem(null)
                formCliente.resetFields()
              }}
              footer={null}
              width={600}
            >
              <Form
                form={formCliente}
                layout="vertical"
                onFinish={editandoItem ? editarCliente : agregarCliente}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="nombre"
                      label="Nombre Completo"
                      rules={[{ required: true, message: 'El nombre es requerido' }]}
                    >
                      <Input placeholder="Ej: Juan Pérez" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'El email es requerido' },
                        { type: 'email', message: 'Email inválido' }
                      ]}
                    >
                      <Input placeholder="Ej: juan@email.com" />
                    </Form.Item>
                  </Col>
                </Row>
                
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="telefono"
                      label="Teléfono"
                      rules={[{ required: true, message: 'El teléfono es requerido' }]}
                    >
                      <Input placeholder="Ej: +1234567890" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="tipo"
                      label="Tipo de Cliente"
                      rules={[{ required: true, message: 'El tipo es requerido' }]}
                    >
                      <Select
                        placeholder="Seleccionar tipo"
                        options={[
                          { value: 'Individual', label: 'Individual' },
                          { value: 'Empresa', label: 'Empresa' }
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="direccion"
                  label="Dirección"
                >
                  <Input.TextArea 
                    placeholder="Dirección completa del cliente"
                    rows={3}
                  />
                </Form.Item>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                      setModalClienteVisible(false)
                      setEditandoItem(null)
                      formCliente.resetFields()
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                      {editandoItem ? 'Actualizar' : 'Crear'} Cliente
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )
        
      case '6':
        return (
          <div>
            <Title level={2} style={{ marginBottom: '24px' }}>
              <ShoppingCartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Punto de Venta
            </Title>
            
            <Row gutter={24}>
              {/* Lista de Productos */}
              <Col xs={24} lg={14}>
                <Card title="Productos Disponibles" style={{ height: '70vh', overflowY: 'auto' }}>
                  {productos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                      <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                      <p>No hay productos disponibles</p>
                      <p>Agrega productos desde el módulo de Productos</p>
                    </div>
                  ) : (
                    <Row gutter={[16, 16]}>
                      {productos.map((producto: any) => (
                        <Col xs={24} sm={12} md={8} key={producto.key}>
                          <Card
                            size="small"
                            hoverable
                            style={{ cursor: 'pointer' }}
                            onClick={() => agregarAlCarrito(producto)}
                            cover={
                              <div style={{ 
                                height: '120px', 
                                background: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <ShopOutlined style={{ fontSize: '32px', color: '#bbb' }} />
                              </div>
                            }
                          >
                            <Card.Meta
                              title={producto.nombre}
                              description={
                                <div>
                                  <Text strong style={{ color: '#1890ff' }}>
                                    ${Number(producto.precio).toFixed(2)}
                                  </Text>
                                  <br />
                                  <Text type="secondary">
                                    Stock: {producto.stock}
                                  </Text>
                                </div>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card>
              </Col>
              
              {/* Carrito de Compras */}
              <Col xs={24} lg={10}>
                <Card title="Carrito de Compras" style={{ height: '70vh' }}>
                  <div style={{ height: '60%', overflowY: 'auto', marginBottom: '16px' }}>
                    {carritoItems.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <ShoppingCartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                        <p>Carrito vacío</p>
                        <p>Haz clic en los productos para agregarlos</p>
                      </div>
                    ) : (
                      carritoItems.map((item: any) => (
                        <div key={item.key} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          padding: '8px 0',
                          borderBottom: '1px solid #f0f0f0'
                        }}>
                          <div style={{ flex: 1 }}>
                            <Text strong>{item.nombre}</Text>
                            <br />
                            <Text type="secondary">
                              ${Number(item.precio).toFixed(2)} x {item.cantidad}
                            </Text>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button 
                              size="small" 
                              onClick={() => actualizarCantidadCarrito(item.key, item.cantidad - 1)}
                            >
                              -
                            </Button>
                            <Text>{item.cantidad}</Text>
                            <Button 
                              size="small" 
                              onClick={() => actualizarCantidadCarrito(item.key, item.cantidad + 1)}
                            >
                              +
                            </Button>
                            <Button 
                              size="small" 
                              danger 
                              icon={<DeleteOutlined />}
                              onClick={() => removerDelCarrito(item.key)}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Total y Checkout */}
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text style={{ fontSize: '18px' }}>
                        Subtotal: <Text strong>${calcularSubtotal().toFixed(2)}</Text>
                      </Text>
                      <br />
                      <Text style={{ fontSize: '18px' }}>
                        Impuestos: <Text strong>${calcularImpuestos().toFixed(2)}</Text>
                      </Text>
                      <br />
                      <Text style={{ fontSize: '24px' }}>
                        Total: <Text strong style={{ color: '#1890ff' }}>
                          ${calcularTotal().toFixed(2)}
                        </Text>
                      </Text>
                    </div>
                    
                    <Button 
                      type="primary" 
                      size="large" 
                      block
                      disabled={carritoItems.length === 0}
                      onClick={procesarVenta}
                    >
                      Procesar Venta
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )

      case '7':
        return <ReportesAvanzados ventas={ventas} gastos={gastos} compras={compras} />

      case '8':
        return (
          <div>
            <Title level={2}>
              <FileTextOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Facturación
            </Title>
            
            {/* Acciones principales */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={24}>
                <Card>
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => {
                        // Crear nueva factura desde el carrito actual
                        if (carritoItems.length === 0) {
                          message.warning('Agregue productos al carrito para crear una factura')
                          setSelectedKey('3') // Ir al POS
                          return
                        }
                        setModalFacturaVisible(true)
                        setEditandoFactura(null)
                      }}
                    >
                      Nueva Factura
                    </Button>
                    
                    <Button 
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const data = obtenerFacturas()
                        
                        const dataStr = JSON.stringify(data, null, 2)
                        const dataBlob = new Blob([dataStr], { type: 'application/json' })
                        const url = URL.createObjectURL(dataBlob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `facturas_${new Date().toISOString().split('T')[0]}.json`
                        link.click()
                        URL.revokeObjectURL(url)
                        
                        message.success('Facturas exportadas exitosamente')
                      }}
                    >
                      Exportar Facturas
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Estadísticas de facturación */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              {(() => {
                const facturas = obtenerFacturas()
                
                const facturasPendientes = facturas.filter((f: any) => f.estado === 'Pendiente')
                const facturasPagadas = facturas.filter((f: any) => f.estado === 'Pagada')
                const facturasVencidas = facturas.filter((f: any) => {
                  const fechaVencimiento = new Date(f.fechaVencimiento)
                  const hoy = new Date()
                  return fechaVencimiento < hoy && f.estado === 'Pendiente'
                })
                
                const totalFacturado = facturas.reduce((sum: number, f: any) => sum + f.total, 0)
                const totalPendiente = facturasPendientes.reduce((sum: number, f: any) => sum + f.total, 0)
                
                return (
                  <>
                    <Col xs={24} sm={12} lg={6}>
                      <Card>
                        <Statistic
                          title="Total Facturado"
                          value={totalFacturado}
                          precision={2}
                          prefix="$"
                          valueStyle={{ color: '#3f8600' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card>
                        <Statistic
                          title="Pendiente de Cobro"
                          value={totalPendiente}
                          precision={2}
                          prefix="$"
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card>
                        <Statistic
                          title="Facturas Pagadas"
                          value={facturasPagadas.length}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Card>
                        <Statistic
                          title="Facturas Vencidas"
                          value={facturasVencidas.length}
                          valueStyle={{ color: '#f5222d' }}
                        />
                      </Card>
                    </Col>
                  </>
                )
              })()}
            </Row>

            {/* Lista de facturas */}
            <Row>
              <Col span={24}>
                <Card title="Lista de Facturas">
                  {(() => {
                    const facturas = obtenerFacturas()
                    
                    if (facturas.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                          <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                          <p>No hay facturas generadas</p>
                          <Button 
                            type="primary" 
                            onClick={() => setSelectedKey('3')}
                          >
                            Ir al POS para crear ventas
                          </Button>
                        </div>
                      )
                    }
                    
                    const columns = [
                      {
                        title: 'N° Factura',
                        dataIndex: 'numeroFactura',
                        key: 'numeroFactura',
                        render: (text: string) => <Text strong>{text}</Text>
                      },
                      {
                        title: 'Cliente',
                        dataIndex: 'cliente',
                        key: 'cliente',
                        render: (cliente: any) => cliente ? cliente.nombre : 'Cliente General'
                      },
                      {
                        title: 'Fecha',
                        dataIndex: 'fecha',
                        key: 'fecha',
                        render: (fecha: string) => new Date(fecha).toLocaleDateString('es-ES')
                      },
                      {
                        title: 'Vencimiento',
                        dataIndex: 'fechaVencimiento',
                        key: 'fechaVencimiento',
                        render: (fecha: string) => new Date(fecha).toLocaleDateString('es-ES')
                      },
                      {
                        title: 'Total',
                        dataIndex: 'total',
                        key: 'total',
                        render: (total: number) => `$${total.toFixed(2)}`
                      },
                      {
                        title: 'Estado',
                        dataIndex: 'estado',
                        key: 'estado',
                        render: (estado: string, record: any) => {
                          const fechaVencimiento = new Date(record.fechaVencimiento)
                          const hoy = new Date()
                          const estaVencida = fechaVencimiento < hoy && estado === 'Pendiente'
                          
                          let color = 'blue'
                          let estadoFinal = estado
                          
                          if (estaVencida) {
                            color = 'red'
                            estadoFinal = 'Vencida'
                          } else if (estado === 'Pagada') {
                            color = 'green'
                          } else if (estado === 'Pendiente') {
                            color = 'orange'
                          }
                          
                          return <Tag color={color}>{estadoFinal}</Tag>
                        }
                      },
                      {
                        title: 'Acciones',
                        key: 'acciones',
                        render: (_: any, record: any) => (
                          <Space>
                            <Button 
                              type="text" 
                              icon={<EyeOutlined />}
                              onClick={() => {
                                setEditandoFactura(record)
                                setModalFacturaVisible(true)
                              }}
                            >
                              Ver
                            </Button>
                            <Button 
                              type="text" 
                              icon={<DownloadOutlined />}
                              onClick={() => {
                                // Generar PDF simple
                                const printWindow = window.open('', '_blank')
                                printWindow?.document.write(`
                                  <html>
                                    <head>
                                      <title>Factura ${record.numeroFactura}</title>
                                      <style>
                                        body { font-family: Arial, sans-serif; padding: 20px; }
                                        .header { text-align: center; border-bottom: 2px solid #1890ff; padding-bottom: 20px; margin-bottom: 20px; }
                                        .factura-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
                                        .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
                                        .items th, .items td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                        .items th { background-color: #f5f5f5; }
                                        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
                                        .footer { margin-top: 40px; text-align: center; color: #666; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h1>FACTURA</h1>
                                        <h2>Gestor POS</h2>
                                      </div>
                                      
                                      <div class="factura-info">
                                        <div>
                                          <strong>Factura N°:</strong> ${record.numeroFactura}<br>
                                          <strong>Fecha:</strong> ${new Date(record.fecha).toLocaleDateString('es-ES')}<br>
                                          <strong>Vencimiento:</strong> ${new Date(record.fechaVencimiento).toLocaleDateString('es-ES')}
                                        </div>
                                        <div>
                                          <strong>Cliente:</strong><br>
                                          ${record.cliente ? record.cliente.nombre : 'Cliente General'}<br>
                                          ${record.cliente ? record.cliente.email || '' : ''}<br>
                                          ${record.cliente ? record.cliente.telefono || '' : ''}
                                        </div>
                                      </div>
                                      
                                      <table class="items">
                                        <tr>
                                          <th>Descripción</th>
                                          <th>Cantidad</th>
                                          <th>Precio Unit.</th>
                                          <th>Subtotal</th>
                                        </tr>
                                        ${record.items.map((item: any) => `
                                          <tr>
                                            <td>${item.nombre}</td>
                                            <td>${item.cantidad}</td>
                                            <td>$${item.precio.toFixed(2)}</td>
                                            <td>$${(item.cantidad * item.precio).toFixed(2)}</td>
                                          </tr>
                                        `).join('')}
                                      </table>
                                      
                                      <div class="total">
                                        <strong>TOTAL: $${record.total.toFixed(2)}</strong>
                                      </div>
                                      
                                      <div class="footer">
                                        <p>Gracias por su preferencia</p>
                                        <p>Generado por Gestor POS - ${new Date().toLocaleDateString('es-ES')}</p>
                                      </div>
                                    </body>
                                  </html>
                                `)
                                printWindow?.document.close()
                                printWindow?.print()
                                
                                message.success('Factura preparada para imprimir')
                              }}
                            >
                              PDF
                            </Button>
                            {record.estado === 'Pendiente' && (
                              <Button 
                                type="text" 
                                style={{ color: '#52c41a' }}
                                onClick={() => {
                                  const facturas = obtenerFacturas()
                                  
                                  const facturasActualizadas = facturas.map((f: any) => 
                                    f.id === record.id 
                                      ? { ...f, estado: 'Pagada', fechaPago: new Date().toISOString() }
                                      : f
                                  )
                                  
                                  localStorage.setItem('gestor_facturas', JSON.stringify(facturasActualizadas))
                                  message.success('Factura marcada como pagada')
                                  // Force re-render
                                  window.location.reload()
                                }}
                              >
                                Marcar Pagada
                              </Button>
                            )}
                          </Space>
                        )
                      }
                    ]
                    
                    return (
                      <Table 
                        columns={columns}
                        dataSource={facturas}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                      />
                    )
                  })()}
                </Card>
              </Col>
            </Row>

            {/* Modal para crear/ver factura */}
            <Modal
              title={editandoFactura ? `Factura ${editandoFactura.numeroFactura}` : 'Nueva Factura'}
              open={modalFacturaVisible}
              onCancel={() => {
                setModalFacturaVisible(false)
                setEditandoFactura(null)
              }}
              width={800}
              footer={editandoFactura ? [
                <Button key="close" onClick={() => setModalFacturaVisible(false)}>
                  Cerrar
                </Button>
              ] : [
                <Button key="cancel" onClick={() => setModalFacturaVisible(false)}>
                  Cancelar
                </Button>,
                <Button 
                  key="submit" 
                  type="primary"
                  onClick={() => {
                    if (carritoItems.length === 0) {
                      message.error('No hay productos en el carrito')
                      return
                    }
                    
                    const subtotal = calcularSubtotal()
                    const total = calcularTotal()
                    
                    const nuevaFactura = {
                      id: Date.now().toString(),
                      numeroFactura: `F-${Date.now().toString().slice(-6)}`,
                      fecha: new Date().toISOString(),
                      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
                      cliente: clienteSeleccionado ? clientes.find((c: any) => c.key === clienteSeleccionado) : null,
                      items: carritoItems.map((item: any) => ({
                        id: item.key,
                        nombre: item.nombre,
                        precio: item.precio,
                        cantidad: item.cantidad
                      })),
                      subtotal: subtotal,
                      total: total,
                      estado: 'Pendiente',
                      notas: ''
                    }
                    
                    const facturas = obtenerFacturas()
                    
                    const facturasActualizadas = [...facturas, nuevaFactura]
                    localStorage.setItem('gestor_facturas', JSON.stringify(facturasActualizadas))
                    
                    // También procesar la venta
                    procesarVenta()
                    
                    setModalFacturaVisible(false)
                    message.success(`Factura ${nuevaFactura.numeroFactura} creada exitosamente`)
                  }}
                >
                  Crear Factura
                </Button>
              ]}
            >
              {editandoFactura ? (
                // Vista de factura existente
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text strong>Número de Factura:</Text>
                      <br />
                      <Text>{editandoFactura.numeroFactura}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Estado:</Text>
                      <br />
                      <Tag color={editandoFactura.estado === 'Pagada' ? 'green' : 'orange'}>
                        {editandoFactura.estado}
                      </Tag>
                    </Col>
                    <Col span={12}>
                      <Text strong>Fecha:</Text>
                      <br />
                      <Text>{new Date(editandoFactura.fecha).toLocaleDateString('es-ES')}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>Vencimiento:</Text>
                      <br />
                      <Text>{new Date(editandoFactura.fechaVencimiento).toLocaleDateString('es-ES')}</Text>
                    </Col>
                    <Col span={24}>
                      <Text strong>Cliente:</Text>
                      <br />
                      <Text>{editandoFactura.cliente ? editandoFactura.cliente.nombre : 'Cliente General'}</Text>
                    </Col>
                  </Row>
                  
                  <div style={{ marginTop: '20px' }}>
                    <Text strong>Productos:</Text>
                    <Table
                      size="small"
                      columns={[
                        { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
                        { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
                        { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (precio: number) => `$${precio.toFixed(2)}` },
                        { title: 'Subtotal', key: 'subtotal', render: (_: any, record: any) => `$${(record.cantidad * record.precio).toFixed(2)}` }
                      ]}
                      dataSource={editandoFactura.items}
                      pagination={false}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text strong>${editandoFactura.total.toFixed(2)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    />
                  </div>
                </div>
              ) : (
                // Vista de nueva factura
                <div>
                  <Text strong>Productos en el carrito:</Text>
                  {carritoItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                      <p>No hay productos en el carrito</p>
                      <Button type="link" onClick={() => {
                        setModalFacturaVisible(false)
                        setSelectedKey('3')
                      }}>
                        Ir al POS para agregar productos
                      </Button>
                    </div>
                  ) : (
                    <Table
                      size="small"
                      columns={[
                        { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
                        { title: 'Cantidad', dataIndex: 'cantidad', key: 'cantidad' },
                        { title: 'Precio', dataIndex: 'precio', key: 'precio', render: (precio: number) => `$${precio.toFixed(2)}` },
                        { title: 'Subtotal', key: 'subtotal', render: (_: any, record: any) => `$${(record.cantidad * record.precio).toFixed(2)}` }
                      ]}
                      dataSource={carritoItems}
                      pagination={false}
                      summary={() => (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text strong>${calcularTotal().toFixed(2)}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                    />
                  )}
                  
                  {clienteSeleccionado && (
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>Cliente seleccionado:</Text>
                      <br />
                      <Text>{clientes.find((c: any) => c.key === clienteSeleccionado)?.nombre}</Text>
                    </div>
                  )}
                </div>
              )}
            </Modal>
          </div>
        )

      case '9':
        return <ConfiguracionModule />

      case '10':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                Gestión de Proveedores y Compras
              </Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditandoItem(null)
                    formProveedor.resetFields()
                    setModalProveedorVisible(true)
                  }}
                >
                  Nuevo Proveedor
                </Button>
                <Button 
                  type="primary" 
                  icon={<TeamOutlined />}
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                  onClick={() => {
                    formProveedoresMultiples.resetFields()
                    setModalProveedoresMultiplesVisible(true)
                  }}
                >
                  Agregar Múltiples Proveedores
                </Button>
              </Space>
            </div>
            
            {/* Buscador de Proveedores */}
            <Card style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Input.Search
                  placeholder="Buscar distribuidora o producto específico..."
                  value={busquedaProveedor}
                  onChange={(e) => {
                    setBusquedaProveedor(e.target.value)
                    buscarProveedores(e.target.value)
                  }}
                  onSearch={buscarProveedores}
                  style={{ flex: 1 }}
                  size="large"
                  allowClear
                  onClear={limpiarBusqueda}
                  enterButton={
                    <Button type="primary" icon={<SearchOutlined />}>
                      Buscar
                    </Button>
                  }
                />
                
                {busquedaProveedor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {tipoBusqueda && (
                      <Tag color={tipoBusqueda === 'distribuidora' ? 'blue' : 'green'}>
                        {tipoBusqueda === 'distribuidora' ? 'Distribuidora' : 'Producto'}
                      </Tag>
                    )}
                    <Text type="secondary">
                      {resultadosBusqueda.length} resultado{resultadosBusqueda.length !== 1 ? 's' : ''}
                    </Text>
                  </div>
                )}
              </div>
              
              {mostrarResultadosVacios && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  background: '#fff2e8', 
                  border: '1px solid #ffbb96',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <WarningOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />
                  <Text style={{ color: '#ad6800' }}>
                    No se encontraron distribuidoras o productos similares a "<strong>{busquedaProveedor}</strong>".
                    Intenta con otros términos de búsqueda.
                  </Text>
                </div>
              )}
              
              {tipoBusqueda === 'producto' && resultadosBusqueda.length > 0 && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  background: '#f6ffed', 
                  border: '1px solid #b7eb8f',
                  borderRadius: '6px'
                }}>
                  <Text style={{ color: '#389e0d' }}>
                    <CheckCircleOutlined style={{ marginRight: '8px' }} />
                    Productos encontrados en las siguientes distribuidoras:
                  </Text>
                </div>
              )}
            </Card>
            
            <Row gutter={[24, 24]}>
              {/* Columna izquierda - Gestión de Proveedores */}
              <Col xs={24} lg={14}>
                <Card 
                  title={
                    <span>
                      <UserOutlined style={{ marginRight: '8px' }} />
                      Proveedores Registrados
                    </span>
                  }
                  style={{ height: '100%' }}
                >
                  <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={8}>
                      <Card size="small">
                        <Statistic
                          title={busquedaProveedor ? "Proveedores Encontrados" : "Total Proveedores"}
                          value={proveedoresFiltrados.length}
                          valueStyle={{ color: '#1890ff' }}
                          prefix={<UserOutlined />}
                          suffix={busquedaProveedor ? `de ${proveedores.length}` : ''}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card size="small">
                        <Statistic
                          title="Proveedores Activos"
                          value={proveedoresFiltrados.filter((p: any) => p.estado === 'Activo').length}
                          valueStyle={{ color: '#52c41a' }}
                          prefix={<CheckCircleOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Card size="small">
                        <Statistic
                          title="Artículos Disponibles"
                          value={proveedoresFiltrados.reduce((sum: number, p: any) => sum + obtenerArticulosGenerales(p).length, 0)}
                          valueStyle={{ color: '#722ed1' }}
                          prefix={<ShopOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Table
                    dataSource={proveedoresFiltrados}
                    size="small"
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={{ margin: 0, padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={5} style={{ margin: 0 }}>
                              <ShopOutlined style={{ marginRight: '8px' }} />
                              Productos Específicos de {record.nombre}
                            </Title>
                            <Button 
                              type="primary" 
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={() => abrirModalProductosProveedor(record)}
                            >
                              Gestionar Productos
                            </Button>
                          </div>
                          
                          {record.productosEspecificos && record.productosEspecificos.length > 0 ? (
                            <Row gutter={[12, 12]}>
                              {record.productosEspecificos.map((producto: any, index: number) => {
                                const esCoincidente = esProductoCoincidente(producto, record)
                                return (
                                  <Col xs={24} sm={12} md={8} key={index}>
                                    <Card 
                                      size="small" 
                                      style={{ 
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        border: esCoincidente ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                        background: esCoincidente ? '#f6ffed' : '#fff',
                                        boxShadow: esCoincidente ? '0 2px 8px rgba(82, 196, 26, 0.3)' : undefined
                                      }}
                                      hoverable
                                      onClick={() => agregarProductoEspecificoAlCarrito(record, producto)}
                                      bodyStyle={{ padding: '12px' }}
                                    >
                                      <div style={{ textAlign: 'center' }}>
                                        {esCoincidente && (
                                          <div style={{
                                            position: 'absolute',
                                            top: '4px',
                                            right: '4px',
                                            background: '#52c41a',
                                            color: 'white',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            fontSize: '10px',
                                            fontWeight: 'bold'
                                          }}>
                                            ENCONTRADO
                                          </div>
                                        )}
                                        <ShoppingCartOutlined 
                                          style={{ 
                                            fontSize: '24px', 
                                            color: esCoincidente ? '#52c41a' : '#1890ff', 
                                            marginBottom: '8px' 
                                          }} 
                                        />
                                        <div>
                                          <Text strong style={{ fontSize: '14px' }}>
                                            {tipoBusqueda === 'producto' && esCoincidente 
                                              ? resaltarTexto(producto.nombre, busquedaProveedor)
                                              : producto.nombre
                                            }
                                          </Text>
                                        </div>
                                        {producto.precio > 0 && (
                                          <div style={{ marginTop: '4px' }}>
                                            <Text style={{ 
                                              color: '#52c41a', 
                                              fontWeight: 'bold',
                                              fontSize: '16px'
                                            }}>
                                              ${producto.precio}
                                            </Text>
                                          </div>
                                        )}
                                        {producto.descripcion && (
                                          <div style={{ marginTop: '4px' }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                              {producto.descripcion}
                                            </Text>
                                          </div>
                                        )}
                                        <div style={{ 
                                          marginTop: '8px', 
                                          padding: '4px 8px', 
                                          background: esCoincidente ? '#e6f7ff' : '#e6f7ff', 
                                          borderRadius: '4px',
                                          fontSize: '11px',
                                          color: esCoincidente ? '#52c41a' : '#1890ff'
                                        }}>
                                          Click para agregar al carrito
                                        </div>
                                      </div>
                                    </Card>
                                  </Col>
                                )
                              })}
                            </Row>
                          ) : (
                            <div style={{ 
                              textAlign: 'center', 
                              padding: '24px',
                              border: '2px dashed #d9d9d9',
                              borderRadius: '8px',
                              background: '#fff'
                            }}>
                              <ShopOutlined style={{ fontSize: '32px', color: '#d9d9d9', marginBottom: '8px' }} />
                              <div style={{ color: '#999' }}>
                                No hay productos específicos registrados
                              </div>
                              <Button 
                                type="dashed" 
                                size="small"
                                icon={<PlusOutlined />}
                                style={{ marginTop: '8px' }}
                                onClick={() => abrirModalProductosProveedor(record)}
                              >
                                Agregar Productos
                              </Button>
                            </div>
                          )}
                        </div>
                      ),
                      rowExpandable: (record) => true,
                      expandIcon: ({ expanded, onExpand, record }) => (
                        <Button
                          type="text"
                          size="small"
                          icon={expanded ? <UpOutlined /> : <DownOutlined />}
                          onClick={(e) => onExpand(record, e)}
                          style={{ border: 'none' }}
                        />
                      )
                    }}
                    columns={[
                      {
                        title: 'Proveedor',
                        dataIndex: 'nombre',
                        key: 'nombre',
                        render: (text, record: any) => (
                          <div>
                            <Text strong>
                              {tipoBusqueda === 'distribuidora' && busquedaProveedor
                                ? resaltarTexto(text, busquedaProveedor)
                                : text
                              }
                            </Text>
                            {tipoBusqueda === 'producto' && record.productosCoincidentes && (
                              <div style={{ marginTop: '4px' }}>
                                <Tag color="green" size="small">
                                  Productos encontrados: {record.productosCoincidentes.length}
                                </Tag>
                              </div>
                            )}
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {record.productosEspecificos?.length || 0} productos específicos •{' '}
                              {obtenerArticulosGenerales(record).length} categorías disponibles
                            </Text>
                          </div>
                        )
                      },
                      {
                        title: 'Contacto',
                        dataIndex: 'contacto',
                        key: 'contacto',
                      },
                      {
                        title: 'Artículos Disponibles',
                        dataIndex: 'articulos',
                        key: 'articulos',
                        render: (articulos: string[], record: any) => {
                          const articulosGenerales = obtenerArticulosGenerales(record)
                          
                          return (
                            <div style={{ maxWidth: '200px' }}>
                              {articulosGenerales && articulosGenerales.length > 0 ? (
                                <div>
                                  {articulosGenerales.slice(0, 2).map((articulo: string, index: number) => (
                                    <Tag 
                                      key={index} 
                                      color="blue" 
                                      style={{ margin: '2px', cursor: 'pointer' }}
                                      onClick={() => {
                                        agregarArticuloACarritoCompras(record, articulo)
                                      }}
                                    >
                                      {articulo}
                                    </Tag>
                                  ))}
                                  {articulosGenerales.length > 2 && (
                                    <Tag color="default">+{articulosGenerales.length - 2} más</Tag>
                                  )}
                                </div>
                              ) : (
                                <Text type="secondary">Sin artículos</Text>
                              )}
                            </div>
                          )
                        }
                      },
                      {
                        title: 'Acciones',
                        key: 'acciones',
                        render: (_, record) => (
                          <Space>
                            <Button
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => {
                                Modal.info({
                                  title: `Detalles de ${record.nombre}`,
                                  width: 600,
                                  content: (
                                    <div>
                                      <p><strong>Contacto:</strong> {record.contacto}</p>
                                      <p><strong>Teléfono:</strong> {record.telefono}</p>
                                      <p><strong>Email:</strong> {record.email}</p>
                                      <p><strong>Dirección:</strong> {record.direccion}</p>
                                      <p><strong>Estado:</strong> {record.estado}</p>
                                      <div style={{ marginTop: '16px' }}>
                                        <strong>Artículos que suministra:</strong>
                                        <div style={{ marginTop: '8px' }}>
                                          {record.articulos && record.articulos.length > 0 ? (
                                            record.articulos.map((articulo: string, index: number) => (
                                              <Tag 
                                                key={index} 
                                                color="blue" 
                                                style={{ margin: '2px', cursor: 'pointer' }}
                                                onClick={() => {
                                                  agregarArticuloACarritoCompras(record, articulo)
                                                  Modal.destroyAll()
                                                }}
                                              >
                                                {articulo} (Click para agregar al carrito)
                                              </Tag>
                                            ))
                                          ) : (
                                            <Text type="secondary">No se han registrado artículos</Text>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                              }}
                            >
                              Ver
                            </Button>
                            <Button
                              size="small"
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => {
                                setEditandoItem(record)
                                formProveedor.setFieldsValue(record)
                                setModalProveedorVisible(true)
                              }}
                            >
                              Editar
                            </Button>
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => eliminarProveedor(record.key)}
                            >
                              Eliminar
                            </Button>
                          </Space>
                        )
                      }
                    ]}
                    scroll={{ x: 400 }}
                    locale={{
                      emptyText: proveedores.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                          <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                            No hay proveedores registrados
                          </div>
                          <Text type="secondary">
                            Agrega tu primer proveedor para comenzar
                          </Text>
                        </div>
                      ) : busquedaProveedor ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                          <SearchOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                          <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                            No se encontraron resultados para "{busquedaProveedor}"
                          </div>
                          <Text type="secondary">
                            Intenta con otros términos de búsqueda o{' '}
                            <Button type="link" onClick={limpiarBusqueda} style={{ padding: 0 }}>
                              ver todos los proveedores
                            </Button>
                          </Text>
                        </div>
                      ) : 'No hay datos'
                    }}
                  />
                </Card>
              </Col>

              {/* Columna derecha - Carrito de Compras */}
              <Col xs={24} lg={10}>
                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <ShoppingCartOutlined style={{ marginRight: '8px' }} />
                        Carrito de Compras
                      </span>
                      <Space>
                        <Text type="secondary">
                          {carritoCompras.length} artículo{carritoCompras.length !== 1 ? 's' : ''}
                        </Text>
                        {carritoCompras.length > 0 && (
                          <Button 
                            size="small" 
                            danger 
                            ghost
                            onClick={limpiarCarritoCompras}
                          >
                            Limpiar
                          </Button>
                        )}
                      </Space>
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  {carritoCompras.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <ShoppingCartOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                      <Title level={4} style={{ color: '#999', marginBottom: '8px' }}>
                        Carrito Vacío
                      </Title>
                      <Text type="secondary">
                        Haz clic en los artículos de los proveedores para agregarlos al carrito
                      </Text>
                    </div>
                  ) : (
                    <div>
                      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '16px' }}>
                        {carritoCompras.map((item: any) => (
                          <Card 
                            key={item.key} 
                            size="small" 
                            style={{ marginBottom: '8px' }}
                            title={
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong>{item.articulo}</Text>
                                <Button 
                                  size="small" 
                                  type="text" 
                                  danger 
                                  icon={<DeleteOutlined />}
                                  onClick={() => removerArticuloDelCarritoCompras(item.key)}
                                />
                              </div>
                            }
                          >
                            <div style={{ marginBottom: '8px' }}>
                              <Text type="secondary">Proveedor: {item.proveedor.nombre}</Text>
                            </div>
                            
                            <Row gutter={8}>
                              <Col span={8}>
                                <div>
                                  <Text style={{ fontSize: '12px', color: '#666' }}>Cantidad</Text>
                                  <InputNumber
                                    size="small"
                                    min={1}
                                    value={item.cantidad}
                                    onChange={(value) => actualizarCantidadCarritoCompras(item.key, value || 1)}
                                    style={{ width: '100%' }}
                                  />
                                </div>
                              </Col>
                              <Col span={8}>
                                <div>
                                  <Text style={{ fontSize: '12px', color: '#666' }}>Precio Unit.</Text>
                                  <InputNumber
                                    size="small"
                                    min={0}
                                    step={0.01}
                                    value={item.precioUnitario}
                                    onChange={(value) => actualizarPrecioCarritoCompras(item.key, value || 0)}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `$ ${value}`}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                  />
                                </div>
                              </Col>
                              <Col span={8}>
                                <div>
                                  <Text style={{ fontSize: '12px', color: '#666' }}>Subtotal</Text>
                                  <div style={{ 
                                    padding: '4px 8px', 
                                    background: '#f5f5f5', 
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#1890ff'
                                  }}>
                                    ${(item.cantidad * item.precioUnitario).toFixed(2)}
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </div>

                      <div style={{ 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: '16px', 
                        textAlign: 'center' 
                      }}>
                        <div style={{ marginBottom: '16px' }}>
                          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            Total: ${carritoCompras.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0).toFixed(2)}
                          </Title>
                        </div>
                        
                        <Button 
                          type="primary" 
                          size="large"
                          block
                          icon={<ShoppingCartOutlined />}
                          onClick={procesarCompraAProveedor}
                          style={{ 
                            height: '48px',
                            fontSize: '16px',
                            background: '#52c41a',
                            borderColor: '#52c41a'
                          }}
                        >
                          Procesar Compra
                        </Button>
                        
                        <Text 
                          type="secondary" 
                          style={{ 
                            display: 'block', 
                            marginTop: '8px', 
                            fontSize: '12px' 
                          }}
                        >
                          Los artículos se agregarán al inventario
                        </Text>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {/* Modal para agregar múltiples proveedores */}
            <Modal
              title="Agregar Múltiples Proveedores"
              open={modalProveedoresMultiplesVisible}
              onCancel={() => {
                setModalProveedoresMultiplesVisible(false)
                formProveedoresMultiples.resetFields()
              }}
              footer={null}
              width={800}
            >
              <Form
                form={formProveedoresMultiples}
                onFinish={agregarProveedoresMultiples}
                layout="vertical"
              >
                <Form.List name="proveedores">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card 
                          key={key} 
                          size="small" 
                          title={`Proveedor ${name + 1}`}
                          extra={
                            fields.length > 1 ? (
                              <Button 
                                type="link" 
                                danger 
                                onClick={() => remove(name)}
                                icon={<DeleteOutlined />}
                              >
                                Eliminar
                              </Button>
                            ) : null
                          }
                          style={{ marginBottom: '16px' }}
                        >
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'nombre']}
                                label="Nombre del Proveedor"
                                rules={[{ required: true, message: 'Ingrese el nombre del proveedor' }]}
                              >
                                <Input placeholder="Ej: Distribuidora ABC" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'contacto']}
                                label="Persona de Contacto"
                                rules={[{ required: true, message: 'Ingrese el contacto' }]}
                              >
                                <Input placeholder="Ej: Juan Pérez" />
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'telefono']}
                                label="Teléfono"
                                rules={[{ required: true, message: 'Ingrese el teléfono' }]}
                              >
                                <Input placeholder="Ej: +1 555 123-4567" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'email']}
                                label="Email"
                                rules={[
                                  { required: true, message: 'Ingrese el email' },
                                  { type: 'email', message: 'Ingrese un email válido' }
                                ]}
                              >
                                <Input placeholder="ejemplo@proveedor.com" />
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'direccion']}
                            label="Dirección"
                          >
                            <Input.TextArea 
                              placeholder="Dirección completa del proveedor"
                              rows={2}
                            />
                          </Form.Item>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'articulos']}
                            label="Artículos que Suministra"
                            rules={[{ required: true, message: 'Ingrese al menos un artículo' }]}
                          >
                            <Select
                              mode="tags"
                              placeholder="Escriba los artículos y presione Enter"
                              style={{ width: '100%' }}
                              tokenSeparators={[',']}
                            />
                          </Form.Item>
                        </Card>
                      ))}
                      
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          Agregar Otro Proveedor
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                      setModalProveedoresMultiplesVisible(false)
                      formProveedoresMultiples.resetFields()
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Agregar Proveedores
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal para agregar/editar proveedor individual */}
            <Modal
              title={editandoItem ? "Editar Proveedor" : "Nuevo Proveedor"}
              open={modalProveedorVisible}
              onCancel={() => {
                setModalProveedorVisible(false)
                setEditandoItem(null)
                formProveedor.resetFields()
              }}
              footer={null}
              width={600}
            >
              <Form
                form={formProveedor}
                onFinish={editandoItem ? editarProveedor : agregarProveedor}
                layout="vertical"
                initialValues={{
                  estado: 'Activo',
                  articulos: []
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Nombre del Proveedor"
                      name="nombre"
                      rules={[{ required: true, message: 'Por favor ingresa el nombre del proveedor' }]}
                    >
                      <Input placeholder="Ej: Distribuidora ABC" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Contacto Principal"
                      name="contacto"
                      rules={[{ required: true, message: 'Por favor ingresa el contacto' }]}
                    >
                      <Input placeholder="Ej: Juan Pérez" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Teléfono"
                      name="telefono"
                      rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
                    >
                      <Input placeholder="Ej: +1234567890" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: 'Por favor ingresa el email' },
                        { type: 'email', message: 'Por favor ingresa un email válido' }
                      ]}
                    >
                      <Input placeholder="Ej: contacto@distribuidora.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Dirección"
                  name="direccion"
                  rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}
                >
                  <Input.TextArea 
                    placeholder="Ej: Calle Principal 123, Ciudad, País" 
                    rows={3}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Estado"
                      name="estado"
                      rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
                    >
                      <Select placeholder="Selecciona el estado">
                        <Select.Option value="Activo">Activo</Select.Option>
                        <Select.Option value="Inactivo">Inactivo</Select.Option>
                        <Select.Option value="Suspendido">Suspendido</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Artículos que Suministra"
                      name="articulos"
                    >
                      <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Escribe y presiona Enter para agregar artículos"
                        tokenSeparators={[',']}
                        maxTagCount="responsive"
                      >
                        {/* Opciones predefinidas comunes */}
                        <Select.Option value="Electrónicos">Electrónicos</Select.Option>
                        <Select.Option value="Ropa">Ropa</Select.Option>
                        <Select.Option value="Alimentos">Alimentos</Select.Option>
                        <Select.Option value="Bebidas">Bebidas</Select.Option>
                        <Select.Option value="Oficina">Oficina</Select.Option>
                        <Select.Option value="Hogar">Hogar</Select.Option>
                        <Select.Option value="Deportes">Deportes</Select.Option>
                        <Select.Option value="Salud">Salud</Select.Option>
                        <Select.Option value="Belleza">Belleza</Select.Option>
                        <Select.Option value="Automóvil">Automóvil</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                      setModalProveedorVisible(false)
                      setEditandoItem(null)
                      formProveedor.resetFields()
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                      {editandoItem ? "Actualizar" : "Agregar"} Proveedor
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>

            {/* Modal para gestionar productos específicos del proveedor */}
            <Modal
              title={
                <span>
                  <ShopOutlined style={{ marginRight: '8px' }} />
                  Gestionar Productos de {proveedorEditandoProductos?.nombre}
                </span>
              }
              open={modalProductosProveedorVisible}
              onCancel={() => {
                setModalProductosProveedorVisible(false)
                setProveedorEditandoProductos(null)
                formProductosProveedor.resetFields()
              }}
              footer={null}
              width={800}
            >
              <div style={{ marginBottom: '16px' }}>
                <Text type="secondary">
                  Define los productos específicos que ofrece este proveedor con sus precios y descripciones.
                </Text>
              </div>

              <Form
                form={formProductosProveedor}
                onFinish={guardarProductosProveedor}
                layout="vertical"
              >
                <Form.List name="productos">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card 
                          key={key}
                          size="small"
                          style={{ marginBottom: '16px' }}
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>
                                <ShopOutlined style={{ marginRight: '8px' }} />
                                Producto #{name + 1}
                              </span>
                              {fields.length > 1 && (
                                <Button 
                                  type="text" 
                                  danger 
                                  size="small"
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(name)}
                                >
                                  Eliminar
                                </Button>
                              )}
                            </div>
                          }
                        >
                          <Row gutter={16}>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'nombre']}
                                label="Nombre del Producto"
                                rules={[{ required: true, message: 'Ingresa el nombre del producto' }]}
                              >
                                <Input placeholder="Ej: Laptop Dell Inspiron 15" />
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item
                                {...restField}
                                name={[name, 'precio']}
                                label="Precio Unitario"
                                rules={[{ required: true, message: 'Ingresa el precio' }]}
                              >
                                <InputNumber
                                  style={{ width: '100%' }}
                                  min={0}
                                  step={0.01}
                                  formatter={(value) => `$ ${value}`}
                                  parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                  placeholder="0.00"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                          
                          <Form.Item
                            {...restField}
                            name={[name, 'descripcion']}
                            label="Descripción (Opcional)"
                          >
                            <Input.TextArea 
                              placeholder="Descripción detallada del producto, especificaciones, etc."
                              rows={2}
                            />
                          </Form.Item>
                        </Card>
                      ))}
                      
                      <Form.Item>
                        <Button 
                          type="dashed" 
                          onClick={() => add()} 
                          block 
                          icon={<PlusOutlined />}
                        >
                          Agregar Otro Producto
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => {
                      setModalProductosProveedorVisible(false)
                      setProveedorEditandoProductos(null)
                      formProductosProveedor.resetFields()
                    }}>
                      Cancelar
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Guardar Productos
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )
        
      default:
        return (
          <div>
            <Title level={2}>
              <SettingOutlined style={{ marginRight: '12px', color: '#666' }} />
              Módulo en Desarrollo
            </Title>
            <Card>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <SettingOutlined style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#666' }}>
                  Este módulo está siendo desarrollado
                </Title>
                <Text style={{ color: '#999' }}>
                  Próximamente tendrás acceso a todas las funcionalidades
                </Text>
              </div>
            </Card>
          </div>
        )
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header del Dashboard */}
      <Header style={{ 
        ...customStyles.header,
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ color: 'white', fontSize: '16px', marginRight: '16px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ShopOutlined style={{ fontSize: '24px', color: colors.light, marginRight: '12px' }} />
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              Gestor POS - Dashboard
            </Title>
          </div>
        </div>
        
        <Space>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Bienvenido, {localStorage.getItem('gestor_user') || 'Usuario'}
          </Text>
          <Button 
            type="text" 
            icon={<LogoutOutlined />}
            onClick={logout}
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            Salir
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* Sidebar Menu */}
        <Sider 
          collapsible 
 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          width={250}
          style={customStyles.sider}
        >
          <div style={{ 
            padding: '16px', 
            borderBottom: `1px solid ${colors.primary}40`,
            background: `linear-gradient(45deg, ${colors.dark} 0%, ${colors.primary}20 100%)`
          }}>
            <Text strong style={{ 
              fontSize: collapsed ? '12px' : '14px',
              color: colors.light
            }}>
              {collapsed ? 'MENÚ' : 'MENÚ PRINCIPAL'}
            </Text>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ 
              borderRight: 0, 
              height: '100%',
              background: 'transparent'
            }}
            theme="dark"
            items={menuItems}
          />
        </Sider>

        {/* Content Area */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{
            padding: '24px',
            margin: 0,
            minHeight: 280,
            ...customStyles.content,
            borderRadius: '8px'
          }}>
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

const App: React.FC = () => {
  const { isAuthenticated, login, logout } = useAuth()
  const [mostrarRegistro, setMostrarRegistro] = React.useState(false)
  const [mostrarLogin, setMostrarLogin] = React.useState(false)

  // Si el usuario está autenticado, mostrar el dashboard
  if (isAuthenticated) {
    return <DashboardPage onLogout={logout} />
  }

  // Si se debe mostrar el registro
  if (mostrarRegistro) {
    return (
      <RegistroPage 
        onRegistroExitoso={() => {
          setMostrarRegistro(false)
          setMostrarLogin(true)
        }} 
      />
    )
  }

  // Si se debe mostrar el login
  if (mostrarLogin) {
    return (
      <LoginPage 
        onLogin={login}
        onIrARegistro={() => {
          setMostrarLogin(false)
          setMostrarRegistro(true)
        }}
      />
    )
  }

  // Página principal con opciones
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: '500px',
        textAlign: 'center',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <Title level={1} style={{ color: '#1890ff', marginBottom: '8px' }}>
            <ShopOutlined style={{ marginRight: '12px' }} />
            Gestor POS
          </Title>
          <Text style={{ color: '#666', fontSize: '18px' }}>
            Sistema de Gestión Empresarial
          </Text>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Gestiona tu negocio de manera profesional con nuestro sistema integral 
            de punto de venta, inventario y clientes.
          </Paragraph>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<LoginOutlined />}
            onClick={() => setMostrarLogin(true)}
            style={{ width: '100%', height: '48px', fontSize: '16px' }}
          >
            Iniciar Sesión
          </Button>
          
          <Button 
            size="large" 
            icon={<UserAddOutlined />}
            onClick={() => setMostrarRegistro(true)}
            style={{ width: '100%', height: '48px', fontSize: '16px' }}
          >
            Crear Cuenta Nueva
          </Button>
        </Space>

        <div style={{ marginTop: '32px', padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
          <Text style={{ color: '#999' }}>
            ¿Necesitas ayuda? Contacta nuestro soporte
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default App
