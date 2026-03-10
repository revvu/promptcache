import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { formatRelative } from '@/lib/demo-data';
import { getDashboardData } from '@/lib/data';
import { requireUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await requireUser('/');
  const data = await getDashboardData(user.id);

  return (
    <AppShell
      currentPath="/"
      eyebrow="Overview"
      title="Prompt operations for people who build with AI every day."
      description="Store proven prompts, iterate in a workshop, connect related prompt sessions, and keep the outputs that made them valuable."
      databaseConnected={data.databaseConnected}
      user={user}
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="panel rounded-[28px] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Prompts', value: data.totalPrompts },
              { label: 'Sessions', value: data.totalSessions },
              { label: 'Captured responses', value: data.totalRuns }
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{item.label}</p>
                <p className="mt-3 font-display text-5xl">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/library" className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-parchment">Open library</Link>
            <Link href="/workshop" className="rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-sm font-semibold text-ink">Use workshop</Link>
          </div>
        </section>

        <section className="panel rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">What is wired now</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-ink/72">
            <p>Supabase magic-link auth with protected app routes.</p>
            <p>Server-rendered prompt library backed by Postgres when available.</p>
            <p>Session management, prompt detail pages, and response capture tied to live persistence.</p>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <section className="panel rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Recent prompts</p>
              <h2 className="mt-2 font-display text-3xl">Library activity</h2>
            </div>
            <Link href="/library" className="text-sm font-semibold text-ember">See all</Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.prompts.map((prompt) => (
              <Link key={prompt.id} href={`/prompts/${prompt.id}`} className="block rounded-[24px] border border-ink/10 bg-white/70 p-4 hover:bg-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{prompt.title}</p>
                  <span className="text-xs uppercase tracking-[0.18em] text-ink/45">{formatRelative(prompt.updatedAt)}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/70">{prompt.body.slice(0, 140)}...</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel rounded-[28px] p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Sessions</p>
              <h2 className="mt-2 font-display text-3xl">Connected workstreams</h2>
            </div>
            <Link href="/sessions" className="text-sm font-semibold text-ember">Manage</Link>
          </div>

          <div className="mt-5 space-y-3">
            {data.sessions.map((session) => (
              <div key={session.id} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{session.title}</p>
                  <span className="rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ember">{session.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{session.description ?? 'No description yet.'}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/45">{session.promptCount} prompts linked · {session.responseCount} responses</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
