import { api } from '@/lib/api';
import PublicFormClient from '@/components/form/PublicFormClient';

export default async function PublicFormPage({ params }) {
  const { id } = await params;
  let form = null;

  try {
    form = await api.getForm(id);
  } catch {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#888' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
        <p style={{ fontWeight: 500 }}>Form not found or server is unreachable.</p>
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