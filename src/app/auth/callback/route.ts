import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { normalizeRedirectPath } from '@/lib/redirect';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = normalizeRedirectPath(searchParams.get('next'));
  const supabase = createSupabaseServerClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash && type) {
    await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=Unable%20to%20sign%20in`);
}
