'use client';

import { useFontLoaded } from '@/hooks/useFontLoaded';
import { ReactNode } from 'react';

/**
 * FontLoader Component
 * 
 * Wraps the application to ensure ITC Avant Garde Gothic Std font is loaded
 * before rendering content. Shows a loading state while fonts are loading.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render
 * @returns {ReactNode} Loading state or children
 */
export function FontLoader({ children }: { children: ReactNode }) {
  const { fontLoaded } = useFontLoaded();

  // Show loading state while fonts are loading
  if (!fontLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#F9FAFB',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E5E7EB',
              borderTop: '4px solid #2563EB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            Loading application...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Render children once fonts are loaded
  return children;
}
