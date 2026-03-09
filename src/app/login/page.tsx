import { redirect } from 'next/navigation';

import { SignInForm } from '@/components/auth/sign-in-form';
import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const user = await getCurrentUser();

  if (user) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="panel w-full max-w-xl rounded-[32px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">PromptCache auth</p>
        <h1 className="mt-3 font-display text-5xl leading-tight tracking-[-0.03em]">Sign in with a magic link.</h1>
        <p className="mt-4 text-base leading-7 text-ink/70">
          PromptCache is now wired to Supabase auth. Use your email to get a one-click sign-in link, then you will land back in the app with a live session.
        </p>
        <div className="mt-8">
          <SignInForm />
          {searchParams?.error ? <p className="mt-4 text-sm text-ember">{searchParams.error}</p> : null}
        </div>
      </section>
    </main>
  );
}
