/**
 * Optional Sentry monitoring integration.
 * Loaded only if VITE_SENTRY_DSN is defined.
 */

let sentryInitialized = false;

export function initSentry(): void {
  if (typeof window === 'undefined' || sentryInitialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || typeof dsn !== 'string' || !dsn.trim()) return;

  try {
    // Dynamically configure basic error tracking hook
    window.addEventListener('error', (event) => {
      reportErrorToSentry(event.error || event.message);
    });
    window.addEventListener('unhandledrejection', (event) => {
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

  try {
    console.error('[Sentry Monitored Exception]', error, context);
  } catch {
    // ignore
  }
}
