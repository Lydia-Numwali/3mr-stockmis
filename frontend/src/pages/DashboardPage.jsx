import { useQuery } from '@tanstack/react-query';
import { dashboardApi, salesApi } from '../services/api';
import { Package, Layers, AlertTriangle, HandHelping, ShoppingCart, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

function StatCard({ label, value, sub, color = 'green', icon: Icon }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
      {Icon && <div className="stat-icon"><Icon size={48} /></div>}
    </div>
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
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your motorcycle parts inventory</p>
        </div>
        <span className="badge badge-green">Live</span>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats mb-6">
        <StatCard label="Total Products" value={stats?.totalProducts || 0} color="green" icon={Package} />
        <StatCard label="Total Stock" value={stats?.totalStock?.toLocaleString() || 0} sub="units in store" color="blue" icon={Layers} />
        <StatCard label="Low Stock" value={stats?.lowStockCount || 0} sub="need restocking" color="red" icon={AlertTriangle} />
        <StatCard label="Items Lent Out" value={stats?.productsLentOut || 0} sub="pending return" color="orange" icon={HandHelping} />
        <StatCard label="Sold Today" value={stats?.soldToday || 0} sub="units" color="purple" icon={ShoppingCart} />
        <StatCard label="Revenue Today" value={formatMoney(stats?.revenueToday)} color="green" icon={DollarSign} />
        <StatCard label="Revenue This Month" value={formatMoney(stats?.revenueThisMonth)} color="blue" icon={TrendingUp} />
      </div>

      {/* Charts Row */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Revenue Trend (6 months)</h3>
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} formatter={v => [formatMoney(v), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: 15 }}>Stock by Category</h3>
            <BarChart2 size={16} style={{ color: 'var(--primary)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats?.lowStockProducts?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} style={{ color: 'var(--danger)' }} /> Low Stock Alerts
            </h3>
            <span className="badge badge-red">{stats.lowStockProducts.length} items</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Category</th><th>Brand</th><th>Available</th><th>Threshold</th></tr></thead>
              <tbody>
                {stats.lowStockProducts.slice(0, 8).map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td><span className="badge badge-gray">{p.category}</span></td>
                    <td>{p.brand || '—'}</td>
                    <td><span className={`badge ${p.quantity === 0 ? 'badge-red' : 'badge-orange'}`}>{p.quantity}</span></td>
                    <td className="text-muted">{p.lowStockThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
