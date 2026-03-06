import { useQuery } from '@tanstack/react-query';
import { dashboardApi, salesApi } from '../services/api';
import { Package, Layers, AlertTriangle, HandHelping, ShoppingCart, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';
import Card from '../components/Card/Card';
import Badge from '../components/Badge/Badge';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

function StatCard({ label, value, sub, variant = 'default', icon: Icon }) {
  return (
    <Card variant={variant} style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#2563EB', marginBottom: '8px' }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: '#6B7280' }}>{sub}</div>}
      </div>
      {Icon && <div style={{ color: '#2563EB', marginTop: '12px' }}><Icon size={24} /></div>}
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({ queryKey: ['dashboard-stats'], queryFn: () => dashboardApi.getStats().then(r => r.data) });
  const { data: trend } = useQuery({ queryKey: ['revenue-trend'], queryFn: () => dashboardApi.getRevenueTrend().then(r => r.data) });
  const { data: categories } = useQuery({ queryKey: ['category-breakdown'], queryFn: () => dashboardApi.getCategoryBreakdown().then(r => r.data) });

  const trendData = (trend || []).map(r => ({
    month: format(new Date(r.month), 'MMM yy'),
    revenue: Number(r.revenue),
  }));

  const catData = (categories || []).map(r => ({ name: r.category, value: Number(r.totalQty) }));

  const formatMoney = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n || 0);

  if (isLoading) return <div className="page-loader"><div className="loader spin" /></div>;

  return (
    <div className="page">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Overview of your motorcycle parts inventory</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total Products" value={stats?.totalProducts || 0} variant="default" icon={Package} />
        <StatCard label="Total Stock" value={stats?.totalStock?.toLocaleString() || 0} sub="units in store" variant="default" icon={Layers} />
        <StatCard label="Low Stock" value={stats?.lowStockCount || 0} sub="need restocking" variant="default" icon={AlertTriangle} />
        <StatCard label="Items Lent Out" value={stats?.productsLentOut || 0} sub="pending return" variant="default" icon={HandHelping} />
        <StatCard label="Sold Today" value={stats?.soldToday || 0} sub="units" variant="default" icon={ShoppingCart} />
        <StatCard label="Revenue Today" value={formatMoney(stats?.revenueToday)} variant="default" icon={DollarSign} />
        <StatCard label="Revenue This Month" value={formatMoney(stats?.revenueThisMonth)} variant="default" icon={TrendingUp} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Revenue Trend (6 months)</h2>
            <TrendingUp size={20} style={{ color: '#2563EB' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827' }} formatter={v => [formatMoney(v), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>Stock by Category</h2>
            <BarChart2 size={20} style={{ color: '#2563EB' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#111827' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6B7280' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {stats?.lowStockProducts?.length > 0 && (
        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={20} style={{ color: '#EF4444' }} /> Low Stock Alerts
            </h2>
            <Badge variant="error">{stats.lowStockProducts.length} items</Badge>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Product</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Category</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Brand</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Available</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 500, color: '#374151' }}>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.slice(0, 8).map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}><Badge variant="secondary">{p.category}</Badge></td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>{p.brand || '—'}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}><Badge variant={p.quantity === 0 ? 'error' : 'warning'}>{p.quantity}</Badge></td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6B7280' }}>{p.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
