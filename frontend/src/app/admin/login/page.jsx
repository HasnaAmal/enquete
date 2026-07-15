'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.adminLogin(email, password);
      router.push('/admin/forms');
      router.refresh();
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f7f6f2',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#fff',
          border: '1px solid #e5e5e0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#28251d' }}>
          Admin login
        </h1>

        <p style={{ color: '#7a7974', marginBottom: '1.5rem' }}>
          Sign in to create forms and view responses.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                padding: '0.8rem 0.9rem',
                border: '1px solid #d4d1ca',
                borderRadius: '10px',
                background: '#fafaf8',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.8rem 0.9rem',
                border: '1px solid #d4d1ca',
                borderRadius: '10px',
                background: '#fafaf8',
              }}
            />
          </div>

          {error ? (
            <div
              style={{
                background: '#fff1f1',
                color: '#b42318',
                border: '1px solid #f3c7c7',
                borderRadius: '10px',
                padding: '0.75rem 0.9rem',
                fontSize: '0.9rem',
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#01696f',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
