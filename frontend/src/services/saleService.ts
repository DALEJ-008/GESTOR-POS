import api from './api';

// Interfaces
export interface Sale {
  id: number;
  sale_number: string;
  sale_date: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    document_number: string;
  };
  sale_type: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: SaleItem[];
  payments?: Payment[];
}

export interface SaleItem {
  id: number;
  sale: number;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
  product_variant?: {
    id: number;
    name: string;
    sku: string;
  };
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  tax_percentage: number;
  tax_amount: number;
  total: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  sale: number;
  payment_method: {
    id: number;
    name: string;
  };
  amount: number;
  payment_date: string;
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Sale Services
export const saleService = {
  // Sales
  getSales: (params?: any) => api.get('/sales/sales/', { params }),
  getSale: (id: number) => api.get(`/sales/sales/${id}/`),
  createSale: (data: Partial<Sale>) => api.post('/sales/sales/', data),
  updateSale: (id: number, data: Partial<Sale>) => api.patch(`/sales/sales/${id}/`, data),
  deleteSale: (id: number) => api.delete(`/sales/sales/${id}/`),
  getTodaySales: () => api.get('/sales/sales/today_sales/'),
  getSalesByPeriod: (params: { period?: string; start_date?: string; end_date?: string }) => 
    api.get('/sales/sales/sales_by_period/', { params }),
  getTopCustomers: (limit = 10) => api.get(`/sales/sales/top_customers/?limit=${limit}`),
  getPendingPayments: () => api.get('/sales/sales/pending_payments/'),
  addPayment: (saleId: number, data: { amount: number; payment_method: number; notes?: string }) =>
    api.post(`/sales/sales/${saleId}/add_payment/`, data),
  completeSale: (saleId: number) => api.post(`/sales/sales/${saleId}/complete_sale/`),
  cancelSale: (saleId: number, reason: string) => api.post(`/sales/sales/${saleId}/cancel_sale/`, { reason }),

  // Sale Items
  getSaleItems: (saleId?: number) => {
    const params = saleId ? { sale: saleId } : {};
    return api.get('/sales/sale-items/', { params });
  },
  getSaleItem: (id: number) => api.get(`/sales/sale-items/${id}/`),
  createSaleItem: (data: Partial<SaleItem>) => api.post('/sales/sale-items/', data),
  updateSaleItem: (id: number, data: Partial<SaleItem>) => api.patch(`/sales/sale-items/${id}/`, data),
  deleteSaleItem: (id: number) => api.delete(`/sales/sale-items/${id}/`),
  getTopProducts: (limit = 10) => api.get(`/sales/sale-items/top_products/?limit=${limit}`),

  // Payments
  getPayments: (params?: any) => api.get('/sales/payments/', { params }),
  getPayment: (id: number) => api.get(`/sales/payments/${id}/`),
  createPayment: (data: Partial<Payment>) => api.post('/sales/payments/', data),
  updatePayment: (id: number, data: Partial<Payment>) => api.patch(`/sales/payments/${id}/`, data),
  deletePayment: (id: number) => api.delete(`/sales/payments/${id}/`),
  getPaymentsByMethod: () => api.get('/sales/payments/payments_by_method/'),
  getDailyPayments: () => api.get('/sales/payments/daily_payments/'),

  // Payment Methods
  getPaymentMethods: (params?: any) => api.get('/sales/payment-methods/', { params }),
  getPaymentMethod: (id: number) => api.get(`/sales/payment-methods/${id}/`),
  createPaymentMethod: (data: Partial<PaymentMethod>) => api.post('/sales/payment-methods/', data),
  updatePaymentMethod: (id: number, data: Partial<PaymentMethod>) => api.patch(`/sales/payment-methods/${id}/`, data),
  deletePaymentMethod: (id: number) => api.delete(`/sales/payment-methods/${id}/`),
  getActivePaymentMethods: () => api.get('/sales/payment-methods/active_methods/'),
};
