export function normalizeRedirectPath(next: string | null | undefined) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/';
  }

  return next;
}
