import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';
import { getWorkshopResult } from '@/lib/data';

export default async function WorkshopPage({ searchParams }: { searchParams?: { draft?: string } }) {
  const user = await requireUser();
  const draft = searchParams?.draft?.trim() ?? 'You are helping me refine a prompt for a code migration. Ask for missing context, then produce a migration plan with risks, test strategy, and rollback notes.';
  const result = await getWorkshopResult(draft);

  return (
    <AppShell
      currentPath="/workshop"
      eyebrow="Workshop"
      title="Improve prompts while you write them."
      description="This screen is ready for a live provider call later. Right now it falls back to a structured local enhancement pass when no model key is configured."
      databaseConnected={Boolean(process.env.DATABASE_URL)}
      user={user}
    >
      <div className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <section className="panel rounded-[28px] p-6">
          <form action="/workshop" className="space-y-3">
            <textarea name="draft" rows={16} defaultValue={draft} className="w-full rounded-[28px] border border-ink/10 bg-white/80 px-4 py-4 outline-none" />
            <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-parchment">Enhance prompt</button>
          </form>
        </section>

        <section className="panel rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Improved version</p>
          <div className="mt-4 rounded-[24px] border border-ink/10 bg-white/70 p-4 text-sm leading-7 text-ink/78">
            {result.improvedPrompt}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Critique</p>
          <div className="mt-4 space-y-3">
            {result.critique.map((item) => (
              <div key={item} className="rounded-[22px] border border-ink/10 bg-white/70 p-4 text-sm leading-6 text-ink/72">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
