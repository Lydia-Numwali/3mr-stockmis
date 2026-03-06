import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Card from '../components/Card/Card';

export default function SettingsPage() {
  const { user } = useAuth();
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  return (
    <div className="page">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#6B7280' }}>Manage your system preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} style={{ color: '#2563EB' }}/>Account</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Username</label>
              <Input value={user?.username || ''} disabled style={{ opacity: 0.6 }}/>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Role</label>
              <Input value={user?.role || ''} disabled style={{ opacity: 0.6, textTransform: 'capitalize' }}/>
            </div>
          </div>
        </Card>

        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}><Bell size={18} style={{ color: '#2563EB' }}/>Notifications</h2>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Default Low Stock Threshold</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
              <Input type="number" min="1" value={lowStockThreshold} onChange={e=>setLowStockThreshold(e.target.value)} style={{ width: '120px' }}/>
              <Button variant="primary" onClick={()=>toast.success(`Default threshold set to ${lowStockThreshold}`)}>Save</Button>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>Products below this quantity will trigger low stock alerts</p>
          </div>
        </Card>

        <Card variant="default" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={18} style={{ color: '#2563EB' }}/>System Info</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[['Application','StockMIS — Motorcycle Parts Manager'],['Version','1.0.0'],['Database','PostgreSQL'],['Backend','NestJS + TypeORM'],['Frontend','React + Vite'],['Currency','KES (Kenyan Shilling)']].map(([k,v])=>(
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{k}</span><span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
