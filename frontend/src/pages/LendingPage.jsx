import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lendingApi, productsApi } from '../services/api';
import { Plus, X, RotateCcw, HandHelping } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import Modal from '../components/Modal/Modal';
import Badge from '../components/Badge/Badge';

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
    <Modal isOpen={true} onClose={onClose} title="Lend Product">
      <form onSubmit={e=>{ e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Product *</label>
          <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.productId} onChange={e=>set('productId',e.target.value)} required>
            <option value="">Select product</option>
            {products.map(p=><option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Quantity *</label>
            <Input type="number" min="1" value={form.quantityLent} onChange={e=>set('quantityLent',e.target.value)} required/>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Borrower Shop *</label>
            <Input value={form.borrowerShop} onChange={e=>set('borrowerShop',e.target.value)} required/>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Contact</label>
            <Input value={form.borrowerContact} onChange={e=>set('borrowerContact',e.target.value)}/>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Date Lent</label>
            <Input type="date" value={form.dateLent} onChange={e=>set('dateLent',e.target.value)}/>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Expected Return</label>
            <Input type="date" value={form.expectedReturnDate} onChange={e=>set('expectedReturnDate',e.target.value)}/>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
          <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Lend Product'}</Button>
        </div>
      </form>
    </Modal>
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
    <Modal isOpen={true} onClose={onClose} title="Record Return" size="small">
      <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>Returning from: <strong style={{ color: '#111827' }}>{lending.borrowerShop}</strong> | Product: <strong style={{ color: '#111827' }}>{lending.product?.name}</strong></p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Qty to Return (max {remaining})</label>
          <Input type="number" min="1" max={remaining} value={form.quantityReturned} onChange={e=>setForm(f=>({...f,quantityReturned:e.target.value}))}/>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Return Date</label>
          <Input type="date" value={form.returnDate} onChange={e=>setForm(f=>({...f,returnDate:e.target.value}))}/>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
          <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} rows={2} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={()=>mutation.mutate(form)} disabled={mutation.isPending}>{mutation.isPending?'Saving...':'Record Return'}</Button>
        </div>
      </div>
    </Modal>
  );
}

const statusVariant = {PENDING:'warning',OVERDUE:'error',RETURNED:'success',PARTIALLY_RETURNED:'info'};

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
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Lent Products</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>Track items lent to other shops</p>
          </div>
          <Button variant="primary" onClick={()=>setShowLend(true)}><Plus size={16}/>Lend Product</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
        {[['all','All'],['pending','Pending'],['overdue','Overdue']].map(([v,l])=>(
          <button key={v} style={{ padding: '12px 16px', border: 'none', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 500, color: tab === v ? '#2563EB' : '#6B7280', borderBottom: tab === v ? '2px solid #2563EB' : 'none', cursor: 'pointer' }} onClick={()=>{setTab(v);setPage(1);}}>{l}</button>
        ))}
      </div>

      <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? <div style={{ padding: '40px', textAlign: 'center' }}><div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Borrower Shop</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Contact</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Lent</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Returned</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Remaining</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Expected Return</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lendings.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center' }}><div><HandHelping size={40} style={{ color: '#D1D5DB', marginBottom: '12px' }}/><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>No lending records</h3></div></td></tr>
                ) : lendings.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{l.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{l.product?.name}</td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{l.borrowerShop}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{l.borrowerContact || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{l.quantityLent}</td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{l.quantityReturned}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: (l.quantityLent-l.quantityReturned)>0 ? '#F59E0B':'#10B981' }}>{l.quantityLent - l.quantityReturned}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: l.status==='OVERDUE'?'#EF4444':'#6B7280' }}>{l.expectedReturnDate ? format(new Date(l.expectedReturnDate),'dd MMM yyyy') : '—'}</td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={statusVariant[l.status]}>{l.status}</Badge></td>
                    <td style={{ padding: '12px 16px' }}>{l.status !== 'RETURNED' && <Button variant="secondary" size="small" onClick={()=>setReturnItem(l)} title="Record Return"><RotateCcw size={14}/></Button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" size="small" disabled={page===1} onClick={()=>setPage(p=>p-1)}>Prev</Button>
              <Button variant="secondary" size="small" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
      {showLend && <LendModal onClose={()=>setShowLend(false)} />}
      {returnItem && <ReturnModal lending={returnItem} onClose={()=>setReturnItem(null)} />}
    </div>
  );
}
