import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, Layers, ShoppingCart,
  HandHelping, BarChart3, Settings, LogOut, Wrench
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/stock', icon: Layers, label: 'Stock' },
  { to: '/sales', icon: ShoppingCart, label: 'Sales' },
  { to: '/lending', icon: HandHelping, label: 'Lent Items' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><Wrench size={20} /></div>
        <div className="brand-text">
          <span className="brand-name">StockMIS</span>
          <span className="brand-sub">Parts Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'M'}</div>
          <div className="user-info">
            <span className="user-name">{user?.username || 'Manager'}</span>
            <span className="user-role">{user?.role || 'manager'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
