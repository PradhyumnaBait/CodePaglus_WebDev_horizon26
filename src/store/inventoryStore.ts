// ============================================================
// OpsPulse — Inventory Zustand Store
// ============================================================
import { create } from 'zustand';

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  status: 'ok' | 'low' | 'critical';
  updatedAt: string;
}

interface InventoryState {
  products: InventoryProduct[];
  addProduct: (product: Omit<InventoryProduct, 'id' | 'status' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Omit<InventoryProduct, 'id'>>) => void;
  deleteProduct: (id: string) => void;
}

function getStockStatus(stock: number): 'ok' | 'low' | 'critical' {
  if (stock <= 5) return 'critical';
  if (stock <= 15) return 'low';
  return 'ok';
}

const SEED_PRODUCTS: InventoryProduct[] = [
  { id: '1', name: 'Gaming Laptop X1', sku: 'SKU-1001', stock: 15, price: 89999, category: 'Electronics', status: 'low', updatedAt: '2026-03-10T10:00:00Z' },
  { id: '2', name: 'Wireless Headset Z', sku: 'SKU-1002', stock: 45, price: 3499, category: 'Accessories', status: 'ok', updatedAt: '2026-03-10T09:30:00Z' },
  { id: '3', name: 'Mechanical Keyboard Pro', sku: 'SKU-1003', stock: 30, price: 7999, category: 'Accessories', status: 'ok', updatedAt: '2026-03-10T09:00:00Z' },
  { id: '4', name: 'UltraWide Monitor 34"', sku: 'SKU-1004', stock: 4, price: 42999, category: 'Electronics', status: 'critical', updatedAt: '2026-03-10T08:30:00Z' },
  { id: '5', name: 'Ergonomic Mouse V2', sku: 'SKU-1005', stock: 100, price: 1999, category: 'Accessories', status: 'ok', updatedAt: '2026-03-10T08:00:00Z' },
  { id: '6', name: 'USB-C Docking Station', sku: 'SKU-1006', stock: 8, price: 12499, category: 'Electronics', status: 'low', updatedAt: '2026-03-09T16:00:00Z' },
  { id: '7', name: 'Webcam 4K Pro', sku: 'SKU-1007', stock: 22, price: 5999, category: 'Electronics', status: 'ok', updatedAt: '2026-03-09T14:00:00Z' },
  { id: '8', name: 'Laptop Sleeve 15"', sku: 'SKU-1008', stock: 3, price: 1299, category: 'Accessories', status: 'critical', updatedAt: '2026-03-09T12:00:00Z' },
  { id: '9', name: 'Standing Desk Mat', sku: 'SKU-1009', stock: 60, price: 2499, category: 'Furniture', status: 'ok', updatedAt: '2026-03-09T10:00:00Z' },
  { id: '10', name: 'Monitor Arm Dual', sku: 'SKU-1010', stock: 12, price: 4999, category: 'Furniture', status: 'low', updatedAt: '2026-03-08T18:00:00Z' },
];

let nextId = 11;

export const useInventoryStore = create<InventoryState>()((set) => ({
  products: SEED_PRODUCTS,

  addProduct: (product) =>
    set((state) => ({
      products: [
        {
          ...product,
          id: String(nextId++),
          status: getStockStatus(product.stock),
          updatedAt: new Date().toISOString(),
        },
        ...state.products,
      ],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
        if (updates.stock !== undefined) {
          updated.status = getStockStatus(updates.stock);
        }
        return updated;
      }),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}));
