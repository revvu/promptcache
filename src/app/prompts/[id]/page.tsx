import Link from 'next/link';
import { notFound } from 'next/navigation';

import { addPromptResponseAction } from '@/app/actions';
import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';
import { formatRelative } from '@/lib/demo-data';
import { getPromptDetail } from '@/lib/data';

export default async function PromptDetailPage({ params, searchParams }: { params: { id: string }; searchParams?: { saved?: string; error?: string } }) {
  const user = await requireUser(`/prompts/${params.id}`);
  const { prompt, databaseConnected } = await getPromptDetail(user.id, params.id);

  if (!prompt) {
    notFound();
  }

  return (
    <AppShell
      currentPath="/library"
      eyebrow="Prompt detail"
      title={prompt.title}
      description="Track the latest prompt text, older versions, and captured responses in one place."
      databaseConnected={databaseConnected}
      user={user}
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="panel rounded-[28px] p-6">
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-ink/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink/60">{tag}</span>
            ))}
          </div>
          <div className="mt-5 rounded-[24px] border border-ink/10 bg-white/70 p-5 text-sm leading-7 text-ink/80">
            {prompt.body}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Goal</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">{prompt.goal ?? 'No goal saved.'}</p>
            </div>
            <div className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Constraints</p>
              <p className="mt-2 text-sm leading-6 text-ink/72">{prompt.constraints ?? 'No constraints saved.'}</p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-ink/45">Context notes</p>
            <p className="mt-2 text-sm leading-6 text-ink/72">{prompt.context ?? prompt.notes ?? 'No notes yet.'}</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="panel rounded-[28px] p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Versions</p>
              <Link href="/workshop" className="text-sm font-semibold text-ember">Open workshop</Link>
            </div>
            <div className="mt-4 space-y-3">
              {prompt.versions.map((version) => (
                <div key={version.id} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">Version {version.versionNumber}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-ink/45">{formatRelative(version.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/72">{version.changeSummary ?? 'Snapshot saved.'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[28px] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">Responses</p>
            {searchParams?.saved ? <p className="mt-2 text-sm text-teal">Response saved.</p> : null}
            {searchParams?.error ? <p className="mt-2 text-sm text-ember">{searchParams.error}</p> : null}
            <div className="mt-4 space-y-3">
              {prompt.runs.map((run) => (
                <div key={run.id} className="rounded-[22px] border border-ink/10 bg-white/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{run.modelName ?? 'Unknown model'}</p>
                    <span className="text-xs uppercase tracking-[0.18em] text-ink/45">{formatRelative(run.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/72">{run.outputText ?? 'No output recorded.'}</p>
                </div>
              ))}
            </div>

            <form action={addPromptResponseAction} className="mt-5 space-y-3">
              <input type="hidden" name="promptId" value={prompt.id} />
              <input name="modelName" placeholder="Model name" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
              <input name="source" placeholder="Source, e.g. codex, chatgpt, api" className="w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
              <textarea required name="outputText" rows={5} placeholder="Paste the response text" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
              <textarea name="notes" rows={3} placeholder="Notes" className="w-full rounded-[24px] border border-ink/10 bg-white/80 px-4 py-3 outline-none" />
              <button className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-parchment">Save response</button>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
