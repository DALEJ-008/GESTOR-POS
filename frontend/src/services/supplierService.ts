import api from './api';

// Interfaces
export interface Supplier {
  id: number;
  company_name: string;
  trade_name?: string;
  document_type: string;
  document_number: string;
  supplier_type: string;
  category?: {
    id: number;
    name: string;
  };
  contact_name: string;
  contact_position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  credit_limit: number;
  payment_terms: number;
  discount_percentage: number;
  minimum_order?: number;
  delivery_time?: number;
  bank_name?: string;
  bank_account?: string;
  account_type?: string;
  rating?: number;
  is_active: boolean;
  is_preferred: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierCategory {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierContact {
  id: number;
  supplier: number;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierProduct {
  id: number;
  supplier: {
    id: number;
    company_name: string;
  };
  product: {
    id: number;
    name: string;
    sku: string;
  };
  supplier_code?: string;
  cost: number;
  minimum_quantity: number;
  delivery_time?: number;
  is_active: boolean;
  last_update: string;
  created_at: string;
  updated_at: string;
}

// Supplier Services
export const supplierService = {
  // Suppliers
  getSuppliers: (params?: any) => api.get('/suppliers/suppliers/', { params }),
  getSupplier: (id: number) => api.get(`/suppliers/suppliers/${id}/`),
  createSupplier: (data: Partial<Supplier>) => api.post('/suppliers/suppliers/', data),
  updateSupplier: (id: number, data: Partial<Supplier>) => api.patch(`/suppliers/suppliers/${id}/`, data),
  deleteSupplier: (id: number) => api.delete(`/suppliers/suppliers/${id}/`),
  getSuppliersByCategory: (categoryId?: number) => {
    const params = categoryId ? { category_id: categoryId } : {};
    return api.get('/suppliers/suppliers/by_category/', { params });
  },
  getActiveSuppliers: () => api.get('/suppliers/suppliers/active_suppliers/'),
  getSuppliersWithDebt: () => api.get('/suppliers/suppliers/suppliers_with_debt/'),
  getSupplierProducts: (id: number) => api.get(`/suppliers/suppliers/${id}/products/`),
  getSupplierStatistics: (id: number) => api.get(`/suppliers/suppliers/${id}/statistics/`),
  addProductToSupplier: (id: number, data: Partial<SupplierProduct>) => 
    api.post(`/suppliers/suppliers/${id}/add_product/`, data),

  // Supplier Categories
  getSupplierCategories: (params?: any) => api.get('/suppliers/categories/', { params }),
  getSupplierCategory: (id: number) => api.get(`/suppliers/categories/${id}/`),
  createSupplierCategory: (data: Partial<SupplierCategory>) => api.post('/suppliers/categories/', data),
  updateSupplierCategory: (id: number, data: Partial<SupplierCategory>) => api.patch(`/suppliers/categories/${id}/`, data),
  deleteSupplierCategory: (id: number) => api.delete(`/suppliers/categories/${id}/`),
  getSuppliersCount: (id: number) => api.get(`/suppliers/categories/${id}/suppliers_count/`),

  // Supplier Contacts
  getSupplierContacts: (supplierId?: number) => {
    const params = supplierId ? { supplier: supplierId } : {};
    return api.get('/suppliers/contacts/', { params });
  },
  getSupplierContact: (id: number) => api.get(`/suppliers/contacts/${id}/`),
  createSupplierContact: (data: Partial<SupplierContact>) => api.post('/suppliers/contacts/', data),
  updateSupplierContact: (id: number, data: Partial<SupplierContact>) => api.patch(`/suppliers/contacts/${id}/`, data),
  deleteSupplierContact: (id: number) => api.delete(`/suppliers/contacts/${id}/`),
  getPrimaryContacts: () => api.get('/suppliers/contacts/primary_contacts/'),

  // Supplier Products
  getAllSupplierProducts: (params?: any) => api.get('/suppliers/supplier-products/', { params }),
  getSupplierProduct: (id: number) => api.get(`/suppliers/supplier-products/${id}/`),
  createSupplierProduct: (data: Partial<SupplierProduct>) => api.post('/suppliers/supplier-products/', data),
  updateSupplierProduct: (id: number, data: Partial<SupplierProduct>) => api.patch(`/suppliers/supplier-products/${id}/`, data),
  deleteSupplierProduct: (id: number) => api.delete(`/suppliers/supplier-products/${id}/`),
  getProductsBySupplier: (supplierId: number) => 
    api.get(`/suppliers/supplier-products/by_supplier/?supplier_id=${supplierId}`),
  getCheapestSuppliers: (productId: number) => 
    api.get(`/suppliers/supplier-products/cheapest_suppliers/?product_id=${productId}`),
};
