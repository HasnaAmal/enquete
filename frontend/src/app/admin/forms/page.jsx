'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await api.getForms();
        if (mounted) {
          setForms(Array.isArray(data) ? data : []);
        }
      } catch {
        if (mounted) {
          setError('Could not load forms.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
          gap: '1rem',
          flexWrap: 'wrap',
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
            Forms
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <Link href="/admin" style={linkBtnSecondary}>
            Back to Builder
          </Link>
          <Link href="/admin" style={linkBtnPrimary}>
            + Create New Form
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#28251d' }}>All Forms</h1>
          <p style={{ color: '#7a7974', marginTop: '0.25rem' }}>
            {loading
              ? 'Loading your forms...'
              : error
              ? error
              : `${forms.length} form${forms.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {loading ? (
          <div style={emptyCard}>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>Loading forms...</p>
          </div>
        ) : error ? (
          <div style={emptyCard}>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>{error}</p>
          </div>
        ) : !forms.length ? (
          <div style={emptyCard}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</div>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>No forms yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Create your first form from the builder.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {forms.map((form) => (
              <div
                key={form.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                  }}
                >
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#28251d' }}>
                      {form.title}
                    </h2>
                    <p style={{ color: '#7a7974', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {form.description || 'No description'}
                    </p>
                  </div>

                  <span
                    style={{
                      alignSelf: 'flex-start',
                      background: form.status === 'PUBLISHED' ? '#eef5e9' : '#f3f0ec',
                      color: form.status === 'PUBLISHED' ? '#437a22' : '#7a7974',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {form.status}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    fontSize: '0.85rem',
                    color: '#7a7974',
                    marginBottom: '1rem',
                  }}
                >
                  <span>{form._count?.questions || 0} questions</span>
                  <span>{form._count?.responses || 0} responses</span>
                  <span>Updated {new Date(form.updatedAt).toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a
                    href={`/form/${form.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkBtnPrimary}
                  >
                    Open public form
                  </a>

                  <Link href={`/admin/responses/${form.id}`} style={linkBtnSecondary}>
                    View responses
                  </Link>

                  <Link href={`/admin/edit/${form.id}`} style={linkBtnSecondary}>
                    Edit form
                  </Link>

                  <Link href="/admin" style={linkBtnSecondary}>
                    Create another form
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const emptyCard = {
  background: '#fff',
  border: '1px solid #e5e5e0',
  borderRadius: '12px',
  padding: '3rem',
  textAlign: 'center',
  color: '#aaa',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const linkBtnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#01696f',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.6rem 1rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  textDecoration: 'none',
};

const linkBtnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#f3f0ec',
  color: '#28251d',
  border: '1px solid #d4d1ca',
  borderRadius: '8px',
  padding: '0.6rem 1rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  textDecoration: 'none',
};
