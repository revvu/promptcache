import { createSessionAction } from '@/app/actions';
import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';
import { formatRelative } from '@/lib/demo-data';
import { getSessions } from '@/lib/data';

export default async function SessionsPage({ searchParams }: { searchParams?: { created?: string; error?: string } }) {
  const user = await requireUser('/sessions');
  const { sessions, databaseConnected } = await getSessions(user.id);

  return (
    <AppShell
      currentPath="/sessions"
      eyebrow="Sessions"
      title="Group prompts into task-shaped sessions with lineage and outcomes."
      description="Sessions hold connected prompts, follow-ups, responses, and notes so you can track how a good prompt evolved inside a real workflow."
      databaseConnected={databaseConnected}
      user={user}
    >
      <div className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
        <section className="panel rounded-[28px] p-6">
          {searchParams?.created ? <p className="text-sm text-teal">Session saved.</p> : null}
          {searchParams?.error ? <p className="text-sm text-ember">{searchParams.error}</p> : null}

          <div className="mt-2 space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{session.title}</p>
                  <span className="rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ember">{session.status}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-ink/70">{session.description ?? 'No description yet.'}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink/45">Updated {formatRelative(session.updatedAt)} · {session.promptCount} prompts · {session.responseCount} responses</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">New session</p>
          <h2 className="mt-2 font-display text-3xl">Create a working thread</h2>
          <form action={createSessionAction} className="mt-5 space-y-3">
            <input required name="title" placeholder="Session title" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <textarea name="description" rows={5} placeholder="What is this session trying to achieve?" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-parchment">Create session</button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
