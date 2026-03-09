create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  body text not null,
  goal text,
  context text,
  constraints text,
  notes text,
  tags jsonb not null default '[]'::jsonb,
  favorite boolean not null default false,
  status text not null default 'active',
  embedding vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table prompts add column if not exists user_id uuid;

create table if not exists prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references prompts(id) on delete cascade,
  version_number integer not null,
  body text not null,
  structured_snapshot jsonb not null default '{}'::jsonb,
  change_summary text,
  created_at timestamptz not null default now(),
  unique(prompt_id, version_number)
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table sessions add column if not exists user_id uuid;

create table if not exists session_items (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  prompt_id uuid references prompts(id) on delete set null,
  parent_item_id uuid references session_items(id) on delete set null,
  item_type text not null default 'prompt',
  position integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists prompt_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  prompt_id uuid references prompts(id) on delete set null,
  session_id uuid references sessions(id) on delete set null,
  prompt_version_id uuid references prompt_versions(id) on delete set null,
  source text,
  model_name text,
  input_snapshot jsonb not null default '{}'::jsonb,
  output_text text,
  output_metadata jsonb not null default '{}'::jsonb,
  rating integer,
  notes text,
  created_at timestamptz not null default now()
);

alter table prompt_runs add column if not exists user_id uuid;

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  key text not null unique,
  type text not null,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table integrations add column if not exists user_id uuid;

create index if not exists prompts_created_at_idx on prompts (created_at desc);
create index if not exists prompts_user_id_idx on prompts (user_id, updated_at desc);
create index if not exists prompt_runs_created_at_idx on prompt_runs (created_at desc);
create index if not exists prompt_runs_user_id_idx on prompt_runs (user_id, created_at desc);
create index if not exists sessions_updated_at_idx on sessions (updated_at desc);
create index if not exists sessions_user_id_idx on sessions (user_id, updated_at desc);
create index if not exists prompts_embedding_idx on prompts using hnsw (embedding vector_cosine_ops);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists prompts_set_updated_at on prompts;
create trigger prompts_set_updated_at
before update on prompts
for each row
execute function set_updated_at();

drop trigger if exists sessions_set_updated_at on sessions;
create trigger sessions_set_updated_at
before update on sessions
for each row
execute function set_updated_at();

drop trigger if exists integrations_set_updated_at on integrations;
create trigger integrations_set_updated_at
before update on integrations
for each row
execute function set_updated_at();
