import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { Wrench, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.access_token, data.user);
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon"><Wrench size={28} /></div>
          <h1 className="login-brand-name">StockMIS</h1>
          <p className="login-brand-sub">Motorcycle Parts Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Sign in to your account</h2>
          <p className="login-desc">Enter your credentials to access the stock management system.</p>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pass-wrap">
              <input
                className="form-control"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <div className="loader spin" /> : <LogIn size={16} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer">Default: <strong>admin</strong> / <strong>admin123</strong></p>
      </div>
    </div>
  );
}
