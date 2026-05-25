/**
 * OAuth/email redirect base URL.
 * In the browser we always use the live origin (works for both
 * https://aiwave.aiwaveagency.com and https://www.aiwave.aiwaveagency.com).
 * VITE_APP_URL is only used when window is unavailable (e.g. build-time).
 */
export function getAppOrigin(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin && origin !== 'null') return origin;
  }
  const configured = String(import.meta.env.VITE_APP_URL ?? '').trim().replace(/\/$/, '');
  return configured;
}

export function appUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getAppOrigin()}${normalized}`;
}
