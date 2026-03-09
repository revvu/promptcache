import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { Database, FolderKanban, Library, Search, Sparkles } from 'lucide-react';

import { SignOutButton } from '@/components/auth/sign-out-button';

const nav = [
  { href: '/', label: 'Home', icon: Sparkles },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/workshop', label: 'Workshop', icon: Search },
  { href: '/sessions', label: 'Sessions', icon: FolderKanban },
  { href: '/integrations', label: 'Integrations', icon: Database }
];

export function AppShell({
  currentPath,
  title,
  eyebrow,
  description,
  databaseConnected,
  user,
  children
}: {
  currentPath: string;
  title: string;
  eyebrow: string;
  description: string;
  databaseConnected: boolean;
  user: User;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-5 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1500px] gap-4 lg:grid-cols-[240px,minmax(0,1fr)]">
        <aside className="panel rounded-[28px] p-5">
          <p className="font-display text-3xl tracking-tight">PromptCache</p>
          <p className="mt-2 text-sm leading-6 text-ink/65">A prompt library, workshop, and session archive for high-signal development work.</p>

          <nav className="mt-8 space-y-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-parchment' : 'flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm font-medium text-ink hover:bg-white'}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[24px] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Signed in as</p>
            <p className="mt-3 break-all text-sm font-medium text-ink/80">{user.email ?? user.id}</p>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Database status</p>
            <p className="mt-3 font-medium">{databaseConnected ? 'Connected' : 'Demo fallback'}</p>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {databaseConnected
                ? 'Live data is loading from the configured Postgres database.'
                : 'The app is using demo records because the current DB host is not reachable from this machine.'}
            </p>
          </div>
        </aside>

        <section className="space-y-4">
          <header className="panel rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{eyebrow}</p>
            <h1 className="mt-3 font-display text-5xl leading-tight tracking-[-0.03em]">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink/70">{description}</p>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
