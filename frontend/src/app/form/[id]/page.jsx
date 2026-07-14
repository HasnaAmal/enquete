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
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#888' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</p>
        <p style={{ fontWeight: 500 }}>Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#888' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
        <p style={{ fontWeight: 500 }}>{error}</p>
      </div>
    );
  }

  if (!form || form.status !== 'PUBLISHED') {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#888' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔒</p>
        <p style={{ fontWeight: 500 }}>This form is not available yet.</p>
      </div>
    );
  }

  return <PublicFormClient form={form} />;
}
