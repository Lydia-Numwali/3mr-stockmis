import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useFontLoaded } from './hooks/useFontLoaded';
import AppLayout from './components/Layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import StockPage from './pages/StockPage';
import SalesPage from './pages/SalesPage';
import LendingPage from './pages/LendingPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import './styles/fonts.css';
import './styles/responsive.css';
import './index.css';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30000 } } });

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="stock" element={<StockPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="lending" element={<LendingPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const fontLoaded = useFontLoaded();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {fontLoaded ? (
            <>
              <AppContent />
              <Toaster position="top-right" toastOptions={{ style: { background: '#1e2530', color: '#e6edf3', border: '1px solid #30363d' }, success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } } }} />
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
              <p>Loading...</p>
            </div>
          )}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
