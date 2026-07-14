'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ResponsesPage({ params }) {
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
        const [formData, responsesData] = await Promise.all([
          api.getForm(id),
          api.getResponses(id),
        ]);

        if (!mounted) return;

        setForm(formData);
        setResponses(Array.isArray(responsesData) ? responsesData : []);
      } catch {
        if (mounted) {
          setError('Could not load responses.');
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
      <div style={{ minHeight: '100vh', background: '#f7f6f2', padding: '2rem' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #e5e5e0',
            borderRadius: '12px',
            padding: '2rem',
            color: '#666',
          }}
        >
          Loading responses...
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f6f2', padding: '2rem' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #e5e5e0',
            borderRadius: '12px',
            padding: '2rem',
            color: '#666',
          }}
        >
          Could not load responses.
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#28251d' }}>
              {form.title}
            </h1>
            <p style={{ color: '#7a7974', marginTop: '0.25rem' }}>
              {responses.length} response{responses.length !== 1 ? 's' : ''}
            </p>
          </div>

          <a
            href="/admin/forms"
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
            Back to forms
          </a>
        </div>

        {!responses.length ? (
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e5e0',
              borderRadius: '12px',
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
              <div
                key={response.id}
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

                        <div style={{ color: '#28251d', fontSize: '0.95rem' }}>
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
