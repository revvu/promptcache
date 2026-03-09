'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireUser } from '@/lib/auth';
import { addPromptResponse, createPrompt, createSession } from '@/lib/data';

export async function createPromptAction(formData: FormData) {
  const user = await requireUser();
  const result = await createPrompt(user.id, {
    title: String(formData.get('title') ?? '').trim(),
    body: String(formData.get('body') ?? '').trim(),
    tags: String(formData.get('tags') ?? '').trim(),
    goal: String(formData.get('goal') ?? '').trim(),
    context: String(formData.get('context') ?? '').trim(),
    constraints: String(formData.get('constraints') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim()
  });

  revalidatePath('/');
  revalidatePath('/library');

  if (!result.ok) {
    redirect(`/library?error=${encodeURIComponent(result.message ?? 'Unable to create prompt')}`);
  }

  redirect('/library?created=1');
}

export async function createSessionAction(formData: FormData) {
  const user = await requireUser();
  const result = await createSession(user.id, {
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim()
  });

  revalidatePath('/');
  revalidatePath('/sessions');

  if (!result.ok) {
    redirect(`/sessions?error=${encodeURIComponent(result.message ?? 'Unable to create session')}`);
  }

  redirect('/sessions?created=1');
}

export async function addPromptResponseAction(formData: FormData) {
  const user = await requireUser();
  const promptId = String(formData.get('promptId') ?? '').trim();
  const result = await addPromptResponse(user.id, {
    promptId,
    modelName: String(formData.get('modelName') ?? '').trim(),
    source: String(formData.get('source') ?? '').trim(),
    outputText: String(formData.get('outputText') ?? '').trim(),
    notes: String(formData.get('notes') ?? '').trim()
  });

  revalidatePath(`/prompts/${promptId}`);

  if (!result.ok) {
    redirect(`/prompts/${promptId}?error=${encodeURIComponent(result.message ?? 'Unable to save response')}`);
  }

  redirect(`/prompts/${promptId}?saved=1`);
}
