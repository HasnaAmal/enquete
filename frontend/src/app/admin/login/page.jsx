'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
      const data = await api.login(email, password);

      if (data?.user?.role === 'ADMIN') {
        router.push('/admin/forms');
      } else {
        router.push('/');
      }

      router.refresh();
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check your credentials.');
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
        background: '#FDFAF7',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#fff',
          border: '1px solid #ead8db',
          borderRadius: '24px',
          padding: '2.2rem',
          boxShadow: '0 20px 50px rgba(200,125,135,0.10)',
        }}
      >
        <p
          style={{
            fontSize: '0.78rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C87D87',
            marginBottom: '0.75rem',
          }}
        >
          Inora
        </p>

        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '0.55rem',
            color: '#3B2C34',
          }}
        >
          Sign in
        </h1>

        <p style={{ color: '#7a6670', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Sign in to access your account. Admins will be directed to the admin space automatically.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.45rem',
                fontWeight: 500,
                color: '#4b3a42',
              }}
            >
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
                padding: '0.9rem 1rem',
                border: '1px solid #e6d7da',
                borderRadius: '14px',
                background: '#fffdfc',
                color: '#3B2C34',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.45rem',
                fontWeight: 500,
                color: '#4b3a42',
              }}
            >
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
                padding: '0.9rem 1rem',
                border: '1px solid #e6d7da',
                borderRadius: '14px',
                background: '#fffdfc',
                color: '#3B2C34',
                outline: 'none',
              }}
            />
          </div>

          {error ? (
            <div
              style={{
                background: '#fff1f1',
                color: '#b42318',
                border: '1px solid #f3c7c7',
                borderRadius: '14px',
                padding: '0.8rem 0.95rem',
                fontSize: '0.92rem',
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#C87D87',
              color: '#fff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.95rem 1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', color: '#7a6670', fontSize: '0.95rem' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: '#6B7556', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
