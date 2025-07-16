import api from './api';

// Interfaces
export interface Stock {
  id: number;
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
  warehouse: {
    id: number;
    name: string;
  };
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
  address?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  stock: {
    id: number;
    product?: { name: string; sku: string };
    product_variant?: { name: string; sku: string };
    warehouse: { name: string };
  };
  movement_type: string;
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  reason: string;
  reference?: string;
  user: {
    id: number;
    username: string;
  };
  created_at: string;
}

export interface StockAlert {
  id: number;
  stock: {
    id: number;
    product?: { name: string; sku: string };
    product_variant?: { name: string; sku: string };
    warehouse: { name: string };
    quantity: number;
  };
  alert_type: string;
  threshold: number;
  is_active: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface InventoryAdjustment {
  id: number;
  warehouse: {
    id: number;
    name: string;
  };
  reason: string;
  notes?: string;
  user: {
    id: number;
    username: string;
  };
  created_at: string;
  items?: InventoryAdjustmentItem[];
}

export interface InventoryAdjustmentItem {
  id: number;
  adjustment: number;
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
  quantity_before: number;
  quantity_after: number;
  quantity_adjusted: number;
  reason?: string;
}

// Inventory Services
export const inventoryService = {
  // Stock
  getStock: (params?: any) => api.get('/inventory/stocks/', { params }),
  getStockItem: (id: number) => api.get(`/inventory/stocks/${id}/`),
  createStockItem: (data: Partial<Stock>) => api.post('/inventory/stocks/', data),
  updateStockItem: (id: number, data: Partial<Stock>) => api.patch(`/inventory/stocks/${id}/`, data),
  deleteStockItem: (id: number) => api.delete(`/inventory/stocks/${id}/`),
  getLowStock: () => api.get('/inventory/stocks/low_stock/'),
  getOutOfStock: () => api.get('/inventory/stocks/out_of_stock/'),
  updateStock: (data: {
    warehouse: number;
    product?: number;
    product_variant?: number;
    quantity_change: number;
    movement_type: string;
    reason: string;
    reference?: string;
  }) => api.post('/inventory/stocks/update_stock/', data),
  getStockSummary: (warehouseId?: number) => {
    const params = warehouseId ? { warehouse: warehouseId } : {};
    return api.get('/inventory/stocks/summary/', { params });
  },

  // Warehouses
  getWarehouses: (params?: any) => api.get('/inventory/warehouses/', { params }),
  getWarehouse: (id: number) => api.get(`/inventory/warehouses/${id}/`),
  createWarehouse: (data: Partial<Warehouse>) => api.post('/inventory/warehouses/', data),
  updateWarehouse: (id: number, data: Partial<Warehouse>) => api.patch(`/inventory/warehouses/${id}/`, data),
  deleteWarehouse: (id: number) => api.delete(`/inventory/warehouses/${id}/`),

  // Stock Movements
  getStockMovements: (params?: any) => api.get('/inventory/movements/', { params }),
  getStockMovement: (id: number) => api.get(`/inventory/movements/${id}/`),
  getMovementsByProduct: (productId?: number, variantId?: number) => {
    const params: any = {};
    if (productId) params.product = productId;
    if (variantId) params.variant = variantId;
    return api.get('/inventory/movements/by_product/', { params });
  },

  // Stock Alerts
  getStockAlerts: (params?: any) => api.get('/inventory/alerts/', { params }),
  getStockAlert: (id: number) => api.get(`/inventory/alerts/${id}/`),
  createStockAlert: (data: Partial<StockAlert>) => api.post('/inventory/alerts/', data),
  updateStockAlert: (id: number, data: Partial<StockAlert>) => api.patch(`/inventory/alerts/${id}/`, data),
  deleteStockAlert: (id: number) => api.delete(`/inventory/alerts/${id}/`),
  resolveAlert: (id: number) => api.post(`/inventory/alerts/${id}/resolve/`),

  // Inventory Adjustments
  getInventoryAdjustments: (params?: any) => api.get('/inventory/adjustments/', { params }),
  getInventoryAdjustment: (id: number) => api.get(`/inventory/adjustments/${id}/`),
  createInventoryAdjustment: (data: Partial<InventoryAdjustment>) => api.post('/inventory/adjustments/', data),
  updateInventoryAdjustment: (id: number, data: Partial<InventoryAdjustment>) => api.patch(`/inventory/adjustments/${id}/`, data),
  deleteInventoryAdjustment: (id: number) => api.delete(`/inventory/adjustments/${id}/`),
};
