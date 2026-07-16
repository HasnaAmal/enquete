'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ResponsesPage() {
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    (async () => {
      try {
        const formData = await api.getForm(id);
        const responsesData = await api.getResponses(id);

        if (!mounted) return;
        setForm(formData);
        setResponses(Array.isArray(responsesData) ? responsesData : []);
      } catch {
        if (mounted) setError('Could not load responses.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
        <header style={headerStyle}>
          <div style={{ fontWeight: 700, color: '#28251d' }}>FormCraft</div>
        </header>
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem' }}>
          <div style={cardStyle}>Loading responses...</div>
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
        <header style={headerStyle}>
          <div style={{ fontWeight: 700, color: '#28251d' }}>FormCraft</div>
        </header>
        <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem' }}>
          <div style={cardStyle}>{error || 'Could not load responses.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
      <header style={headerStyle}>
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
            Responses
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <Link href="/admin/forms" style={linkBtnSecondary}>
            Back to forms
          </Link>
          <Link href={`/admin/edit/${id}`} style={linkBtnSecondary}>
            Edit form
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#28251d' }}>{form.title}</h1>
          <p style={{ color: '#7a7974', marginTop: '0.25rem' }}>
            {responses.length} response{responses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {!responses.length ? (
          <div
            style={{
              ...cardStyle,
              padding: '3rem',
              textAlign: 'center',
              color: '#aaa',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>No responses yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Once users submit this form, their answers will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {responses.map((response, index) => (
              <div key={response.id} style={cardStyle}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #f0efeb',
                  }}
                >
                  <span
                    style={{
                      background: '#01696f',
                      color: '#fff',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    Response #{responses.length - index}
                  </span>

                  <span style={{ color: '#7a7974', fontSize: '0.85rem' }}>
                    {new Date(response.createdAt).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {response.answers.map((answer) => {
                    let displayValue = answer.value;

                    try {
                      const parsed = JSON.parse(answer.value);
                      if (Array.isArray(parsed)) {
                        displayValue = parsed.join(', ');
                      }
                    } catch {}

                    return (
                      <div
                        key={answer.id}
                        style={{
                          background: '#fafaf8',
                          border: '1px solid #ece9e3',
                          borderRadius: '10px',
                          padding: '0.875rem 1rem',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            color: '#7a7974',
                            marginBottom: '0.35rem',
                          }}
                        >
                          {answer.question?.text || 'Deleted question'}
                        </div>

                        <div style={{ color: '#28251d', fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {String(displayValue || '—')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const headerStyle = {
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
};

const cardStyle = {
  background: '#fff',
  border: '1px solid #e5e5e0',
  borderRadius: '12px',
  padding: '1.25rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
