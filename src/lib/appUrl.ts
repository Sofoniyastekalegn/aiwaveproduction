/** Production site URL from Hostinger / build env; falls back to current origin in the browser. */
export function getAppOrigin(): string {
  const configured = String(import.meta.env.VITE_APP_URL ?? '').trim().replace(/\/$/, '');
  if (configured) return configured;
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

export function appUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getAppOrigin()}${normalized}`;
}
