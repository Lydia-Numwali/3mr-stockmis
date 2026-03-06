import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lendingApi, productsApi } from '../services/api';
import { Plus, X, RotateCcw, HandHelping } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

function LendModal({ onClose }) {
  const [form, setForm] = useState({ productId: '', quantityLent: 1, borrowerShop: '', borrowerContact: '', dateLent: new Date().toISOString().split('T')[0], expectedReturnDate: '', notes: '' });
  const qc = useQueryClient();
  const { data: prodData } = useQuery({ queryKey: ['products-all'], queryFn: () => productsApi.getAll({ limit: 999 }).then(r => r.data) });
  const products = prodData?.items || [];
  const mutation = useMutation({
    mutationFn: (data) => lendingApi.create(data),
    onSuccess: () => { qc.invalidateQueries(['lendings']); qc.invalidateQueries(['products']); qc.invalidateQueries(['dashboard-stats']); toast.success('Item lent!'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Lend Product</h2><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
        <form onSubmit={e=>{ e.preventDefault(); mutation.mutate(form); }}>
          <div className="form-group"><label className="form-label">Product *</label>
            <select className="form-control" value={form.productId} onChange={e=>set('productId',e.target.value)} required>
              <option value="">Select product</option>
              {products.map(p=><option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Quantity *</label><input className="form-control" type="number" min="1" value={form.quantityLent} onChange={e=>set('quantityLent',e.target.value)} required/></div>
            <div className="form-group"><label className="form-label">Borrower Shop *</label><input className="form-control" value={form.borrowerShop} onChange={e=>set('borrowerShop',e.target.value)} required/></div>
            <div className="form-group"><label className="form-label">Contact</label><input className="form-control" value={form.borrowerContact} onChange={e=>set('borrowerContact',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Date Lent</label><input className="form-control" type="date" value={form.dateLent} onChange={e=>set('dateLent',e.target.value)}/></div>
            <div className="form-group"><label className="form-label">Expected Return</label><input className="form-control" type="date" value={form.expectedReturnDate} onChange={e=>set('expectedReturnDate',e.target.value)}/></div>
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/></div>
          <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Lend Product'}</button></div>
        </form>
      </div>
    </div>
  );
}

function ReturnModal({ lending, onClose }) {
  const [form, setForm] = useState({ quantityReturned: lending.quantityLent - lending.quantityReturned, returnDate: new Date().toISOString().split('T')[0], notes: '' });
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data) => lendingApi.returnItem(lending.id, data),
    onSuccess: () => { qc.invalidateQueries(['lendings']); qc.invalidateQueries(['products']); qc.invalidateQueries(['dashboard-stats']); toast.success('Return recorded!'); onClose(); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed'),
  });
  const remaining = lending.quantityLent - lending.quantityReturned;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><h2 className="modal-title">Record Return</h2><button className="modal-close" onClick={onClose}><X size={18}/></button></div>
        <p className="text-muted text-sm mb-4">Returning from: <strong style={{color:'var(--text)'}}>{lending.borrowerShop}</strong> | Product: <strong style={{color:'var(--text)'}}>{lending.product?.name}</strong></p>
        <div className="form-group"><label className="form-label">Qty to Return (max {remaining})</label><input className="form-control" type="number" min="1" max={remaining} value={form.quantityReturned} onChange={e=>setForm(f=>({...f,quantityReturned:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Return Date</label><input className="form-control" type="date" value={form.returnDate} onChange={e=>setForm(f=>({...f,returnDate:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
        <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={()=>mutation.mutate(form)} disabled={mutation.isPending}>{mutation.isPending?'Saving...':'Record Return'}</button></div>
      </div>
    </div>
  );
}

const statusBadge = {PENDING:'badge-orange',OVERDUE:'badge-red',RETURNED:'badge-green',PARTIALLY_RETURNED:'badge-blue'};

export default function LendingPage() {
  const [tab, setTab] = useState('all');
  const [showLend, setShowLend] = useState(false);
  const [returnItem, setReturnItem] = useState(null);
  const [page, setPage] = useState(1);

  const status = tab === 'pending' ? 'PENDING' : tab === 'overdue' ? 'OVERDUE' : '';
  const { data, isLoading } = useQuery({
    queryKey: ['lendings', status, page],
    queryFn: () => lendingApi.getAll({ status, page, limit: 20 }).then(r => r.data),
    keepPreviousData: true,
  });

  const lendings = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Lent Products</h1><p className="page-subtitle">Track items lent to other shops</p></div>
        <button className="btn btn-primary" onClick={()=>setShowLend(true)}><Plus size={16}/>Lend Product</button>
      </div>

      <div className="tabs">
        {[['all','All'],['pending','Pending'],['overdue','Overdue']].map(([v,l])=>(
          <button key={v} className={`tab-btn ${tab===v?'active':''}`} onClick={()=>{setTab(v);setPage(1);}}>{l}</button>
        ))}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          {isLoading ? <div className="page-loader"><div className="loader spin"/></div> : (
            <table>
              <thead><tr><th>#</th><th>Product</th><th>Borrower Shop</th><th>Contact</th><th>Lent</th><th>Returned</th><th>Remaining</th><th>Expected Return</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {lendings.length === 0 ? (
                  <tr><td colSpan={10}><div className="empty-state"><HandHelping size={40}/><h3>No lending records</h3></div></td></tr>
                ) : lendings.map(l => (
                  <tr key={l.id}>
                    <td style={{color:'var(--text-muted)',fontSize:12}}>{l.id}</td>
                    <td style={{fontWeight:500}}>{l.product?.name}</td>
                    <td>{l.borrowerShop}</td>
                    <td style={{fontSize:12,color:'var(--text-muted)'}}>{l.borrowerContact || '—'}</td>
                    <td>{l.quantityLent}</td>
                    <td>{l.quantityReturned}</td>
                    <td><span style={{fontWeight:700,color: (l.quantityLent-l.quantityReturned)>0 ? 'var(--warning)':'var(--success)'}}>{l.quantityLent - l.quantityReturned}</span></td>
                    <td style={{fontSize:12,color: l.status==='OVERDUE'?'var(--danger)':'var(--text-muted)'}}>{l.expectedReturnDate ? format(new Date(l.expectedReturnDate),'dd MMM yyyy') : '—'}</td>
                    <td><span className={`badge ${statusBadge[l.status]}`}>{l.status}</span></td>
                    <td>{l.status !== 'RETURNED' && <button className="btn btn-secondary btn-sm btn-icon" onClick={()=>setReturnItem(l)} title="Record Return"><RotateCcw size={13}/></button>}</td>
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
      {showLend && <LendModal onClose={()=>setShowLend(false)} />}
      {returnItem && <ReturnModal lending={returnItem} onClose={()=>setReturnItem(null)} />}
    </div>
  );
}
