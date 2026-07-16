'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import PublicFormClient from '@/components/form/PublicFormClient';

export default function PublicFormPage() {
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    (async () => {
      try {
        const data = await api.getForm(id);

        if (!mounted) return;
        setForm(data);
      } catch {
        if (mounted) {
          setError('Form not found or server is unreachable.');
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
  }, [id]);

  if (loading) {
    return (
      <div style={publicPageStyle}>
        <div style={publicShellStyle}>
          <div style={publicCardStyle}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</p>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>Loading form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={publicPageStyle}>
        <div style={publicShellStyle}>
          <div style={publicCardStyle}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!form || form.status !== 'PUBLISHED') {
    return (
      <div style={publicPageStyle}>
        <div style={publicShellStyle}>
          <div style={publicCardStyle}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</p>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>This form is not available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={publicPageStyle}>
      <div style={publicShellStyle}>
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: '#fff',
              border: '1px solid #e5e5e0',
              borderRadius: '999px',
              padding: '0.5rem 0.9rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <rect x="3" y="3" width="22" height="22" rx="6" stroke="#01696f" strokeWidth="2" />
              <line x1="8" y1="10" x2="20" y2="10" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="14" x2="17" y2="14" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="18" x2="13" y2="18" stroke="#01696f" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="18" r="3.5" fill="#01696f" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#28251d' }}>FormCraft</span>
          </div>
        </div>

        <PublicFormClient form={form} />
      </div>
    </div>
  );
}

const publicPageStyle = {
  minHeight: '100vh',
  background: '#f7f6f2',
  padding: '2rem 1rem',
};

const publicShellStyle = {
  maxWidth: '820px',
  margin: '0 auto',
};

const publicCardStyle = {
  background: '#fff',
  border: '1px solid #e5e5e0',
  borderRadius: '12px',
  padding: '3rem 2rem',
  textAlign: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};
