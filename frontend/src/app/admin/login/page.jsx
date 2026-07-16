'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/admin');
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
        background:
          'radial-gradient(circle at top left, rgba(200,125,135,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(107,117,86,0.12), transparent 28%), #FDFAF7',
        display: 'grid',
        placeItems: 'center',
        padding: 'clamp(1.25rem, 3vw, 2.5rem)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          background: 'rgba(255,255,255,0.82)',
          border: '1px solid rgba(201, 177, 181, 0.45)',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(91, 68, 77, 0.10)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            padding: 'clamp(2rem, 4vw, 4rem)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '2rem',
            borderRight: '1px solid rgba(201, 177, 181, 0.28)',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#C87D87',
                marginBottom: '1rem',
                fontWeight: 700,
              }}
            >
              Inora
            </p>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.6rem)',
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                color: '#3B2C34',
                marginBottom: '1rem',
              }}
            >
              Welcome back to your form workspace
            </h1>

            <p
              style={{
                color: '#6F5D66',
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: '34rem',
              }}
            >
              Sign in to manage your forms, update questions, and review submissions in one calm, private dashboard.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '0.9rem',
            }}
          >
            {[
              'Create and manage your own forms',
              'Edit questions before responses arrive',
              'Review submissions from your dashboard',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: '#4F3E47',
                  fontSize: '0.98rem',
                  background: 'rgba(255,255,255,0.56)',
                  border: '1px solid rgba(201, 177, 181, 0.22)',
                  borderRadius: '18px',
                  padding: '0.95rem 1rem',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '999px',
                    background: '#C87D87',
                    flexShrink: 0,
                    boxShadow: '0 0 0 6px rgba(200,125,135,0.12)',
                  }}
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.72)',
          }}
        >
          <div style={{ width: '100%', maxWidth: '420px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontSize: '1.85rem',
                  color: '#3B2C34',
                  marginBottom: '0.45rem',
                }}
              >
                Sign in
              </h2>

              <p
                style={{
                  color: '#7A6670',
                  lineHeight: 1.7,
                  fontSize: '0.98rem',
                }}
              >
                Use your email and password to enter your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    marginBottom: '0.45rem',
                    fontWeight: 600,
                    color: '#4B3A42',
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
                    padding: '0.95rem 1rem',
                    border: '1px solid #E8DCDD',
                    borderRadius: '16px',
                    background: '#FFFDFC',
                    color: '#3B2C34',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.45rem',
                    gap: '1rem',
                  }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      fontWeight: 600,
                      color: '#4B3A42',
                    }}
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    style={{
                      color: '#6B7556',
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem',
                    border: '1px solid #E8DCDD',
                    borderRadius: '16px',
                    background: '#FFFDFC',
                    color: '#3B2C34',
                    outline: 'none',
                  }}
                />
              </div>

              {error ? (
                <div
                  style={{
                    background: '#FFF3F4',
                    color: '#B42318',
                    border: '1px solid #F2C7CD',
                    borderRadius: '16px',
                    padding: '0.85rem 0.95rem',
                    fontSize: '0.93rem',
                  }}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.35rem',
                  background: '#C87D87',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '1rem 1.1rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.75 : 1,
                  boxShadow: '0 14px 30px rgba(200,125,135,0.22)',
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p
              style={{
                marginTop: '1.25rem',
                color: '#7A6670',
                fontSize: '0.95rem',
              }}
            >
              New here?{' '}
              <Link
                href="/register"
                style={{
                  color: '#6B7556',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
