import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/api';
import { BarChart3, Download, TrendingUp, Package, HandHelping, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';
import Badge from '../components/Badge/Badge';
import Alert from '../components/Alert/Alert';

const formatMoney = (n) => `KES ${Number(n || 0).toLocaleString()}`;

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('income');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [exporting, setExporting] = useState(false);

  const { data: income } = useQuery({ queryKey: ['income-report'], queryFn: () => reportsApi.getIncome().then(r => r.data), enabled: activeTab === 'income' });
  const { data: salesData } = useQuery({ queryKey: ['sales-report', from, to], queryFn: () => reportsApi.getSales({ from, to }).then(r => r.data), enabled: activeTab === 'sales' });
  const { data: stockData } = useQuery({ queryKey: ['stock-report'], queryFn: () => reportsApi.getStock().then(r => r.data), enabled: activeTab === 'stock' });
  const { data: lendingData } = useQuery({ queryKey: ['lending-report'], queryFn: () => reportsApi.getLending().then(r => r.data), enabled: activeTab === 'lending' });

  const handleExport = async (type) => {
    setExporting(true);
    try {
      let res;
      if (type === 'sales') res = await reportsApi.exportSales({ from, to });
      else if (type === 'stock') res = await reportsApi.exportStock();
      else if (type === 'lending') res = await reportsApi.exportLending();
      downloadBlob(new Blob([res.data]), `${type}-report.xlsx`);
      toast.success('Export complete!');
    } catch { toast.error('Export failed'); } finally { setExporting(false); }
  };

  return (
    <div className="page">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Reports</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Generate and export inventory reports</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
        {[['income','Income Summary'],['sales','Sales Report'],['stock','Stock Report'],['lending','Lending Report']].map(([v,l])=>(
          <button key={v} style={{ padding: '12px 16px', border: 'none', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 500, color: activeTab === v ? '#2563EB' : '#6B7280', borderBottom: activeTab === v ? '2px solid #2563EB' : 'none', cursor: 'pointer' }} onClick={()=>setActiveTab(v)}>{l}</button>
        ))}
      </div>

      {/* Income Summary */}
      {activeTab === 'income' && income && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <Card variant="default" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Income</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981' }}>{formatMoney(income.dailyIncome)}</div>
            </Card>
            <Card variant="default" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Income</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2563EB' }}>{formatMoney(income.weeklyIncome)}</div>
            </Card>
            <Card variant="default" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Monthly Income</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#8B5CF6' }}>{formatMoney(income.monthlyIncome)}</div>
            </Card>
          </div>
          <Card variant="default" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Top Selling Products</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={income.topSelling} margin={{top:10,right:20,left:20,bottom:60}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="productName" tick={{fill:'#6B7280',fontSize:11}} angle={-35} textAnchor="end" />
                <YAxis tick={{fill:'#6B7280',fontSize:11}} />
                <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:8,color:'#111827'}} />
                <Bar dataKey="totalSold" fill="#2563EB" radius={[4,4,0,0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>From</label>
              <Input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{ width: '150px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>To</label>
              <Input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{ width: '150px' }} />
            </div>
            <Button variant="primary" onClick={()=>handleExport('sales')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</Button>
          </div>
          {salesData && <Alert variant="success" title="Total Revenue" message={`${formatMoney(salesData.totalRevenue)} from ${salesData.sales?.length} sales`} />}
          <Card variant="default" style={{ padding: 0, overflow: 'hidden', marginTop: '16px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Qty</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Type</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Total</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(salesData?.sales || []).map(s=>(
                    <tr key={s.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{s.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{s.product?.name}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{s.quantitySold}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant={s.saleType==='RETAIL'?'info':'warning'}>{s.saleType}</Badge></td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{formatMoney(s.priceUsed)}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#10B981' }}>{formatMoney(s.quantitySold * Number(s.priceUsed))}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{format(new Date(s.date),'dd MMM yyyy')}</td>
                    </tr>
                  ))}
                  {!salesData?.sales?.length && <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No sales data</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Stock Report */}
      {activeTab === 'stock' && (
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={()=>handleExport('stock')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</Button></div>
          <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Category</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Brand</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Qty</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Cost Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Retail</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Wholesale</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Supplier</th>
                  </tr>
                </thead>
                <tbody>
                  {(stockData || []).map(p=>(
                    <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{p.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{p.name}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant="secondary">{p.category}</Badge></td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{p.brand||'—'}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant={p.quantity===0?'error':p.quantity<=p.lowStockThreshold?'warning':'success'}>{p.quantity}</Badge></td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{formatMoney(p.costPrice)}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{formatMoney(p.retailPrice)}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{formatMoney(p.wholesalePrice)}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{p.supplier||'—'}</td>
                    </tr>
                  ))}
                  {!stockData?.length && <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No stock data</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Lending Report */}
      {activeTab === 'lending' && (
        <div>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'flex-end' }}><Button variant="primary" onClick={()=>handleExport('lending')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</Button></div>
          <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>#</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Borrower</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Lent</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Returned</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Remaining</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Date Lent</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Expected</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(lendingData || []).map(l=>(
                    <tr key={l.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 16px', color: '#6B7280', fontSize: '12px' }}>{l.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#111827' }}>{l.product?.name}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{l.borrowerShop}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{l.quantityLent}</td>
                      <td style={{ padding: '12px 16px', color: '#111827' }}>{l.quantityReturned}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>{l.quantityLent - l.quantityReturned}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280' }}>{format(new Date(l.dateLent),'dd MMM yyyy')}</td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: l.status==='OVERDUE'?'#EF4444':'#6B7280' }}>{l.expectedReturnDate ? format(new Date(l.expectedReturnDate),'dd MMM yyyy') : '—'}</td>
                      <td style={{ padding: '12px 16px' }}><Badge variant={l.status==='RETURNED'?'success':l.status==='OVERDUE'?'error':'warning'}>{l.status}</Badge></td>
                    </tr>
                  ))}
                  {!lendingData?.length && <tr><td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No lending data</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
