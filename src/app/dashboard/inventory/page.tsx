'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertTriangle,
  X,
  Clock,
} from 'lucide-react';
import { useInventoryStore, type InventoryProduct } from '@/store/inventoryStore';
import { DashboardCard } from '@/components/cards/DashboardCard';

const CATEGORIES = ['Electronics', 'Accessories', 'Furniture', 'Software', 'Other'];

const STOCK_STATUS = {
  ok: { color: '#10B981', label: 'In Stock', bg: 'rgba(16,185,129,0.1)' },
  low: { color: '#F59E0B', label: 'Low Stock', bg: 'rgba(245,158,11,0.12)' },
  critical: { color: '#EF4444', label: 'Critical', bg: 'rgba(239,68,68,0.12)' },
};

interface FormData {
  name: string;
  sku: string;
  stock: string;
  price: string;
  category: string;
}

const EMPTY_FORM: FormData = { name: '', sku: '', stock: '', price: '', category: '' };

export default function InventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase());
        const matchCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchSearch && matchCategory;
      })
      .sort((a, b) => {
        const order = { critical: 0, low: 1, ok: 2 };
        return order[a.status] - order[b.status];
      });
  }, [products, search, filterCategory]);

  const lowStockCount = products.filter((p) => p.status === 'low' || p.status === 'critical').length;

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (product: InventoryProduct) => {
    setForm({
      name: product.name,
      sku: product.sku,
      stock: String(product.stock),
      price: String(product.price),
      category: product.category,
    });
    setEditingId(product.id);
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.sku.trim()) errs.sku = 'Required';
    if (!form.stock.trim() || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Enter valid quantity';
    if (!form.price.trim() || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Enter valid price';
    if (!form.category) errs.category = 'Select category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      stock: parseInt(form.stock),
      price: parseFloat(form.price),
      category: form.category,
    };
    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-page-title text-[#F1F5F9]">Inventory</h1>
          <p className="text-[12px] text-[#64748B] mt-1 flex items-center gap-1.5">
            <Package size={11} />
            Manage products and stock levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)]">
              <AlertTriangle size={13} className="text-[#EF4444]" />
              <span className="text-[12px] font-semibold text-[#FCA5A5]">
                {lowStockCount} items need attention
              </span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold"
            style={{
              background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            <Plus size={15} />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      <DashboardCard delay={0.05}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0F172A] border border-[#1E293B] text-[13px] text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['all', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`text-[11px] font-semibold uppercase px-3 py-1.5 rounded-lg transition-colors ${
                  filterCategory === cat
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#64748B] bg-[#0F172A] hover:text-[#F1F5F9] border border-[#1E293B]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </DashboardCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: '#3B82F6' },
          { label: 'In Stock', value: products.filter((p) => p.status === 'ok').length, color: '#10B981' },
          { label: 'Low Stock', value: products.filter((p) => p.status === 'low').length, color: '#F59E0B' },
          { label: 'Critical', value: products.filter((p) => p.status === 'critical').length, color: '#EF4444' },
        ].map((stat, i) => (
          <DashboardCard key={stat.label} variant="flat" delay={0.1 + i * 0.05}>
            <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-[24px] font-bold text-[#F1F5F9]" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </DashboardCard>
        ))}
      </div>

      {/* Inventory Table */}
      <DashboardCard delay={0.15}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E293B]">
                {['Product', 'SKU', 'Category', 'Stock', 'Price', 'Status', 'Actions'].map(
                  (col) => (
                    <th
                      key={col}
                      className="pb-3 text-[10px] font-semibold text-[#475569] uppercase tracking-wider pr-4"
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              <AnimatePresence>
                {filteredProducts.map((product, i) => {
                  const s = STOCK_STATUS[product.status];
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                    >
                      <td className="py-3 pr-4">
                        <p className="text-[13px] font-semibold text-[#E2E8F0]">{product.name}</p>
                      </td>
                      <td className="py-3 pr-4 text-[12px] text-[#64748B] font-mono">
                        {product.sku}
                      </td>
                      <td className="py-3 pr-4 text-[12px] text-[#94A3B8]">{product.category}</td>
                      <td className="py-3 pr-4 text-[14px] font-bold text-[#F1F5F9] tabular-nums">
                        {product.stock}
                      </td>
                      <td className="py-3 pr-4 text-[13px] text-[#E2E8F0] tabular-nums">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full"
                          style={{ color: s.color, backgroundColor: s.bg }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={32} className="mx-auto text-[#334155] mb-3" />
              <p className="text-[14px] text-[#64748B]">No products found</p>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[480px] bg-[#1E293B] border border-[#334155] rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[18px] font-bold text-[#F1F5F9]">
                  {editingId ? 'Update Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#F1F5F9] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                    placeholder="Enter product name"
                    className={`w-full px-3 py-2.5 rounded-xl text-[13px] text-[#F1F5F9] bg-[#0F172A] border outline-none focus:border-[#3B82F6] transition-colors placeholder:text-[#475569] ${
                      errors.name ? 'border-[#EF4444]' : 'border-[#334155]'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-[#EF4444] mt-1">{errors.name}</p>}
                </div>

                {/* SKU + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => { setForm({ ...form, sku: e.target.value }); setErrors({ ...errors, sku: undefined }); }}
                      placeholder="SKU-XXXX"
                      className={`w-full px-3 py-2.5 rounded-xl text-[13px] text-[#F1F5F9] bg-[#0F172A] border outline-none focus:border-[#3B82F6] transition-colors placeholder:text-[#475569] ${
                        errors.sku ? 'border-[#EF4444]' : 'border-[#334155]'
                      }`}
                    />
                    {errors.sku && <p className="text-[11px] text-[#EF4444] mt-1">{errors.sku}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => { setForm({ ...form, stock: e.target.value }); setErrors({ ...errors, stock: undefined }); }}
                      placeholder="0"
                      className={`w-full px-3 py-2.5 rounded-xl text-[13px] text-[#F1F5F9] bg-[#0F172A] border outline-none focus:border-[#3B82F6] transition-colors placeholder:text-[#475569] ${
                        errors.stock ? 'border-[#EF4444]' : 'border-[#334155]'
                      }`}
                    />
                    {errors.stock && <p className="text-[11px] text-[#EF4444] mt-1">{errors.stock}</p>}
                  </div>
                </div>

                {/* Price + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">
                      Price (INR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => { setForm({ ...form, price: e.target.value }); setErrors({ ...errors, price: undefined }); }}
                      placeholder="0.00"
                      className={`w-full px-3 py-2.5 rounded-xl text-[13px] text-[#F1F5F9] bg-[#0F172A] border outline-none focus:border-[#3B82F6] transition-colors placeholder:text-[#475569] ${
                        errors.price ? 'border-[#EF4444]' : 'border-[#334155]'
                      }`}
                    />
                    {errors.price && <p className="text-[11px] text-[#EF4444] mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#94A3B8] mb-1.5">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: undefined }); }}
                      className={`w-full px-3 py-2.5 rounded-xl text-[13px] text-[#F1F5F9] bg-[#0F172A] border outline-none focus:border-[#3B82F6] transition-colors appearance-none cursor-pointer ${
                        errors.category ? 'border-[#EF4444]' : 'border-[#334155]'
                      }`}
                    >
                      <option value="">Select</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.category && <p className="text-[11px] text-[#EF4444] mt-1">{errors.category}</p>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#334155] text-[13px] font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#475569] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl text-white text-[13px] font-semibold"
                  style={{
                    background: 'linear-gradient(120deg, #2563EB 0%, #3B82F6 100%)',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
                  }}
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] bg-[#1E293B] border border-[#334155] rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(239,68,68,0.1)] mx-auto mb-4">
                <Trash2 size={20} className="text-[#EF4444]" />
              </div>
              <h3 className="text-[16px] font-bold text-[#F1F5F9] mb-2">Delete Product</h3>
              <p className="text-[13px] text-[#94A3B8] mb-5">
                This action cannot be undone. Are you sure?
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl border border-[#334155] text-[13px] font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-5 py-2 rounded-xl bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
