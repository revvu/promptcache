'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    });
  }

  return (
    <button onClick={handleSignOut} disabled={isPending} className="rounded-full border border-ink/15 bg-white/70 px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">
      {isPending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
