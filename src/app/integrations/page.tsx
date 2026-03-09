import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';

const integrations = [
  {
    name: 'Provider layer',
    status: process.env.OPENAI_API_KEY ? 'Configured' : 'Pending key',
    detail: 'Use this for workshop improve and critique actions. OpenAI key is optional until you want live enhancements.'
  },
  {
    name: 'Postgres + pgvector',
    status: process.env.DATABASE_URL ? 'Configured' : 'Missing URL',
    detail: 'This powers prompt storage, sessions, response capture, and semantic retrieval once the DB host resolves.'
  },
  {
    name: 'MCP adapters',
    status: 'Planned',
    detail: 'Filesystem, GitHub, docs, and skill promotion adapters are the strongest first integrations.'
  }
];

export default async function IntegrationsPage() {
  const user = await requireUser();

  return (
    <AppShell
      currentPath="/integrations"
      eyebrow="Integrations"
      title="Prepare PromptCache for providers, MCPs, and skill customization."
      description="The infrastructure is laid out so we can add live provider calls, context ingestion, and skill generation without reshaping the whole app."
      databaseConnected={Boolean(process.env.DATABASE_URL)}
      user={user}
    >
      <section className="panel rounded-[28px] p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {integrations.map((integration) => (
            <div key={integration.name} className="rounded-[24px] border border-ink/10 bg-white/70 p-4">
              <p className="font-medium">{integration.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ember">{integration.status}</p>
              <p className="mt-3 text-sm leading-6 text-ink/72">{integration.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
