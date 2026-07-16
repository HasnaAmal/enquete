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
    <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
      <header
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e5e0',
          padding: '0.875rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="22" height="22" rx="6" stroke="#01696f" strokeWidth="2" />
            <line x1="8" y1="10" x2="20" y2="10" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="14" x2="17" y2="14" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="18" x2="13" y2="18" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
            <circle cx="21" cy="18" r="3.5" fill="#01696f" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#28251d' }}>FormCraft</span>
        </div>

        <Link
          href="/register"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f3f0ec',
            color: '#28251d',
            border: '1px solid #d4d1ca',
            borderRadius: '8px',
            padding: '0.625rem 1rem',
            fontWeight: 500,
            fontSize: '0.875rem',
            textDecoration: 'none',
          }}
        >
          Create account
        </Link>
      </header>

      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '2rem',
          minHeight: 'calc(100vh - 72px)',
          display: 'grid',
          gridTemplateColumns: '1.05fr 420px',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        <section>
          <div style={{ marginBottom: '1rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '3px 10px',
                borderRadius: '99px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: '#e6f2f2',
                color: '#01696f',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'currentColor',
                  display: 'inline-block',
                }}
              />
              Private workspace
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.05,
              fontWeight: 700,
              color: '#28251d',
              marginBottom: '0.875rem',
              maxWidth: '10ch',
            }}
          >
            Build and manage forms in one place
          </h1>

          <p
            style={{
              color: '#7a7974',
              fontSize: '1rem',
              lineHeight: 1.75,
              maxWidth: '56ch',
              marginBottom: '1.5rem',
            }}
          >
            Sign in to create forms, edit questions, publish surveys, and review incoming responses from your dashboard.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.875rem',
            }}
          >
            {[
              { title: 'Draft fast', text: 'Start with a title, add questions, and save anytime.' },
              { title: 'Publish clearly', text: 'Share live forms with a simple public link.' },
              { title: 'Track responses', text: 'Review submissions inside your private admin area.' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#e6f2f2',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#01696f',
                    }}
                  />
                </div>

                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#28251d',
                    marginBottom: '0.35rem',
                  }}
                >
                  {item.title}
                </p>

                <p
                  style={{
                    color: '#7a7974',
                    fontSize: '0.875rem',
                    lineHeight: 1.65,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: '#fff',
            border: '1px solid #e5e5e0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderBottom: '1px solid #f0efeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#28251d' }}>Sign in</span>
            <span
              style={{
                background: '#f3f0ec',
                color: '#7a7974',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Secure access
            </span>
          </div>

          <div
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            <div style={{ marginBottom: '0.25rem' }}>
              <h2
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#28251d',
                  marginBottom: '0.35rem',
                }}
              >
                Welcome back
              </h2>
              <p style={{ color: '#7a7974', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Enter your details to continue to your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={fieldStyle}>
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={inputStyle}
                  placeholder="you@example.com"
                />
              </div>

              <div style={fieldStyle}>
                <label htmlFor="password" style={labelStyle}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={inputStyle}
                  placeholder="Enter your password"
                />
              </div>

              {error ? (
                <div
                  style={{
                    background: '#fff5f5',
                    color: '#c53030',
                    border: '1px solid #fed7d7',
                    borderRadius: '8px',
                    padding: '0.75rem 0.875rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...btnPrimary,
                  width: '100%',
                  justifyContent: 'center',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p style={{ marginTop: '0.25rem', color: '#7a7974', fontSize: '0.875rem' }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                style={{ color: '#01696f', fontWeight: 600, textDecoration: 'none' }}
              >
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
};

const labelStyle = {
  fontSize: '0.825rem',
  fontWeight: 500,
  color: '#28251d',
};

const inputStyle = {
  padding: '0.6rem 0.875rem',
  border: '1px solid #d4d1ca',
  borderRadius: '8px',
  fontSize: '0.875rem',
  background: '#fafaf8',
  width: '100%',
  transition: 'border-color 180ms ease',
};

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#01696f',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.125rem',
  fontWeight: 500,
  fontSize: '0.875rem',
};
