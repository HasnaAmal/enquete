'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || '/.netlify/functions/api';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || 'Registration failed.');
        return;
      }

      setSuccess('Account created successfully.');
      setForm({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFAF7] px-6 py-12 text-[#3B2C34]">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-[#E5D6D9] bg-white shadow-[0_20px_60px_rgba(200,125,135,0.12)] lg:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-[#FBEAD6] via-[#FDF6F3] to-[#F0C4CB] p-10 lg:flex">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-[#C87D87]">
                Inora
              </p>
              <h1 className="font-serif text-5xl leading-tight text-[#3B2C34]">
                Create an account and start building your forms beautifully.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#6E5A63]">
                Register once, create forms with your own account, and manage everything from your personal workspace.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 backdrop-blur-sm">
              <div className="mb-4 h-2 w-20 rounded-full bg-[#C87D87]" />
              <p className="text-sm leading-7 text-[#5E4A53]">
                Elegant, secure, and simple — each form belongs to the account that created it.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 sm:px-10">
            <div className="w-full max-w-md">
              <p className="mb-2 text-sm uppercase tracking-[0.28em] text-[#C87D87]">
                Register
              </p>
              <h2 className="font-serif text-4xl text-[#3B2C34]">
                Create your account
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#7A6670]">
                Use your email and password to access your forms and dashboard.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4850]">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-[#E7D7DA] bg-[#FFFDFC] px-4 py-3 text-[#3B2C34] outline-none transition focus:border-[#C87D87] focus:ring-4 focus:ring-[#C87D87]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4850]">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-[#E7D7DA] bg-[#FFFDFC] px-4 py-3 text-[#3B2C34] outline-none transition focus:border-[#C87D87] focus:ring-4 focus:ring-[#C87D87]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4850]">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full rounded-2xl border border-[#E7D7DA] bg-[#FFFDFC] px-4 py-3 text-[#3B2C34] outline-none transition focus:border-[#C87D87] focus:ring-4 focus:ring-[#C87D87]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#5A4850]">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat your password"
                    className="w-full rounded-2xl border border-[#E7D7DA] bg-[#FFFDFC] px-4 py-3 text-[#3B2C34] outline-none transition focus:border-[#C87D87] focus:ring-4 focus:ring-[#C87D87]/10"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-2xl border border-[#6B7556]/20 bg-[#6B7556]/10 px-4 py-3 text-sm text-[#556046]">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#C87D87] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#b96d78] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p className="mt-6 text-sm text-[#7A6670]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[#6B7556] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
