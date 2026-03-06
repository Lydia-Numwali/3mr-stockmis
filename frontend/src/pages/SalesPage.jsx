import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesApi, productsApi } from '../services/api';
import { Plus, X, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import Modal from '../components/Modal/Modal';
import Badge from '../components/Badge/Badge';
import Alert from '../components/Alert/Alert';

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
    <Modal isOpen={true} onClose={onClose} title="Record Sale">
      <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Product *</label>
          <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.productId} onChange={e=>handleProductChange(e.target.value)} required>
            <option value="">Select product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Sale Type</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.saleType} onChange={e=>handleSaleTypeChange(e.target.value)}>
              <option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Customer Type</label>
            <select style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} value={form.customerType} onChange={e=>set('customerType',e.target.value)}>
              <option value="INDIVIDUAL">Individual</option><option value="SHOP_OWNER">Shop Owner</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Quantity *</label>
            <Input type="number" min="1" value={form.quantitySold} onChange={e=>set('quantitySold',e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Price (KES) *</label>
            <Input type="number" min="0" value={form.priceUsed} onChange={e=>set('priceUsed',e.target.value)} required />
          </div>
        </div>
        {total > 0 && <Alert variant="success" title="Total Sale Value" message={`KES ${total.toLocaleString()}`} />}
        {selectedProduct && selectedProduct.quantity < form.quantitySold && <Alert variant="error" title="Insufficient stock" message={`Available: ${selectedProduct.quantity}`} />}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Notes</label>
          <textarea style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} value={form.notes} onChange={e=>set('notes',e.target.value)} rows={2}/>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={mutation.isPending}>{mutation.isPending ? 'Recording...' : 'Record Sale'}</Button>
        </div>
      </form>
    </Modal>
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
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Sales Records</h1>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>{total} sales recorded</p>
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)}><Plus size={16}/>Record Sale</Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>From</label>
          <Input type="date" value={from} onChange={e=>{setFrom(e.target.value);setPage(1);}} style={{ width: '150px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>To</label>
          <Input type="date" value={to} onChange={e=>{setTo(e.target.value);setPage(1);}} style={{ width: '150px' }} />
        </div>
        <select style={{ padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', width: '150px' }} value={saleType} onChange={e=>{setSaleType(e.target.value);setPage(1);}}>
          <option value="">All Types</option><option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
        </select>
      </div>

      {sales.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <Card variant="default" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Records</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#2563EB' }}>{total}</div>
          </Card>
          <Card variant="default" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimated Revenue</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#10B981' }}>KES {totalRevenue.toLocaleString()}</div>
          </Card>
          <Card variant="default" style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Showing</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#8B5CF6' }}>{sales.length}</div>
          </Card>
        </div>
      )}

      <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          {isLoading ? <div style={{ padding: '40px', textAlign: 'center' }}><div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Qty</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Price</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Total</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}><div><ShoppingCart size={40} style={{ color: '#D1D5DB', marginBottom: '12px' }}/><h3 style={{ fontSize: '16px', fontWeight: 600, color: '#6B7280' }}>No sales recorded</h3></div></td></tr>
                ) : sales.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{s.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{s.product?.name}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{s.quantitySold}</td>
                    <td style={{ padding: '12px 16px' }}><Badge variant={s.saleType === 'RETAIL' ? 'info' : 'warning'}>{s.saleType}</Badge></td>
                    <td style={{ padding: '12px 16px' }}><Badge variant="secondary">{s.customerType || '—'}</Badge></td>
                    <td style={{ padding: '12px 16px', color: '#111827' }}>KES {Number(s.priceUsed).toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#10B981' }}>KES {(s.quantitySold * Number(s.priceUsed)).toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{format(new Date(s.date), 'dd MMM yyyy HH:mm')}</td>
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
      {showAdd && <RecordSaleModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
