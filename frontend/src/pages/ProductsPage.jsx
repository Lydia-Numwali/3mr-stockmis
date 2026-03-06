import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { Plus, Search, Edit, Trash2, X, Filter, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import Modal from '../components/Modal/Modal';
import Badge from '../components/Badge/Badge';

const CATEGORIES = ['Engine Parts','Brake System','Electrical Parts','Body Parts','Suspension','Tires & Wheels','Other'];
const BRANDS = ['Yamaha','Honda','TVS','Bajaj','Suzuki','Kawasaki','Other'];

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState(product || { name:'',category:'Engine Parts',brand:'',model:'',partType:'',wholesalePrice:'',retailPrice:'',costPrice:'',quantity:0,lowStockThreshold:5,supplier:'',storageLocation:'',notes:'' });
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => product ? productsApi.update(product.id, data) : productsApi.create(data),
    onSuccess: () => { qc.invalidateQueries(['products']); qc.invalidateQueries(['dashboard-stats']); toast.success(product ? 'Product updated!' : 'Product added!'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal isOpen={true} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'} size="large">
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Product Name *</label>
            <Input value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="e.g. Front Brake Pad" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Category *</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Brand</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.brand} onChange={e=>set('brand',e.target.value)}><option value="">Select Brand</option>{BRANDS.map(b=><option key={b}>{b}</option>)}</select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Model</label>
            <Input value={form.model} onChange={e=>set('model',e.target.value)} placeholder="e.g. Boxer 150" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Part Type / Spec</label>
            <Input value={form.partType} onChange={e=>set('partType',e.target.value)} placeholder="e.g. Front Brake Pad" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Supplier</label>
            <Input value={form.supplier} onChange={e=>set('supplier',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Cost Price (KES)</label>
            <Input type="number" min="0" value={form.costPrice} onChange={e=>set('costPrice',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Retail Price (KES)</label>
            <Input type="number" min="0" value={form.retailPrice} onChange={e=>set('retailPrice',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Wholesale Price (KES)</label>
            <Input type="number" min="0" value={form.wholesalePrice} onChange={e=>set('wholesalePrice',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Initial Quantity</label>
            <Input type="number" min="0" value={form.quantity} onChange={e=>set('quantity',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Low Stock Threshold</label>
            <Input type="number" min="0" value={form.lowStockThreshold} onChange={e=>set('lowStockThreshold',e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Storage Location</label>
            <Input value={form.storageLocation} onChange={e=>set('storageLocation',e.target.value)} placeholder="e.g. Shelf A3" />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
          <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}</Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({ product, onClose }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => productsApi.delete(product.id),
    onSuccess: () => { qc.invalidateQueries(['products']); toast.success('Product deleted'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  return (
    <Modal isOpen={true} onClose={onClose} title="Delete Product" size="small">
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>Are you sure you want to delete <strong style={{ color: '#111827' }}>{product.name}</strong>? This cannot be undone.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={() => mutation.mutate()} disabled={mutation.isPending}>{mutation.isPending ? 'Deleting...' : 'Yes, Delete'}</Button>
      </div>
    </Modal>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [lowStock, setLowStock] = useState('');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, category, brand, lowStock, page],
    queryFn: () => productsApi.getAll({ search, category, brand, lowStock, page, limit: 15 }).then(r => r.data),
    keepPreviousData: true,
  });

  const products = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 15);

  const formatMoney = (n) => `KES ${Number(n || 0).toLocaleString()}`;

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Products</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>{total} parts registered</p>
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Add Product</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0 12px', backgroundColor: '#FFFFFF' }}>
          <Search size={16} style={{ color: '#6B7280' }} />
          <input style={{ flex: 1, border: 'none', padding: '10px 0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} placeholder="Search products..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/>
        </div>
        <select style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', width: '160px' }} value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}}><option value="">All Categories</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
        <select style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', width: '130px' }} value={brand} onChange={e=>{setBrand(e.target.value);setPage(1);}}><option value="">All Brands</option>{BRANDS.map(b=><option key={b}>{b}</option>)}</select>
        <select style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', width: '140px' }} value={lowStock} onChange={e=>{setLowStock(e.target.value);setPage(1);}}><option value="">All Stock</option><option value="true">Low Stock</option></select>
        {(search||category||brand||lowStock) && <Button variant="secondary" size="small" onClick={()=>{setSearch('');setCategory('');setBrand('');setLowStock('');setPage(1);}}><X size={12}/>Clear</Button>}
      </div>

      <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? <div style={{ padding: '40px', textAlign: 'center' }}><div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Brand/Model</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Stock</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Retail</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Wholesale</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Supplier</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center' }}><div><Package size={40} style={{ color: '#D1D5DB', marginBottom: '12px' }}/><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>No products found</h3></div></td></tr>
                ) : products.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{p.id}</td>
                    <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 500, color: '#111827' }}>{p.name}</div><div style={{ fontSize: '12px', color: '#6B7280' }}>{p.partType}</div></td>
                    <td style={{ padding: '12px 16px' }}><Badge variant="secondary">{p.category}</Badge></td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{p.brand || '—'} {p.model ? `/ ${p.model}` : ''}</td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={p.quantity === 0 ? 'error' : p.quantity <= p.lowStockThreshold ? 'warning' : 'success'}>{p.quantity}</Badge></td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{formatMoney(p.retailPrice)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{formatMoney(p.wholesalePrice)}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{p.supplier || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button variant="secondary" size="small" onClick={()=>setEditItem(p)} title="Edit"><Edit size={14}/></Button>
                        <Button variant="danger" size="small" onClick={()=>setDeleteItem(p)} title="Delete"><Trash2 size={14}/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>{total} products | Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" size="small" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Button variant="secondary" size="small" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      {showAdd && <ProductModal onClose={()=>setShowAdd(false)} />}
      {editItem && <ProductModal product={editItem} onClose={()=>setEditItem(null)} />}
      {deleteItem && <DeleteModal product={deleteItem} onClose={()=>setDeleteItem(null)} />}
    </div>
  );
}
