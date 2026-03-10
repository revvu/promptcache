'use client';

import { useMemo, useState } from 'react';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function SignInForm({ next = '/' }: { next?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('Sending your magic link...');

    const redirectTo = new URL('/auth/callback', window.location.origin);
    redirectTo.searchParams.set('next', next);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo.toString()
      }
    });

    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('success');
    setMessage('Check your email for the sign-in link.');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        className="w-full rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 outline-none"
      />
      <button disabled={status === 'loading'} className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-parchment disabled:opacity-60">
        {status === 'loading' ? 'Sending link...' : 'Email me a magic link'}
      </button>
      {message ? <p className={status === 'error' ? 'text-sm text-ember' : 'text-sm text-teal'}>{message}</p> : null}
    </form>
  );
}
