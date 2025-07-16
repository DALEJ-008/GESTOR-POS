import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Tooltip,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  InputNumber,
  message
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  WarningOutlined,
  ExportOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface InventoryItem {
  id: number;
  productName: string;
  sku: string;
  categoryName: string;
  warehouse: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  lastMovement: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

const { Search } = Input;
const { Option } = Select;

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [adjustmentModalVisible, setAdjustmentModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      // Simulación de datos de inventario
      const mockInventory: InventoryItem[] = [
        {
          id: 1,
          productName: 'Laptop HP Pavilion',
          sku: 'HP-PAV-001',
          categoryName: 'Computadoras',
          warehouse: 'Almacén Principal',
          currentStock: 25,
          minStock: 5,
          maxStock: 100,
          unitCost: 12000,
          totalValue: 300000,
          lastMovement: '2025-01-09',
          status: 'in_stock'
        },
        {
          id: 2,
          productName: 'Mouse Logitech',
          sku: 'LOG-MX-001',
          categoryName: 'Accesorios',
          warehouse: 'Almacén Principal',
          currentStock: 3,
          minStock: 20,
          maxStock: 200,
          unitCost: 250,
          totalValue: 750,
          lastMovement: '2025-01-08',
          status: 'low_stock'
        },
        {
          id: 3,
          productName: 'Monitor Samsung',
          sku: 'SAM-MON-001',
          categoryName: 'Monitores',
          warehouse: 'Almacén Secundario',
          currentStock: 0,
          minStock: 10,
          maxStock: 50,
          unitCost: 3500,
          totalValue: 0,
          lastMovement: '2025-01-07',
          status: 'out_of_stock'
        }
      ];

      setInventory(mockInventory);
      
      // Calcular estadísticas
      const totalProducts = mockInventory.length;
      const totalValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0);
      const lowStockItems = mockInventory.filter(item => item.status === 'low_stock').length;
      const outOfStockItems = mockInventory.filter(item => item.status === 'out_of_stock').length;

      setStats({
        totalProducts,
        totalValue,
        lowStockItems,
        outOfStockItems
      });

    } catch (error) {
      message.error('Error al cargar datos de inventario');
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (_status: string, currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return <Tag color="red">Sin Stock</Tag>;
    } else if (currentStock <= minStock) {
      return <Tag color="orange">Stock Bajo</Tag>;
    } else {
      return <Tag color="green">En Stock</Tag>;
    }
  };

  const handleStockAdjustment = (item: InventoryItem) => {
    setSelectedItem(item);
    form.setFieldsValue({
      currentStock: item.currentStock,
      newStock: item.currentStock,
      reason: ''
    });
    setAdjustmentModalVisible(true);
  };

  const handleAdjustmentSubmit = async (values: any) => {
    try {
      // TODO: API call para ajustar inventario
      console.log('Adjustment values:', values);
      message.success('Ajuste de inventario realizado exitosamente');
      setAdjustmentModalVisible(false);
      fetchInventoryData();
    } catch (error) {
      message.error('Error al realizar ajuste de inventario');
    }
  };

  const columns: ColumnsType<InventoryItem> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Producto',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Categoría',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
    },
    {
      title: 'Almacén',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 150,
    },
    {
      title: 'Stock Actual',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 100,
      render: (stock: number, record: InventoryItem) => (
        <div>
          <div className="font-semibold">{stock}</div>
          {getStatusTag(record.status, stock, record.minStock)}
        </div>
      ),
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: 'Min/Max',
      key: 'minMax',
      width: 100,
      render: (_, record: InventoryItem) => (
        <div className="text-xs">
          <div>Min: {record.minStock}</div>
          <div>Max: {record.maxStock}</div>
        </div>
      ),
    },
    {
      title: 'Costo Unitario',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 120,
      render: (cost: number) => `$${cost.toLocaleString()}`,
      sorter: (a, b) => a.unitCost - b.unitCost,
    },
    {
      title: 'Valor Total',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Último Movimiento',
      dataIndex: 'lastMovement',
      key: 'lastMovement',
      width: 130,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record: InventoryItem) => (
        <Space size="small">
          <Tooltip title="Ajustar stock">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => handleStockAdjustment(record)}
            />
          </Tooltip>
          <Tooltip title="Ver movimientos">
            <Button 
              type="text" 
              icon={<AppstoreOutlined />} 
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesWarehouse = !selectedWarehouse || item.warehouse === selectedWarehouse;
    
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Inventario</h1>
        <p className="text-gray-600">Control y seguimiento de stock</p>
      </div>

      {/* Estadísticas */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Productos"
              value={stats.totalProducts}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Valor Total"
              value={stats.totalValue}
              prefix="$"
              precision={0}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Stock Bajo"
              value={stats.lowStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sin Stock"
              value={stats.outOfStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros y acciones */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <Search
              placeholder="Buscar por nombre o SKU"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Filtrar por almacén"
              allowClear
              style={{ width: 200 }}
              value={selectedWarehouse || undefined}
              onChange={setSelectedWarehouse}
            >
              <Option value="Almacén Principal">Almacén Principal</Option>
              <Option value="Almacén Secundario">Almacén Secundario</Option>
            </Select>
          </div>
          <Space>
            <Button icon={<ExportOutlined />}>
              Exportar
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Ajuste de Inventario
            </Button>
          </Space>
        </div>
      </Card>

      {/* Tabla de inventario */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredInventory}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            total: filteredInventory.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} productos`,
          }}
        />
      </Card>

      {/* Modal de ajuste de inventario */}
      <Modal
        title="Ajuste de Inventario"
        open={adjustmentModalVisible}
        onCancel={() => setAdjustmentModalVisible(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdjustmentSubmit}
        >
          <Form.Item label="Producto">
            <Input value={selectedItem?.productName} disabled />
          </Form.Item>
          <Form.Item label="SKU">
            <Input value={selectedItem?.sku} disabled />
          </Form.Item>
          <Form.Item
            label="Stock Actual"
            name="currentStock"
          >
            <InputNumber disabled style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Nuevo Stock"
            name="newStock"
            rules={[{ required: true, message: 'Ingrese el nuevo stock' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Motivo del Ajuste"
            name="reason"
            rules={[{ required: true, message: 'Ingrese el motivo del ajuste' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
