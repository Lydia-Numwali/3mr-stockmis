import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockApi, productsApi } from '../services/api';
import { Plus, X, Package, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function AddStockModal({ onClose }) {
  const [form, setForm] = useState({ productId: '', quantity: 1, purchasePrice: '', supplier: '', notes: '' });
  const qc = useQueryClient();
  const { data: prodData } = useQuery({ queryKey: ['products-all'], queryFn: () => productsApi.getAll({ limit: 999 }).then(r => r.data) });
  const products = prodData?.items || [];

  const mutation = useMutation({
    mutationFn: (data) => stockApi.addStock(data),
    onSuccess: () => { qc.invalidateQueries(['products']); qc.invalidateQueries(['stock-movements']); qc.invalidateQueries(['dashboard-stats']); toast.success('Stock added!'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Add Stock</h2><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }}>
          <div className="form-group"><label className="form-label">Product *</label>
            <select className="form-control" value={form.productId} onChange={e=>set('productId',e.target.value)} required>
              <option value="">Select product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Quantity *</label><input className="form-control" type="number" min="1" value={form.quantity} onChange={e=>set('quantity',e.target.value)} required /></div>
            <div className="form-group"><label className="form-label">Purchase Price (KES)</label><input className="form-control" type="number" min="0" value={form.purchasePrice} onChange={e=>set('purchasePrice',e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Supplier</label><input className="form-control" value={form.supplier} onChange={e=>set('supplier',e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/></div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Adding...' : 'Add Stock'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default function StockPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['stock-movements', page],
    queryFn: () => stockApi.getMovements({ page, limit: 20 }).then(r => r.data),
    keepPreviousData: true,
  });
  const movements = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  const typeColor = { IN: 'badge-green', OUT: 'badge-red', LEND: 'badge-orange', RETURN: 'badge-blue' };
  const typeLabel = { IN: 'Stock In', OUT: 'Sold', LEND: 'Lent', RETURN: 'Returned' };

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Stock Management</h1><p className="page-subtitle">{total} movement records</p></div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Add Stock</button>
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          {isLoading ? <div className="page-loader"><div className="loader spin"/></div> : (
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Type</th><th>Quantity</th><th>Purchase Price</th><th>Supplier</th><th>Notes</th><th>Date</th></tr></thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr><td colSpan={8}><div className="empty-state"><Layers size={40}/><h3>No movements recorded</h3></div></td></tr>
                ) : movements.map(m => (
                  <tr key={m.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{m.id}</td>
                    <td><div style={{fontWeight:500}}>{m.product?.name}</div></td>
                    <td><span className={`badge ${typeColor[m.type]}`}>{typeLabel[m.type]}</span></td>
                    <td><span style={{fontWeight:600}}>{m.type === 'OUT' || m.type === 'LEND' ? '-' : '+'}{m.quantity}</span></td>
                    <td>{m.purchasePrice ? `KES ${Number(m.purchasePrice).toLocaleString()}` : '—'}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{m.supplier || '—'}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{m.notes || '—'}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{format(new Date(m.date), 'dd MMM yyyy HH:mm')}</td>
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
      {showAdd && <AddStockModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
