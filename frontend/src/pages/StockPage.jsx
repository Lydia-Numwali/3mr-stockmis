import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stockApi, productsApi } from '../services/api';
import { Plus, X, Package, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import Modal from '../components/Modal/Modal';
import Badge from '../components/Badge/Badge';

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
    <Modal isOpen={true} onClose={onClose} title="Add Stock">
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Product *</label>
          <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.productId} onChange={e=>set('productId',e.target.value)} required>
            <option value="">Select product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Quantity *</label>
            <Input type="number" min="1" value={form.quantity} onChange={e=>set('quantity',e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Purchase Price (KES)</label>
            <Input type="number" min="0" value={form.purchasePrice} onChange={e=>set('purchasePrice',e.target.value)} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Supplier</label>
          <Input value={form.supplier} onChange={e=>set('supplier',e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
          <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={mutation.isPending}>{mutation.isPending ? 'Adding...' : 'Add Stock'}</Button>
        </div>
      </form>
    </Modal>
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

  const typeVariant = { IN: 'success', OUT: 'error', LEND: 'warning', RETURN: 'info' };
  const typeLabel = { IN: 'Stock In', OUT: 'Sold', LEND: 'Lent', RETURN: 'Returned' };

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Stock Management</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>{total} movement records</p>
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Add Stock</Button>
        </div>
      </div>

      <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? <div style={{ padding: '40px', textAlign: 'center' }}><div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Quantity</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Purchase Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Supplier</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Notes</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {movements.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}><div><Layers size={40} style={{ color: '#D1D5DB', marginBottom: '12px' }}/><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>No movements recorded</h3></div></td></tr>
                ) : movements.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{m.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{m.product?.name}</td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={typeVariant[m.type]}>{typeLabel[m.type]}</Badge></td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{m.type === 'OUT' || m.type === 'LEND' ? '-' : '+'}{m.quantity}</td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>{m.purchasePrice ? `KES ${Number(m.purchasePrice).toLocaleString()}` : '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{m.supplier || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.notes || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{format(new Date(m.date), 'dd MMM yyyy HH:mm')}</td>
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
      {showAdd && <AddStockModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
