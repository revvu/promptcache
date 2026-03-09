# Setup Notes

## Environment

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `OPENAI_API_KEY`

## Supabase

1. Create a Supabase project if one is not already available.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Enable pgvector support if your project prompts for it.

## Recommended MCP / Integration Order

1. LLM provider for workshop improve and critique actions
2. Embedding provider for semantic prompt search
3. Filesystem or repo context MCP for coding prompts
4. Skill promotion layer for turning successful prompts into reusable skill drafts

## First Build Targets

- Persist prompts to Supabase
- Save workshop variants as prompt versions
- Add session detail and prompt detail routes
- Implement search with tag filters and semantic retrieval
- Add response capture from manual paste or provider callbacks
