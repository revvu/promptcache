import { cache } from 'react';

import { databaseConfigured, sql } from '@/lib/db';
import { demoPromptDetail, demoPrompts, demoSessions, demoWorkshopResult, improvePrompt, splitTags } from '@/lib/demo-data';
import type { DashboardData, PromptDetail, PromptSummary, SessionSummary, WorkshopResult } from '@/lib/types';

function getDb() {
  return databaseConfigured ? sql : null;
}

export const getDashboardData = cache(async (userId: string): Promise<DashboardData> => {
  const db = getDb();
  if (!db) {
    return {
      prompts: demoPrompts,
      sessions: demoSessions,
      totalPrompts: demoPrompts.length,
      totalSessions: demoSessions.length,
      totalRuns: demoPromptDetail.runs.length,
      databaseConnected: false
    };
  }

  try {
    const prompts = await db<PromptSummary[]>`
      select id::text, title, body, coalesce(array(select jsonb_array_elements_text(tags)), array[]::text[]) as tags,
        favorite, status, created_at::text as "createdAt", updated_at::text as "updatedAt"
      from prompts
      where user_id = ${userId}::uuid
      order by updated_at desc
      limit 6
    `;

    const sessions = await db<SessionSummary[]>`
      select s.id::text, s.title, s.description, s.status,
        count(distinct si.id)::int as "promptCount",
        count(distinct pr.id)::int as "responseCount",
        s.updated_at::text as "updatedAt"
      from sessions s
      left join session_items si on si.session_id = s.id
      left join prompt_runs pr on pr.session_id = s.id and pr.user_id = ${userId}::uuid
      where s.user_id = ${userId}::uuid
      group by s.id
      order by s.updated_at desc
      limit 6
    `;

    const counts = await db<{ totalPrompts: number; totalSessions: number; totalRuns: number }[]>`
      select
        (select count(*)::int from prompts where user_id = ${userId}::uuid) as "totalPrompts",
        (select count(*)::int from sessions where user_id = ${userId}::uuid) as "totalSessions",
        (select count(*)::int from prompt_runs where user_id = ${userId}::uuid) as "totalRuns"
    `;

    return {
      prompts,
      sessions,
      totalPrompts: counts[0]?.totalPrompts ?? 0,
      totalSessions: counts[0]?.totalSessions ?? 0,
      totalRuns: counts[0]?.totalRuns ?? 0,
      databaseConnected: true
    };
  } catch {
    return {
      prompts: demoPrompts,
      sessions: demoSessions,
      totalPrompts: demoPrompts.length,
      totalSessions: demoSessions.length,
      totalRuns: demoPromptDetail.runs.length,
      databaseConnected: false
    };
  }
});

export async function getPrompts(userId: string, query?: string): Promise<{ prompts: PromptSummary[]; databaseConnected: boolean }> {
  const db = getDb();
  if (!db) {
    const filtered = query
      ? demoPrompts.filter((prompt) => `${prompt.title} ${prompt.body} ${prompt.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
      : demoPrompts;
    return { prompts: filtered, databaseConnected: false };
  }

  try {
    const prompts = query
      ? await db<PromptSummary[]>`
          select id::text, title, body, coalesce(array(select jsonb_array_elements_text(tags)), array[]::text[]) as tags,
            favorite, status, created_at::text as "createdAt", updated_at::text as "updatedAt"
          from prompts
          where user_id = ${userId}::uuid
            and (title ilike ${`%${query}%`} or body ilike ${`%${query}%`})
          order by updated_at desc
        `
      : await db<PromptSummary[]>`
          select id::text, title, body, coalesce(array(select jsonb_array_elements_text(tags)), array[]::text[]) as tags,
            favorite, status, created_at::text as "createdAt", updated_at::text as "updatedAt"
          from prompts
          where user_id = ${userId}::uuid
          order by updated_at desc
        `;

    return { prompts, databaseConnected: true };
  } catch {
    return { prompts: demoPrompts, databaseConnected: false };
  }
}

export async function getPromptDetail(userId: string, id: string): Promise<{ prompt: PromptDetail | null; databaseConnected: boolean }> {
  const db = getDb();
  if (!db) {
    return { prompt: demoPromptDetail, databaseConnected: false };
  }

  try {
    const prompts = await db<PromptDetail[]>`
      select id::text, title, body, goal, context, constraints, notes,
        coalesce(array(select jsonb_array_elements_text(tags)), array[]::text[]) as tags,
        favorite, status, created_at::text as "createdAt", updated_at::text as "updatedAt"
      from prompts
      where id = ${id}::uuid and user_id = ${userId}::uuid
      limit 1
    `;

    const prompt = prompts[0];
    if (!prompt) {
      return { prompt: null, databaseConnected: true };
    }

    const versions = await db<PromptDetail['versions']>`
      select pv.id::text, pv.version_number as "versionNumber", pv.body, pv.change_summary as "changeSummary", pv.created_at::text as "createdAt"
      from prompt_versions pv
      join prompts p on p.id = pv.prompt_id
      where pv.prompt_id = ${id}::uuid and p.user_id = ${userId}::uuid
      order by pv.version_number desc
    `;

    const runs = await db<PromptDetail['runs']>`
      select id::text, model_name as "modelName", source, output_text as "outputText", notes, created_at::text as "createdAt"
      from prompt_runs
      where prompt_id = ${id}::uuid and user_id = ${userId}::uuid
      order by created_at desc
    `;

    return { prompt: { ...prompt, versions, runs }, databaseConnected: true };
  } catch {
    return { prompt: demoPromptDetail, databaseConnected: false };
  }
}

export async function getSessions(userId: string): Promise<{ sessions: SessionSummary[]; databaseConnected: boolean }> {
  const db = getDb();
  if (!db) {
    return { sessions: demoSessions, databaseConnected: false };
  }

  try {
    const sessions = await db<SessionSummary[]>`
      select s.id::text, s.title, s.description, s.status,
        count(distinct si.id)::int as "promptCount",
        count(distinct pr.id)::int as "responseCount",
        s.updated_at::text as "updatedAt"
      from sessions s
      left join session_items si on si.session_id = s.id
      left join prompt_runs pr on pr.session_id = s.id and pr.user_id = ${userId}::uuid
      where s.user_id = ${userId}::uuid
      group by s.id
      order by s.updated_at desc
    `;

    return { sessions, databaseConnected: true };
  } catch {
    return { sessions: demoSessions, databaseConnected: false };
  }
}

export async function createPrompt(userId: string, input: { title: string; body: string; tags: string; goal?: string; context?: string; constraints?: string; notes?: string }) {
  const db = getDb();
  if (!db) {
    return { ok: false, message: 'Database is not connected yet. Fix the Supabase host or credentials to save real prompts.' };
  }

  const tags = splitTags(input.tags);

  await db`
    insert into prompts (user_id, title, body, goal, context, constraints, notes, tags)
    values (${userId}::uuid, ${input.title}, ${input.body}, ${input.goal ?? null}, ${input.context ?? null}, ${input.constraints ?? null}, ${input.notes ?? null}, ${JSON.stringify(tags)}::jsonb)
  `;

  return { ok: true };
}

export async function createSession(userId: string, input: { title: string; description?: string }) {
  const db = getDb();
  if (!db) {
    return { ok: false, message: 'Database is not connected yet. Sessions will be demo-only until the DB host resolves.' };
  }

  await db`
    insert into sessions (user_id, title, description)
    values (${userId}::uuid, ${input.title}, ${input.description ?? null})
  `;

  return { ok: true };
}

export async function addPromptResponse(userId: string, input: { promptId: string; modelName?: string; source?: string; outputText: string; notes?: string }) {
  const db = getDb();
  if (!db) {
    return { ok: false, message: 'Database is not connected yet. Response capture is currently in demo mode.' };
  }

  const prompts = await db<{ id: string }[]>`
    select id::text
    from prompts
    where id = ${input.promptId}::uuid and user_id = ${userId}::uuid
    limit 1
  `;

  if (!prompts[0]) {
    return { ok: false, message: 'That prompt does not belong to the current user.' };
  }

  await db`
    insert into prompt_runs (user_id, prompt_id, model_name, source, output_text, notes)
    values (${userId}::uuid, ${input.promptId}::uuid, ${input.modelName ?? null}, ${input.source ?? null}, ${input.outputText}, ${input.notes ?? null})
  `;

  return { ok: true };
}

export async function getWorkshopResult(input: string): Promise<WorkshopResult> {
  if (!process.env.OPENAI_API_KEY) {
    return improvePrompt(input);
  }

  return demoWorkshopResult;
}
