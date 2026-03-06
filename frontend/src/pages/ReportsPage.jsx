import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/api';
import { BarChart3, Download, TrendingUp, Package, HandHelping, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

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
      <div className="page-header">
        <div><h1 className="page-title">Reports</h1><p className="page-subtitle">Generate and export inventory reports</p></div>
      </div>

      <div className="tabs">
        {[['income','Income Summary'],['sales','Sales Report'],['stock','Stock Report'],['lending','Lending Report']].map(([v,l])=>(
          <button key={v} className={`tab-btn ${activeTab===v?'active':''}`} onClick={()=>setActiveTab(v)}>{l}</button>
        ))}
      </div>

      {/* Income Summary */}
      {activeTab === 'income' && income && (
        <div>
          <div className="grid-3 mb-6">
            <div className="stat-card green"><div className="stat-label">Daily Income</div><div className="stat-value" style={{fontSize:22}}>{formatMoney(income.dailyIncome)}</div></div>
            <div className="stat-card blue"><div className="stat-label">Weekly Income</div><div className="stat-value" style={{fontSize:22}}>{formatMoney(income.weeklyIncome)}</div></div>
            <div className="stat-card purple"><div className="stat-label">Monthly Income</div><div className="stat-value" style={{fontSize:22}}>{formatMoney(income.monthlyIncome)}</div></div>
          </div>
          <div className="card mb-4">
            <div className="card-header"><h3 style={{fontWeight:700,fontSize:15}}>Top Selling Products</h3></div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={income.topSelling} margin={{top:10,right:20,left:20,bottom:60}}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="productName" tick={{fill:'var(--text-muted)',fontSize:11}} angle={-35} textAnchor="end" />
                <YAxis tick={{fill:'var(--text-muted)',fontSize:11}} />
                <Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text)'}} />
                <Bar dataKey="totalSold" fill="var(--primary)" radius={[4,4,0,0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sales Report */}
      {activeTab === 'sales' && (
        <div>
          <div className="filters-bar mb-4">
            <div className="form-group" style={{margin:0}}><label className="form-label" style={{marginBottom:4}}>From</label><input className="form-control" type="date" value={from} onChange={e=>setFrom(e.target.value)}/></div>
            <div className="form-group" style={{margin:0}}><label className="form-label" style={{marginBottom:4}}>To</label><input className="form-control" type="date" value={to} onChange={e=>setTo(e.target.value)}/></div>
            <button className="btn btn-primary" style={{alignSelf:'flex-end'}} onClick={()=>handleExport('sales')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</button>
          </div>
          {salesData && <div className="alert alert-success mb-4">Total Revenue: <strong>{formatMoney(salesData.totalRevenue)}</strong> from {salesData.sales?.length} sales</div>}
          <div className="card" style={{padding:0}}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Product</th><th>Qty</th><th>Type</th><th>Price</th><th>Total</th><th>Date</th></tr></thead>
                <tbody>
                  {(salesData?.sales || []).map(s=>(
                    <tr key={s.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{s.id}</td>
                      <td style={{fontWeight:500}}>{s.product?.name}</td>
                      <td>{s.quantitySold}</td>
                      <td><span className={`badge ${s.saleType==='RETAIL'?'badge-blue':'badge-orange'}`}>{s.saleType}</span></td>
                      <td>{formatMoney(s.priceUsed)}</td>
                      <td style={{fontWeight:600,color:'var(--success)'}}>{formatMoney(s.quantitySold * Number(s.priceUsed))}</td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{format(new Date(s.date),'dd MMM yyyy')}</td>
                    </tr>
                  ))}
                  {!salesData?.sales?.length && <tr><td colSpan={7}><div className="empty-state" style={{padding:40}}>No sales data</div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stock Report */}
      {activeTab === 'stock' && (
        <div>
          <div style={{marginBottom:16,display:'flex',justifyContent:'flex-end'}}><button className="btn btn-primary" onClick={()=>handleExport('stock')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</button></div>
          <div className="card" style={{padding:0}}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Product</th><th>Category</th><th>Brand</th><th>Qty</th><th>Cost Price</th><th>Retail</th><th>Wholesale</th><th>Supplier</th></tr></thead>
                <tbody>
                  {(stockData || []).map(p=>(
                    <tr key={p.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{p.id}</td>
                      <td style={{fontWeight:500}}>{p.name}</td>
                      <td><span className="badge badge-gray">{p.category}</span></td>
                      <td>{p.brand||'—'}</td>
                      <td><span className={`badge ${p.quantity===0?'badge-red':p.quantity<=p.lowStockThreshold?'badge-orange':'badge-green'}`}>{p.quantity}</span></td>
                      <td>{formatMoney(p.costPrice)}</td>
                      <td>{formatMoney(p.retailPrice)}</td>
                      <td>{formatMoney(p.wholesalePrice)}</td>
                      <td style={{fontSize:12,color:'var(--text-muted)'}}>{p.supplier||'—'}</td>
                    </tr>
                  ))}
                  {!stockData?.length && <tr><td colSpan={9}><div className="empty-state" style={{padding:40}}>No stock data</div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Lending Report */}
      {activeTab === 'lending' && (
        <div>
          <div style={{marginBottom:16,display:'flex',justifyContent:'flex-end'}}><button className="btn btn-primary" onClick={()=>handleExport('lending')} disabled={exporting}><Download size={14}/>{exporting?'Exporting...':'Export Excel'}</button></div>
          <div className="card" style={{padding:0}}>
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Product</th><th>Borrower</th><th>Lent</th><th>Returned</th><th>Remaining</th><th>Date Lent</th><th>Expected</th><th>Status</th></tr></thead>
                <tbody>
                  {(lendingData || []).map(l=>(
                    <tr key={l.id}>
                      <td style={{color:'var(--text-muted)',fontSize:12}}>{l.id}</td>
                      <td style={{fontWeight:500}}>{l.product?.name}</td>
                      <td>{l.borrowerShop}</td>
                      <td>{l.quantityLent}</td>
                      <td>{l.quantityReturned}</td>
                      <td style={{fontWeight:600}}>{l.quantityLent - l.quantityReturned}</td>
                      <td style={{fontSize:12}}>{format(new Date(l.dateLent),'dd MMM yyyy')}</td>
                      <td style={{fontSize:12,color:l.status==='OVERDUE'?'var(--danger)':'var(--text-muted)'}}>{l.expectedReturnDate ? format(new Date(l.expectedReturnDate),'dd MMM yyyy') : '—'}</td>
                      <td><span className={`badge ${l.status==='RETURNED'?'badge-green':l.status==='OVERDUE'?'badge-red':'badge-orange'}`}>{l.status}</span></td>
                    </tr>
                  ))}
                  {!lendingData?.length && <tr><td colSpan={9}><div className="empty-state" style={{padding:40}}>No lending data</div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
