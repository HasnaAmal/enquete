'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PublicFormClient({ form }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const normalizedQuestions = (form?.questions || []).map((q) => ({
    ...q,
    normalizedType: String(q.type || '').toUpperCase(),
  }));

  const setAnswer = (qId, value) => {
    setAnswers((p) => ({ ...p, [qId]: value }));
    setErrors((p) => ({ ...p, [qId]: false }));
  };

  const toggleCheckbox = (qId, value, checked) => {
    setAnswers((p) => {
      const curr = Array.isArray(p[qId]) ? p[qId] : [];
      return {
        ...p,
        [qId]: checked ? [...curr, value] : curr.filter((v) => v !== value),
      };
    });
    setErrors((p) => ({ ...p, [qId]: false }));
  };

  const validate = () => {
    const errs = {};

    normalizedQuestions.forEach((q) => {
      if (!q.required) return;

      const val = answers[q.id];
      if (!val || (Array.isArray(val) && !val.length) || val === '') {
        errs[q.id] = true;
      }
    });

    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      await api.submitResponse(form.id, answers);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const answered = Object.keys(answers).filter((id) => {
    const v = answers[id];
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '';
  }).length;

  const progress = normalizedQuestions.length
    ? Math.round((answered / normalizedQuestions.length) * 100)
    : 0;

  if (submitted) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1rem 0 2rem' }}>
        <div
          style={{
            background: '#fff',
            border: '1px solid #e5e5e0',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#eef5e9',
              color: '#437a22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2rem',
              animation: 'popIn 500ms cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            ✓
          </div>

          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem', color: '#28251d' }}>
            Response submitted
          </h2>

          <p style={{ color: '#7a7974', marginBottom: '2rem', lineHeight: 1.7 }}>
            Thank you for filling out this form.
          </p>

          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
              setErrors({});
            }}
            style={btnSecondary}
          >
            Submit another response
          </button>

          <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 0 2rem' }}>
      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e5e0',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <h1 style={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '0.375rem', color: '#28251d' }}>
            {form.title}
          </h1>

          {form.description ? (
            <p style={{ color: '#7a7974', fontSize: '0.95rem', lineHeight: 1.7 }}>{form.description}</p>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          style={{
            height: '6px',
            background: '#f3f0ec',
            borderRadius: '99px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#01696f',
              borderRadius: '99px',
              transition: 'width 300ms ease',
            }}
          />
        </div>

        <p style={{ fontSize: '0.78rem', color: '#7a7974', marginTop: '0.45rem' }}>
          {answered} of {normalizedQuestions.length} answered
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {normalizedQuestions.map((q, i) => (
          <div
            key={q.id}
            style={{
              background: '#fff',
              border: `1px solid ${errors[q.id] ? '#e53e3e' : '#e5e5e0'}`,
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: errors[q.id]
                ? '0 0 0 3px rgba(229,62,62,0.08)'
                : '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'border-color 180ms ease, box-shadow 180ms ease',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.45rem', lineHeight: 1.5, color: '#28251d' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '24px',
                    background: '#01696f',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginRight: '0.55rem',
                  }}
                >
                  {i + 1}
                </span>
                {q.text}
                {q.required && <span style={{ color: '#e53e3e', marginLeft: '4px' }}>*</span>}
              </p>

              <p style={{ fontSize: '0.78rem', color: '#7a7974' }}>
                {q.required ? 'Required' : 'Optional'}
              </p>
            </div>

            {q.normalizedType === 'SHORT' && (
              <input
                type="text"
                placeholder="Your answer"
                style={inputStyle(errors[q.id])}
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              />
            )}

            {q.normalizedType === 'LONG' && (
              <textarea
                placeholder="Your answer"
                style={{ ...inputStyle(errors[q.id]), minHeight: '120px', resize: 'vertical' }}
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              />
            )}

            {q.normalizedType === 'RADIO' &&
              q.options.map((opt) => (
                <label key={opt} style={optionLabel(answers[q.id] === opt)}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswer(q.id, opt)}
                    style={{ accentColor: '#01696f' }}
                  />
                  <span>{opt}</span>
                </label>
              ))}

            {q.normalizedType === 'CHECKBOX' &&
              q.options.map((opt) => {
                const checked = (answers[q.id] || []).includes(opt);

                return (
                  <label key={opt} style={optionLabel(checked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => toggleCheckbox(q.id, opt, e.target.checked)}
                      style={{ accentColor: '#01696f' }}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}

            {q.normalizedType === 'SELECT' && (
              <select
                style={inputStyle(errors[q.id])}
                value={answers[q.id] || ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
              >
                <option value="">Select an option</option>
                {q.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {q.normalizedType === 'RATING' && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = answers[q.id] === n;

                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAnswer(q.id, n)}
                      aria-pressed={active}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        border: `1.5px solid ${active ? '#01696f' : '#e5e5e0'}`,
                        background: active ? '#01696f' : '#fafaf8',
                        color: active ? '#fff' : '#28251d',
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            )}

            {errors[q.id] ? (
              <p style={{ color: '#e53e3e', fontSize: '0.78rem', marginTop: '0.625rem' }}>
                This field is required.
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          marginTop: '1.25rem',
          width: '100%',
          padding: '0.95rem',
          borderRadius: '10px',
          border: 'none',
          background: submitting ? '#7a7974' : '#01696f',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1rem',
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 180ms ease',
          boxShadow: submitting ? 'none' : '0 4px 12px rgba(1,105,111,0.2)',
        }}
      >
        {submitting ? 'Submitting…' : 'Submit response'}
      </button>
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.75rem 0.875rem',
  border: `1px solid ${hasError ? '#e53e3e' : '#d4d1ca'}`,
  borderRadius: '8px',
  fontSize: '0.875rem',
  background: '#fafaf8',
  color: '#28251d',
  outline: 'none',
});

const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#f3f0ec',
  color: '#28251d',
  border: '1px solid #d4d1ca',
  borderRadius: '8px',
  padding: '0.625rem 1.25rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const optionLabel = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  marginBottom: '0.5rem',
  border: `1px solid ${active ? '#01696f' : '#e5e5e0'}`,
  borderRadius: '8px',
  cursor: 'pointer',
  background: active ? 'rgba(1,105,111,0.06)' : '#fafaf8',
  fontSize: '0.875rem',
  transition: 'all 180ms ease',
  color: '#28251d',
});
