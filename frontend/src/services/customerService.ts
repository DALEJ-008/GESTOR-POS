import api from './api';

// Interfaces
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  company_name?: string;
  document_type: string;
  document_number: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  customer_group?: {
    id: number;
    name: string;
    discount_percentage: number;
  };
  credit_limit: number;
  payment_terms: number;
  discount_percentage: number;
  is_active: boolean;
  is_vip: boolean;
  notes?: string;
  birth_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  description?: string;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerAddress {
  id: number;
  customer: number;
  type: string;
  address: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerContact {
  id: number;
  customer: number;
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

// Customer Services
export const customerService = {
  // Customers
  getCustomers: (params?: any) => api.get('/customers/customers/', { params }),
  getCustomer: (id: number) => api.get(`/customers/customers/${id}/`),
  createCustomer: (data: Partial<Customer>) => api.post('/customers/customers/', data),
  updateCustomer: (id: number, data: Partial<Customer>) => api.patch(`/customers/customers/${id}/`, data),
  deleteCustomer: (id: number) => api.delete(`/customers/customers/${id}/`),
  searchByDocument: (document: string) => api.get(`/customers/customers/search_by_document/?document=${document}`),
  getVipCustomers: () => api.get('/customers/customers/vip_customers/'),
  getCustomersWithDebt: () => api.get('/customers/customers/with_debt/'),
  getCustomerStatistics: (id: number) => api.get(`/customers/customers/${id}/statistics/`),
  getCustomerPurchaseHistory: (id: number) => api.get(`/customers/customers/${id}/purchase_history/`),

  // Customer Groups
  getCustomerGroups: (params?: any) => api.get('/customers/groups/', { params }),
  getCustomerGroup: (id: number) => api.get(`/customers/groups/${id}/`),
  createCustomerGroup: (data: Partial<CustomerGroup>) => api.post('/customers/groups/', data),
  updateCustomerGroup: (id: number, data: Partial<CustomerGroup>) => api.patch(`/customers/groups/${id}/`, data),
  deleteCustomerGroup: (id: number) => api.delete(`/customers/groups/${id}/`),

  // Customer Addresses
  getCustomerAddresses: (customerId?: number) => {
    const params = customerId ? { customer: customerId } : {};
    return api.get('/customers/addresses/', { params });
  },
  getCustomerAddress: (id: number) => api.get(`/customers/addresses/${id}/`),
  createCustomerAddress: (data: Partial<CustomerAddress>) => api.post('/customers/addresses/', data),
  updateCustomerAddress: (id: number, data: Partial<CustomerAddress>) => api.patch(`/customers/addresses/${id}/`, data),
  deleteCustomerAddress: (id: number) => api.delete(`/customers/addresses/${id}/`),

  // Customer Contacts
  getCustomerContacts: (customerId?: number) => {
    const params = customerId ? { customer: customerId } : {};
    return api.get('/customers/contacts/', { params });
  },
  getCustomerContact: (id: number) => api.get(`/customers/contacts/${id}/`),
  createCustomerContact: (data: Partial<CustomerContact>) => api.post('/customers/contacts/', data),
  updateCustomerContact: (id: number, data: Partial<CustomerContact>) => api.patch(`/customers/contacts/${id}/`, data),
  deleteCustomerContact: (id: number) => api.delete(`/customers/contacts/${id}/`),
};
