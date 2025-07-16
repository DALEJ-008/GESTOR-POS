import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Tooltip,
  message,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Services
import { productService, Product, Category, Brand } from '../../services/productService';

const { Search } = Input;
const { Option } = Select;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts();
      setProducts(response.data.results || response.data);
    } catch (error) {
      message.error('Error al cargar productos');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar categorías');
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await productService.getBrands();
      setBrands(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar marcas');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: API call to delete product
      console.log('Deleting product with id:', id);
      message.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      message.error('Error al eliminar producto');
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      // TODO: API call to duplicate product
      console.log('Duplicating product:', product.name);
      message.success('Producto duplicado exitosamente');
      fetchProducts();
    } catch (error) {
      message.error('Error al duplicar producto');
    }
  };

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return <Tag color="red">Sin stock</Tag>;
    } else if (currentStock <= minStock) {
      return <Tag color="orange">Stock bajo</Tag>;
    } else {
      return <Tag color="green">En stock</Tag>;
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Categoría',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 120,
      render: (_, record: Product) => record.category?.name || 'Sin categoría',
    },
    {
      title: 'Marca',
      dataIndex: ['brand', 'name'],
      key: 'brand',
      width: 100,
      render: (_, record: Product) => record.brand?.name || 'Sin marca',
    },
    {
      title: 'Precio',
      dataIndex: 'selling_price',
      key: 'selling_price',
      width: 100,
      render: (price: number) => `$${price.toLocaleString()}`,
      sorter: (a, b) => a.selling_price - b.selling_price,
    },
    {
      title: 'Stock',
      dataIndex: 'current_stock',
      key: 'current_stock',
      width: 80,
      render: (stock: number | undefined, record: Product) => (
        <div>
          <div>{stock || 0}</div>
          {getStockStatus(stock || 0, record.min_stock)}
        </div>
      ),
      sorter: (a, b) => (a.current_stock || 0) - (b.current_stock || 0),
    },
    {
      title: 'Margen',
      dataIndex: 'profit_margin',
      key: 'profit_margin',
      width: 80,
      render: (margin: number | undefined) => {
        const marginValue = margin || 0;
        return (
          <Tag color={marginValue > 30 ? 'green' : marginValue > 15 ? 'orange' : 'red'}>
            {marginValue.toFixed(1)}%
          </Tag>
        );
      },
      sorter: (a, b) => (a.profit_margin || 0) - (b.profit_margin || 0),
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
    },
    {
      title: 'Variantes',
      dataIndex: 'has_variants',
      key: 'has_variants',
      width: 80,
      render: (hasVariants: boolean) => (
        hasVariants ? <Tag color="blue">Sí</Tag> : <Tag>No</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record: Product) => (
        <Space size="small">
          <Tooltip title="Ver detalles">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small"
            />
          </Tooltip>
          <Tooltip title="Duplicar">
            <Button 
              type="text" 
              icon={<CopyOutlined />} 
              size="small"
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Tooltip title="Eliminar">
              <Button 
                type="text" 
                icon={<DeleteOutlined />} 
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand?.name === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <Card
      title="Gestión de Productos"
      extra={
        <Button type="primary" icon={<PlusOutlined />}>
          Nuevo Producto
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap gap-4">
        <Search
          placeholder="Buscar por nombre o SKU"
          allowClear
          style={{ width: 300 }}
          onSearch={setSearchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="Filtrar por categoría"
          allowClear
          style={{ width: 200 }}
          value={selectedCategory || undefined}
          onChange={setSelectedCategory}
        >
          {categories.map(category => (
            <Option key={category.id} value={category.name}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por marca"
          allowClear
          style={{ width: 200 }}
          value={selectedBrand || undefined}
          onChange={setSelectedBrand}
        >
          {brands.map(brand => (
            <Option key={brand.id} value={brand.name}>
              {brand.name}
            </Option>
          ))}
        </Select>
        <Button onClick={fetchProducts}>
          Actualizar
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          total: filteredProducts.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} productos`,
        }}
      />
    </Card>
  );
};

export default ProductList;
