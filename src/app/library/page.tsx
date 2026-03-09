import Link from 'next/link';

import { createPromptAction } from '@/app/actions';
import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';
import { formatRelative } from '@/lib/demo-data';
import { getPrompts } from '@/lib/data';

export default async function LibraryPage({ searchParams }: { searchParams?: { q?: string; created?: string; error?: string } }) {
  const user = await requireUser();
  const query = searchParams?.q?.trim() ?? '';
  const { prompts, databaseConnected } = await getPrompts(user.id, query);

  return (
    <AppShell
      currentPath="/library"
      eyebrow="Library"
      title="Store prompts with enough structure to make reuse easy."
      description="Capture prompts with tags, constraints, and notes. Search them later by keyword now, and by embeddings once vector jobs are online."
      databaseConnected={databaseConnected}
      user={user}
    >
      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <section className="panel rounded-[28px] p-6">
          <form className="flex flex-col gap-3 md:flex-row" action="/library">
            <input name="q" defaultValue={query} placeholder="Search prompts by title, body, or tags" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-parchment">Search</button>
          </form>

          {searchParams?.created ? <p className="mt-4 text-sm text-teal">Prompt saved.</p> : null}
          {searchParams?.error ? <p className="mt-4 text-sm text-ember">{searchParams.error}</p> : null}

          <div className="mt-5 space-y-3">
            {prompts.map((prompt) => (
              <Link key={prompt.id} href={`/prompts/${prompt.id}`} className="block rounded-[24px] border border-ink/10 bg-white/70 p-4 hover:bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{prompt.title}</p>
                    <p className="mt-2 text-sm leading-6 text-ink/70">{prompt.body.slice(0, 170)}...</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-ink/45">{formatRelative(prompt.updatedAt)}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/60">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="panel rounded-[28px] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">New prompt</p>
          <h2 className="mt-2 font-display text-3xl">Capture a reusable prompt</h2>
          <form action={createPromptAction} className="mt-5 space-y-3">
            <input required name="title" placeholder="Prompt title" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <textarea required name="body" rows={7} placeholder="Prompt body" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <input name="tags" placeholder="Tags, comma separated" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <input name="goal" placeholder="Goal" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <textarea name="context" rows={3} placeholder="Context" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <textarea name="constraints" rows={3} placeholder="Constraints" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <textarea name="notes" rows={3} placeholder="Notes" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
            <button className="rounded-2xl bg-ember px-5 py-3 text-sm font-semibold text-white">Save prompt</button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
