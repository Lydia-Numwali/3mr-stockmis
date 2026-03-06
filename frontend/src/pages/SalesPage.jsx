import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi, productsApi } from '../services/api';
import { Plus, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function RecordSaleModal({ onClose }) {
  const [form, setForm] = useState({ productId: '', quantitySold: 1, saleType: 'RETAIL', priceUsed: '', customerType: 'INDIVIDUAL', notes: '' });
  const qc = useQueryClient();
  const { data: prodData } = useQuery({ queryKey: ['products-all'], queryFn: () => productsApi.getAll({ limit: 999 }).then(r => r.data) });
  const products = prodData?.items || [];

  const selectedProduct = products.find(p => p.id === Number(form.productId));

  const handleProductChange = (id) => {
    const p = products.find(pr => pr.id === Number(id));
    setForm(f => ({ ...f, productId: id, priceUsed: form.saleType === 'RETAIL' ? (p?.retailPrice || '') : (p?.wholesalePrice || '') }));
  };
  const handleSaleTypeChange = (type) => {
    const p = selectedProduct;
    setForm(f => ({ ...f, saleType: type, priceUsed: type === 'RETAIL' ? (p?.retailPrice || f.priceUsed) : (p?.wholesalePrice || f.priceUsed) }));
  };

  const mutation = useMutation({
    mutationFn: (data) => salesApi.create(data),
    onSuccess: () => { qc.invalidateQueries(['sales']); qc.invalidateQueries(['products']); qc.invalidateQueries(['dashboard-stats']); toast.success('Sale recorded!'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const total = Number(form.quantitySold) * Number(form.priceUsed || 0);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Record Sale</h2><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }}>
          <div className="form-group"><label className="form-label">Product *</label>
            <select className="form-control" value={form.productId} onChange={e=>handleProductChange(e.target.value)} required>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Sale Type</label>
              <select className="form-control" value={form.saleType} onChange={e=>handleSaleTypeChange(e.target.value)}>
                <option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Customer Type</label>
              <select className="form-control" value={form.customerType} onChange={e=>set('customerType',e.target.value)}>
                <option value="INDIVIDUAL">Individual</option><option value="SHOP_OWNER">Shop Owner</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Quantity *</label><input className="form-control" type="number" min="1" value={form.quantitySold} onChange={e=>set('quantitySold',e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Price (KES) *</label><input className="form-control" type="number" min="0" value={form.priceUsed} onChange={e=>set('priceUsed',e.target.value)} required /></div>
          </div>
          {total > 0 && <div className="alert alert-success" style={{marginBottom:16}}>Total Sale Value: <strong>KES {total.toLocaleString()}</strong></div>}
          {selectedProduct && selectedProduct.quantity < form.quantitySold && <div className="alert alert-danger">Insufficient stock! Available: {selectedProduct.quantity}</div>}
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/></div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Recording...' : 'Record Sale'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [saleType, setSaleType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['sales', from, to, saleType, page],
    queryFn: () => salesApi.getAll({ from, to, saleType, page, limit: 20 }).then(r => r.data),
    keepPreviousData: true,
  });

  const sales = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);
  const totalRevenue = sales.reduce((acc, s) => acc + s.quantitySold * Number(s.priceUsed), 0);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Sales Records</h1><p className="page-subtitle">{total} sales recorded</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Record Sale</button>
      </div>

      <div className="filters-bar">
        <div className="form-group" style={{margin:0,flex:0}}><label className="form-label" style={{marginBottom:4}}>From</label><input className="form-control" type="date" value={from} onChange={e=>{setFrom(e.target.value);setPage(1);}}/></div>
        <div className="form-group" style={{margin:0,flex:0}}><label className="form-label" style={{marginBottom:4}}>To</label><input className="form-control" type="date" value={to} onChange={e=>{setTo(e.target.value);setPage(1);}}/></div>
        <select className="form-control" style={{width:150,alignSelf:'flex-end'}} value={saleType} onChange={e=>{setSaleType(e.target.value);setPage(1);}}>
          <option value="">All Types</option><option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
        </select>
      </div>

      {sales.length > 0 && (
        <div className="grid-3 mb-4">
          <div className="stat-card blue card-sm"><div className="stat-label">Total Records</div><div className="stat-value">{total}</div></div>
          <div className="stat-card green card-sm"><div className="stat-label">Estimated Revenue</div><div className="stat-value" style={{fontSize:18}}>KES {totalRevenue.toLocaleString()}</div></div>
          <div className="stat-card purple card-sm"><div className="stat-label">Showing</div><div className="stat-value">{sales.length}</div></div>
        </div>
      )}

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          {isLoading ? <div className="page-loader"><div className="loader spin"/></div> : (
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Type</th><th>Customer</th><th>Price</th><th>Total</th><th>Date</th></tr></thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr><td colSpan={8}><div className="empty-state"><ShoppingCart size={40}/><h3>No sales recorded</h3></div></td></tr>
                ) : sales.map(s => (
                  <tr key={s.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{s.id}</td>
                    <td style={{fontWeight:500}}>{s.product?.name}</td>
                    <td style={{fontWeight:600}}>{s.quantitySold}</td>
                    <td><span className={`badge ${s.saleType === 'RETAIL' ? 'badge-blue' : 'badge-orange'}`}>{s.saleType}</span></td>
                    <td><span className="badge badge-gray">{s.customerType || '—'}</span></td>
                    <td>KES {Number(s.priceUsed).toLocaleString()}</td>
                    <td style={{fontWeight:600,color:'var(--success)'}}>KES {(s.quantitySold * Number(s.priceUsed)).toLocaleString()}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{format(new Date(s.date), 'dd MMM yyyy HH:mm')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div className="pagination" style={{padding:'12px 16px'}}>
            <span className="pagination-info">Page {page} of {totalPages}</span>
            <button className="pagination-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <button className="pagination-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        )}
      </div>
      {showAdd && <RecordSaleModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
