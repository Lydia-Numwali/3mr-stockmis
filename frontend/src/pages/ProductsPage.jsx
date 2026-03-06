import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api';
import { Plus, Search, Edit, Trash2, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }}>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Product Name *</label><input className="form-control" value={form.name} onChange={e=>set('name',e.target.value)} required placeholder="e.g. Front Brake Pad" /></div>
            <div className="form-group"><label className="form-label">Category *</label><select className="form-control" value={form.category} onChange={e=>set('category',e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Brand</label><select className="form-control" value={form.brand} onChange={e=>set('brand',e.target.value)}><option value="">Select Brand</option>{BRANDS.map(b=><option key={b}>{b}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Model</label><input className="form-control" value={form.model} onChange={e=>set('model',e.target.value)} placeholder="e.g. Boxer 150" /></div>
            <div className="form-group"><label className="form-label">Part Type / Spec</label><input className="form-control" value={form.partType} onChange={e=>set('partType',e.target.value)} placeholder="e.g. Front Brake Pad" /></div>
            <div className="form-group"><label className="form-label">Supplier</label><input className="form-control" value={form.supplier} onChange={e=>set('supplier',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Cost Price (KES)</label><input className="form-control" type="number" min="0" value={form.costPrice} onChange={e=>set('costPrice',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Retail Price (KES)</label><input className="form-control" type="number" min="0" value={form.retailPrice} onChange={e=>set('retailPrice',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Wholesale Price (KES)</label><input className="form-control" type="number" min="0" value={form.wholesalePrice} onChange={e=>set('wholesalePrice',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Initial Quantity</label><input className="form-control" type="number" min="0" value={form.quantity} onChange={e=>set('quantity',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Low Stock Threshold</label><input className="form-control" type="number" min="0" value={form.lowStockThreshold} onChange={e=>set('lowStockThreshold',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Storage Location</label><input className="form-control" value={form.storageLocation} onChange={e=>set('storageLocation',e.target.value)} placeholder="e.g. Shelf A3" /></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/></div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}</button>
          </div>
        </form>
      </div>
    </div>
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Delete Product</h2><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
        <p style={{color:'var(--text-muted)'}}>Are you sure you want to delete <strong style={{color:'var(--text)'}}>{product.name}</strong>? This cannot be undone.</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={() => mutation.mutate()} disabled={mutation.isPending}>{mutation.isPending ? 'Deleting...' : 'Yes, Delete'}</button>
        </div>
      </div>
    </div>
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
      <div className="page-header">
        <div><h1 className="page-title">Products</h1><p className="page-subtitle">{total} parts registered</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Add Product</button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrap"><Search size={15}/><input className="form-control search-input" placeholder="Search products..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}/></div>
        <select className="form-control" style={{width:160}} value={category} onChange={e=>{setCategory(e.target.value);setPage(1);}}><option value="">All Categories</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
        <select className="form-control" style={{width:130}} value={brand} onChange={e=>{setBrand(e.target.value);setPage(1);}}><option value="">All Brands</option>{BRANDS.map(b=><option key={b}>{b}</option>)}</select>
        <select className="form-control" style={{width:140}} value={lowStock} onChange={e=>{setLowStock(e.target.value);setPage(1);}}><option value="">All Stock</option><option value="true">Low Stock</option></select>
        {(search||category||brand||lowStock) && <button className="btn btn-secondary btn-sm" onClick={()=>{setSearch('');setCategory('');setBrand('');setLowStock('');setPage(1);}}><X size={12}/>Clear</button>}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          {isLoading ? <div className="page-loader"><div className="loader spin" /></div> : (
            <table>
              <thead><tr><th>#</th><th>Product Name</th><th>Category</th><th>Brand/Model</th><th>Stock</th><th>Retail</th><th>Wholesale</th><th>Supplier</th><th>Actions</th></tr></thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={9}><div className="empty-state"><Package size={40}/><h3>No products found</h3></div></td></tr>
                ) : products.map(p => (
                  <tr key={p.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{p.id}</td>
                    <td><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:'var(--text-muted)'}}>{p.partType}</div></td>
                    <td><span className="badge badge-gray">{p.category}</span></td>
                    <td style={{fontSize:13}}>{p.brand || '—'} {p.model ? `/ ${p.model}` : ''}</td>
                    <td><span className={`badge ${p.quantity === 0 ? 'badge-red' : p.quantity <= p.lowStockThreshold ? 'badge-orange' : 'badge-green'}`}>{p.quantity}</span></td>
                    <td style={{fontSize:13}}>{formatMoney(p.retailPrice)}</td>
                    <td style={{fontSize:13}}>{formatMoney(p.wholesalePrice)}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{p.supplier || '—'}</td>
                    <td>
                      <div style={{display:'flex',gap:6}}>
                        <button className="btn btn-secondary btn-icon btn-sm" onClick={()=>setEditItem(p)} title="Edit"><Edit size={13}/></button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={()=>setDeleteItem(p)} title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination" style={{padding:'12px 16px'}}>
            <span className="pagination-info">{total} products | Page {page} of {totalPages}</span>
            <button className="pagination-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <button className="pagination-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        )}
      </div>

      {showAdd && <ProductModal onClose={()=>setShowAdd(false)} />}
      {editItem && <ProductModal product={editItem} onClose={()=>setEditItem(null)} />}
      {deleteItem && <DeleteModal product={deleteItem} onClose={()=>setDeleteItem(null)} />}
    </div>
  );
}
