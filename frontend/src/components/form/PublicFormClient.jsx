'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PublicFormClient({ form }) {
  const [answers, setAnswers]       = useState({});
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const setAnswer = (qId, value) => {
    setAnswers(p => ({ ...p, [qId]: value }));
    setErrors(p => ({ ...p, [qId]: false }));
  };

  const toggleCheckbox = (qId, value, checked) => {
    setAnswers(p => {
      const curr = p[qId] || [];
      return { ...p, [qId]: checked ? [...curr, value] : curr.filter(v => v !== value) };
    });
    setErrors(p => ({ ...p, [qId]: false }));
  };

  const validate = () => {
    const errs = {};
    form.questions.forEach(q => {
      if (!q.required) return;
      const val = answers[q.id];
      if (!val || (Array.isArray(val) && !val.length) || val === '') errs[q.id] = true;
    });
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please fill in all required fields.'); return; }
    setSubmitting(true);
    try {
      await api.submitResponse(form.id, answers);
      setSubmitted(true);
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  const answered = Object.keys(answers).filter(id => {
    const v = answers[id];
    return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '';
  }).length;
  const progress = form.questions.length
    ? Math.round((answered / form.questions.length) * 100) : 0;

  if (submitted) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: '#eef5e9', color: '#437a22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem', fontSize: '2rem',
        animation: 'popIn 500ms cubic-bezier(0.16,1,0.3,1)'
      }}>✓</div>
      <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        Response submitted!
      </h2>
      <p style={{ color: '#7a7974', marginBottom: '2rem' }}>
        Thank you for filling out this form.
      </p>
      <button onClick={() => { setSubmitted(false); setAnswers({}); setErrors({}); }}
        style={btnSecondary}>
        Submit another response
      </button>
      <style>{`@keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Form header */}
      <div style={{
        background: 'linear-gradient(135deg, #01696f 0%, #0c4e54 100%)',
        color: '#fff', borderRadius: '16px',
        padding: '2rem', marginBottom: '1.5rem',
        boxShadow: '0 4px 16px rgba(1,105,111,0.25)'
      }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.375rem' }}>
          {form.title}
        </h1>
        {form.description && (
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>{form.description}</p>
        )}
        <div style={{
          marginTop: '1.25rem', height: '4px',
          background: 'rgba(255,255,255,0.25)', borderRadius: '99px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${progress}%`, background: '#fff',
            borderRadius: '99px', transition: 'width 400ms cubic-bezier(0.16,1,0.3,1)'
          }} />
        </div>
        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.375rem' }}>
          {answered} of {form.questions.length} answered
        </p>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {form.questions.map((q, i) => (
          <div key={q.id} style={{
            background: '#fff',
            border: `1px solid ${errors[q.id] ? '#e53e3e' : '#e5e5e0'}`,
            borderRadius: '12px', padding: '1.25rem',
            boxShadow: errors[q.id]
              ? '0 0 0 3px rgba(229,62,62,0.1)'
              : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'border-color 180ms ease, box-shadow 180ms ease'
          }}>
            <p style={{ fontWeight: 500, marginBottom: '1rem', lineHeight: 1.4 }}>
              <span style={{
                background: '#01696f', color: '#fff',
                borderRadius: '5px', padding: '1px 7px',
                fontSize: '0.75rem', fontWeight: 700, marginRight: '0.5rem'
              }}>{i + 1}</span>
              {q.text}
              {q.required && <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>}
            </p>

            {q.type === 'SHORT' && (
              <input type="text" placeholder="Your answer…" style={inputStyle}
                value={answers[q.id] || ''}
                onChange={e => setAnswer(q.id, e.target.value)} />
            )}

            {q.type === 'LONG' && (
              <textarea placeholder="Your answer…"
                style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                value={answers[q.id] || ''}
                onChange={e => setAnswer(q.id, e.target.value)} />
            )}

            {q.type === 'RADIO' && q.options.map(opt => (
              <label key={opt} style={optionLabel(answers[q.id] === opt)}>
                <input type="radio" name={`q-${q.id}`} value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => setAnswer(q.id, opt)}
                  style={{ accentColor: '#01696f' }} />
                {opt}
              </label>
            ))}

            {q.type === 'CHECKBOX' && q.options.map(opt => {
              const checked = (answers[q.id] || []).includes(opt);
              return (
                <label key={opt} style={optionLabel(checked)}>
                  <input type="checkbox" checked={checked}
                    onChange={e => toggleCheckbox(q.id, opt, e.target.checked)}
                    style={{ accentColor: '#01696f' }} />
                  {opt}
                </label>
              );
            })}

            {q.type === 'SELECT' && (
              <select style={inputStyle} value={answers[q.id] || ''}
                onChange={e => setAnswer(q.id, e.target.value)}>
                <option value="">Select an option…</option>
                {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            )}

            {q.type === 'RATING' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setAnswer(q.id, n)} style={{
                    width: '48px', height: '48px', borderRadius: '8px', fontWeight: 600,
                    border: `1.5px solid ${answers[q.id] >= n ? '#01696f' : '#e5e5e0'}`,
                    background: answers[q.id] >= n ? '#01696f' : '#fafaf8',
                    color: answers[q.id] >= n ? '#fff' : '#aaa',
                    cursor: 'pointer', transition: 'all 180ms ease'
                  }}>{n}</button>
                ))}
              </div>
            )}

            {errors[q.id] && (
              <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.625rem' }}>
                ⚠ This field is required.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} disabled={submitting} style={{
        marginTop: '1.5rem', width: '100%',
        padding: '0.875rem', borderRadius: '10px', border: 'none',
        background: submitting ? '#aaa' : '#01696f',
        color: '#fff', fontWeight: 600, fontSize: '1rem',
        cursor: submitting ? 'not-allowed' : 'pointer',
        transition: 'background 180ms ease',
        boxShadow: submitting ? 'none' : '0 4px 12px rgba(1,105,111,0.3)'
      }}>
        {submitting ? 'Submitting…' : 'Submit Response'}
      </button>
    </div>
  );
}

const inputStyle  = { width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d4d1ca', borderRadius: '8px', fontSize: '0.875rem', background: '#fafaf8' };
const btnSecondary = { display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#f3f0ec', color: '#28251d', border: '1px solid #d4d1ca', borderRadius: '8px', padding: '0.625rem 1.25rem', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' };
const optionLabel = (active) => ({
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.65rem 1rem', marginBottom: '0.4rem',
  border: `1px solid ${active ? '#01696f' : '#e5e5e0'}`,
  borderRadius: '8px', cursor: 'pointer',
  background: active ? 'rgba(1,105,111,0.06)' : '#fafaf8',
  fontSize: '0.875rem', transition: 'all 180ms ease'
});