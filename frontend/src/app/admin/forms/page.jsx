import { prisma } from '@/lib/prisma.mjs';

export default async function AdminFormsPage() {
  let forms = [];

  try {
    forms = await prisma.form.findMany({
      include: {
        _count: {
          select: { questions: true, responses: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
  } catch {
    return (
      <div style={{ padding: '2rem', color: '#666' }}>
        Could not load forms.
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#28251d' }}>
              All Forms
            </h1>
            <p style={{ color: '#7a7974', marginTop: '0.25rem' }}>
              {forms.length} form{forms.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <a
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: '#01696f',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontWeight: 500,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            + Create New Form
          </a>
        </div>

        {!forms.length ? (
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
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📋</div>
            <p style={{ fontWeight: 500, color: '#7a7974' }}>No forms yet</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Create your first form from the admin builder.
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

                  <a href={`/admin/responses/${form.id}`} style={linkBtnSecondary}>
                    View responses
                  </a>

                  <a href={`/admin/edit/${form.id}`} style={linkBtnSecondary}>
                    Edit form
                  </a>

                  <a href="/admin" style={linkBtnSecondary}>
                    Create another form
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
