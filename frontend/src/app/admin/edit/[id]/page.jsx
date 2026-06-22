'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { PlusCircle, Trash2, Save, Plus, X, ArrowLeft } from 'lucide-react';

const QUESTION_TYPES = [
  { value: 'short', label: 'Short Text' },
  { value: 'long', label: 'Long Text' },
  { value: 'radio', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'select', label: 'Dropdown' },
  { value: 'rating', label: 'Rating 1–5' },
];

const HAS_OPTIONS = ['radio', 'checkbox', 'select'];

export default function EditFormPage({ params }) {
  const [formId, setFormId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [questions, setQuestions] = useState([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('short');
  const [qRequired, setQRequired] = useState(false);
  const [qOptions, setQOptions] = useState(['Option 1', 'Option 2']);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        setFormId(id);

        const form = await api.getForm(id);
        setTitle(form.title || '');
        setDesc(form.description || '');
        setPublished(form.status === 'PUBLISHED');

        const normalizedQuestions = (form.questions || []).map((q) => ({
          id: q.id,
          text: q.text,
          type: q.type.toLowerCase(),
          required: q.required,
          options: q.options || [],
        }));

        setQuestions(normalizedQuestions);
      } catch {
        toast.error('Could not load form.');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [params]);

  const addOption = () => setQOptions((p) => [...p, `Option ${p.length + 1}`]);
  const removeOption = (i) => setQOptions((p) => p.filter((_, idx) => idx !== i));
  const updateOption = (i, v) => setQOptions((p) => p.map((o, idx) => (idx === i ? v : o)));

  const addQuestion = () => {
    if (!qText.trim()) {
      toast.error('Enter question text first.');
      return;
    }

    setQuestions((p) => [
      ...p,
      {
        id: Date.now(),
        text: qText,
        type: qType,
        required: qRequired,
        options: HAS_OPTIONS.includes(qType) ? [...qOptions] : [],
      },
    ]);

    setQText('');
    setQRequired(false);
    setQOptions(['Option 1', 'Option 2']);
    toast.success('Question added!');
  };

  const deleteQuestion = (id) => {
    setQuestions((p) => p.filter((q) => q.id !== id));
  };

  const saveChanges = async () => {
  if (!title.trim()) {
    toast.error('Add a title first.');
    return;
  }

  if (!questions.length) {
    toast.error('Add at least one question.');
    return;
  }

  setSaving(true);

  try {
    const formUpdateResult = await api.updateForm(formId, {
      title,
      description,
      status: published ? 'PUBLISHED' : 'DRAFT',
    });

    console.log('FORM UPDATE OK:', formUpdateResult);

    const cleanedQuestions = questions.map((q) => ({
      text: q.text,
      type: q.type,
      required: q.required,
      options: q.options || [],
    }));

    console.log('SENDING QUESTIONS:', cleanedQuestions);

    const saveQuestionsResult = await api.saveQuestions(formId, cleanedQuestions);
    console.log('QUESTIONS SAVE OK:', saveQuestionsResult);

    toast.success('Form updated!');
  } catch (error) {
  toast.error(
    error?.response?.data?.error ||
    error?.message ||
    'Update failed.'
  );
} finally {
  setSaving(false);
}
};
const publishForm = async () => {
  if (!formId) return;

  setSaving(true);

  try {
    await api.updateForm(formId, {
      title,
      description,
      status: 'PUBLISHED',
    });

    setPublished(true);
    toast.success('Form published!');
  } catch (error) {
    toast.error(
      error?.response?.data?.error ||
      error?.message ||
      'Publish failed.'
    );
  } finally {
    setSaving(false);
  }
};
  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#777' }}>
        Loading form...
      </div>
    );
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="/admin/forms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#28251d',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} />
            Back
          </a>
          <span style={{ fontWeight: 700 }}>Edit Form</span>
        </div>
<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
  {!published && (
    <button onClick={publishForm} disabled={saving} style={btnSecondary}>
      {saving ? 'Publishing…' : 'Publish'}
    </button>
  )}

  <button onClick={saveChanges} disabled={saving} style={btnPrimary}>
    <Save size={14} />
    {saving ? 'Saving…' : 'Save Changes'}
  </button>
</div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2rem',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={panel}>
            <div style={panelHeader}>
              <span style={panelTitle}>Form Settings</span>
            </div>
            <div style={panelBody}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div style={panel}>
            <div style={panelHeader}>
              <span style={panelTitle}>Add Question</span>
            </div>
            <div style={panelBody}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Question Type</label>
                <select style={inputStyle} value={qType} onChange={(e) => setQType(e.target.value)}>
                  {QUESTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Question Text</label>
                <input
                  style={inputStyle}
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="e.g. New question..."
                />
              </div>

              {HAS_OPTIONS.includes(qType) && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Answer Options</label>
                  {qOptions.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                      />
                      <button onClick={() => removeOption(i)} style={{ color: '#aaa' }}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button onClick={addOption} style={{ ...btnSecondary, width: '100%' }}>
                    <Plus size={12} />
                    Add Option
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={labelStyle}>Required</label>
                <input
                  type="checkbox"
                  checked={qRequired}
                  onChange={(e) => setQRequired(e.target.checked)}
                />
              </div>

              <button onClick={addQuestion} style={{ ...btnPrimary, width: '100%' }}>
                <PlusCircle size={16} />
                Add Question
              </button>
            </div>
          </div>
        </aside>

        <main>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h1>
          <p style={{ color: '#7a7974', marginBottom: '1rem' }}>{description || 'No description'}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {questions.map((q, i) => (
              <div
                key={q.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e5e0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.35rem' }}>
                    {i + 1}. {q.text} {q.required && <span style={{ color: '#e53e3e' }}>*</span>}
                  </p>
                  {q.options?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {q.options.map((o, oi) => (
                        <span
                          key={oi}
                          style={{
                            background: '#f3f0ec',
                            color: '#7a7974',
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => deleteQuestion(q.id)} style={{ color: '#ccc' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

const panel = {
  background: '#fff',
  border: '1px solid #e5e5e0',
  borderRadius: '12px',
  overflow: 'hidden',
};

const panelHeader = {
  padding: '0.875rem 1.25rem',
  borderBottom: '1px solid #f0efeb',
};

const panelTitle = {
  fontWeight: 600,
  fontSize: '0.9rem',
};

const panelBody = {
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.875rem',
};

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
};

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#01696f',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.625rem 1.125rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  cursor: 'pointer',
};

const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  background: '#f3f0ec',
  color: '#28251d',
  border: '1px solid #d4d1ca',
  borderRadius: '8px',
  padding: '0.625rem 1.125rem',
  fontWeight: 500,
  fontSize: '0.875rem',
  cursor: 'pointer',
};