export async function track(event: string, data: Record<string, any> = {}) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event,
        data,
        ts: Date.now(),
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        ref: typeof document !== 'undefined' ? document.referrer : undefined,
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }),
    });
  } catch {}
}
