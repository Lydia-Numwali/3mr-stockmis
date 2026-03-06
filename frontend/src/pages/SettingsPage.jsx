import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Manage your system preferences</p></div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:20,maxWidth:640}}>
        <div className="card">
          <div className="card-header" style={{marginBottom:16}}><h3 style={{fontWeight:700,fontSize:15,display:'flex',alignItems:'center',gap:8}}><User size={16} style={{color:'var(--primary)'}}/>Account</h3></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Username</label><input className="form-control" value={user?.username || ''} disabled style={{opacity:0.6}}/></div>
            <div className="form-group"><label className="form-label">Role</label><input className="form-control" value={user?.role || ''} disabled style={{opacity:0.6,textTransform:'capitalize'}}/></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{marginBottom:16}}><h3 style={{fontWeight:700,fontSize:15,display:'flex',alignItems:'center',gap:8}}><Bell size={16} style={{color:'var(--primary)'}}/>Notifications</h3></div>
          <div className="form-group">
            <label className="form-label">Default Low Stock Threshold</label>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <input className="form-control" type="number" min="1" value={lowStockThreshold} onChange={e=>setLowStockThreshold(e.target.value)} style={{width:120}}/>
              <button className="btn btn-primary" onClick={()=>toast.success(`Default threshold set to ${lowStockThreshold}`)}>Save</button>
            </div>
            <span className="text-muted text-sm">Products below this quantity will trigger low stock alerts</span>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{marginBottom:16}}><h3 style={{fontWeight:700,fontSize:15,display:'flex',alignItems:'center',gap:8}}><Shield size={16} style={{color:'var(--primary)'}}/>System Info</h3></div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {[['Application','StockMIS — Motorcycle Parts Manager'],['Version','1.0.0'],['Database','PostgreSQL'],['Backend','NestJS + TypeORM'],['Frontend','React + Vite'],['Currency','KES (Kenyan Shilling)']].map(([k,v])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid var(--border-light)'}}>
                <span className="text-muted text-sm">{k}</span><span style={{fontSize:13,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
