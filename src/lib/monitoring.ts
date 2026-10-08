/**
 * Optional Sentry monitoring integration.
 * Loaded only if VITE_SENTRY_DSN is defined.
 * Ignores Vite dev WebSocket and benign network connection drops.
 */

let sentryInitialized = false;

function isIgnoredError(error: unknown): boolean {
  if (!error) return true;
  const str =
    typeof error === 'string'
      ? error
      : (error as any)?.message ||
        (error as any)?.stack ||
        (error as any)?.name ||
        String(error);

  const lower = str.toLowerCase();
  return (
    lower.includes('websocket') ||
    lower.includes('ws://') ||
    lower.includes('wss://') ||
    lower.includes('closed without opened') ||
    lower.includes('@vite/client') ||
    lower.includes('vite:ws') ||
    lower.includes('failed to fetch') ||
    lower.includes('load failed') ||
    lower.includes('network error')
  );
}

export function initSentry(): void {
  if (typeof window === 'undefined' || sentryInitialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || !dsn.trim()) return;

  try {
    window.addEventListener('error', (event) => {
      if (isIgnoredError(event.error || event.message)) return;
      reportErrorToSentry(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
      if (isIgnoredError(event.reason)) return;
      reportErrorToSentry(event.reason);
    });
    sentryInitialized = true;
  } catch (err) {
    console.warn('Sentry listener setup warning', err);
  }
}

export function reportErrorToSentry(error: unknown, context?: Record<string, unknown>): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || !dsn.trim()) return;
  if (isIgnoredError(error)) return;

  // In production with real Sentry SDK installed: Sentry.captureException(error, { extra: context });
}
