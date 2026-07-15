import Link from 'next/link';
import { FileText, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f7f6f2',
        color: '#28251d',
      }}
    >
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem 1.5rem 4rem',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '4rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#e6f2f2',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid #cfe3e2',
              }}
            >
              <FileText size={20} color="#01696f" />
            </div>

            <div>
              <p
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#7a7974',
                  marginBottom: '0.15rem',
                }}
              >
                Form Platform
              </p>
              <h1 style={{ fontSize: '1rem', fontWeight: 700 }}>Form</h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/register" style={secondaryBtn}>
              Create account
            </Link>
            <Link href="/admin/login" style={primaryBtn}>
              Sign in
            </Link>
          </div>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 0.85fr',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e5e0',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#eef5e9',
                color: '#437a22',
                border: '1px solid #d8e8cd',
                borderRadius: '999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={14} />
              Create and manage forms easily
            </div>

            <h2
              style={{
                fontSize: '3rem',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                maxWidth: '10ch',
              }}
            >
              Build forms with a clean, simple workflow.
            </h2>

            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.8,
                color: '#7a7974',
                maxWidth: '62ch',
                marginBottom: '1.75rem',
              }}
            >
              Create your account, sign in, build forms, publish them, and manage responses from one place.
              Admin access stays protected, while the main site remains public and easy to use.
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link href="/register" style={primaryBtn}>
                Get started
                <ArrowRight size={15} />
              </Link>

              <Link href="/admin/login" style={secondaryBtn}>
                Go to login
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '0.875rem',
              }}
            >
              <div style={statCard}>
                <div style={statLabel}>Access</div>
                <div style={statValue}>Accounts</div>
                <div style={statHint}>Users create and manage their own forms</div>
              </div>

              <div style={statCard}>
                <div style={statLabel}>Workflow</div>
                <div style={statValue}>Draft → Publish</div>
                <div style={statHint}>Build first, then make the form live</div>
              </div>

              <div style={statCard}>
                <div style={statLabel}>Admin</div>
                <div style={statValue}>Protected</div>
                <div style={statHint}>Dashboard access only after sign-in</div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
            }}
          >
            <div style={featurePanel}>
              <div style={iconWrap}>
                <FileText size={18} color="#01696f" />
              </div>
              <div>
                <h3 style={featureTitle}>Form creation</h3>
                <p style={featureText}>
                  Add questions, define answer types, and shape each form with a structured builder.
                </p>
              </div>
            </div>

            <div style={featurePanel}>
              <div style={iconWrap}>
                <ShieldCheck size={18} color="#01696f" />
              </div>
              <div>
                <h3 style={featureTitle}>Protected admin area</h3>
                <p style={featureText}>
                  Admin pages stay behind authentication, while public pages remain accessible.
                </p>
              </div>
            </div>

            <div
              style={{
                background: '#01696f',
                color: '#f9f8f4',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 18px 38px rgba(1,105,111,0.18)',
              }}
            >
              <p
                style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.72,
                  marginBottom: '0.75rem',
                }}
              >
                Start here
              </p>

              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                Open the platform the right way.
              </h3>

              <p
                style={{
                  lineHeight: 1.8,
                  color: 'rgba(249,248,244,0.82)',
                  marginBottom: '1.25rem',
                }}
              >
                New users should begin on the homepage, create an account, and sign in. The admin section
                should only open after authentication.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href="/register"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: '#f9f8f4',
                    color: '#01696f',
                    textDecoration: 'none',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                  }}
                >
                  Create account
                </Link>

                <Link
                  href="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    background: 'transparent',
                    color: '#f9f8f4',
                    textDecoration: 'none',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    border: '1px solid rgba(249,248,244,0.22)',
                  }}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const primaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.45rem',
  background: '#01696f',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '10px',
  padding: '0.8rem 1.1rem',
  fontWeight: 600,
  border: 'none',
};

const secondaryBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.45rem',
  background: '#f3f0ec',
  color: '#28251d',
  textDecoration: 'none',
  borderRadius: '10px',
  padding: '0.8rem 1.1rem',
  fontWeight: 600,
  border: '1px solid #d4d1ca',
};

const statCard = {
  background: '#fafaf8',
  border: '1px solid #ece9e2',
  borderRadius: '16px',
  padding: '1rem',
};

const statLabel = {
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#7a7974',
  marginBottom: '0.45rem',
};

const statValue = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#28251d',
  marginBottom: '0.35rem',
};

const statHint = {
  fontSize: '0.86rem',
  lineHeight: 1.6,
  color: '#7a7974',
};

const featurePanel = {
  background: '#fff',
  border: '1px solid #e5e5e0',
  borderRadius: '20px',
  padding: '1.25rem',
  boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
  display: 'flex',
  gap: '0.95rem',
  alignItems: 'flex-start',
};

const iconWrap = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: '#e6f2f2',
  border: '1px solid #cfe3e2',
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
};

const featureTitle = {
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: '0.35rem',
  color: '#28251d',
};

const featureText = {
  fontSize: '0.92rem',
  lineHeight: 1.7,
  color: '#7a7974',
};
