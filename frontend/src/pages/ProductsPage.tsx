import React from 'react';
import { Layout, Typography, Breadcrumb } from 'antd';
import ProductList from '../components/products/ProductList';

const { Content } = Layout;
const { Title } = Typography;

const ProductsPage: React.FC = () => {
  return (
    <Content className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item>Productos</Breadcrumb.Item>
      </Breadcrumb>
      
      <Title level={2} className="mb-6">Productos</Title>
      
      <ProductList />
    </Content>
  );
};

export default ProductsPage;
