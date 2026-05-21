import { Mail, ShieldCheck, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

export default function Auth({ authOpen, authLoading, onClose, user }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    const authAction =
      mode === 'signup'
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

    const { error } = await authAction;
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      mode === 'signup'
        ? 'Account created. Check your email if confirmation is enabled.'
        : 'Welcome back',
    );
    setPassword('');
    onClose();
  }

  if (user) {
    return (
      <aside className="panel animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Signed in
            </p>
            <h2 className="mt-1 text-xl font-bold">Ready to post notices</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Authenticated users can create notices and delete only the notices
              they own. Supabase RLS enforces that rule in the database.
            </p>
            <p className="mt-4 truncate rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
              {user.email}
            </p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`${authOpen ? 'block' : 'hidden lg:block'} panel`}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Secure access
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Create account'}
          </h2>
        </div>
        <button
          aria-label="Close auth panel"
          className="icon-button lg:hidden"
          type="button"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-slate-900">
        <button
          className={`segmented-button ${mode === 'login' ? 'segmented-button-active' : ''}`}
          type="button"
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`segmented-button ${mode === 'signup' ? 'segmented-button-active' : ''}`}
          type="button"
          onClick={() => setMode('signup')}
        >
          Sign up
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="email">
          Email
          <span className="input-shell">
            <Mail size={18} />
            <input
              required
              autoComplete="email"
              className="input"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </span>
        </label>

        <label className="field-label" htmlFor="password">
          Password
          <span className="input-shell">
            <UserPlus size={18} />
            <input
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="input"
              id="password"
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </span>
        </label>

        <button
          className="btn-primary w-full justify-center"
          disabled={submitting || authLoading}
          type="submit"
        >
          {submitting ? (
            <span className="spinner" />
          ) : mode === 'login' ? (
            'Login'
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </aside>
  );
}
