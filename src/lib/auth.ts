import { redirect } from 'next/navigation';

import { normalizeRedirectPath } from '@/lib/redirect';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser(next?: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(normalizeRedirectPath(next))}`);
  }

  return user;
}
