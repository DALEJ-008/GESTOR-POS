import api from './api';

// Interfaces
export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  category: {
    id: number;
    name: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  cost_price: number;
  selling_price: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  has_variants: boolean;
  is_active: boolean;
  is_service: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
  current_stock?: number;
  profit_margin?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product: number;
  name: string;
  sku: string;
  barcode?: string;
  cost_price: number;
  selling_price: number;
  attributes: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product Services
export const productService = {
  // Products
  getProducts: (params?: any) => api.get('/products/products/', { params }),
  getProduct: (id: number) => api.get(`/products/products/${id}/`),
  createProduct: (data: Partial<Product>) => api.post('/products/products/', data),
  updateProduct: (id: number, data: Partial<Product>) => api.patch(`/products/products/${id}/`, data),
  deleteProduct: (id: number) => api.delete(`/products/products/${id}/`),
  searchProducts: (query: string) => api.get(`/products/products/search/?q=${query}`),
  getProductsByCategory: (categoryId: number) => api.get(`/products/products/by_category/?category=${categoryId}`),
  getLowStockProducts: () => api.get('/products/products/low_stock/'),
  scanBarcode: (barcode: string) => api.get(`/products/products/scan_barcode/?barcode=${barcode}`),

  // Categories
  getCategories: (params?: any) => api.get('/products/categories/', { params }),
  getCategory: (id: number) => api.get(`/products/categories/${id}/`),
  createCategory: (data: Partial<Category>) => api.post('/products/categories/', data),
  updateCategory: (id: number, data: Partial<Category>) => api.patch(`/products/categories/${id}/`, data),
  deleteCategory: (id: number) => api.delete(`/products/categories/${id}/`),

  // Brands
  getBrands: (params?: any) => api.get('/products/brands/', { params }),
  getBrand: (id: number) => api.get(`/products/brands/${id}/`),
  createBrand: (data: Partial<Brand>) => api.post('/products/brands/', data),
  updateBrand: (id: number, data: Partial<Brand>) => api.patch(`/products/brands/${id}/`, data),
  deleteBrand: (id: number) => api.delete(`/products/brands/${id}/`),

  // Product Variants
  getProductVariants: (productId?: number) => {
    const params = productId ? { product: productId } : {};
    return api.get('/products/variants/', { params });
  },
  getProductVariant: (id: number) => api.get(`/products/variants/${id}/`),
  createProductVariant: (data: Partial<ProductVariant>) => api.post('/products/variants/', data),
  updateProductVariant: (id: number, data: Partial<ProductVariant>) => api.patch(`/products/variants/${id}/`, data),
  deleteProductVariant: (id: number) => api.delete(`/products/variants/${id}/`),
};
