# PromptCache PRD

## Overview

PromptCache is a web application for writing, storing, searching, improving, and organizing prompts used during software development and AI-assisted workflows. The product combines a durable prompt library with a prompt workshop, making it easy to evolve prompts over time, connect them to sessions, and capture the responses they produce.

This v1 is optimized for a single primary user, with an architecture that can later expand to small-team collaboration.

## Product Vision

PromptCache should become the working environment for prompt engineering:

- a place to draft and refine prompts
- a memory layer for previously used prompts
- a searchable archive of prompts, sessions, and outcomes
- a workshop for improving prompt quality
- a flexible integration surface for MCP servers, plugins, and custom skills

## Goals

- Store prompts in a durable, searchable system.
- Make it easy to find and reuse prior prompts.
- Help users improve prompts while writing.
- Support sessions that group related prompts, variants, and outputs.
- Capture prompt responses alongside the originating prompt.
- Create a clean foundation for MCP and plugin integrations.
- Enable structured prompt authoring without losing freeform flexibility.

## Non-Goals For V1

- Public prompt marketplace
- Complex multi-tenant permissions
- Full enterprise observability
- Deep analytics on model cost, latency, or token usage
- Fully automated integrations with every AI provider from day one

## Target User

Primary user:

- an AI-heavy developer who writes prompts repeatedly across coding, research, planning, and workflow automation

Future users:

- small teams sharing prompt patterns
- builders maintaining internal skill libraries and prompt systems

## Core User Problems

1. Good prompts get lost in chats, notes, and scattered files.
2. It is hard to search old prompts by meaning, not just exact words.
3. Prompt improvement is inconsistent and hard to repeat.
4. Prompt variants and follow-up prompts are hard to organize.
5. There is no clean home for sessions containing prompt, response, and iteration history.
6. Integrating prompts with external tools, MCP servers, or custom skills is ad hoc.

## Product Principles

- Fast capture beats perfect structure.
- Structured metadata improves retrieval.
- Prompt iteration should feel like a workshop, not a form.
- Sessions should preserve context and lineage.
- Integrations should be modular and optional.
- The interface should feel focused, tool-like, and satisfying for heavy daily use.

## Assumptions For This Draft

- V1 is single-user with authentication.
- Data is stored in Supabase Postgres.
- The app will support both structured prompt fields and a freeform editor.
- Search should include keyword search, tags, filters, and semantic search.
- Prompt enhancement should include inline suggestions plus dedicated workshop tools.
- Sessions should represent grouped prompt runs, linked prompts, and captured responses.
- Response capture in v1 can start with manual or semi-automated logging, with room for deeper live integrations.

## Primary Use Cases

### 1. Save a Prompt

The user writes a prompt and stores it with title, body, tags, and optional structured metadata.

### 2. Find a Prior Prompt

The user searches old prompts by keyword, tag, or semantic similarity and reopens one for reuse.

### 3. Improve a Prompt

The user drafts a prompt in the workshop and gets suggested rewrites, critiques, comparisons, and alternative formulations.

### 4. Organize Prompt Sessions

The user creates a session for a task and links multiple prompts, variants, outputs, and notes together.

### 5. Capture Responses

The user stores the outputs produced by a prompt so future reuse includes real examples and outcomes.

### 6. Extend With Integrations

The user connects MCP or plugin-based tools that enrich prompting, retrieval, evaluation, or context injection.

## Functional Requirements

### Prompt Library

- Create, edit, archive, and delete prompts.
- Store prompt title, content, tags, timestamps, and author.
- Support optional structured fields:
  - goal
  - context
  - constraints
  - variables
  - examples
  - target model or environment
  - notes
- Track prompt versions or revisions.
- Mark favorite, pinned, or canonical prompts.

### Search And Retrieval

- Full-text search across prompt title and content.
- Filter by tags, date, session, favorites, and prompt type.
- Semantic search over prompt embeddings.
- Search results should preview matched content and related sessions.

### Prompt Workshop

- Rich editor for drafting and revising prompts.
- AI-assisted improve flow:
  - make clearer
  - make more concise
  - add constraints
  - adapt for coding
  - adapt for research
  - adapt for tool use
- Critique mode that explains weaknesses in the current prompt.
- Compare mode to diff prompt variants side by side.
- Save workshop outputs as new versions or new prompt records.

### Sessions

- Create sessions around a project, task, or investigation.
- Link multiple prompts to a session.
- Link prompts to parent prompts or sibling variants.
- Attach notes, outcomes, and status to a session.
- View prompt lineage within a session.

### Responses

- Store one or more responses for a prompt run.
- Attach metadata such as model, source, timestamp, rating, and notes.
- Support manual paste-in for v1.
- Design data model to later support automated provider or session ingestion.

### Integrations

- MCP/plugin registry page for enabled integrations.
- Integration abstraction layer for:
  - embedding providers
  - LLM providers
  - external context sources
  - evaluation tools
  - custom skill adapters
- Settings UI for configuring integrations and credentials.

### Authentication

- Secure user authentication via Supabase Auth or equivalent.
- Single-user first, with future support for teams and role separation.

## Recommended MCP / Plugin Directions

### High-Value First Integrations

- Embeddings provider for semantic prompt search
- LLM provider for prompt enhancement and critique
- GitHub or local repo context integration for coding prompts
- Web retrieval or documentation lookup integration for research prompts
- Evaluation integration to score prompt quality or compare outputs

### MCP Ideas

- filesystem or workspace MCP to pull context from active projects
- GitHub MCP to connect prompts to repos, issues, or pull requests
- docs/search MCP to inject library or framework documentation
- browser or fetch MCP for source capture and comparison
- memory MCP for reusable user preferences and style guidance
- custom skill MCP layer to suggest relevant skill snippets or templates

### Skill Customization Ideas

- save prompts as reusable skill seeds
- generate skill drafts from successful prompt sessions
- derive prompt templates from repeated structures
- recommend skills based on session context or prompt category

## Information Architecture

Top-level areas:

- Home
- Library
- Workshop
- Sessions
- Search
- Integrations
- Settings

## Data Model (Draft)

### prompts

- id
- user_id
- title
- slug
- body
- goal
- context
- constraints
- variables_json
- examples_json
- notes
- tags_json
- status
- favorite
- created_at
- updated_at
- archived_at

### prompt_versions

- id
- prompt_id
- version_number
- body
- structured_snapshot_json
- change_summary
- created_at

### sessions

- id
- user_id
- title
- description
- status
- created_at
- updated_at

### session_items

- id
- session_id
- prompt_id
- parent_item_id
- item_type
- position
- notes
- created_at

### prompt_runs

- id
- prompt_id
- session_id
- prompt_version_id
- source
- model_name
- input_snapshot
- output_text
- output_metadata_json
- rating
- notes
- created_at

### integrations

- id
- user_id
- key
- type
- config_json
- enabled
- created_at
- updated_at

## Success Metrics

- prompts saved per week
- prompt reuse rate
- average time to find a previous prompt
- number of prompt improvements accepted
- sessions created per active week
- response capture rate

## UX Requirements

- Fast save flow with minimal friction
- Powerful search always within reach
- Workshop experience should feel spacious and iterative
- Session graphs or lineage views should be understandable at a glance
- Data-heavy screens should still feel elegant, not cluttered

## Technical Direction

Recommended stack:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth + Postgres
- pgvector for semantic search
- Drizzle ORM or Prisma

## Risks

- Prompt data model can become overly complex too early.
- Semantic search quality depends on embedding quality and tuning.
- Automated response capture may vary by provider and workflow.
- Integrations can bloat scope if not modularized early.

## Proposed V1 Scope

- auth
- prompt CRUD
- tagging and structured metadata
- full-text and semantic search
- workshop editor with AI improve and critique actions
- sessions with linked prompts
- manual response capture
- integrations/settings foundation

## Open Decisions To Confirm

- Should prompts support folder-like collections in v1, or are tags and sessions enough?
- Should response capture support file attachments in v1?
- Should prompt versions be automatic on each save or manual snapshots?
- Should workshop suggestions be generated with one provider initially or provider-agnostic from the start?
