'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
      await api.updateForm(formId, {
        title,
        description,
        status: published ? 'PUBLISHED' : 'DRAFT',
      });

      const cleanedQuestions = questions.map((q) => ({
        text: q.text,
        type: q.type,
        required: q.required,
        options: q.options || [],
      }));

      await api.saveQuestions(formId, cleanedQuestions);
      toast.success('Form updated!');
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message || 'Update failed.');
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
      toast.error(error?.response?.data?.error || error?.message || 'Publish failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7f6f2', padding: '3rem', textAlign: 'center', color: '#777' }}>
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
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
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
          </Link>

          <span style={{ fontWeight: 700, color: '#28251d' }}>Edit Form</span>

          <span
            style={{
              background: published ? '#eef5e9' : '#f3f0ec',
              color: published ? '#437a22' : '#7a7974',
              borderRadius: '999px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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
                  placeholder="Form title"
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Form description"
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
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        style={{
                          color: '#aaa',
                          padding: '0 0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={addOption} style={{ ...btnSecondary, width: '100%', justifyContent: 'center' }}>
                    <Plus size={12} />
                    Add Option
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={labelStyle}>Required</label>

                <div
                  onClick={() => setQRequired((p) => !p)}
                  style={{
                    width: '40px',
                    height: '22px',
                    borderRadius: '99px',
                    background: qRequired ? '#01696f' : '#d4d1ca',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 200ms ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: qRequired ? '21px' : '3px',
                      width: '16px',
                      height: '16px',
                      background: '#fff',
                      borderRadius: '50%',
                      transition: 'left 200ms ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              <button onClick={addQuestion} style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>
                <PlusCircle size={16} />
                Add Question
              </button>
            </div>
          </div>
        </aside>

        <main>
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', color: '#28251d' }}>
              {title || 'Untitled Form'}
            </h1>

            <p style={{ color: '#7a7974', fontSize: '0.9rem' }}>
              {description || 'No description yet.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '3px 10px',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: published ? '#eef5e9' : '#f3f0ec',
                  color: published ? '#437a22' : '#7a7974',
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
                {published ? 'Published' : 'Draft'}
              </span>

              <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {questions.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: '#fff',
                borderRadius: '16px',
                border: '2px dashed #e5e5e0',
                color: '#bbb',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
              <p style={{ fontWeight: 500, color: '#7a7974', marginBottom: '0.25rem' }}>No questions yet</p>
              <p style={{ fontSize: '0.875rem' }}>Use the panel on the left to add your first question.</p>
            </div>
          ) : (
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
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flex: 1 }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        background: '#01696f',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>

                    <div>
                      <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.375rem', color: '#28251d' }}>
                        {q.text}
                        {q.required && <span style={{ color: '#e53e3e', marginLeft: '3px' }}>*</span>}
                      </p>

                      {q.options.length > 0 && (
                        <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {q.options.map((o, oi) => (
                            <li
                              key={oi}
                              style={{
                                background: '#f3f0ec',
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                color: '#7a7974',
                              }}
                            >
                              {o}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span
                      style={{
                        background: '#f3f0ec',
                        color: '#7a7974',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {QUESTION_TYPES.find((t) => t.value === q.type)?.label}
                    </span>

                    <button
                      onClick={() => deleteQuestion(q.id)}
                      style={{
                        color: '#ccc',
                        padding: '0.25rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
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
