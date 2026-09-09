import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Sekitarku Runtime Error:', error, errorInfo);
  }

  handleReload = () => {
    try {
      localStorage.removeItem('sekitarku-theme');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (const reg of registrations) reg.unregister();
        });
      }
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0d1117',
          color: '#f0f6fc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '480px',
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <AlertCircle size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Terjadi Kendala Memuat Data
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#8b949e', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Aplikasi mengalami masalah saat memuat data atau cache browser. Klik tombol di bawah untuk memuat ulang.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#2ea043',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <RefreshCw size={16} /> Muat Ulang Sekitarku
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
